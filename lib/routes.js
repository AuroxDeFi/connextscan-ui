const routes = [
  { pathname: '/' },
  { pathname: '/transactions' },
  { pathname: '/routers' },
  { pathname: '/tx/[tx]' },
  { pathname: '/address/[address]' },
  { pathname: '/router/[address]' },
  { pathname: '/[chain]' },
]

export const is_route_exist = pathname => routes.findIndex((route, i) => {
  if (route.pathname === pathname) return true
  if (route.pathname.split('/').filter(p => p).length === pathname.split('/').filter(p => p).length) {
    const routePathnameSplit = route.pathname.split('/').filter(p => p)
    const pathnameSplit = pathname.split('/').filter(p => p)
    return !(routePathnameSplit.findIndex((p, j) => !(p.startsWith('[') && p.endsWith(']')) && p !== pathnameSplit[j]) > -1)
  }
  return false
}) > -1