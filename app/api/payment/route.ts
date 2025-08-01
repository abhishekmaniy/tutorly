import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
})

console.log(process.env.RAZORPAY_KEY_ID)
console.log(process.env.RAZORPAY_KEY_SECRET)

export async function POST(request: NextRequest) {
    try {

        const order = await razorpay.orders.create({
            amount: 99 * 100,
            currency: "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7)
        })

        return NextResponse.json({ orderId: order.id }, { status: 200 })
    } catch (error: any) {
        console.error("Razorpay Error:", error); // Full stack trace
        if (error?.error) {
            console.error("Razorpay API Error:", error.error);
        }

        return NextResponse.json(
            { error: "Error creating order", details: error?.message || error },
            { status: 500 }
        );
    }
}