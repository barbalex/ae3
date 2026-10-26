import { apiFetch } from '../../../modules/api.js'

export const buildOptions = async ({ cb, val }) => {
  const treeFilterText = val?.trim() ?? ''
  if (!treeFilterText) return cb([])

  let objects = []
  let pcs = []
  try {
    ;[objects, pcs] = await Promise.all([
      apiFetch(
        `/rpc/object_by_object_name?object_name=${encodeURIComponent(treeFilterText)}&select=id,name,taxonomy:taxonomy_id(id,type,name)`,
      ),
      apiFetch(
        `/rpc/property_collection_by_property_name?property_name=${encodeURIComponent(treeFilterText)}&select=id,name`,
      ),
    ])
  } catch (error) {
    // TODO: on error surface to user
    console.log(error)
    return cb([])
  }

  /**
   * need add type:
   * when suggestion is clicked,
   * url is calculated by id depending on type
   */
  const suggestionsArt = objects
    .filter((n) => n?.taxonomy?.type === 'Art')
    .map((o) => ({
      val: o.id,
      label: `${o?.taxonomy?.name ?? ''}: ${o.name}`,
      type: 'art',
    }))
  const suggestionsLr = objects
    .filter((n) => n?.taxonomy?.type === 'Lebensraum')
    .map((o) => ({
      val: o.id,
      label: `${o?.taxonomy?.name ?? ''}: ${o.name}`,
      type: 'lr',
    }))
  const suggestionsPC = pcs.map((s) => ({
    ...s,
    type: 'pC',
  }))

  const options = []
  if (suggestionsArt.length) {
    options.push({
      label: `Arten (${suggestionsArt.length})`,
      options: suggestionsArt,
    })
  }
  if (suggestionsLr.length) {
    options.push({
      label: `Lebensräume (${suggestionsLr.length})`,
      options: suggestionsLr,
    })
  }
  if (suggestionsPC.length) {
    options.push({
      label: `Eigenschaften-Sammlungen (${suggestionsPC.length})`,
      options: suggestionsPC,
    })
  }

  cb(options)
}
