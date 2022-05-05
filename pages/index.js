import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import { is_route_exist } from '../lib/routes'

export default () => {
  const router = useRouter()
  const { pathname, asPath } = { ...router }
  const _asPath = asPath.includes('?') ? asPath.substring(0, asPath.indexOf('?')) : asPath

  const [ssr, setSsr] = useState(true)

  useEffect(() => {
    setSsr(false)
  }, [])

  if (typeof window !== 'undefined' && pathname !== _asPath) {
    router.push(is_route_exist(_asPath) ? asPath : '/')
  }
  return !ssr && (
    <Bridge />
  )
}