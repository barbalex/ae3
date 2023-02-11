import Row from '../../Row'

const ArtenNode = ({ isLoading, count }) => {
  const data = {
    label: 'Arten',
    id: 'Arten',
    url: ['Arten'],
    childrenCount: count,
    info: `${isLoading ? '...' : count} Taxonomien`,
    menuType: 'TODO:',
  }

  return <Row data={data} />
}

export default ArtenNode
