import Row from '../../Row'

const ArtenNode = ({ isLoading, count }) => {
  const data = {
    label: 'Arten',
    id: 'Arten',
    url: ['Arten'],
    children_count: count,
    info: `${isLoading ? '...' : count} Taxonomien`,
    menu_type: 'TODO:',
  }

  return <Row data={data} />
}

export default ArtenNode
