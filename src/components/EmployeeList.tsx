import React, { useMemo } from 'react';
import { Table, Container, Accordion, Badge, Card, Row, Col } from 'react-bootstrap';
import { EmployeeData } from '../services/linkedinService';

interface EmployeeListProps {
  companyData: {
    companyUrl: string;
    region: string[];
    employees: EmployeeData[];
    loading?: boolean;
    error?: string;
  }[];
}

// Map of region codes to region names
const REGION_NAMES: Record<string, string> = {
  'us': 'United States',
  'gb': 'United Kingdom',
  'ca': 'Canada',
  'au': 'Australia',
  'fr': 'France',
  'de': 'Germany',
  'es': 'Spain',
  'in': 'India',
  'jp': 'Japan',
  'br': 'Brazil',
};

// Function to extract company name from LinkedIn URL
const extractCompanyName = (url: string): string => {
  // Extract company name from URL
  const companySlug = url.replace('https://www.linkedin.com/company/', '').replace(/\/$/, '');
  
  // Convert slug to readable name (capitalize each word, replace hyphens with spaces)
  return companySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const EmployeeList: React.FC<EmployeeListProps> = ({ companyData }) => {
  // Check if we have any companies with employees
  const hasEmployees = companyData.some(company => company.employees && company.employees.length > 0);
  
  // Group data by company URL and then by region
  const groupedData = useMemo(() => {
    const grouped: Record<string, Record<string, typeof companyData[0]>> = {};
    
    companyData.forEach(company => {
      if (!grouped[company.companyUrl]) {
        grouped[company.companyUrl] = {};
      }
      company.region.forEach(region => {
        if (!grouped[company.companyUrl][region]) {
          grouped[company.companyUrl][region] = company;
        }
      });
    });
    
    return grouped;
  }, [companyData]);
  
  // Get unique regions from the data
  const uniqueRegions = useMemo(() => {
    const regions = new Set<string>();
    companyData.forEach(company => company.region.forEach(region => regions.add(region)));
    return Array.from(regions);
  }, [companyData]);

  // Calculate total employees across all companies and regions
  const totalEmployees = useMemo(() => {
    return companyData.reduce((total, company) => total + company.employees.length, 0);
  }, [companyData]);

  if (!hasEmployees && !companyData.some(company => company.loading)) {
    return <p className="text-center mt-5">No employee data available. Please fetch data for at least one company.</p>;
  }

  return (
    <Container className="mt-5">
      <Card className="mb-4 bg-light">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">Company Employees</h2>
            <Badge bg="dark" className="p-2">
              Total: {totalEmployees} employees
            </Badge>
          </div>
          <div className="d-flex flex-wrap">
            <strong className="me-2">Selected Regions:</strong>
            {uniqueRegions.map(region => (
              <Badge bg="primary" key={region} className="me-2 mb-1 p-2">
                {REGION_NAMES[region] || region} ({region})
              </Badge>
            ))}
          </div>
        </Card.Body>
      </Card>
      
      <Row>
        {Object.entries(groupedData).map(([companyUrl, regionData], companyIndex) => (
          <Col md={12} key={companyUrl} className="mb-4">
            <Card>
              <Card.Header className="bg-info text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">{extractCompanyName(companyUrl)}</h4>
                  <small className="text-white-50">{companyUrl}</small>
                </div>
              </Card.Header>
              <Card.Body>
                <Accordion defaultActiveKey="0">
                  {Object.entries(regionData).map(([region, company], regionIndex) => (
                    <Accordion.Item eventKey={regionIndex.toString()} key={region}>
                      <Accordion.Header>
                        <div className="d-flex w-100 justify-content-between align-items-center">
                          <div>
                            {REGION_NAMES[region] || region} ({region})
                          </div>
                          <Badge bg="info">{company.employees.length} employees</Badge>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        {company.loading ? (
                          <p>Loading...</p>
                        ) : company.error ? (
                          <p className="text-danger">{company.error}</p>
                        ) : company.employees.length > 0 ? (
                          <Table striped bordered hover responsive>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Title</th>
                                <th>Company</th>
                                <th>Profile</th>
                              </tr>
                            </thead>
                            <tbody>
                              {company.employees.map((employee, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{`${employee.firstName} ${employee.lastName}`}</td>
                                  <td>{employee.title}</td>
                                  <td>{employee.company || extractCompanyName(companyUrl)}</td>
                                  <td>
                                    <a 
                                      href={employee.profileUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                    >
                                      View Profile
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        ) : (
                          <p>No employees found.</p>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default EmployeeList; 