import { groupBy, sumBy } from 'es-toolkit'

export const joinTaxProperties = ({ taxCount, taxProperties }) => {
  let props = []
  if (taxCount > 1) {
    props = Object.values(
      groupBy(taxProperties, (t) => `${t.propertyName}/${t.jsontype}`),
    )
      .filter((v) => v.length === taxCount)
      .map((t) => ({
        count: sumBy(t, (x) => Number(x.count)),
        jsontype: t[0].jsontype,
        propertyName: t[0].propertyName,
        taxonomies: t.map((x) => x.taxonomyName),
        taxname: 'Taxonomie',
      }))
  }
  return props
}
