import { searchCompanyEmployees } from './apolloService';

export interface EmployeeData {
    profileUrl: string;
    firstName: string;
    lastName: string;
    title: string;
    company: string;
}

export async function fetchEmployees(companyUrl: string, region: Array<string>): Promise<EmployeeData[]> {
    try {
        // Extract company name from LinkedIn URL
        const companyName = companyUrl.split('/').pop() || '';
        
        // Use Apollo API to search for employees
        return await searchCompanyEmployees(companyName, region);
    } catch (error) {
        console.error(`Error fetching employees for ${companyUrl}:`, error);
        throw error;
    }
} 