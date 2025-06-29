'use client'

import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { logout as serverLogout } from '../actions'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export default function LogoutButton() {
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      // Sign out from Firebase on the client
      await signOut(auth)

      // Call the server action to clear the cookie and trigger the redirect
      await serverLogout()
      
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
