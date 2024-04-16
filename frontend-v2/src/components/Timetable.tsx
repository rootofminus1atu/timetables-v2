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


const schedulerData = [
{
  startDate: '2021-07-07T09:45',
  endDate: '2021-07-07T11:00',
  title: 'Meeting',
  room: "B1"
},
{
  startDate: '2021-07-07T10:00',
  endDate: '2021-07-07T12:00',
  title: 'Meeting',
  room: "B1"
},
{
  startDate: '2021-07-07T11:15',
  endDate: '2021-07-07T13:00',
  title: 'Meeting',
  room: "B1"
},
];

const Timetable = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2021-07-07'))

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
      /*
        appointmentComponent={({
          children, data, style, ...restProps
        }: Appointments.AppointmentProps & {style?: React.CSSProperties;}) => (
          <Appointments.Appointment
            {...restProps}
            data={data}
            style={{
              ...style,
              backgroundColor: '#FFC107',
              borderRadius: '8px',
            }}
          >
            {children}
            <p>{data.room}</p>
          </Appointments.Appointment>
        )}
        */
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