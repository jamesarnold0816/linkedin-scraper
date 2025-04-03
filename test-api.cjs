const axios = require('axios');

const options = {
  method: 'POST',
  url: 'https://fresh-linkedin-profile-data.p.rapidapi.com/google-full-profiles',
  headers: {
    'x-rapidapi-key': 'a425c3544cmsh59bd8348930bf57p16db18jsn745f323089f7',
    'x-rapidapi-host': 'fresh-linkedin-profile-data.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    name: 'James',
    company_name: '',
    job_title: 'CEO',
    location: 'US',
    keywords: '',
    limit: 5
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		console.log(response.data);
	} catch (error) {
		console.error(error);
	}
}

fetchData();