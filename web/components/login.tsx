'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { ArrowSquareOut, List, X } from '@phosphor-icons/react'
import Link from 'next/link'

export const Login = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if the screen size is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile)

    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="flex items-center gap-4">
      <SignedIn>
        {isMobile ? (
          <div className="relative">
            {/* Hamburger menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <List size={24} />}
            </Button>

            {/* Mobile menu dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-900 rounded-md shadow-lg py-2 z-10">
                <div className="px-4 py-2 border-b border-zinc-800">
                  <UserButton
                    showName
                    userProfileMode={'modal'}
                    appearance={{ baseTheme: dark }}
                  />
                </div>
                <div className="py-1">
                  <Link
                    href="/"
                    className="block px-4 py-2 text-sm text-white hover:bg-zinc-800"
                  >
                    Home
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-white hover:bg-zinc-800"
                  >
                    Dashboard
                  </Link>
                  <a
                    href="https://github.com/thiagobarbosa/markify-ts.git"
                    target="_blank"
                    className="flex items-center px-4 py-2 text-sm text-white hover:bg-zinc-800"
                  >
                    About
                    <ArrowSquareOut size={16} className="ml-2 inline" />
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-md">
            <UserButton
              showName
              userProfileMode={'modal'}
              appearance={{ baseTheme: dark }}
            />
          </div>
        )}
      </SignedIn>
      <SignedOut>
        <SignInButton appearance={{ baseTheme: dark }}>
          <Button variant="outline" className={'cursor-pointer'}>Sign In</Button>
        </SignInButton>
      </SignedOut>
    </div>
  )
}