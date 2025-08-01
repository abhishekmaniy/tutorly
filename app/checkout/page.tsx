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
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast"

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

const LoadingOverlay = ({ message }: { message: string }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center text-white space-y-4"
    >
      <svg
        className="animate-spin h-10 w-10 mx-auto text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        ></path>
      </svg>
      <p className="text-lg font-semibold">{message}</p>
    </motion.div>
  </div>
);


const Checkout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPlan = searchParams.get("plan") || "Pro";
  const { user, setUser } = useStore()
  const { getToken, userId } = useAuth()


  const [selectedPlan, setSelectedPlan] = useState(defaultPlan);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRefunding, setIsRefuding] = useState(false)

  const plan = pricing.find((p) => p.name === selectedPlan);

  console.log(user)

  useEffect(() => {
    const controller = new AbortController();

    const fetchUserCourses = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);

        const token = await getToken();
        const res = await axios.get(`/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        setUser(res.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          toast.error("Failed to fetch user data", { id: "fetch-user" });
          console.error("Fetch courses error", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCourses();
    return () => controller.abort();
  }, [userId]);

  const handlePay = async () => {
    setErrorMessage(null); // clear previous
    if (!plan || plan.name === "Starter") return router.push("/prompt");
    if (plan.name === "Team") return;

    if (!razorpayLoaded) {
      const msg = "Razorpay SDK not loaded yet.";
      console.error(msg);
      setErrorMessage(msg);
      return;
    }

    setIsProcessing(true);

    try {
      const paymentResponse = await axios.post("/api/payment");
      const { orderId } = paymentResponse.data;

      if (!user) throw new Error("User not logged in");

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: plan.price * 100,
        currency: "INR",
        name: "Tutorly",
        description: `${plan.name} Plan`,
        order_id: orderId,
        prefill: {
          name: user.name!,
          email: user.email!,
        },
        theme: { color: "#4f46e5" },
        handler: async (response: any) => {
          try {
            setIsUpgrading(true);
            toast.loading("Upgrading your plan...", { id: "upgrade" });


            const upgradeResponse = await axios.post("/api/upgrade", {
              plan: plan.name,
              userId: user.id,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            const updatedUser = upgradeResponse.data;
            setUser(updatedUser);
            toast.success("Plan upgraded To Pro", { id: "upgrade" })
            router.push("/prompt");
          } catch (upgradeErr) {
            console.error("Upgrade failed. Initiating refund...", upgradeErr);
            setErrorMessage("Upgrade failed. Initiating refund...");
            setIsRefuding(true);

            toast.error("Upgrade failed. Starting refund...", { id: "upgrade" });


            try {
              toast.loading("Refund in progress. Do not close the tab.", { id: "refund" });

              const refundRes = await axios.post("/api/refund", {
                userId: user.id,
                plan,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              });

              toast.success("We’ve refunded your money. It should reflect soon!", { id: "refund" });
              setErrorMessage("Upgrade failed. Your payment is being refunded.");
            } catch (refundErr) {
              console.error("Refund also failed", refundErr);
              toast.error("Refund failed. Please contact support.", { id: "refund" });
              setErrorMessage("Upgrade and refund both failed. Please contact support.");
            } finally {
              setIsRefuding(false);
            }
          } finally {
            setIsUpgrading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      });

      rzp.open();
    } catch (err: any) {
      console.error("Payment initiation failed", err);
      setErrorMessage(err?.message || "Something went wrong while initiating payment.");
    } finally {
      setIsProcessing(false);
    }
  };




  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          onLoad={() => setRazorpayLoaded(true)}
        />

        <Card className="flex flex-col lg:flex-row w-full max-w-5xl gap-10 bg-black shadow-2xl rounded-xl p-8 relative">
          {/* Overlay conditions */}
          {(() => {
            if (!user) return <LoadingOverlay message="Fetching your details..." />;
            if (isUpgrading) return <LoadingOverlay message="Upgrading your plan..." />;
            if (isRefunding)
              return (
                <LoadingOverlay message="Your upgrade failed. Please don’t close this tab — we are refunding your money." />
              );
            return null;
          })()}

          {/* Main content */}
          {user && !isUpgrading && !isRefunding && (
            <>
              {/* Left: Plan selection */}
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
                      onClick={() => {
                        const expiry = user?.planExpire ? new Date(user.planExpire) : null;
                        const isPro = user?.plan === "Pro";
                        const isExpired = expiry ? expiry.getTime() < Date.now() : true;

                        if (isPro && !isExpired) {
                          router.push("/prompt");
                        } else {
                          handlePay();
                        }
                      }}
                      disabled={selectedPlan === "Team" || isProcessing}
                      className="mt-4"
                    >
                      {(() => {
                        const expiry = user?.planExpire ? new Date(user.planExpire) : null;
                        const isPro = user?.plan === "Pro";
                        const isExpired = expiry ? expiry.getTime() < Date.now() : true;

                        if (isPro && !isExpired) {
                          return `Pro Expires: ${expiry?.toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}`;
                        }

                        if (selectedPlan === "Starter") return "It's Free";
                        if (isProcessing) return "Processing...";
                        return "Pay Now";
                      })()}
                    </Button>
                  )}

                  {errorMessage && (
                    <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>
                  )}
                </div>
              </div>

              {/* Right: Plan Features */}
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
            </>
          )}
        </Card>
      </div>
    </>
  );

};



export default Checkout;
