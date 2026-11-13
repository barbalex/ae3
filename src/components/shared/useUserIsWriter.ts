import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { apiFetch } from '../../modules/api'
import { loginUsernameAtom } from '../../store'

export type OrgUser = {
  id: string
  organizationId: string
  role: string
  organizationByOrganizationId: { id: string; name: string }
}

export type UserWithOrgs = {
  id: string
  name: string
  email: string
  organizationUsersByUserId: OrgUser[]
}

// every consumer of the ['allUsers'] query must go through this hook:
// react-query caches by key, so a different select shape under the same
// key would poison the other consumers
export const useAllUsers = () =>
  useQuery({
    queryKey: ['allUsers'],
    queryFn: () =>
      apiFetch(
        '/user?select=id,name,email,organizationUsersByUserId:organization_user(id,organizationId:organization_id,role,organizationByOrganizationId:organization_id(id,name))',
      ) as Promise<UserWithOrgs[]>,
  })

export const taxonomyWriterRoles = ['orgTaxonomyWriter', 'orgAdmin']
export const collectionWriterRoles = ['orgCollectionWriter', 'orgAdmin']

// does the logged-in user hold one of the given roles in the organization
// owning the record? records without an organization are writable by any
// writer of that kind
export const useUserIsWriter = (
  writerRoles: string[],
  organizationId: string | null | undefined,
) => {
  const username = useAtomValue(loginUsernameAtom)
  const { data: allUsers, error } = useAllUsers()
  const user = (allUsers ?? []).find((u) => u.name === username)
  const orgsUserIsWriter = (user?.organizationUsersByUserId ?? [])
    .filter((o) => writerRoles.includes(o.role))
    .map((o) => ({
      id: o.organizationId,
      name: o.organizationByOrganizationId?.name ?? '',
    }))
  const userIsWriter = orgsUserIsWriter.length > 0
  const userIsThisWriter =
    !!orgsUserIsWriter.find((o) => o.id === organizationId) ||
    (userIsWriter && !organizationId)
  return {
    allUsers: allUsers ?? [],
    orgsUserIsWriter,
    userIsWriter,
    userIsThisWriter,
    error,
  }
}
