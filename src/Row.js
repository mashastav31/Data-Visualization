import { Link } from 'react-router-dom'

export default function Row ({
  number,
  racks = [],
  datacenter,
  roomNumber
}) {
  const numbers = Array.from(
    {length: 20},
    (_, i) => i + 1
  )
  const cells = numbers.map((rackNumber) => {
    const string = rackNumber.toString()

    const rack = racks
      .find(rack => rack.number === string)

    const path = rack && `/rack/${roomNumber}/${number}/${rack.number}?datacenter=${datacenter}`
    const cell = rack && (
      <Link to={path}>
        {rackNumber}
      </Link>
      )

    const className = (rack && rack.failed)
      ? 'fail'
      : ''

    return (
      <td className={className} key={rackNumber}>
        {cell}
      </td>
    )
  })

  const path = `/row/${roomNumber}/${number}?datacenter=${datacenter}`

  return (
    <tr>
      <td className='row-number'>
        <Link to={path}>
          Row {number}
        </Link>
      </td>

      {cells}
    </tr>
  )
}