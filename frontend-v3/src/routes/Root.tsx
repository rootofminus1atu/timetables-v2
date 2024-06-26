import { Outlet, useLoaderData, useNavigate, useNavigation } from 'react-router-dom'
import { DataReturn } from '../utils'
import { useCourseStore } from '../stores/courseStore'
import Sidebar from '../components/Siderbar'
import { useState } from 'react' 
import { Course } from '../interfaces/course'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';

export async function loader() {
  const courses: Course[] = await fetch("https://vtlxqv4eyh.execute-api.eu-west-1.amazonaws.com/GetModules/modules")
    .then(res => res.json())
    .catch(err => console.error('nooo how does fetching courses fail', err))

  console.log(courses)

  return courses
}

const drawerWidth = 300;

export default function Root() {
  const allCourses = useLoaderData() as DataReturn<typeof loader>
  const navigation = useNavigation()
  const navigate = useNavigate()
  // only runs on init
  useCourseStore(state => state.setInitialCourses)(allCourses)
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="start search"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <SearchIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Timetables v2
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            color="inherit"
            aria-label="home"
            edge="end"
            onClick={() => navigate('/')}
          >
            <HomeIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <Sidebar />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 0, width: { md: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Box
          id='timetable-island'
          sx={{
            flex: 1,
            width: '100%',
            opacity: navigation.state === "loading" ? 0.55 : 1,
            transition: 'opacity 200ms',
            '::after': navigation.state === "loading" ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              // backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 10,
            } : {},
          }}
        >
          <Outlet />
        </Box>
        
      </Box>
    </Box>
  );
}
