import  { useState } from 'react'
import { ThemeProvider, createTheme, CssBaseline, Box, Container } from '@mui/material'
import CompanyForm from './components/CompanyForm'
// Define the type locally if the import isn't working
type ThemeMode = 'light' | 'dark'

function App() {
  const [mode, setMode] = useState<ThemeMode>('light')

  const theme = createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: {
              main: '#1976d2',
            },
            background: {
              default: '#f5f5f5',
            },
          }
        : {
            primary: {
              main: '#90caf9',
            },
            background: {
              default: '#121212',
            },
          }),
    },
  })

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <CompanyForm onThemeToggle={toggleTheme} />
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App 