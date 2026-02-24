import { gql } from '@apollo/client'
import createUserMutation from '../../Benutzer/createUserMutation.js'
import deleteUserMutation from '../../Benutzer/deleteUserMutation.js'
import createObjectMutation from '../../Objekt/createObjectMutation.js'
import createRootObjectMutation from '../../Objekt/createRootObjectMutation.js'
import deleteObjectMutation from '../../Objekt/deleteObjectMutation.js'
import createTaxonomyMutation from '../../Taxonomy/createTaxonomyMutation.js'
import createPCMutation from '../../PropertyCollection/createPCMutation.js'
import deletePCMutation from '../../PropertyCollection/deletePCMutation.js'
import deleteTaxonomyMutation from '../../Taxonomy/deleteTaxonomyMutation.js'
import {
  store,
  apolloClientAtom,
  queryClientAtom,
} from '../../../store/index.ts'
import { editingTaxonomiesAtom, editingPCsAtom } from '../../../store/index.ts'

const taxonomyTypeConverter = {
  Arten: 'ART',
  Lebensraeume: 'LEBENSRAUM',
}

export const onClickContextMenu = async ({
  data,
  target,
  scrollIntoView,
  loginUsername,
  navigate,
}) => {
  const client = store.get(apolloClientAtom)
  const queryClient = store.get(queryClientAtom)
  const editingTaxonomies = store.get(editingTaxonomiesAtom)

  if (!client || !queryClient) {
    console.error('Apollo client or Query client not initialized')
    return
  }
  if (!data) return console.log('no data passed with click')
  if (!target) {
    return console.log('no target passed with click')
  }
  const { table, action } = data
  const id = target.firstElementChild.getAttribute('data-id')
  const url = target.firstElementChild.getAttribute('data-url').split(',')

  const actions = {
    insert: async () => {
      if (table === 'user') {
        let newUser
        try {
          newUser = await client.mutate({
            mutation: createUserMutation,
          })
        } catch (error) {
          console.log(error)
        }
        const newUserId = newUser?.data?.createUser?.user?.id
        if (newUserId) {
          navigate(`/Benutzer/${newUserId}`)
        }
      }
      // get userId
      const { data: userData } = await client.query({
        query: gql`
          query treeRowUserQuery($name: String!) {
            userByName(name: $name) {
              id
            }
          }
        `,
        variables: { name: loginUsername },
      })
      const userId = userData?.userByName?.id
      if (table === 'object') {
        let newObjectData
        if (url.length === 2) {
          // user clicked on the taxonomy
          // need to create root level object, without parentId
          newObjectData = await client.mutate({
            mutation: createRootObjectMutation,
            variables: { taxonomyId: url[1] },
          })
        } else {
          newObjectData = await client.mutate({
            mutation: createObjectMutation,
            variables: { taxonomyId: url[1], parentId: id },
          })
        }
        const newId = newObjectData?.data?.createObject?.object?.id ?? null
        navigate(`/${[...url, newId].join('/')}`)
        // if not editing, set editing true
        if (!editingTaxonomies) {
          store.set(editingTaxonomiesAtom, true)
        }
      }
      if (table === 'taxonomy') {
        const type = taxonomyTypeConverter[id] ?? 'Art'
        const newTaxonomyData = await client.mutate({
          mutation: createTaxonomyMutation,
          variables: {
            type: taxonomyTypeConverter[id],
            importedBy: userId,
            lastUpdated: new Date(),
          },
        })
        const newId =
          newTaxonomyData?.data?.createTaxonomy?.taxonomy?.id ?? null
        navigate(`/${[...url, newId].join('/')}`)
        // if not editingTaxonomies, set editingTaxonomies true
        if (!editingTaxonomies) {
          store.set(editingTaxonomiesAtom, true)
        }
      }
      if (table === 'pc') {
        const newPCData = await client.mutate({
          mutation: createPCMutation,
          variables: { importedBy: userId, lastUpdated: new Date() },
        })
        const newId =
          newPCData?.data?.createPropertyCollection?.propertyCollection?.id ??
          null
        navigate(`/${[...url, newId].join('/')}`)
        // if not editing, set editingTaxonomies true
        if (!editingTaxonomies) {
          store.set(editingPCsAtom, true)
        }
      }
      queryClient.invalidateQueries({
        queryKey: [`tree`],
      })
      // console.log('will scroll into view')
      setTimeout(() => scrollIntoView())
    },
    delete: async () => {
      if (table === 'user') {
        try {
          await client.mutate({
            mutation: deleteUserMutation,
            variables: { id },
            optimisticResponse: {
              deleteUserById: {
                user: {
                  id,
                  __typename: 'User',
                },
                __typename: 'Mutation',
              },
            },
          })
        } catch (error) {
          console.log(error)
        }
        navigate('/Benutzer')
        queryClient.invalidateQueries({
          queryKey: [`tree`],
        })
      }
      if (table === 'object') {
        await client.mutate({
          mutation: deleteObjectMutation,
          variables: { id },
          optimisticResponse: {
            deleteObjectById: {
              object: {
                id,
                __typename: 'Object',
              },
              __typename: 'Mutation',
            },
          },
        })
        queryClient.invalidateQueries({
          queryKey: [`tree`],
        })
        if (url.includes(id)) {
          url.length = url.indexOf(id)
          navigate(`/${url.join('/')}`)
        }
      }
      if (table === 'taxonomy') {
        await client.mutate({
          mutation: deleteTaxonomyMutation,
          variables: { id },
          optimisticResponse: {
            deleteTaxonomyById: {
              taxonomy: {
                id,
                __typename: 'Taxonomy',
              },
              __typename: 'Mutation',
            },
          },
        })
        queryClient.invalidateQueries({
          queryKey: [`tree`],
        })
        if (url.includes(id)) {
          url.length = url.indexOf(id)
          navigate(`/${url.join('/')}`)
        }
      }
      if (table === 'pc') {
        await client.mutate({
          mutation: deletePCMutation,
          variables: { id },
          optimisticResponse: {
            deletePropertyCollectionById: {
              propertyCollection: {
                id,
                __typename: 'PropertyCollection',
              },
              __typename: 'Mutation',
            },
          },
        })
        queryClient.invalidateQueries({
          queryKey: [`tree`],
        })
        if (url.includes(id)) {
          url.length = url.indexOf(id)
          navigate(`/${url.join('/')}`)
        }
      }
      queryClient.invalidateQueries({
        queryKey: [`tree`],
      })
      setTimeout(() => scrollIntoView())
    },
  }
  if (Object.keys(actions).includes(action)) {
    actions[action]()
  } else {
    console.log(`action "${action}" unknown, therefore not executed`)
  }
}
