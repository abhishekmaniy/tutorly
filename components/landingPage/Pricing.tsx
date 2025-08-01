"use client";

import { useRouter } from "next/navigation"; // 👈 For App Router
import { cubicBezier, motion } from "framer-motion"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"

import { CheckCircle } from "lucide-react"

const pricing = [
    {
        name: 'Starter',
        price: '₹0',
        period: '/free',
        description: 'Perfect for individual learners',
        features: [
            '5 AI-generated courses per month',
            'Basic progress tracking',
            'Standard quiz types',
            'Email support'
        ],
        popular: false
    },
    {
        name: 'Pro',
        price: '₹99',
        period: '/month',
        description: 'Best for serious learners',
        features: [
            'Unlimited AI-generated courses',
            'Advanced progress analytics',
            'All quiz types',
            'Priority support',
            'Course sharing',
            'Custom learning paths',
            'Video lectures (coming soon)',
            'Images in course content (coming soon)'
        ],
        popular: true
    },
    {
        name: 'Team',
        price: '₹249',
        period: '/month',
        description: 'For teams and organizations',
        features: [
            'Everything in Pro',
            'Team management',
            'Bulk course creation',
            'Advanced analytics',
            'API access',
            'Dedicated support'
        ],
        popular: false
    }
]

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.2,
            duration: 0.8,
            ease: cubicBezier(0.25, 0.1, 0.25, 1)
        }
    })
}

export function Pricing() {
    const router = useRouter();
    const handlePlanClick = (planName: string) => {
        if (planName === "Pro") {
            router.push("/checkout");
        } else if (planName === "Starter") {
            router.push("/prompt");
        }
    };

    return (
        <section id='pricing' className='py-20'>
            <div className='container mx-auto px-4'>
                <motion.div
                    className='mx-auto max-w-2xl text-center mb-16'
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                    custom={1}
                >
                    <h2 className='mb-4 text-3xl font-bold sm:text-4xl'>
                        Choose Your Learning Plan
                    </h2>
                    <p className='text-lg text-muted-foreground'>
                        Start free and upgrade as you grow. All plans include our core AI
                        features.
                    </p>
                </motion.div>

                <div className='grid gap-8 lg:grid-cols-3'>
                    {pricing.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial='hidden'
                            whileInView='visible'
                            viewport={{ once: true, amount: 0.2 }}
                            variants={fadeUp}
                            custom={index + 2}
                        >
                            <Card
                                className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''
                                    }`}
                            >
                                {/* ✅ Coming Soon badge for Team */}
                                {plan.name === 'Team' && (
                                    <Badge className='absolute -top-3 left-1/2 -translate-x-1/2 bg-muted text-foreground'>
                                        Coming Soon
                                    </Badge>
                                )}

                                {/* ✅ Most Popular badge for Pro */}
                                {plan.popular && (
                                    <Badge className='absolute -top-3 left-1/2 -translate-x-1/2'>
                                        Most Popular
                                    </Badge>
                                )}

                                <CardHeader className='text-center'>
                                    <CardTitle className='text-2xl'>{plan.name}</CardTitle>

                                    <div className='mt-4'>
                                        <span className='text-4xl font-bold'>{plan.price}</span>
                                        <span className='text-muted-foreground'>
                                            {plan.period}
                                        </span>
                                    </div>

                                    <CardDescription className='mt-2'>
                                        {plan.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    {/* ✅ Free for all users notice for Pro */}
                                    {plan.name === 'Pro' && (
                                        <motion.div
                                            className='mb-4 rounded-md p-2 text-center text-primary text-sm font-medium'
                                            initial={{ backgroundColor: 'rgba(59,130,246,0.1)' }} // primary/10
                                            animate={{
                                                backgroundColor: [
                                                    'rgba(59,130,246,0.1)', // light
                                                    'rgba(59,130,246,0.2)', // highlight
                                                    'rgba(59,130,246,0.1)' // light
                                                ]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            Free for all users for 15 days after launch
                                        </motion.div>
                                    )}

                                    <ul className='space-y-3'>
                                        {plan.features.map(
                                            (feature: string, featureIndex: number) => (
                                                <li key={featureIndex} className='flex items-center'>
                                                    <CheckCircle className='mr-3 h-5 w-5 text-primary' />
                                                    <span>{feature}</span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                    <Button
                                        className='mt-6 w-full'
                                        variant={plan.popular ? 'default' : 'outline'}
                                        disabled={plan.name === 'Team'}
                                        onClick={() => handlePlanClick(plan.name)}
                                    >
                                        {plan.name === 'Team' ? 'Coming Soon' : 'Get Started'}
                                    </Button>

                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )

}