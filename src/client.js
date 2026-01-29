import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  HttpLink,
} from '@apollo/client'
import { LocalState } from '@apollo/client/local-state'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { SetContextLink } from '@apollo/client/link/context'
import { jwtDecode } from 'jwt-decode'

import './index.css'
import 'react-reflex/styles.css'

import { graphQlUri } from './modules/graphQlUri.js'
import { store, loginTokenAtom, setLoginAtom } from './store/index.ts'

export const client = ({ idb }) => {
  /**
   * On the next line Firefox 45.3.0 errors out with:
   * Unhandled Rejection (OpenFailedError): UnknownError The operation failed
   * for reasons unrelated to the database itself and not covered by any other error code
   */
  const authLink = new SetContextLink(async () => {
    const token = store.get(loginTokenAtom)
    if (token) {
      const tokenDecoded = jwtDecode(token)
      // for unknown reason, date.now returns three more after comma
      // numbers than the exp date contains
      const tokenIsValid = tokenDecoded.exp > Date.now() / 1000
      if (tokenIsValid) {
        return {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      } else {
        // token is not valid any more > remove it
        idb.users.clear()
        store.set(setLoginAtom, {
          username: 'Login abgelaufen',
          token: '',
        })
        setTimeout(
          () =>
            store.set(setLoginAtom, {
              username: '',
              token: '',
            }),
          10000,
        )
      }
      // TODO: tell user "Ihre Anmeldung ist abgelaufen"
    }
  })

  // use httpLink _instead_ of batchHttpLink in order not to batch

  // batchHttpLink was MUCH SLOWER!!!!!
  // needed to set batchMax: 1 to make it fast
  // seems that some of the batched queries are WAY too slow and that slows the others down
  // "solved" by loading heavy query later
  const batchHttpLink = new BatchHttpLink({
    uri: graphQlUri(),
    // batchMax: 5
  })
  const client = new ApolloClient({
    link: ApolloLink.from([authLink, batchHttpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
      },
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  })
  return client
}
