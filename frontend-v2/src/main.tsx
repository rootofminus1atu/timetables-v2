import React from 'react'
import './index.css'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, ShouldRevalidateFunctionArgs } from 'react-router-dom'
import Root, { loader as rootLoader } from './routes/Root.tsx'
import TimetableDisplay, { loader as timetableDisplayLoader } from './routes/TimetableDisplay.tsx'
import Home from './routes/Home.tsx'
import { getThisWeeksMonday } from './utils.ts'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} loader={rootLoader}>
      <Route index element={<Home />} />
      <Route 
        path="timetable/:id" 
        element={<TimetableDisplay />} 
        loader={timetableDisplayLoader} 
        shouldRevalidate={({ currentUrl, nextUrl }: ShouldRevalidateFunctionArgs) => {
          const currentDate = currentUrl.searchParams.get('date') || ''
          const nextDate = nextUrl.searchParams.get('date') || ''

          return getThisWeeksMonday(new Date(currentDate)).getTime() !== getThisWeeksMonday(new Date(nextDate)).getTime()
        }}
      />
    </Route>
  )
)




ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
