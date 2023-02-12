import Row from '../../../Row'

const PcFolders = ({ pc, pcoCount, relCount }) => {
  const dataPc = {
    label: 'Eigenschaften',
    id: `${pc.id}/Eigenschaften`,
    url: ['Eigenschaften-Sammlungen', pc.id, 'Eigenschaften'],
    childrenCount: 0,
    info: pcoCount,
    menuType: 'pCProperties',
  }
  const dataRel = {
    label: 'Beziehungen',
    id: `${pc.id}/Beziehungen`,
    url: ['Eigenschaften-Sammlungen', pc.id, 'Beziehungen'],
    childrenCount: 0,
    info: relCount,
    menuType: 'pCRelations',
  }

  return (
    <>
      <Row data={dataPc} />
      <Row data={dataRel} />
    </>
  )
}

export default PcFolders
