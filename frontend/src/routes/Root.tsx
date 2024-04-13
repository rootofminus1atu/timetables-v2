import { Form, Link, LoaderFunctionArgs, NavLink, Outlet, useLoaderData, useNavigation, useSubmit } from 'react-router-dom'
import { DataReturn } from '../utils'
import { useEffect } from 'react'

// this will live in dynamo, or in some other store
// it will also have other fields, like tags
const timetableIds = [
  {
    id: "Software1234"
  },
  {
    id: "Computing1234"
  },
]


export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q') || ''
  
  // calling the lambda with the given search term q and getting some results
  const found = timetableIds.filter(t => t.id.toLowerCase().includes(q.toLowerCase()))
  await new Promise(resolve => setTimeout(resolve, 1000));
  // ofc the actual filtering will be a bit more complicated, to get more accurate results

  return { found, q }
}


const Root = () => {
  const { found, q } = useLoaderData() as DataReturn<typeof loader>
  const navigation = useNavigation()
  const submit = useSubmit()

  useEffect(() => {
    (document.getElementById("q") as HTMLInputElement).value = q;
  }, [q]);
  
  return (
    <div>
      <div id="sidebar">
        <Form id="search-form" role='search'>
          <input 
            type="search" 
            id="q"
            placeholder='Search'
            name='q' 
            defaultValue={q}
            onChange={(event) => {
              submit(event.currentTarget.form);
            }}
          />
        </Form>

        <nav>
          {found.length ? (
            <ul>
              {found.map(t => (
                <NavLink to={`timetable/${t.id}`}>
                  {t.id}
                </NavLink>
              ))}
            </ul>
          ) : (
            <p>nothing found</p>
          )}
        </nav>
      </div>

      <div id='timetable-island'>
        {navigation.state === "loading" ? (
          <p>loading...</p>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  )
}

export default Root