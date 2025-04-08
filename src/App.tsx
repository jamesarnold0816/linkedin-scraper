import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Alert, Spinner } from 'react-bootstrap';
import CompanyForm from './components/CompanyForm';
import EmployeeList from './components/EmployeeList';
import { fetchEmployees, EmployeeData } from './services/linkedinService';

interface CompanyEmployeeData {
  companyUrl: string;
  region: string[];
  employees: EmployeeData[];
  loading?: boolean;
  error?: string;
}

function App() {
  const [companyData, setCompanyData] = useState<CompanyEmployeeData[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFormSubmit = async (companies: { url: string; region: string[]}[]) => {
    setError('');
    setIsLoading(true);

    // Initialize company data with loading states
    const initialCompanyData = companies.map(company => ({
      companyUrl: company.url,
      region: company.region,
      employees: [],
      loading: true
    }));

    setCompanyData(initialCompanyData);

    try {
      // Fetch employee data for each company and region pair
      const fetchPromises = companies.map(async (company, index) => {
        try {
          const employees = await fetchEmployees(company.url, company.region);
          return {
            companyUrl: company.url,
            region: company.region,
            employees,
            loading: false
          };
        } catch (err) {
          console.error(`Error fetching data for company ${company.url} in region ${company.region}:`, err);
          return {
            companyUrl: company.url,
            region: company.region,
            employees: [],
            loading: false,
            error: `Failed to fetch employees: ${err instanceof Error ? err.message : 'Unknown error'}`
          };
        }
      });

      const updatedCompanyData = await Promise.all(fetchPromises);
      setCompanyData(updatedCompanyData);
    } catch (err) {
      setError(`Error processing company data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">LinkedIn Company Scraper</Navbar.Brand>
          {isLoading && (
            <Spinner animation="border" variant="light" size="sm" className="ms-2" />
          )}
        </Container>
      </Navbar>

      <Container className="mt-3">
        {error && <Alert variant="danger">{error}</Alert>}
        
        <CompanyForm onSubmit={handleFormSubmit} />
        
        {companyData.length > 0 && (
          <EmployeeList companyData={companyData} />
        )}
      </Container>
    </div>
  );
}

export default App;
