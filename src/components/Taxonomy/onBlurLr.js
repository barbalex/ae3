import updateTaxonomyMutationLr from './updateTaxonomyMutationLr.js'

export const onBlurLr = async ({
  apolloClient,
  queryClient,
  scrollIntoView,
  field,
  taxonomy,
  value,
  prevValue,
  refetch,
}) => {
  if (value !== prevValue) {
    const lastUpdated = new Date()
    const variables = {
      id: taxonomy.id,
      name: field === 'name' ? value : taxonomy.name,
      description: field === 'description' ? value : taxonomy.description,
      links: field === 'links' ? value.split(',') : taxonomy.links,
      organizationId:
        field === 'organizationId' ? value : taxonomy.organizationId,
      lastUpdated,
      importedBy: field === 'importedBy' ? value : taxonomy.importedBy,
      termsOfUse: field === 'termsOfUse' ? value : taxonomy.termsOfUse,
      habitatLabel: field === 'habitatLabel' ? value : taxonomy.habitatLabel,
      habitatComments:
        field === 'habitatComments' ? value : taxonomy.habitatComments,
      habitatNrFnsMin:
        field === 'habitatNrFnsMin' ? +value : taxonomy.habitatNrFnsMin,
      habitatNrFnsMax:
        field === 'habitatNrFnsMax' ? +value : taxonomy.habitatNrFnsMax,
      type: taxonomy.type,
    }
    await apolloClient.mutate({
      mutation: updateTaxonomyMutationLr,
      variables,
    })
    refetch()
    await queryClient.invalidateQueries({
      queryKey: ['tree'],
    })
    scrollIntoView()
  }
}
