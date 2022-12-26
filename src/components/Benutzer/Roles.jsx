import React from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`
const List = styled.div`
  column-width: 400px;
  margin-bottom: 10px;
  ul {
    -webkit-margin-before: 0px;
  }
`

const Roles = ({ orgUsers }) => (
  <Container>
    <List>
      <ul>
        {orgUsers.map((u) => {
          const orgName = u?.organizationByOrganizationId?.name ?? ''
          const role = u?.role ?? ''
          const val = `${orgName}: ${role}`

          return <li key={val}>{val}</li>
        })}
      </ul>
    </List>
  </Container>
)

export default Roles
