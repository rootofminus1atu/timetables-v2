import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';


interface TimetableName {
  id: string
}


// could either be a lambda or local function
const performSearch = async (timetableNames: TimetableName[], q: string) => {
  // the line below simulates a 1 sec wait time
  await new Promise(resolve => setTimeout(resolve, 1000));
  return timetableNames.filter(t => t.id.toLowerCase().includes(q.toLowerCase()))
}


const Sidebar = ({ allTimetableNames }: { allTimetableNames: TimetableName[] }) => {
  const [timetableNames, setTimetableNames] = useState(allTimetableNames)

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const query = event.target.value || ''

    const found = await performSearch(allTimetableNames, query)
    setTimetableNames(found)
  }
  
  return (
    <div id="sidebar">
      <form id="search-form" role='search'>
        <input 
          type="search" 
          id="q"
          placeholder='Search'
          name='q' 
          onChange={handleSearch}
        />
      </form>

      <nav>
        {timetableNames.length ? (
          <ul>
            {timetableNames.map(t => (
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
  )
}

export default Sidebar