'use client'

import { useEffect } from 'react'
import { SignIn, useAuth, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useStore } from '@/store/store'

const AuthCallbackPage = () => {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const { setUser } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (isSignedIn && user) {
      const createUser = async () => {
        try {
          const response = await axios.post('/api/user', {
            id: user.id,
            fullName: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
            email: user.emailAddresses[0]?.emailAddress ?? ''
          })
          setUser(response.data)
        } catch (err) {
          console.error(err)
        } finally {
          router.push('/') // Redirect to home after setup
        }
      }
      createUser()
    }
  }, [isSignedIn, user, setUser, router])

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-background px-4">
        <div className="w-full max-w-md">
          <SignIn routing="hash" fallbackRedirectUrl="/sign-in" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background px-4">
      <p className="text-lg font-medium text-muted-foreground">Setting up your account...</p>
    </div>
  )
}

export default AuthCallbackPage
