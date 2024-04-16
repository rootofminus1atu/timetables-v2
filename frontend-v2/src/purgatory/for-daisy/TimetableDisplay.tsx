import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom'
import { DataReturn } from '../../utils'
import { mockTimetable } from '../../interfaces/lessons';


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


    </div>
  )
}

export default TimetableDisplay


/*


      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>M</th>
              <th>T</th>
              <th>W</th>
              <th>T</th>
              <th>F</th>
            </tr>
          </thead>
          <tbody>

            <tr>
              <th className='mt-0 pt-0 align-top'>9:00</th>
              <td rowSpan={2} className='bg-red-400 rounded-md p-0'>Cy Ganderton</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <th className='mt-0 pt-0 align-top'>10:00</th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <th className='mt-0 pt-0 align-top'>11:00</th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
*/