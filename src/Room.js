import Row from './Row'
import { Link } from 'react-router-dom'

export default function Room ({ number, rows, datacenter }) {
  const numbers = Array.from(
    {length: 20},
    (_, i) => i + 1
  )

  const sections = numbers.map(rowNumber => {
    const racks = rows[rowNumber]

    return (
      <Row
        key={rowNumber}
        number={rowNumber}
        racks={racks}
        datacenter={datacenter}
        roomNumber={number}
      />
    )
  })

  const path = `/room/${number}?datacenter=${datacenter}`

  return (
    <>
      <Link to={path} className={'roomHeader'}>
        <h1>Room {number}</h1>
      </Link>

      <table>
        <tbody>
          {sections}
        </tbody>
      </table>
    </>
  )
}
