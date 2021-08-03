import data from './data.json'
import { useLocation, useParams } from 'react-router-dom'
import BackButton from './BackButton'

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

export default function RackPage () {
  const location = useLocation()

  const { search } = location

  const params = new URLSearchParams(search)

  const datacenter = params.get('datacenter')

  const { roomNumber, rowNumber, number } = useParams()
  console.log('number test:', number)

  const racks = []

//1.
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

  //Couldn't find any easie way to place a rack exactly where it belogs. This seems to be working fine!
  const found = racks
    .find(rack => {
      console.log('rack test:', rack)
      const dataMatch = rack.datacenter === datacenter
      const roomMatch = rack.room === roomNumber
      const rowMatch = rack.row === rowNumber
      const rackMatch = rack.number === number

      return dataMatch && roomMatch && rowMatch && rackMatch
    })


  const sections = found
    .tors
    .map(tor => {
      const className = tor.failed ? 'tor fail' : 'tor'

      return (
        <div key={tor.hostname} className={className}>
          <h2 style={{color: 'white', textTransform: 'capitalize'}}>{tor.hostname}</h2>

          <table>
            <thead>
              <th />
              <th>Horizontal</th>
              <th>Vertical</th>
            </thead>
            <tbody>
              <tr>
                <td>Latency</td>
                <td>{tor.horizontal.latency}</td>
                <td>{tor.vertical.latency}</td>
              </tr>
              <tr>
                <td>Loss</td>
                <td>{tor.horizontal.loss}</td>
                <td>{tor.vertical.loss}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    })

  return (
    <>
      <h1>Rack {number}</h1>

      {sections}
      <BackButton/>
    </>
  )
}
