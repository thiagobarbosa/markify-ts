import { Button } from '@/components/ui/button'
import { SignInButton, useAuth, UserButton } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

export const Login = () => {
  const { isSignedIn } = useAuth()
  return (
    <div className="flex items-center gap-4">
      {isSignedIn ? (
        <div className="flex items-center gap-2 rounded-md">
          <UserButton showName userProfileMode={'modal'} appearance={{ baseTheme: dark }} />
        </div>
      ) : (
        <SignInButton mode="modal" appearance={{ baseTheme: dark }}>
          <Button variant="outline" className={'cursor-pointer'}>Sign In</Button>
        </SignInButton>
      )}
    </div>
  )
}