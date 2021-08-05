import data from './data.json'
import { useLocation, useParams } from 'react-router-dom'
import Row from './Row'

//failing consitions
function isFailed (latency, loss) {
  const latencyFailed = latency > 10000
  if (latencyFailed) {
    return 'latency'
  }
  const lossFailed = loss > 10
  if (lossFailed) {
    return 'loss'
  }
  return false
}

export default function RowPage () {
  const location = useLocation()

  const { search } = location

  const params = new URLSearchParams(search)

  const datacenter = params.get('datacenter')

  const { roomNumber, number } = useParams()

  const racks = []

  data.forEach(report => {
    const {
      hostname,
      location,
      latency_us: latency,
      loss,
      type
    } = report

    const failed = isFailed(latency, loss)
    const dimension = {
      loss,
      latency,
      failed
    }

    const alreadyRack = racks
      .find(rack => rack.location === location)

    if (alreadyRack) {
      if (failed) {
        alreadyRack.failed = failed
      }

      const alreadyTor = alreadyRack
        .tors
        .find(tor => tor.hostname === hostname)

      if (alreadyTor) {
        if (failed) {
          alreadyTor.failed = failed
        }

        alreadyTor[type] = dimension
      } else {
        const tor = {
          hostname,
          failed,
          [type]: dimension
        }

        alreadyRack.tors.push(tor)
      }
    } else {
      const components = location.split('.')

      const [
        datacenter, room, row, number
      ] = components

      const tor = {
        hostname,
        failed,
        [type]: dimension
      }

      const rack = {
        location,
        datacenter,
        room,
        row,
        number,
        failed,
        tors: [tor]
      }

      racks.push(rack)
    }
  })

  const filtered = racks
    .filter(rack => {
      const dataMatch = rack.datacenter === datacenter
      const roomMatch = rack.room === roomNumber
      const rowMatch = rack.row === number

      return dataMatch && roomMatch && rowMatch
    })

  return (
    <>
      <h1>Row {number}</h1>

      <table>
        <tbody>
          <Row className={'rowView'}
            number={number}
            racks={filtered}
            datacenter={datacenter}
            roomNumber={roomNumber}
          />
        </tbody>
      </table>
    </>
  )
}
