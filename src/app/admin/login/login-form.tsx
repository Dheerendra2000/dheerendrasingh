
'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/lib/firebase';
import { setAuthCookie } from '@/lib/auth';

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export default function LoginForm() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      // 1. Sign in with Firebase on the client.
      await signInWithEmailAndPassword(auth, email, password)
      
      // 2. Set the server-side session cookie for route protection.
      await setAuthCookie();

      toast({
        title: 'Login Successful',
        description: 'Redirecting to dashboard...',
      })

      // 3. Force a full page reload to the dashboard.
      // This ensures the new session cookie is sent to the server, fixing the redirect loop.
      window.location.href = '/admin/dashboard';

    } catch (error: any) {
      const errorCode = error.code;
      let errorMessage = 'An unknown error occurred. Please try again.';
      if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/invalid-email' || errorCode === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (errorCode === 'auth/user-not-found') {
          errorMessage = 'No user found with this email.';
      } else if (errorCode === 'auth/invalid-api-key') {
          errorMessage = 'Firebase API Key is invalid. Please check your .env.local file.';
      }
      console.error("Firebase Auth Error:", error)
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      })
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm mx-4">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Admin Login</CardTitle>
        <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="admin@example.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
