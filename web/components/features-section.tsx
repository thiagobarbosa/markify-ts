import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { ArrowCircleUpRight, GithubLogo, UserCircleCheck } from '@phosphor-icons/react'
import { ScriptCopyBtn } from '@/components/ui/script-copy-btn'
import { Button } from '@/components/ui/button'

const files = [
  {
    name: 'airbnb.com',
    body: 'Airbnb is a marketplace for people to list, discover, and book accommodations around the world.',
  },
  {
    name: 'nytimes.com',
    body: 'The New York Times is an American newspaper based in New York City with worldwide influence and readership.',
  },
  {
    name: 'github.com',
    body: 'GitHub is a code hosting platform for version control and collaboration.',
  },
  {
    name: 'stackoverflow.com',
    body: 'Stack Overflow is a question and answer site for professional and enthusiast programmers.',
  }
]

const features = [
  {
    Icon: GithubLogo,
    name: 'Open source',
    description: 'Markify is open source and free to use.',
    href: 'https://github.com/thiagobarbosa/markify-ts',
    cta: 'Learn more',
    className: 'col-span-3 lg:col-span-1',
    background: (
      <div className="flex flex-col items-start">
        <ScriptCopyBtn
          showMultiplePackageOptions={true}
          codeLanguage="shell"
          lightTheme="nord"
          darkTheme="vitesse-dark"
          commandMap={{ npm: 'npm install markify' }}
        />
        <Button
          variant="link"
          disabled={false}
          className={'mx-auto lg:mx-0'}
        >
          <span className="flex items-center gap-2 mx-auto text-sm">
            View on GitHub
          <ArrowCircleUpRight size={32} />
          </span>
        </Button>
      </div>
    ),
  },
  {
    Icon: UserCircleCheck,
    name: 'Custom dashboard',
    description: 'Create an account to save your links, organise them into categories, and export their markdown code.',
    href: 'http://localhost:3000/dashboard',
    cta: 'Learn more',
    className: 'col-span-3 lg:col-span-2',
    background: (
      <div className="absolute right-0 top-10 flex w-full opacity-20">
        <img
          className="h-full w-full dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15] transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
          src="/markify-dashboard.png"
          alt="Integrations"
        />
      </div>
    ),
  },
]

export function FeaturesSection() {
  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  )
}
