import { cn } from '@/lib/utils'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { Marquee } from '@/components/ui/marquee'
import { GithubLogo, UserCircleCheck } from '@phosphor-icons/react'

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
      <Marquee
        pauseOnHover
        className="absolute top-10 opacity-50 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]"
      >
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              'relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4',
              'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
              'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]',
              'transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none',
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white ">
                  {f.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
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
