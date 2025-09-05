import updateTaxonomyMutationArten from './updateTaxonomyMutationArten.js'

export const onBlurArten = async ({
  apolloClient,
  queryClient,
  field,
  taxonomy,
  value,
  prevValue,
  setFieldError = () => {},
  refetchTree = () => {},
}) => {
  if (value !== prevValue) {
    const variables = {
      id: taxonomy.id,
      name: field === 'name' ? value : taxonomy.name,
      description: field === 'description' ? value : taxonomy.description,
      links: field === 'links' ? value.split(',') : taxonomy.links,
      organizationId:
        field === 'organizationId' ? value : taxonomy.organizationId,
      lastUpdated: field === 'lastUpdated' ? value : taxonomy.lastUpdated,
      importedBy: field === 'importedBy' ? value : taxonomy.importedBy,
      termsOfUse: field === 'termsOfUse' ? value : taxonomy.termsOfUse,
      type: taxonomy.type,
    }
    try {
      await apolloClient.mutate({
        mutation: updateTaxonomyMutationArten,
        variables,
        optimisticResponse: {
          updateTaxonomyById: {
            taxonomy: {
              id: taxonomy.id,
              name: field === 'name' ? value : taxonomy.name,
              description:
                field === 'description' ? value : taxonomy.description,
              links: field === 'links' ? value.split(',') : taxonomy.links,
              organizationId:
                field === 'organizationId' ? value : taxonomy.organizationId,
              lastUpdated:
                field === 'lastUpdated' ? value : taxonomy.lastUpdated,
              importedBy: field === 'importedBy' ? value : taxonomy.importedBy,
              termsOfUse: field === 'termsOfUse' ? value : taxonomy.termsOfUse,
              type: taxonomy.type,
              __typename: 'Taxonomy',
            },
            __typename: 'Taxonomy',
          },
          __typename: 'Mutation',
        },
      })
    } catch (error) {
      return setFieldError(error)
    }
    setFieldError(undefined)
    refetchTree()
    queryClient.invalidateQueries({
      queryKey: ['tree'],
    })
  }
}
