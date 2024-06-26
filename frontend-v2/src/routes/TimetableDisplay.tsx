import { LoaderFunctionArgs, useLoaderData, useNavigate, useSearchParams } from 'react-router-dom'
import { DataReturn, dateToString, fetchLessons, fetchLessonsFake, getDefaults, getThisWeeksMonday, toFullLesson } from '../utils'
import { TimetableResponse, Lesson } from '../interfaces/timetable';
import { useCourseStore } from '../stores/courseStore';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  Appointments,
  WeekView,
  ViewSwitcher,
  Toolbar,
  CurrentTimeIndicator,
  DateNavigator,
  TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui';

// todo: 
// - state management for the timetable data that has already been requested, either with useContext, useState, or something like zustand
// - another path param, for the dates
// - both of those at the same time? 

export async function loader({ params, request }: LoaderFunctionArgs) {
  console.log("enter loader")
  const url = new URL(request.url)
  const defaults = getDefaults()

  const timetableId = decodeURI(params.id as string)

  const date = new Date(url.searchParams.get('date') || defaults.dateStr)

  const baseLessons = await fetchLessonsFake(timetableId, date)
  const lessons = baseLessons.map(l => toFullLesson(l, timetableId))

  console.log("exit loader")
  return { 
    lessons: lessons, 
    timetableId
  }
}


// a) enter through main page
//     get current date same as in b)1

// b) enter through link
// - normal link:
//     get current date (that's what happens currently)
//     we get a timetable from the initial fetch for today and save it in a store
//     if the user goes to the next week (we need to detect that somehow) we fetch another one and save it to the store too
//     the store could be later modified to use localStorage for something more persistent, but then we would have to take into account cache invalidation
//     aka for how long should localStorag be valid 
//     its probably a better idea to not do caching like this and instead do that on the backend
//
// - query link:
//     get the date (and display type) ?d=2024-04-22&t=w (t could also be `d`)
//     what makes it harder is date/type combinations 
//     and how to push that info into/through the timetable
//     for that id have to revise react-router, something like fetcher
//     so for now ill ignore query links

// i got a tip
// dont fetch lessons in the loader, do it in the component instead (better for zustand) (can use react-query)

// nvm this approach with shouldRevalidate and useSearchParams is SO much better



const TimetableDisplay = () => {
  const { lessons, timetableId } = useLoaderData() as DataReturn<typeof loader>
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const currentView = searchParams.get('view') || getDefaults().view
  const currentDate = new Date(searchParams.get('date') || getDefaults().dateStr);

  const handleCurrentDateChange = (newDate: Date) => {
    navigate(`/timetable/${encodeURIComponent(timetableId)}?date=${dateToString(newDate)}&view=${currentView}`)
  }

  const handleViewNameChange = (newView: string) => {
    navigate(`/timetable/${encodeURIComponent(timetableId)}?date=${dateToString(currentDate)}&view=${newView}`)
  }

  // let courses = useCourseStore(state => state.courses)
  // let fullCourse = useCourseStore(state => state.getCourseById)(timetableId)

  return (
    <div>
{/*       
      {!fullModule ? (
        <p>full course loading</p>
      ) : (
        <p>department: {fullModule.department}</p>
      )}
        <p>displaying timetable with id {timetableId}</p> */}

      {/*<Timetable /> */}
      <Scheduler
        data={lessons}
      >
        <ViewState
          currentDate={currentDate}
          onCurrentDateChange={handleCurrentDateChange}
          currentViewName={currentView}
          onCurrentViewNameChange={handleViewNameChange}
        />
        <DayView
          startDayHour={9}
          endDayHour={18}
        />
        <WeekView
          startDayHour={9}
          endDayHour={18}
          excludedDays={[0, 6]}
        />
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <ViewSwitcher />
        <Appointments 
          appointmentComponent={({
            children, data, style, ...restProps
          }: Appointments.AppointmentProps & {style?: React.CSSProperties;}) => (
            <Appointments.Appointment
              {...restProps}
              data={data}
              style={{
                ...style,
                backgroundColor: data.color,
                borderRadius: '8px',
              }}
            >
              {children}
            </Appointments.Appointment>
          )}
          /*
          appointmentContentComponent={({ children, data, ...restProps }) => (
              <Appointments.AppointmentContent {...restProps} data={data}>
                <strong className='block'>{data.title}</strong>
                <p className='block'>{data.room}</p>
                <p className='block'>{data.startDate.toLocaleString()}</p>
              </Appointments.AppointmentContent>
          )} */
        />

        <CurrentTimeIndicator
          updateInterval={10000}
        />

      </Scheduler>
    </div>
  )
}

export default TimetableDisplay

