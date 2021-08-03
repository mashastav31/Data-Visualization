import data from './data.json'
import { useLocation, useParams } from 'react-router-dom'
import Row from './Row'
import './style.css'

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

  const filtered = racks
    .filter(rack => {
      const dataMatch = rack.datacenter === datacenter
      const roomMatch = rack.room === roomNumber
      const rowMatch = rack.row === number

      return dataMatch && roomMatch && rowMatch
    })

  console.log('filtered test:', filtered)

  return (
    <Row className={'rowView'}
      number={number}
      racks={filtered}
      datacenter={datacenter}
      roomNumber={roomNumber}
    />
  )
}
