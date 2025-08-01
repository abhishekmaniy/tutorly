import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import { db } from "@/lib/db";
import { Plan } from "@/lib/generated/prisma";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
})

export async function POST(req: NextRequest) {
  try {
    const { userId, plan, orderId, paymentId, signature } = await req.json();
    console.log(userId, plan, orderId, paymentId, signature)

    if (!userId || !orderId || !paymentId || !signature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log(process.env.RAZORPAY_KEY_SECRET!)
    // Step 1: Verify Signature
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Step 2: Check user exists
    const user = await db.user.findFirst({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    

    // Step 3: Try upgrading the user plan
    try {
      const upgraded = await db.user.update({
        where: { id: userId },
        data: {
          plan: plan === "Pro" ? Plan.PRO : Plan.TEAM,
          orderId,
          paymentId,
          signature,
          planExpire: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });

      return NextResponse.json(upgraded);
    } catch (dbError) {
      // Step 4: Refund if DB update failed
      console.error("DB upgrade failed. Initiating refund...");

      const refund = await razorpay.payments.refund(paymentId, {
        notes: {
          reason: "Upgrade failed – refund issued",
        },
      });

      console.log("Refund issued:", refund);
      return NextResponse.json(
        { error: "Upgrade failed, refund initiated", refund },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Upgrade Error:", error);
    return NextResponse.json({ error: "Error processing upgrade" }, { status: 500 });
  }
}
