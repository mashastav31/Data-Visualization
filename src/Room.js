import Row from './Row'
import { Link } from 'react-router-dom'

export default function Room ({ number, rows, datacenter }) {
  console.log('rows test:', rows)

  const numbers = Object.keys(rows)
  const sections = numbers.map(rowNumber => {
    const racks = rows[rowNumber]

    return (
      <Row
        key={number}
        number={rowNumber}
        racks={racks}
        datacenter={datacenter}
        roomNumber={number}
      />
    )
  })

  console.log('number test:', number)

  const path = `/room/${number}?datacenter=${datacenter}`

  return (
    <>
      <Link to={path} className={'roomHeader'}>
        <h2>Room {number}</h2>
      </Link>

      {sections}
    </>
  )
}
