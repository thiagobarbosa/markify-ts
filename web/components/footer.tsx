import { ArrowCircleUpRight } from '@phosphor-icons/react'

export default function Footer() {
  return (
    <footer
      className="py-4 flex gap-[24px] flex-wrap items-center justify-center border-t border-black/10 dark:border-white/10 mt-auto">
      <a
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="https://github.com/thiagobarbosa/markify-ts"
        target="_blank"
        rel="noopener noreferrer"
      >
        Github
        <ArrowCircleUpRight size={24} weight={'thin'} />
      </a>
    </footer>
  )
}