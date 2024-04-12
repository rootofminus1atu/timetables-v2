import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom'
import { DataReturn } from '../utils'


export async function loader({ params }: LoaderFunctionArgs) {
  // calling the timetable scraper lambda
  return params.id as string
}


const Timetable = () => {
  let res = useLoaderData() as DataReturn<typeof loader>

  return (
    <div>Timetable {res}</div>
  )
}

export default Timetable