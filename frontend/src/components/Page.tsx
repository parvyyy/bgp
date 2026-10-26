import type { ReactNode } from 'react'

// The centred column every page sits in.
function Page({ children }: { children: ReactNode }) {
  return <section className="relative mx-auto max-w-[1100px] px-6 pt-12 pb-16 text-center">{children}</section>
}

export default Page
