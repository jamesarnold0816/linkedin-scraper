import React, { useState, useRef } from 'react'
import axios from 'axios'
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  Avatar,
  Link,
  Card,
  CardContent,
  Grid,
  Chip,
  InputAdornment,
  Tooltip,
  Collapse,
} from '@mui/material'
import { Brightness4, Person, LocationOn, Business, Search,  School, ExpandMore, ExpandLess, Work } from '@mui/icons-material'
import { CompanyFormProps, LinkedInProfile } from '../types'

// RapidAPI credentials
const RAPIDAPI_KEY = 'a425c3544cmsh59bd8348930bf57p16db18jsn745f323089f7'
const FRESH_PROFILE_HOST = 'fresh-linkedin-profile-data.p.rapidapi.com'

// Component to display an individual profile card
const ProfileCard = ({ profile }: { profile: any }) => {
  const [expandedExperience, setExpandedExperience] = useState(false);
  const [expandedEducation, setExpandedEducation] = useState(false);
  
  // Get the current job
  const currentJob = profile.experiences?.find((exp: any) => exp.is_current === true) || 
                   (profile.experiences && profile.experiences.length > 0 ? profile.experiences[0] : null);
  
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {/* Profile Header */}
        <Box sx={{ display: 'flex', mb: 3 }}>
          <Avatar
            src={profile.profile_image_url}
            alt={profile.full_name}
            sx={{ width: 80, height: 80, mr: 3 }}
          >
            {profile.full_name?.charAt(0)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="div" gutterBottom>
              {profile.full_name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {profile.headline || profile.job_title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {profile.location}
              </Typography>
            </Box>
            {profile.connection_count && (
              <Chip 
                size="small" 
                label={`${profile.connection_count} connections`} 
                sx={{ mr: 1, mb: 1 }}
              />
            )}
            {profile.follower_count && (
              <Chip 
                size="small" 
                label={`${profile.follower_count} followers`} 
                sx={{ mb: 1 }}
              />
            )}
          </Box>
          
          {/* View Profile Button */}
          {profile.linkedin_url && (
            <Box>
              <Link
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
              >
                <Button 
                  variant="outlined" 
                  size="small"
                  startIcon={<Person />}
                >
                  View Profile
                </Button>
              </Link>
            </Box>
          )}
        </Box>
        
        {/* About Section */}
        {profile.about && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>About</Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              {profile.about.length > 300 
                ? `${profile.about.substring(0, 300)}...` 
                : profile.about
              }
            </Typography>
          </Box>
        )}
        
        {/* Current Position */}
        {currentJob && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Current Position</Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              {currentJob.company_logo_url ? (
                <Avatar 
                  src={currentJob.company_logo_url} 
                  alt={currentJob.company}
                  sx={{ width: 50, height: 50, mr: 2 }}
                />
              ) : (
                <Business sx={{ fontSize: 50, mr: 2, color: 'text.secondary' }} />
              )}
              <Box>
                <Typography variant="subtitle1">{currentJob.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentJob.company}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentJob.date_range} {currentJob.duration && `(${currentJob.duration})`}
                </Typography>
                {currentJob.location && (
                  <Typography variant="body2" color="text.secondary">
                    {currentJob.location}
                  </Typography>
                )}
                {currentJob.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {currentJob.description.length > 200 
                      ? `${currentJob.description.substring(0, 200)}...` 
                      : currentJob.description
                    }
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        )}
        
        {/* Experience Section */}
        {profile.experiences && profile.experiences.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer',
                pb: 1,
                borderBottom: 1,
                borderColor: 'divider',
                mb: 2
              }}
              onClick={() => setExpandedExperience(!expandedExperience)}
            >
              <Typography variant="h6">Experience</Typography>
              {expandedExperience ? <ExpandLess /> : <ExpandMore />}
            </Box>
            
            <Collapse in={expandedExperience} timeout="auto">
              {profile.experiences.map((exp: any, i: number) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  {exp.company_logo_url ? (
                    <Avatar 
                      src={exp.company_logo_url} 
                      alt={exp.company}
                      sx={{ width: 40, height: 40, mr: 2 }}
                    />
                  ) : (
                    <Work sx={{ fontSize: 40, mr: 2, color: 'text.secondary' }} />
                  )}
                  <Box>
                    <Typography variant="subtitle1">{exp.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {exp.company}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {exp.date_range} {exp.duration && `(${exp.duration})`}
                    </Typography>
                    {exp.location && (
                      <Typography variant="body2" color="text.secondary">
                        {exp.location}
                      </Typography>
                    )}
                    {exp.description && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {exp.description.length > 150 
                          ? `${exp.description.substring(0, 150)}...` 
                          : exp.description
                        }
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Collapse>
          </Box>
        )}
        
        {/* Education Section */}
        {profile.educations && profile.educations.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer',
                pb: 1,
                borderBottom: 1,
                borderColor: 'divider',
                mb: 2
              }}
              onClick={() => setExpandedEducation(!expandedEducation)}
            >
              <Typography variant="h6">Education</Typography>
              {expandedEducation ? <ExpandLess /> : <ExpandMore />}
            </Box>
            
            <Collapse in={expandedEducation} timeout="auto">
              {profile.educations.map((edu: any, i: number) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  {edu.school_logo_url ? (
                    <Avatar 
                      src={edu.school_logo_url} 
                      alt={edu.school}
                      sx={{ width: 40, height: 40, mr: 2 }}
                    />
                  ) : (
                    <School sx={{ fontSize: 40, mr: 2, color: 'text.secondary' }} />
                  )}
                  <Box>
                    <Typography variant="subtitle1">{edu.school}</Typography>
                    {edu.degree && (
                      <Typography variant="body2">
                        {edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}
                      </Typography>
                    )}
                    {edu.date_range && (
                      <Typography variant="body2" color="text.secondary">
                        {edu.date_range}
                      </Typography>
                    )}
                    {edu.activities && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {edu.activities}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Collapse>
          </Box>
        )}
        
        {/* Company Information */}
        {profile.company_description && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Company Information</Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              {profile.company_logo_url && (
                <Avatar 
                  src={profile.company_logo_url} 
                  alt={profile.company}
                  sx={{ width: 50, height: 50, mr: 2 }}
                />
              )}
              <Box>
                <Typography variant="subtitle1">{profile.company}</Typography>
                {profile.company_industry && (
                  <Typography variant="body2" color="text.secondary">
                    Industry: {profile.company_industry}
                  </Typography>
                )}
                {profile.company_employee_range && (
                  <Typography variant="body2" color="text.secondary">
                    Size: {profile.company_employee_range} employees
                  </Typography>
                )}
                {profile.company_year_founded && (
                  <Typography variant="body2" color="text.secondary">
                    Founded: {profile.company_year_founded}
                  </Typography>
                )}
                {profile.company_website && (
                  <Link 
                    href={profile.company_website} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Typography variant="body2">
                      {profile.company_website}
                    </Typography>
                  </Link>
                )}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {profile.company_description.length > 200 
                    ? `${profile.company_description.substring(0, 200)}...` 
                    : profile.company_description
                  }
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const ProfileSearchForm = ({ onThemeToggle }: CompanyFormProps) => {
  // Profile search state
  const [name, setName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [location, setLocation] = useState('')
  const [limit, setLimit] = useState(10)
  const [profiles, setProfiles] = useState<LinkedInProfile[]>([])

  // Loading state
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined)

  const startTimer = () => {
    setTimer(0)
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1)
    }, 1000)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  // Function to search for LinkedIn profiles using the fresh LinkedIn profile data API
  const searchLinkedInProfiles = async () => {
    
    const options = {
      method: 'POST',
      url: 'https://fresh-linkedin-profile-data.p.rapidapi.com/google-full-profiles',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': FRESH_PROFILE_HOST,
        'Content-Type': 'application/json'
      },
      data: {
        name: name,
        company_name: '',
        job_title: jobTitle,
        location: location,
        keywords: '',
        limit: limit
      }
    };

    const response = await axios.request(options);
    console.log('API Response:', response.data);
    
    // The API returns an array of profiles in data.data
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    return [];
  }

  // Save profile data to localStorage
  const saveProfileData = (profiles: LinkedInProfile[]) => {
    try {
      // Get existing saved profiles
      const savedProfiles = localStorage.getItem('savedProfiles');
      let existingProfiles = savedProfiles ? JSON.parse(savedProfiles) : [];

      // Add search metadata
      const profileData = {
        name,
        jobTitle,
        companyName:'',
        location,
        keywords:'',
        searchedAt: new Date().toISOString(),
        profiles: profiles
      };

      // Add to existing searches
      existingProfiles.unshift(profileData);

      // Keep only the most recent 10 searches
      if (existingProfiles.length > 10) {
        existingProfiles = existingProfiles.slice(0, 10);
      }

      // Save back to localStorage
      localStorage.setItem('savedProfiles', JSON.stringify(existingProfiles));
      console.log(`Profile data saved: ${profiles.length} profiles`);
      return true;
    } catch (error) {
      console.error('Error saving profile data:', error);
      return false;
    }
  };

  // Handle profile search
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Require at least one search parameter
    if (!name && !jobTitle && !location) {
      alert('Please enter at least one search parameter');
      return;
    }

    setIsLoading(true);
    startTimer();
    setProfiles([]); // Clear previous results

    try {
      // Search for profiles with the given parameters
      const foundProfiles = await searchLinkedInProfiles();

      stopTimer();

      setProfiles(foundProfiles);

      // Save to localStorage
      saveProfileData(foundProfiles);
    } catch (error) {
      stopTimer();
      console.error('Error searching profiles:', error);
      alert('Error searching profiles. See console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const clearSavedData = () => {
    if (window.confirm('Are you sure you want to clear all saved profile data?')) {
      localStorage.removeItem('savedProfiles');
      setProfiles([]);
    }
  };

  const exportData = () => {
    try {
      const data = JSON.stringify({
        name,
        jobTitle,
        companyName:'',
        location,
        keywords:'',
        profiles,
        searchedAt: new Date().toISOString()
      }, null, 2);

      const filename = `linkedin-profiles-${new Date().toISOString().slice(0, 10)}.json`;
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          LinkedIn Profile Search
        </Typography>
        <Box>
          <IconButton onClick={onThemeToggle} color="inherit" title="Toggle Theme">
            <Brightness4 />
          </IconButton>
          <Button
            variant="outlined"
            size="small"
            onClick={exportData}
            sx={{ mx: 1 }}
            disabled={profiles.length === 0}
          >
            Export
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={clearSavedData}
            disabled={profiles.length === 0}
          >
            Clear
          </Button>
        </Box>
      </Box>

      <form onSubmit={handleProfileSubmit}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name (e.g. John Smith)"
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Enter the person's full name">
                      <Person fontSize="small" color="action" />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Job Title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Enter job title (e.g. Software Engineer, CEO)"
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Enter the job title to search for">
                      <Person fontSize="small" color="action" />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location (e.g. US, New York)"
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Enter the location to search for (country or city)">
                      <LocationOn fontSize="small" color="action" />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Result Limit"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              inputProps={{ min: 1, max: 50 }}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Maximum number of results to return (1-50)">
                      <Person fontSize="small" color="action" />
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || (!name && !jobTitle && !location)}
              startIcon={isLoading ? <CircularProgress size={20} /> : <Search />}
              sx={{ minWidth: 160, py: 1 }}
            >
              {isLoading ? 'Searching...' : 'Search Profiles'}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Timer: {formatTime(timer)}
      </Typography>

      {profiles.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Found {profiles.length} profiles
          </Typography>

          <Grid container spacing={2}>
            {profiles.map((profile, index) => (
              <Grid item xs={12} key={index}>
                <ProfileCard profile={profile} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Paper>
  )
}

export default ProfileSearchForm 