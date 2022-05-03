import Link from 'next/link'

import Image from '../../image'

export default function Logo() {
  return (
    <div className="logo ml-3 mr-1 sm:mr-3">
      <Link href="/">
        <a className="w-full flex items-start">
          <div className="min-w-max sm:mr-3">
            <div className="flex dark:hidden items-center">
              <Image
                src="/logos/logo.png"
                alt=""
                width={32}
                height={32}
              />
            </div>
            <div className="hidden dark:flex items-center">
              <Image
                src="/logos/logo_white.png"
                alt=""
                width={32}
                height={32}
              />
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="normal-case text-base font-semibold">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </div>
            <div className="max-w-min bg-blue-600 rounded whitespace-nowrap text-white pb-0.5 px-1.5 mt-0.5">
              {process.env.NEXT_PUBLIC_ENVIRONMENT}
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}