import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom'
import { DataReturn } from '../utils'
import { mockTimetable } from '../interfaces/lessons';
import CreateEventWithNoOverlap from '../components/Timetable';
import { momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Timetable from '../components/Timetable';

const mLocalizer = momentLocalizer(moment)

export async function loader({ params }: LoaderFunctionArgs) {
  // calling the timetable scraper lambda
  // another 1 sec wait time
  await new Promise(resolve => setTimeout(resolve, 1000));
  const timetable = mockTimetable
  
  return { timetable, id: params.id as string }
}


const TimetableDisplay = () => {
  let { timetable, id } = useLoaderData() as DataReturn<typeof loader>
  console.log("time to render this:", timetable)

  return (
    <div>
      <p>displaying timetable with id {id}</p>

      <div id='timetable-will-be-here'></div>

      <Timetable />


    </div>
  )
}

export default TimetableDisplay