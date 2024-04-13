import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Root, { loader as rootLoader } from './routes/Root.tsx'
import Timetable, { loader as timetableLoader } from './routes/Timetable.tsx'
import Home from './routes/Home.tsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} loader={rootLoader}>
      <Route index element={<Home />} />
      <Route path="timetable/:id" element={<Timetable />} loader={timetableLoader} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
