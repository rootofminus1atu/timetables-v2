import { LoaderFunctionArgs, NavLink, Outlet, useLoaderData, useNavigation } from 'react-router-dom'
import { DataReturn } from '../utils'
import Sidebar from '../components/Sidebar'
import LoadingSpinner from '../components/LoadingSpinner'
import { Course } from '../interfaces/course'
import { useCourseStore } from '../stores/courseStore'
import { useEffect } from 'react'



export async function loader() {
  // const courses: Course[] = await fetch("https://vtlxqv4eyh.execute-api.eu-west-1.amazonaws.com/GetModules/modules")
  //   .then(res => res.json())
  //   .catch(err => console.error(err))

  // console.log(modules)

  const courses = [
    {
      "department": "Dept of Business",
      "shortName": "Accounting L8 - Y1",
      "longName": "BA (Hons) Accounting L8 - Y1 Group A",
      "id": "SG_BACOO_H08/F/Y1/1/(A)"
    },
    {
      "department": "Dept of Environmental Science",
      "shortName": "Occupational Safety & Health L8 - Y4 - A",
      "longName": "B.Sc (Hons) Occupational Safety & Health L8 - Y4 - A",
      "id": "SG_SOCCU_H08/F/Y4/1/(A)"
    },
    {
      "department": "Dept of Computing and Electronic Engineering",
      "shortName": "Software Development L8 - Y2",
      "longName": "BSc (Hons) in Computing in Software Development L8 - Y2",
      "id": "SG_KSODV_H08/F/Y2/1/(B)"
    },
    {
      "department": "Dept of Computing and Electronic Engineering",
      "shortName": "Computing Games Development L7 - Y2",
      "longName": "BSc Computing Games Development L7 - Y2",
      "id": "SG_KGADV_B07/F/Y2/1/(A)"
    },
    {
      "department": "Dept of Civil Eng and Construction",
      "shortName": "Civil Engineering L7 - Y3 - A",
      "longName": "B Eng in Civil Engineering L7 - Y3 - A",
      "id": "SG_ECVIL_B07/F/Y3/1/(A) - CIV L7 Y3 A"
    }
  ]

  return courses
}


const Root = () => {
  const allCourses = useLoaderData() as DataReturn<typeof loader>
  const navigation = useNavigation()

  // only runs on init
  useCourseStore(state => state.setInitialCourses)(allCourses)

  return (
    <div className='flex w-full'>
      <Sidebar />
      <div className="divider divider-horizontal m-0 w-1"></div>
      <div id='timetable-island' className='flex-grow'>
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