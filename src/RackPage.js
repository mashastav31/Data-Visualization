import data from './data.json'
import { useLocation, useParams } from 'react-router-dom'
import './style.css'
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
  // [
  //   {
  //     location: 'US....',
  //     datacenter: 'US...',
  //     room: '1',
  //     row: '1',
  //     number: '1',
  //     failed: true,
  //     tors: [
  //       {
  //         hostname: 'usmt...',
  //         failed: true,
  //         vertical: {
  //           loss: 0.0,
  //           latency: 0.0,
  //           failed: false
  //         },
  //         horizontal: {
  //           loss: 10.0,
  //           latency: 0.0,
  //           failed: true
  //         }
  //       },
  //       {
  //         hostname: 'usst...',
  //         failed: true,
  //         vertical: {
  //           loss: 0.0,
  //           latency: 0.0,
  //           failed: false
  //         },
  //         horizontal: {
  //           loss: 10.0,
  //           latency: 0.0,
  //           failed: true
  //         }
  //       }
  //     ]
  //   }
  // ]

  console.log('data test:', data)
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

  console.log('racks test:', racks)

  console.log('datacenter test:', datacenter)
  console.log('roomNumber test:', roomNumber)
  console.log('number test:', number)

  const found = racks
    .find(rack => {
      const dataMatch = rack.datacenter === datacenter
      const roomMatch = rack.room === roomNumber
      const rowMatch = rack.row === rowNumber
      const rackMatch = rack.number === number

      return dataMatch && roomMatch && rowMatch && rackMatch
    })

  console.log('found test:', found)

  const sections = found
    .tors
    .map(tor => {
      const className = tor.failed ? 'tor fail' : 'tor'

      return (
        <div key={tor.hostname} className={className}>
          <h2>{tor.hostname}</h2>

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
    <main >
      <h1 className={'rackHeader'}>Rack {number}</h1>

      {sections}
      <BackButton/>
    </main>
  )
}
