import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom'
import { DataReturn, fetchLessons, fetchLessonsFake, getThisWeeksMonday, toFullLesson } from '../utils'
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
import { useEffect, useState } from 'react';
import { Course } from '../interfaces/course';
import { useLessonsStore } from '../stores/lessonsStore';

// todo: 
// - state management for the timetable data that has already been requested, either with useContext, useState, or something like zustand
// - another path param, for the dates
// - both of those at the same time? 

export async function loader({ params }: LoaderFunctionArgs) {
  console.log("enter loader")
  const timetableId = decodeURI(params.id as string)

  const today = new Date()
  const baseLessons = await fetchLessonsFake(timetableId, today)
  console.log("calling toFullLesson")
  const lessons = baseLessons.map(l => toFullLesson(l, timetableId))
  

  // const prepared: LessonForScheduler[] = lessons.map(lesson => ({
  //   lesson: lesson,
  //   startDate: lesson.startDate,
  //   endDate: lesson.endDate,
  //   title: lesson.details.subject
  // }))

  console.log("exit loader")
  return { lessons: lessons, timetableId, date: new Date('2024-04-23T11:00:00') }

  // const res = await fetchLesson(timetableId, new Date())
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



const TimetableDisplay = () => {
  let { lessons, timetableId, date } = useLoaderData() as DataReturn<typeof loader>
  console.log('date from loader', date)
  let [currentDate, setCurrentDate] = useState(date)
  const { addLessons } = useLessonsStore();

  const handleCurrentDateChange = (newDate: Date) => {
    console.log('date from loader', date)
    console.log('changing to', newDate)
    setCurrentDate(newDate)
  }

  // 1st time init
  // useLessonsStore(state => state.setInitialLessons)(lessons)

  // i dont think we need a 1st time init, maybe addLessons+fetchMore is sufficient
  // and a couple filters for the timetableIds
  useEffect(() => {
    addLessons(lessons)
  }, [lessons])


  // let courses = useCourseStore(state => state.courses)
  // let fullCourse = useCourseStore(state => state.getCourseById)(timetableId)

  console.log('woohoo lessons:', useLessonsStore(state => state.lessons))
  console.log('current date', currentDate);  

  const lessonsForThisCourse = useLessonsStore(state => state.getLessonsForCourse)(timetableId)

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
        data={lessonsForThisCourse}
      >
        <ViewState
          currentDate={currentDate}
          onCurrentDateChange={handleCurrentDateChange}
          defaultCurrentViewName="Week"
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