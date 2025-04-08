'use client'

import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

export const Login = () => {
  return (
    <div className="flex items-center gap-4">
      <SignedIn>
        <div className="flex items-center gap-2 rounded-md">
          <UserButton showName userProfileMode={'modal'} appearance={{ baseTheme: dark }} />
        </div>
      </SignedIn>
      <SignedOut>
        <SignInButton appearance={{ baseTheme: dark }}>
          <Button variant="outline" className={'cursor-pointer'}>Sign In</Button>
        </SignInButton>
      </SignedOut>
    </div>
  )
}