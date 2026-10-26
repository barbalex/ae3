import { apiFetch } from '../../modules/api.js'

const columnByField = {
  name: 'name',
  description: 'description',
  links: 'links',
  organizationId: 'organization_id',
  lastUpdated: 'last_updated',
  importedBy: 'imported_by',
  termsOfUse: 'terms_of_use',
  habitatLabel: 'habitat_label',
  habitatComments: 'habitat_comments',
  habitatNrFnsMin: 'habitat_nr_fns_min',
  habitatNrFnsMax: 'habitat_nr_fns_max',
}

const numericFields = ['habitatNrFnsMin', 'habitatNrFnsMax']

export const onBlurLr = async ({
  queryClient,
  scrollIntoView,
  field,
  taxonomy,
  value,
  prevValue,
  refetch,
}) => {
  if (value !== prevValue) {
    const column = columnByField[field]
    // like the former implementation: lr changes set lastUpdated
    const patch = {
      [column]:
        field === 'links' ? value.split(',')
        : numericFields.includes(field) ? +value
        : value,
      last_updated: new Date(),
    }
    await apiFetch(`/taxonomy?id=eq.${taxonomy.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    refetch()
    await queryClient.invalidateQueries({
      queryKey: ['tree'],
    })
    scrollIntoView()
  }
}
