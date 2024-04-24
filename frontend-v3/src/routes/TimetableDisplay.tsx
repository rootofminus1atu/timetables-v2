import React from 'react'
import { LoaderFunctionArgs, useLoaderData, useNavigate } from 'react-router'
import { DataReturn, dateToString, fetchLessons, getDefaults, toFullLesson } from '../utils'
import { useSearchParams } from 'react-router-dom'
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
  AppointmentTooltip,
} from '@devexpress/dx-react-scheduler-material-ui';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import PersonIcon from '@mui/icons-material/Person';
import { Typography } from '@mui/material';

export async function loader({ params, request }: LoaderFunctionArgs) {
  console.log("enter loader")
  const url = new URL(request.url)
  const defaults = getDefaults()

  const timetableId = decodeURI(params.id as string)

  const date = new Date(url.searchParams.get('date') || defaults.dateStr)

  const baseLessons = await fetchLessons(timetableId, date)
  if (!baseLessons) {
    throw new Error("Oh dang!")
  }
  const lessons = baseLessons.map(l => toFullLesson(l, timetableId))

  console.log("exit loader")
  return { 
    lessons: lessons, 
    timetableId
  }
}


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


  return (
    <div>
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
              <Typography
                style={{
                  color: '#fff',
                  fontSize: '0.75rem',
                  padding: '4px 8px',
                }}
              >{data!.details.roomDetails.id}</Typography>
            </Appointments.Appointment>
          )}
        />
        <AppointmentTooltip
          showCloseButton
          contentComponent={({
            children, appointmentData, ...restProps
          }) => (
            <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
              <Grid container alignItems="center">
                <Grid item xs={2} container justifyContent="center">
                  <LocationOnIcon color="action" />
                </Grid>
                <Grid item xs={10}>
                  <span>{appointmentData!.details.roomDetails.id} - {appointmentData!.details.roomDetails.desc}</span>
                </Grid>
              </Grid>
              <Grid container alignItems="center">
                <Grid item xs={2} container justifyContent="center">
                  <PersonIcon color="action" />
                </Grid>
                <Grid item xs={10}>
                  <span>{appointmentData!.details.lecturer}</span>
                </Grid>
              </Grid>
            </AppointmentTooltip.Content>
          )}
        />

        <CurrentTimeIndicator
          updateInterval={10000}
        />

      </Scheduler>
    </div>
  )
}

export default TimetableDisplay