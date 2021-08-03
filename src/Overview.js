import data from './data.json'
import { useLocation } from 'react-router-dom'
import Room from './Room'
import './style.css'

function unique (data, key) {
  const rooms = data.map(datum => datum[key])
  const set = new Set(rooms)
  const array = Array.from(set)

  return array
}

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

export default function Overview () {
  const location = useLocation()

  const { search } = location

  const params = new URLSearchParams(search)

  const datacenter = params.get('datacenter')

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

  const filtered = racks
    .filter(rack => rack.datacenter === datacenter)

  console.log('filtered test:', filtered)

  const rooms = unique(filtered, 'room')

  const sorted = rooms.sort((a, b) => {
    if (a < b) {
      return -1
    }

    return 1
  })

  console.log('sorted test:', sorted)

  const nested = {}

  sorted.forEach(room => {
    const roomRacks = filtered
      .filter(rack => rack.room === room)

    const nestedRoom = {}

    const rows = unique(roomRacks, 'row')

    rows.forEach(row => {
      const rowRacks = roomRacks
        .filter(rack => rack.row === row)

      nestedRoom[row] = rowRacks
    })

    nested[room] = nestedRoom
  })

  console.log('nested test:', nested)

  const sections = sorted.map(room => {
    const rows = nested[room]

    console.log('rows test:', rows)

    return (
      <Room 
        key={room}
        number={room}
        rows={rows}
        datacenter={datacenter}
      />
    )
  })

  return (
    <main>
      <h1 className={'mainHeader'}>Datacenter {datacenter}</h1>
      {sections}
    </main>
  )
}
