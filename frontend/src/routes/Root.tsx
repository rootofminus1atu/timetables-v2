import { Form, Link, Outlet } from 'react-router-dom'


// loader
// action
// these 2 functions will be needed for the search functionality


const Root = () => {
  // will be returned from the loader (mock list currently)
  const timetableIds = [
    {
      id: "Software1234"
    },
    {
      id: "Computing1234"
    },
  ]

  return (
    <div>
      <div id="sidebar">
        <Form>
          <label htmlFor="q">
          search
          <input type="text" id="q" />
          </label>
        </Form>
        {timetableIds.map(t => (
          <Link to={`timetable/${t.id}`}>
            {t.id}
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  )
}

export default Root