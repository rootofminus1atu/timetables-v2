import React, { useState } from 'react';
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
import { mockTimetable, toLessonsStore } from '../interfaces/lessons';

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}


const preparedData = toLessonsStore(mockTimetable)

const Timetable = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2024-04-15'))


  const schedulerData = preparedData.lesson.map((lesson) => {

    // this is wrong, the date has to come from outside (i think)
    const startDate = new Date(currentDate)
    startDate.setDate(startDate.getDate() + lesson.day - 1)

    const startHour = parseInt(lesson.start.split(':')[0])
    const startMinute = parseInt(lesson.start.split(':')[1])
    startDate.setHours(startHour, startMinute, 0)

    const endDate = new Date(startDate)
    const endHour = startHour + lesson.duration
    const endMinute = startMinute
    endDate.setHours(endHour, endMinute, 0)

    const color = stringToColor(lesson.details.subject)

    return {
      startDate: startDate,
      endDate: endDate,
      title: lesson.details.subject,
      color: color
    }
  })

  console.log(schedulerData, schedulerData.length)

  return (
    <Scheduler
      data={schedulerData}
    >
      <ViewState
        currentDate={currentDate}
        onCurrentDateChange={(newDate) => setCurrentDate(newDate)}
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
  )
};

export default Timetable;