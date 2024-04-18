import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';

// TODOS:
// - custom hook for searching spinner display in progress
// - material ui

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
  const [searching, setSearching] = useState(false)

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const query = event.target.value || ''

    setSearching(true)
    const found = await performSearch(allTimetableNames, query)
    setSearching(false)
    setTimetableNames(found)
  }

  
  
  return (
    <div id="sidebar" className='flex flex-col p-4 gap-4'>
      <form id="search-form" role='search'>
        <label className="input input-bordered flex items-center gap-2">
          <input 
            className="grow" 
            type="search"
            placeholder="Search" 
            id="q" 
            name='q' 
            onChange={handleSearch}
          />
          {searching ? (
            <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/></path></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
          )}
        </label>
      </form>

      <nav>
        {timetableNames.length ? (
          <ul className='flex flex-col'>
            {timetableNames.map(t => (
              <NavLink 
                to={`timetable/${t.id}`} 
                className='btn btn-ghost justify-start'
              >
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