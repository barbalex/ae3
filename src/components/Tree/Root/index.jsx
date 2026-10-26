import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { apiCount } from '../../../modules/api.js'
import { Arten } from './Arten/index.jsx'
import { LR } from './LR/index.jsx'
import { PC } from './PC/index.jsx'
import { UsersFolder } from './Users/index.jsx'
import { OrganizationsFolder } from './Organizations/index.jsx'
import { loginTokenAtom } from '../../../store/index.ts'

export const Root = () => {
  const loginToken = useAtomValue(loginTokenAtom)
  const hasToken = !!loginToken

  const { data } = useQuery({
    queryKey: ['tree', 'root', hasToken],
    queryFn: async () => {
      // This query is re-run under certain circumstances
      // when focus was out of app and comes back in
      // EVENT THOUGH component is not re-rendered
      // Seems that was a feature of tanstack-query:
      // https://tanstack.com/query/latest/docs/react/guides/window-focus-refetching
      const [arten, lebensraeume, pcs, users, organizations] =
        await Promise.all([
          apiCount('/taxonomy?type=eq.Art'),
          apiCount('/taxonomy?type=eq.Lebensraum'),
          apiCount('/property_collection'),
          ...(hasToken ?
            [apiCount('/user'), apiCount('/organization')]
          : [Promise.resolve(0), Promise.resolve(0)]),
        ])
      return { arten, lebensraeume, pcs, users, organizations }
    },
    suspense: true,
  })

  if (!data) return null

  return (
    <>
      <Arten count={data?.arten} />
      <LR count={data?.lebensraeume} />
      <PC count={data?.pcs} />
      {hasToken && (
        <>
          <UsersFolder count={data?.users} />
          <OrganizationsFolder count={data?.organizations} />
        </>
      )}
    </>
  )
}
