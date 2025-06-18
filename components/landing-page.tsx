'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Navbar } from '@/components/navbar'
import {
  BookOpen,
  Brain,
  CheckCircle,
  Zap,
  Star,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

export function LandingPage () {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const router = useRouter()
  const { isSignedIn } = useAuth()

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/prompt')
    } else {
      router.push('/sign-in')
    }
  }

  const handleDashboard = () => {
    if (isSignedIn) {
      router.push('/history')
    } else {
      router.push('/sign-in')
    }
  }

  useEffect(() => {
    router.prefetch('/sign-in')
    router.prefetch('/history')
    router.prefetch('/prompt')
  })

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Course Generation',
      description:
        'Simply describe what you want to learn, and our AI creates a comprehensive course tailored to your needs.'
    },
    {
      icon: BookOpen,
      title: 'Interactive Lessons',
      description:
        'Engage with dynamic content, track your progress, and learn at your own pace with our intuitive interface.'
    },
    {
      icon: Target,
      title: 'Smart Quizzes',
      description:
        'Test your knowledge with various question types including MCQs, theoretical questions, and true/false.'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description:
        'Monitor your learning journey with detailed progress bars and completion tracking for every course.'
    }
  ]

  const pricing = [
    {
      name: 'Starter',
      price: '$9',
      period: '/month',
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
      price: '$19',
      period: '/month',
      description: 'Best for serious learners',
      features: [
        'Unlimited AI-generated courses',
        'Advanced progress analytics',
        'All quiz types',
        'Priority support',
        'Course sharing',
        'Custom learning paths'
      ],
      popular: true
    },
    {
      name: 'Team',
      price: '$49',
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

  const reviews = [
    {
      name: 'Sarah Johnson',
      role: 'Software Developer',
      content:
        'Tutorly transformed how I learn new technologies. The AI-generated courses are incredibly detailed and well-structured.',
      rating: 5,
      avatar: '/placeholder.svg?height=40&width=40'
    },
    {
      name: 'Michael Chen',
      role: 'Student',
      content:
        "The progress tracking keeps me motivated, and the quizzes really help reinforce what I've learned. Highly recommend!",
      rating: 5,
      avatar: '/placeholder.svg?height=40&width=40'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Manager',
      content:
        "I've completed 12 courses so far. The platform makes learning addictive in the best way possible!",
      rating: 5,
      avatar: '/placeholder.svg?height=40&width=40'
    }
  ]

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />

      {/* Hero Section */}
      <section className='relative overflow-hidden py-20 lg:py-32'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5' />
        <div className='container relative mx-auto px-4'>
          <div className='mx-auto max-w-4xl text-center'>
            <Badge variant='secondary' className='mb-4 animate-pulse-slow'>
              <Sparkles className='mr-2 h-4 w-4' />
              AI-Powered Learning Platform
            </Badge>
            <h1 className='mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl'>
              Learn Anything with{' '}
              <span className='bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent'>
                AI-Generated
              </span>{' '}
              Courses
            </h1>
            <p className='mb-8 text-xl text-muted-foreground sm:text-2xl'>
              Transform any topic into a comprehensive learning experience. Just
              describe what you want to learn, and let our AI create the perfect
              course for you.
            </p>
            <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
              <Button
                size='lg'
                className='group text-lg'
                onClick={handleGetStarted}
              >
                Get Started Free
                <ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
              </Button>
                <Button onClick={handleDashboard} variant='outline' size='lg' className='text-lg'>
                  View Dashboard
                </Button>
            </div>
          </div>
        </div>
        <div className='absolute -bottom-32 -right-32 h-64 w-64 animate-float rounded-full bg-primary/20 blur-3xl' />
        <div
          className='absolute -left-32 -top-32 h-64 w-64 animate-float rounded-full bg-primary/10 blur-3xl'
          style={{ animationDelay: '2s' }}
        />
      </section>

      {/* Features Section */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='mx-auto max-w-2xl text-center mb-16'>
            <h2 className='mb-4 text-3xl font-bold sm:text-4xl'>
              Powerful Features for Modern Learning
            </h2>
            <p className='text-lg text-muted-foreground'>
              Everything you need to create, learn, and track your educational
              journey
            </p>
          </div>
          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
            {features.map((feature, index) => (
              <Card
                key={index}
                className='group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg'
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardHeader>
                  <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20'>
                    <feature.icon className='h-6 w-6 text-primary' />
                  </div>
                  <CardTitle className='text-xl'>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-base'>
                    {feature.description}
                  </CardDescription>
                </CardContent>
                {hoveredFeature === index && (
                  <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50' />
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className='py-20 bg-muted/30'>
        <div className='container mx-auto px-4'>
          <div className='mx-auto max-w-2xl text-center mb-16'>
            <h2 className='mb-4 text-3xl font-bold sm:text-4xl'>
              See How It Works
            </h2>
            <p className='text-lg text-muted-foreground'>
              Experience the power of AI-driven learning through our intuitive
              interface
            </p>
          </div>
          <div className='mx-auto max-w-4xl'>
            <Card className='p-8'>
              <div className='aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center'>
                <div className='text-center'>
                  <div className='mx-auto mb-4 h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center'>
                    <BookOpen className='h-8 w-8 text-primary' />
                  </div>
                  <h3 className='text-xl font-semibold mb-2'>
                    Platform Screenshots
                  </h3>
                  <p className='text-muted-foreground'>
                    Screenshots will be added here to showcase the platform
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='mx-auto max-w-2xl text-center mb-16'>
            <h2 className='mb-4 text-3xl font-bold sm:text-4xl'>
              Choose Your Learning Plan
            </h2>
            <p className='text-lg text-muted-foreground'>
              Start free and upgrade as you grow. All plans include our core AI
              features.
            </p>
          </div>
          <div className='grid gap-8 lg:grid-cols-3'>
            {pricing.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.popular ? 'border-primary shadow-lg scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <Badge className='absolute -top-3 left-1/2 -translate-x-1/2'>
                    Most Popular
                  </Badge>
                )}
                <CardHeader className='text-center'>
                  <CardTitle className='text-2xl'>{plan.name}</CardTitle>
                  <div className='mt-4'>
                    <span className='text-4xl font-bold'>{plan.price}</span>
                    <span className='text-muted-foreground'>{plan.period}</span>
                  </div>
                  <CardDescription className='mt-2'>
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-3'>
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className='flex items-center'>
                        <CheckCircle className='mr-3 h-5 w-5 text-primary' />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className='mt-6 w-full'
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className='py-20 bg-muted/30'>
        <div className='container mx-auto px-4'>
          <div className='mx-auto max-w-2xl text-center mb-16'>
            <h2 className='mb-4 text-3xl font-bold sm:text-4xl'>
              What Our Learners Say
            </h2>
            <p className='text-lg text-muted-foreground'>
              Join thousands of satisfied learners who've transformed their
              skills with Tutorly
            </p>
          </div>
          <div className='grid gap-8 md:grid-cols-3'>
            {reviews.map((review, index) => (
              <Card
                key={index}
                className='group hover:shadow-lg transition-shadow'
              >
                <CardContent className='pt-6'>
                  <div className='flex mb-4'>
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className='h-5 w-5 fill-yellow-400 text-yellow-400'
                      />
                    ))}
                  </div>
                  <p className='mb-4 text-muted-foreground'>
                    "{review.content}"
                  </p>
                  <div className='flex items-center'>
                    <Avatar className='mr-3'>
                      <AvatarImage src={review.avatar || '/placeholder.svg'} />
                      <AvatarFallback>
                        {review.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-semibold'>{review.name}</p>
                      <p className='text-sm text-muted-foreground'>
                        {review.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <Card className='gradient-bg text-white'>
            <CardContent className='p-12 text-center'>
              <h2 className='mb-4 text-3xl font-bold sm:text-4xl'>
                Ready to Start Learning?
              </h2>
              <p className='mb-8 text-xl opacity-90'>
                Join thousands of learners and start your AI-powered education
                journey today.
              </p>
              <Link href='/prompt'>
                <Button size='lg' variant='secondary' className='text-lg'>
                  Create Your First Course
                  <Zap className='ml-2 h-5 w-5' />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t py-12'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
            <div className='flex items-center space-x-2'>
              <BookOpen className='h-6 w-6 text-primary' />
              <span className='text-xl font-bold'>Tutorly</span>
            </div>
            <p className='text-muted-foreground'>
              © 2024 Tutorly. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
