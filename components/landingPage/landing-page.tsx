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
import { Navbar } from '@/components/common/navbar'
import {
  BookOpen,
  Brain,
  CheckCircle,
  Zap,
  Star,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  Twitter,
  Linkedin,
  Github
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { cubicBezier, easeOut, motion, Variants } from 'framer-motion'
import { BackgroundLines } from '../ui/background-lines'
import { CardSpotlight } from '../ui/card-spotlight'
import { cn } from '@/lib/utils'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
}

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

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easeOut
    }
  }
}

export function LandingPage () {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const router = useRouter()
  const { isSignedIn } = useAuth()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

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

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className='h-screen bg-background overflow-y-auto scrollbar-thin 
  scrollbar-thumb-gray-400 scrollbar-track-gray-200
  dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-900
'
    >
      {' '}
      <Navbar />
      {/* Hero Section */}
      <BackgroundLines className='relative overflow-hidden py-20 lg:py-32'>
        <div className='absolute right-6 top-6 z-30'>
          <a
            href='https://www.producthunt.com/products/tutorly-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-tutorly&#0045;2'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              src='https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=983344&theme=neutral&t=1750790431832'
              alt='Tutorly - AI&#0045;powered&#0032;course&#0032;creation&#0044;&#0032;simplified&#0046; | Product Hunt'
              style={{ width: '250px', height: '54px' }}
              width='250'
              height='54'
            />
          </a>
        </div>
        <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5' />

        <div className='container relative mx-auto px-4'>
          <div className='mx-auto max-w-4xl text-center'>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <Badge variant='secondary' className='mb-4 animate-pulse-slow'>
                <Sparkles className='mr-2 h-4 w-4' />
                AI-Powered Learning Platform
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className='mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl'
            >
              Learn Anything with{' '}
              <span className='bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent'>
                AI-Generated
              </span>{' '}
              Courses
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className='mb-8 text-xl text-muted-foreground sm:text-2xl'
            >
              Transform any topic into a comprehensive learning experience. Just
              describe what you want to learn, and let our AI create the perfect
              course for you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className='flex flex-col gap-4 sm:flex-row sm:justify-center'
            >
              <Button
                size='lg'
                className='group text-lg'
                onClick={handleGetStarted}
              >
                Get Started Free
                <ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
              </Button>
              <Button
                onClick={handleDashboard}
                variant='outline'
                size='lg'
                className='text-lg'
              >
                View Dashboard
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Floating Background Effects */}
        <motion.div
          className='absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-primary/20 blur-3xl'
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        />
        <motion.div
          className='absolute -left-32 -top-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl'
          animate={{ y: [0, 20, 0] }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: 'easeInOut',
            delay: 1
          }}
        />
      </BackgroundLines>
      {/* Features Section */}
      <section id='features' className='py-20'>
        <div className='container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
            className='mx-auto max-w-2xl text-center mb-16'
          >
            <h2 className='mb-4 text-3xl font-bold sm:text-4xl'>
              Powerful Features for Modern Learning
            </h2>
            <p className='text-lg text-muted-foreground'>
              Everything you need to create, learn, and track your educational
              journey
            </p>
          </motion.div>

          <motion.div
            className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'
            variants={containerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature: any, index: number) => (
              <CardSpotlight>
                <motion.div
                  key={index}
                  variants={cardVariants}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 shadow-xl backdrop-blur-md transition-all duration-300',
                    'from-white/60 to-white/40 border-gray-300 hover:border-primary/50 hover:shadow-primary/30', // ✅ Light mode
                    'dark:from-background/50 dark:to-background/30 dark:border-white/10 dark:hover:border-primary/40' // ✅ Dark mode
                  )}
                >
                  {/* Animated Background Effect */}
                  {hoveredFeature === index && (
                    <div className='absolute inset-0 z-0 animate-pulse bg-gradient-to-br from-primary/20 via-transparent to-primary/30 opacity-80' />
                  )}

                  {/* Foreground Content */}
                  <div className='relative z-10'>
                    <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15'>
                      <feature.icon className='h-6 w-6 text-primary' />
                    </div>

                    <h3 className='text-xl font-semibold mb-2 text-black dark:text-white'>
                      {feature.title}
                    </h3>
                    <p className='text-muted-foreground'>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              </CardSpotlight>
            ))}
          </motion.div>
        </div>
      </section>
      {/* Screenshots Section */}
      <section className='py-20 bg-muted/30'>
        <div className='container mx-auto px-4'>
          <motion.div
            className='mx-auto max-w-2xl text-center mb-16'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={1}
          >
            <h2 className='mb-4 text-3xl font-bold sm:text-4xl'>
              See How It Works
            </h2>
            <p className='text-lg text-muted-foreground'>
              Experience the power of AI-driven learning through our intuitive
              interface
            </p>
          </motion.div>

          <motion.div
            className='mx-auto max-w-4xl'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={2}
          >
            <Card className='p-8'>
              <motion.div
                className='aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center'
                variants={fadeUp}
                custom={3}
              >
                <div className='text-center'>
                  <motion.div
                    className='mx-auto mb-4 h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center'
                    variants={fadeUp}
                    custom={4}
                  >
                    <BookOpen className='h-8 w-8 text-primary' />
                  </motion.div>
                  <motion.h3
                    className='text-xl font-semibold mb-2'
                    variants={fadeUp}
                    custom={5}
                  >
                    Platform Screenshots
                  </motion.h3>
                  <motion.p
                    className='text-muted-foreground'
                    variants={fadeUp}
                    custom={6}
                  >
                    Screenshots will be added here to showcase the platform
                  </motion.p>
                </div>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </section>
      {/* Pricing Section */}
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
                  className={`relative ${
                    plan.popular ? 'border-primary shadow-lg scale-105' : ''
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
                      disabled={plan.name === 'Team'} // ✅ Disable button for Coming Soon
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
      {/* Reviews Section */}
      <section id='reviews' className='py-20 bg-muted/30'>
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
              What Our Learners Say
            </h2>
            <p className='text-lg text-muted-foreground'>
              Join thousands of satisfied learners who've transformed their
              skills with Tutorly
            </p>
          </motion.div>

          <div className='grid gap-8 md:grid-cols-3'>
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                custom={index + 2}
              >
                <Card className='group hover:shadow-lg transition-shadow'>
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
                        <AvatarImage
                          src={review.avatar || '/placeholder.svg'}
                        />
                        <AvatarFallback>
                          {review.name
                            .split(' ')
                            .map((n: string) => n[0])
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className='py-20 relative'>
        {/* Subtle background gradient */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5' />

        <div className='container relative mx-auto px-4'>
          <motion.div
            variants={fadeInUp}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
          >
            <Card className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-2xl transition hover:scale-[1.02] hover:shadow-primary/30 duration-500'>
              {/* Optional glowing border */}
              <div className='absolute inset-0 rounded-2xl border border-white/20 backdrop-blur-md' />

              <CardContent className='relative z-10 p-12 text-center space-y-6'>
                <h2 className='text-4xl font-extrabold tracking-tight'>
                  Ready to Start Learning?
                </h2>
                <p className='text-xl text-white/90'>
                  Join thousands of learners and start your AI-powered education
                  journey today.
                </p>
                <Link href='/prompt'>
                  <Button
                    size='lg'
                    variant='secondary'
                    className='relative group text-lg px-8'
                  >
                    Create Your First Course
                    <Zap className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:scale-110' />
                    {/* Glowing effect on hover */}
                    <span className='absolute inset-0 rounded-full bg-primary/30 opacity-0 group-hover:opacity-20 transition' />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      {/* Footer */}
      <footer className='border-t bg-background py-12 relative overflow-hidden'>
        {/* Decorative floating blur elements */}
        <div className='absolute -top-10 -left-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl' />
        <div className='absolute -bottom-10 -right-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl' />

        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
            {/* Logo */}
            <Link href='/' className='flex items-center space-x-2 text-primary'>
              <BookOpen className='h-7 w-7' />
              <span className='text-2xl font-bold tracking-tight'>Tutorly</span>
            </Link>

            {/* Links */}
            <div className='flex gap-6 text-muted-foreground text-sm'>
              <Link href='/privacy' className='hover:text-primary transition'>
                Privacy
              </Link>
              <Link href='/terms' className='hover:text-primary transition'>
                Terms
              </Link>
              <Link href='/contact' className='hover:text-primary transition'>
                Contact
              </Link>
            </div>

            {/* Social Icons */}
            <div className='flex gap-4'>
              <Link
                href='https://x.com/AbhishekNI3811'
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:text-primary transition'
              >
                <Twitter className='h-5 w-5' />
              </Link>
              <Link
                href='https://github.com/abhishekmaniy/tutorly'
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:text-primary transition'
              >
                <Github className='h-5 w-5' />
              </Link>
              <Link
                href='https://www.linkedin.com/in/abhishekmaniyar502/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:text-primary transition'
              >
                <Linkedin className='h-5 w-5' />
              </Link>
            </div>
          </div>

          <p className='mt-6 text-center text-xs text-muted-foreground'>
            © 2024 Tutorly. All rights reserved.
          </p>

          <p className='mt-2 text-center text-xs text-muted-foreground'>
            Made with <span className='text-red-500 text-xl'>'♥'</span> by{' '}
            <a
              href='https://x.com/AbhishekNI3811'
              target='_blank'
              rel='noopener noreferrer'
              className='underline underline-offset-2 hover:text-primary'
            >
              Abhishek
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
