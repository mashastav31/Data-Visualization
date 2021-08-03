import { Link } from 'react-router-dom'

export default function Row ({
  number,
  racks,
  datacenter,
  roomNumber
}) {
  console.log('racks test:', racks)

  const sorted = racks.sort((a, b) => {
    if (a.number > b.number) {
      return -1
    }

    return 1
  })

  const rows = sorted.map(rack => {
    const cells = rack.tors.map(tor => {
      const { failed, hostname } = tor

      const className = failed ? 'fail' : 'good'

      return (
        <td className={className} key={hostname}>
          {hostname}
        </td>
      )
    })

    const className = rack.failed ? 'fail' : 'good'

    if (cells.length === 1) {
      cells.push(
        <td key='empty' className={className} />
      )
    }

    const path = `/rack/${roomNumber}/${number}/${rack.number}?datacenter=${datacenter}`

    return (
      <tr key={rack.number}>
        <td className={className}>
          <Link to={path}>
            Rack {rack.number}
          </Link>
        </td>

        {cells}
      </tr>
    )
  })

  const path = `/row/${roomNumber}/${number}?datacenter=${datacenter}`

  return (
    <>

      <Link to={path} className={'rowView'}>
        <h3>Row {number}</h3>
      </Link>

      <table className={'rowTable'}>
        <tbody>
          {rows}
        </tbody>
      </table>
    </>
  )
}