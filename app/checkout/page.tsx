"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/common/navbar";
import { useStore } from "@/store/store";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const pricing = [
  {
    name: "Starter",
    price: 0,
    label: "₹0 / free",
    description: "Perfect for individual learners",
    features: [
      "5 AI-generated courses per month",
      "Basic progress tracking",
      "Standard quiz types",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: 99,
    label: "₹99 / month",
    description: "Best for serious learners",
    features: [
      "Unlimited AI-generated courses",
      "Advanced progress analytics",
      "All quiz types",
      "Priority support",
      "Course sharing",
      "Custom learning paths",
      "Video lectures (coming soon)",
      "Images in course content (coming soon)",
    ],
  },
  {
    name: "Team",
    price: 249,
    label: "₹249 / month",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Team management",
      "Bulk course creation",
      "Advanced analytics",
      "API access",
      "Dedicated support",
    ],
  },
];

const Checkout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPlan = searchParams.get("plan") || "Pro";
  const { user } = useStore()

  const [selectedPlan, setSelectedPlan] = useState(defaultPlan);
  const [isProcessing, setIsProcessing] = useState(false);

  const plan = pricing.find((p) => p.name === selectedPlan);

  const handlePay = async () => {
    if (!plan || plan.name === "Starter") return router.push("/prompt");
    if (plan.name === "Team") return;

    setIsProcessing(true);
    try {
      const response = await axios.post("/api/payment", {});
      const { orderId } = response.data;

      if ((!user)) {
        return
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: plan.price * 100,
        currency: "INR",
        name: "Tutorly",
        description: `${plan.name} Plan`,
        order_id: orderId,
        handler: async function (response: any) {
          await axios.post("/api/upgrade", { plan: plan.name });
          router.push("/prompt");
        },
        prefill: {
          name: user.name!,
          email: user.email!,
        },
        theme: { color: "#4f46e5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />

        <Card className="flex flex-col lg:flex-row w-full max-w-5xl gap-10 bg-black shadow-2xl rounded-xl p-8">
          {/* Left side: Plan selection */}
          <div className="flex-1 space-y-6">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">Choose a plan that suits you best.</p>

            <div>
              <Label className="mb-2 block">Select Plan</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger className="w-full max-w-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pricing.map((p) => (
                    <SelectItem
                      value={p.name}
                      key={p.name}
                      disabled={p.name === "Team"}
                    >
                      {p.name} - {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              {plan && (
                <Button
                  disabled={selectedPlan === "Team" || isProcessing}
                  onClick={handlePay}
                  className="mt-4"
                >
                  {selectedPlan === "Starter"
                    ? "It's Free"
                    : isProcessing
                      ? "Processing..."
                      : "Pay Now"}
                </Button>
              )}
            </div>
          </div>

          {/* Right side: Plan Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle>{plan?.name} Plan</CardTitle>
                <CardDescription>{plan?.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan?.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="text-green-500 mr-2 w-5 h-5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </Card>
      </div>
    </>


  );
};

export default Checkout;
