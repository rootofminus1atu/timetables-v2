import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"

const Home = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container direction="column" justifyContent="center" alignItems="center" style={{ minHeight: '80vh' }}>
        <Grid item>
          <Typography variant="h1" sx={{ fontSize: { xs: 'h4.fontSize', sm: 'h3.fontSize', md: 'h1.fontSize' } }}>
            Timetables&nbsp;V2
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1" gutterBottom>
            An improved version of our beloved timetables.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Home