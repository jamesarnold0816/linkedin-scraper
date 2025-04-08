import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, InputGroup } from 'react-bootstrap';

interface CompanyFormProps {
  onSubmit: (companies: { url: string; region: string[] }[]) => void;
}

// Common regions with their country codes
const REGIONS = [
  { code: 'us', name: 'United States' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'ca', name: 'Canada' },
  { code: 'au', name: 'Australia' },
  { code: 'fr', name: 'France' },
  { code: 'de', name: 'Germany' },
  { code: 'es', name: 'Spain' },
  { code: 'in', name: 'India' },
  { code: 'jp', name: 'Japan' },
  { code: 'br', name: 'Brazil' },
];

const CompanyForm: React.FC<CompanyFormProps> = ({ onSubmit }) => {
  const [companies, setCompanies] = useState<string[]>(Array(5).fill(''));
  const [selectedRegions, setSelectedRegions] = useState<Record<string, boolean>>({
    us: true, // Default to US selected
  });
  const [customRegion, setCustomRegion] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [inputMode, setInputMode] = useState<'name' | 'url'>('name');

  const handleCompanyChange = (index: number, value: string) => {
    const updatedCompanies = [...companies];
    updatedCompanies[index] = value;
    setCompanies(updatedCompanies);
  };

  const handleRegionChange = (code: string, checked: boolean) => {
    setSelectedRegions(prev => ({
      ...prev,
      [code]: checked
    }));
  };

  const handleCustomRegionChange = (value: string) => {
    setCustomRegion(value);
    // Also mark custom as selected if user types something
    if (value.trim()) {
      setSelectedRegions(prev => ({
        ...prev,
        custom: true
      }));
    }
  };

  const formatCompanyInput = (input: string): string => {
    if (inputMode === 'url') {
      // If already a URL, return it
      return input;
    }
    
    // Otherwise, transform company name to LinkedIn URL
    // Remove any special characters and spaces
    const sanitizedName = input.trim().toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
      
    if (sanitizedName) {
      return `https://www.linkedin.com/company/${sanitizedName}`;
    }
    
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate at least one company has input
    const validCompanies = companies.filter(input => input.trim() !== '');
    
    if (validCompanies.length === 0) {
      setError('Please enter at least one company');
      return;
    }

    // Get all selected regions
    const activeRegionCodes = Object.entries(selectedRegions)
      .filter(([_, isSelected]) => isSelected)
      .map(([code]) => code === 'custom' ? customRegion : code)
      .filter(Boolean); // Remove empty values
    
    if (activeRegionCodes.length === 0) {
      setError('Please select at least one region');
      return;
    }

    if (selectedRegions.custom && !customRegion.trim()) {
      setError('Please enter a custom region code or uncheck the custom option');
      return;
    }
    
    setError('');
    
    // Create a company entry for each selected region
    const companiesWithRegions: { url: string; region: string[] }[] = [];
    
    // Format company inputs to LinkedIn URLs if needed
    validCompanies.forEach(input => {
      const companyUrl = formatCompanyInput(input);
        companiesWithRegions.push({ url: companyUrl, region: activeRegionCodes });
    });
    
    onSubmit(companiesWithRegions);
  };

  return (
    <Container>
      <h2 className="my-4">Enter Company Information (Maximum 5 Companies)</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Row className="mb-4">
          <Col md={12}>
            <Form.Group>
              <Form.Label><strong>Select Regions for Companies (Multiple Selection)</strong></Form.Label>
              <Row>
                {REGIONS.map(region => (
                  <Col md={3} key={region.code}>
                    <Form.Check
                      type="checkbox"
                      id={`region-${region.code}`}
                      label={`${region.name} (${region.code})`}
                      checked={selectedRegions[region.code] || false}
                      onChange={(e) => handleRegionChange(region.code, e.target.checked)}
                      className="mb-2"
                    />
                  </Col>
                ))}
                <Col md={3}>
                  <Form.Check
                    type="checkbox"
                    id="region-custom"
                    label="Custom Region"
                    checked={selectedRegions.custom || false}
                    onChange={(e) => handleRegionChange('custom', e.target.checked)}
                    className="mb-2"
                  />
                </Col>
                {(selectedRegions.custom || customRegion) && (
                  <Col md={12} className="mt-2">
                    <Form.Control
                      type="text"
                      placeholder="Enter custom region code (e.g., sg, nl, it)"
                      value={customRegion}
                      onChange={(e) => handleCustomRegionChange(e.target.value)}
                    />
                    <Form.Text className="text-muted">
                      Enter a 2-letter ISO country code (e.g., sg for Singapore, nl for Netherlands)
                    </Form.Text>
                  </Col>
                )}
              </Row>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label><strong>Input Type</strong></Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  id="input-name"
                  label="Company Name"
                  checked={inputMode === 'name'}
                  onChange={() => setInputMode('name')}
                  className="me-3"
                />
                <Form.Check
                  inline
                  type="radio"
                  id="input-url"
                  label="LinkedIn URL"
                  checked={inputMode === 'url'}
                  onChange={() => setInputMode('url')}
                />
              </div>
              <Form.Text className="text-muted">
                {inputMode === 'name' 
                  ? "Enter company names and they'll be converted to LinkedIn URLs automatically" 
                  : "Enter full LinkedIn company URLs (e.g., https://www.linkedin.com/company/microsoft)"}
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <h4 className="mb-3">Company {inputMode === 'name' ? 'Names' : 'LinkedIn URLs'}</h4>
        {companies.map((input, index) => (
          <Row key={index} className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Company {index + 1}</Form.Label>
                <InputGroup>
                  {inputMode === 'name' && (
                    <InputGroup.Text>
                      linkedin.com/company/
                    </InputGroup.Text>
                  )}
                  <Form.Control
                    type="text"
                    placeholder={inputMode === 'name' ? "microsoft, apple, amazon, etc." : "https://www.linkedin.com/company/company-name"}
                    value={input}
                    onChange={(e) => handleCompanyChange(index, e.target.value)}
                  />
                </InputGroup>
                {inputMode === 'name' && input && (
                  <Form.Text className="text-muted">
                    Will be converted to: {formatCompanyInput(input)}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>
        ))}
        
        <Button variant="primary" type="submit" className="mt-3">
          Fetch Employees
        </Button>
      </Form>
    </Container>
  );
};

export default CompanyForm; 