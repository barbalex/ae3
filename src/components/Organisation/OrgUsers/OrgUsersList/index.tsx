import { OrgUser } from './OrgUser'

type OrgUsersListProps = {
  orgUsers: any[]
  orgUsersRefetch: () => void
}

export const OrgUsersList = ({ orgUsers, orgUsersRefetch }: OrgUsersListProps) =>
  orgUsers.map((orgUser) => (
    <OrgUser
      key={`${orgUser.id}/${orgUser.role}`}
      orgUser={orgUser}
      orgUsersRefetch={orgUsersRefetch}
    />
  ))
