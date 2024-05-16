import React from 'react'

import OrgUser from './OrgUser.jsx'

const OrgUsersList = ({ orgUsers }) =>
  orgUsers.map((orgUser) => (
    <OrgUser orgUser={orgUser} key={`${orgUser.id}/${orgUser.role}`} />
  ))

export default OrgUsersList
