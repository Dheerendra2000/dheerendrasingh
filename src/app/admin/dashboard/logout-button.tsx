'use client'

import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { revokeSessionCookie } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export default function LogoutButton() {
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      // Sign out from Firebase on the client
      await signOut(auth)

      // Call the server action to revoke the session and clear the cookie
      await revokeSessionCookie()
      
      // Force a full page reload to the login page
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
