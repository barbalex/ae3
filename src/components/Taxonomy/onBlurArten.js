import { apiFetch } from '../../modules/api.js'

const columnByField = {
  name: 'name',
  description: 'description',
  links: 'links',
  organizationId: 'organization_id',
  lastUpdated: 'last_updated',
  importedBy: 'imported_by',
  termsOfUse: 'terms_of_use',
}

export const onBlurArten = async ({
  queryClient,
  scrollIntoView,
  field,
  taxonomy,
  value,
  prevValue,
  setFieldError = () => {},
  refetch,
}) => {
  if (value !== prevValue) {
    const column = columnByField[field]
    const patch =
      field === 'links' ?
        { [column]: value.split(',') }
      : { [column]: value }
    try {
      await apiFetch(`/taxonomy?id=eq.${taxonomy.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
    } catch (error) {
      return setFieldError(error)
    }
    refetch()
    setFieldError(undefined)
    await queryClient.invalidateQueries({
      queryKey: ['tree'],
    })
    scrollIntoView()
  }
}
