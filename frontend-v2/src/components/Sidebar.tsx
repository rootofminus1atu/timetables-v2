import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { Course } from '../interfaces/course';
import { useCourseStore } from '../stores/courseStore';

// TODOS:
// - custom hook for searching spinner display in progress
// - material ui


const Sidebar = () => {
  const [query, setQuery] = useState('')
  const matchedCourses = useCourseStore(state => state.searchCourses)(query, ['longName'])

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const query = event.target.value || ''
    setQuery(query)
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
        </label>
      </form>

      <nav>
        {matchedCourses.length ? (
          <ul className='flex flex-col'>
            {matchedCourses.map(c => (
              <NavLink 
                to={`timetable/${encodeURIComponent(c.id)}`}
                key={c.id} 
                className='btn btn-ghost justify-start'
              >
                {c.longName}
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