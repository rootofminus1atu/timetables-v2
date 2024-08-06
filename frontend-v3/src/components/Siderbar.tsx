import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { useCourseStore } from '../stores/courseStore';
import { getDefaults } from '../utils';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';


const Sidebar = () => {
  const [query, setQuery] = useState('')
  const matchedCourses = useCourseStore(state => state.searchCourses)(query, ['longName'])

  const defaults = getDefaults()

  const searchParams = new URLSearchParams(location.search);
  console.log(searchParams)
  const currentDate = searchParams.get('date') || defaults.dateStr

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const query = event.target.value || ''
    setQuery(query)
  }

  return (
    <div>
      <Toolbar sx={{ p: '0' }}>
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', height: '100%', borderRadius: 0 }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search courses"
            type="search"
            id="q" 
            name='q' 
            onChange={handleSearch}
            inputProps={{ 'aria-label': 'search courses' }}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
          </IconButton>
        </Paper>
      </Toolbar>
      <List>
        {matchedCourses.map(course => (
          <ListItem key={course.id} disablePadding>
            <ListItemButton
              component={NavLink}
              to={`/timetable/${encodeURIComponent(course.id)}?date=${currentDate}&view=${defaults.view}`}
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                '&.active': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                },
              }}
            >
              <ListItemText primary={course.shortName} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default Sidebar