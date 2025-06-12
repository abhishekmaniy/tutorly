'use client'

import { Button } from '@/components/ui/button'
import { BookOpen, Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { useState } from 'react'
import Link from 'next/link'
import { SignInButton, useAuth, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export function Navbar () {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isSignedIn } = useAuth()
  const router = useRouter()

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push("/prompt")
    } else {
      router.push("/sign-in")
    }
  }

  return (
    <nav className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          <Link href='/' className='flex items-center space-x-2'>
            <BookOpen className='h-8 w-8 text-primary' />
            <span className='text-2xl font-bold'>Tutorly</span>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            <Link
              href='#features'
              className='text-sm font-medium hover:text-primary transition-colors'
            >
              Features
            </Link>
            <Link
              href='#pricing'
              className='text-sm font-medium hover:text-primary transition-colors'
            >
              Pricing
            </Link>
            <Link
              href='#reviews'
              className='text-sm font-medium hover:text-primary transition-colors'
            >
              Reviews
            </Link>
          </div>

          <div className='hidden md:flex items-center space-x-4'>
            <ThemeToggle />
            {isSignedIn ? <UserButton /> : <SignInButton />}
            <Button onClick={handleGetStarted} >Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <div className='flex items-center space-x-2 md:hidden'>
            <ThemeToggle />
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='border-t py-4 md:hidden'>
            <div className='flex flex-col space-y-4'>
              <Link
                href='#features'
                className='text-sm font-medium hover:text-primary transition-colors'
              >
                Features
              </Link>
              <Link
                href='#pricing'
                className='text-sm font-medium hover:text-primary transition-colors'
              >
                Pricing
              </Link>
              <Link
                href='#reviews'
                className='text-sm font-medium hover:text-primary transition-colors'
              >
                Reviews
              </Link>
              <div className='flex flex-col space-y-2 pt-4'>
                <Link href='/prompt'>
                  <Button variant='outline' className='w-full'>
                    Sign In
                  </Button>
                </Link>
                <Link href='/prompt'>
                  <Button className='w-full'>Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
