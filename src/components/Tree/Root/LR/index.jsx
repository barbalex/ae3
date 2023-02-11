import Row from '../../Row'

const LrNode = ({ isLoading, count }) => {
  const data = {
    label: 'Lebensräume',
    id: 'Lebensraeume',
    url: ['Lebensräume'],
    childrenCount: count,
    info: `${isLoading ? '...' : count} Taxonomien`,
    menuType: 'CmType',
  }

  return <Row data={data} />
}

export default LrNode
