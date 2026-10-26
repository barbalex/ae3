import { apiFetch } from '../../modules/api.js'

const columnByField = {
  id: 'id',
  name: 'name',
  description: 'description',
  links: 'links',
  combining: 'combining',
  organizationId: 'organization_id',
  lastUpdated: 'last_updated',
  importedBy: 'imported_by',
  termsOfUse: 'terms_of_use',
}

export const onBlurDo = async ({
  queryClient,
  field,
  pC,
  value,
  prevValue,
  navigate,
  scrollIntoView,
  setError = () => {},
  refetch,
}) => {
  setError(null)
  if (value !== prevValue) {
    const column = columnByField[field]
    const patch =
      field === 'links' ?
        { [column]: value.split(',') }
      : { [column]: value }
    try {
      await apiFetch(`/property_collection?id=eq.${pC.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      refetch?.()
      queryClient.invalidateQueries({
        queryKey: ['pc'],
      })
    } catch (error) {
      console.log('error:', error.message)
      return setError(error.message)
    }
    // if id was updated, need to update url
    if (field === 'id') {
      navigate(`/Eigenschaften-Sammlungen/${value}`)
    }
    if (field === 'name') {
      await queryClient.invalidateQueries({
        queryKey: ['tree'],
      })
      scrollIntoView()
    }
  }
}
