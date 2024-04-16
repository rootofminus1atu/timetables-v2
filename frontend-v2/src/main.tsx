import React from 'react'
import './index.css'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Root, { loader as rootLoader } from './routes/Root.tsx'
import TimetableDisplay, { loader as timetableDisplayLoader } from './routes/TimetableDisplay.tsx'
import Home from './routes/Home.tsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} loader={rootLoader}>
      <Route index element={<Home />} />
      <Route path="timetable/:id" element={<TimetableDisplay />} loader={timetableDisplayLoader} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
