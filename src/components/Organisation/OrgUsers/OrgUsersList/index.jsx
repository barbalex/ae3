import OrgUser from './OrgUser.jsx'

const OrgUsersList = ({ orgUsers, orgUsersRefetch }) =>
  orgUsers.map((orgUser) => (
    <OrgUser
      key={`${orgUser.id}/${orgUser.role}`}
      orgUser={orgUser}
      orgUsersRefetch={orgUsersRefetch}
    />
  ))

export default OrgUsersList
