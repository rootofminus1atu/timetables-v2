import { Outlet, useLoaderData, useNavigation } from 'react-router-dom'
import { DataReturn } from '../utils'
import Sidebar from '../components/Sidebar'
import LoadingSpinner from '../components/LoadingSpinner'


export async function loader() {
  // initial fetch from dynamo
  const allTimetableNames = [
    {
      id: "Software1234"
    },
    {
      id: "Computing1234"
    },
  ]

  return allTimetableNames
}


const Root = () => {
  const allTimetableNames = useLoaderData() as DataReturn<typeof loader>
  const navigation = useNavigation()

  return (
    <div>
      <Sidebar allTimetableNames={allTimetableNames} />

      <div id='timetable-island'>
        {navigation.state === "loading" ? (
          <LoadingSpinner />
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  )
}

export default Root