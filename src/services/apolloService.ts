import axios from 'axios';
import { EmployeeData } from './linkedinService';

const APOLLO_API_KEY = process.env.REACT_APP_APOLLO_API_KEY || '';
const DELAY_BETWEEN_REQUESTS = 2000; // 2 seconds delay between requests

interface ApolloCompanySearchRequest {
    organization_locations?: string[];
    q_organization_name: string;
}

interface ApolloEmployeeSearchRequest {
    organization_ids: string[];
    person_seniorities: string[];
    organization_locations?: string[];
    page: number;
    per_page: number;
}

interface ApolloCompany {
    id: string;
    name: string;
    domain: string;
}

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function searchCompany(companyName: string, regions: string[]): Promise<ApolloCompany | null> {
    const endpoint = 'https://api.apollo.io/api/v1/mixed_companies/search';
    
    const headers = {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'x-api-key': APOLLO_API_KEY
    };

    const queryParams = new URLSearchParams();
    queryParams.append('q_organization_name', companyName);
    
    // Add each region as a separate organization_locations[] parameter
    regions.forEach(region => {
        queryParams.append('organization_locations[]', region);
    });

    try {
        console.log(`Searching for company: ${companyName}`);
        const startTime = Date.now();
        
        const url = `${endpoint}?${queryParams.toString()}`;
        const response = await axios.post(url, {}, { headers });
        
        const endTime = Date.now();
        console.log(`Company search completed in ${(endTime - startTime) / 1000} seconds`);

        if (response.data && response.data.organizations && response.data.organizations.length > 0) {
            const company = response.data.organizations[0];
            return {
                id: company.id,
                name: company.name,
                domain: company.domain
            };
        }
        return null;
    } catch (error) {
        console.error(`Error searching for company ${companyName}:`, error);
        throw error;
    }
}

export async function searchCompanyEmployees(companyName: string, region: Array<string>): Promise<EmployeeData[]> {
    try {
        const startTotalTime = Date.now();
        console.log(`Starting search for ${companyName} employees...`);

        // Step 1: Search for company to get ID
        const regions = region ? [...region] : ['us', 'india'];
        const company = await searchCompany(companyName, regions);
        
        if (!company) {
            throw new Error(`Company ${companyName} not found`);
        }

        // Add delay between API calls
        console.log('Waiting for rate limit...');
        await delay(DELAY_BETWEEN_REQUESTS);

        // Step 2: Search for employees using company ID
        const endpoint = 'https://api.apollo.io/api/v1/mixed_people/search';
        
        const headers = {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'x-api-key': APOLLO_API_KEY
        };

        const queryParams = new URLSearchParams();
        queryParams.append('page', '1');
        queryParams.append('per_page', '200');

        // Add organization ID
        queryParams.append('organization_ids[]', company.id);

        // Add seniority levels
        ['director', 'vp', 'CXO', 'SVP'].forEach(seniority => {
            queryParams.append('person_seniorities[]', seniority);
        });

        // Add regions
        regions.forEach(region => {
            queryParams.append('organization_locations[]', region);
        });

        console.log('Searching for employees...');
        const startEmployeeSearch = Date.now();

        const url = `${endpoint}?${queryParams.toString()}`;
        const response = await axios.post(url, {}, { headers });
        
        const endEmployeeSearch = Date.now();
        console.log(`Employee search completed in ${(endEmployeeSearch - startEmployeeSearch) / 1000} seconds`);

        if (response.data && Array.isArray(response.data.people)) {
            const employees = response.data.people.map((person: any) => ({
                profileUrl: person.linkedin_url || '',
                firstName: person.first_name || '',
                lastName: person.last_name || '',
                title: person.title || '',
                company: person.organization_name || companyName,
            }));

            const endTotalTime = Date.now();
            console.log(`Total search completed in ${(endTotalTime - startTotalTime) / 1000} seconds`);
            console.log(`Found ${employees.length} employees`);

            return employees;
        }
        
        throw new Error('Invalid response format from Apollo API');
    } catch (error) {
        console.error(`Error fetching employees for ${companyName}:`, error);
        throw error;
    }
} 