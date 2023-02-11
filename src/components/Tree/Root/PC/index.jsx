import Row from '../../Row'

const PcNode = ({ isLoading, count }) => {
  const data = {
    label: 'Eigenschaften-Sammlungen',
    id: 'Eigenschaften-Sammlungen',
    url: ['Eigenschaften-Sammlungen'],
    childrenCount: count,
    info: isLoading ? '...' : count,
    menuType: 'TODO:',
  }

  return <Row data={data} />
}

export default PcNode
