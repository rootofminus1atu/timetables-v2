import { Outlet, useLoaderData, useNavigation } from 'react-router-dom'
import { DataReturn } from '../../utils'
import Sidebar from '../../components/Sidebar'
import LoadingSpinner from '../../components/LoadingSpinner'


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
    <div className='flex w-full'>
      <Sidebar allTimetableNames={allTimetableNames} />
      <div className="divider divider-horizontal m-0 w-1"></div>
      <div id='timetable-island' className='p-2'>
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