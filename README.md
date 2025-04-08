# LinkedIn Company Scraper

This application allows you to fetch and display employee information from LinkedIn company pages using the Proxycurl API.

## Features

- Input up to 10 LinkedIn company URLs with their regions
- Fetch up to 100 employees per company
- Display employee data in an organized, accordion-style interface
- View employee names, titles, companies, and links to their LinkedIn profiles

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone this repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd linkedin-scraper
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Usage

1. Start the development server:
   ```
   npm start
   ```

2. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

3. Enter the LinkedIn company URLs (e.g., https://www.linkedin.com/company/microsoft) and the region code (e.g., us, gb, fr)

4. Click "Fetch Employees" to retrieve and display the employee data

## API Key

The application uses the Proxycurl API to fetch LinkedIn data. The API key is already included in the `src/api-key.ts` file.

## Important Notes

- The Proxycurl API has rate limits. If you encounter errors, you might have exceeded these limits.
- For testing purposes, the application will display mock data if the API call fails.
- This application is for demonstration purposes only and should be used in accordance with LinkedIn's terms of service.

## Technologies Used

- React.js with TypeScript
- React Bootstrap for UI components
- Axios for API requests
- HTTP-Proxy-Middleware for handling CORS issues

## License

This project is licensed under the MIT License.
