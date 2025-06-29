'use client'

import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export default function LogoutButton() {
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      // On success, redirect to the login page with a full page reload.
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Error signing out: ', error)
      toast({
        title: 'Logout Failed',
        description: 'An error occurred while signing out. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  )
}
