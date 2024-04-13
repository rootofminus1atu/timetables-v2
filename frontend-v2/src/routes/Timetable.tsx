import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom'
import { DataReturn } from '../utils'


export async function loader({ params }: LoaderFunctionArgs) {
  // calling the timetable scraper lambda
  // another 1 sec wait time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return params.id as string
}


const Timetable = () => {
  let res = useLoaderData() as DataReturn<typeof loader>
  console.log("time to render")

  return (
    <div>Timetable {res}</div>
  )
}

export default Timetable