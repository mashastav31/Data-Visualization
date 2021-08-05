import Overview from './Overview'
import RoomPage from './RoomPage'
import RowPage from './RowPage'
import RackPage from './RackPage'
import { Route } from 'react-router-dom'
import './style.css'

function App () {
  return (
    <main>
      <Route exact path='/' component={Overview}/>
      <Route path='/room/:number' component={RoomPage} />
      <Route
        path='/row/:roomNumber/:number'
        component={RowPage}
      />
      <Route
        path='/rack/:roomNumber/:rowNumber/:number'
        component={RackPage}
      />
    </main>
  )
}

export default App