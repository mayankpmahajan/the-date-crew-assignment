export interface Customer {
  id: string
  firstName: string
  lastName: string
  gender: 'Male' | 'Female' | 'Other'
  dateOfBirth: string
  age: number
  country: string
  city: string
  height: string
  email: string
  phoneNumber: string
  undergraduateCollege: string
  degree: string
  income: number
  currentCompany: string
  designation: string
  maritalStatus: 'Single' | 'Divorced' | 'Widowed'
  languagesKnown: string[]
  siblings: number
  caste: string
  religion: string
  wantKids: 'Yes' | 'No' | 'Maybe'
  openToRelocate: 'Yes' | 'No' | 'Maybe'
  openToPets: 'Yes' | 'No' | 'Maybe'
  statusTag: 'Active' | 'Matched' | 'Pending' | 'Inactive'
  createdAt: string
  profileImage?: string
}

export interface CustomerTableData {
  id: string
  name: string
  age: number
  city: string
  maritalStatus: string
  statusTag: 'Active' | 'Matched' | 'Pending' | 'Inactive'
  email: string
}

// Mock data for demonstration
export const mockCustomers: Customer[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Johnson',
    gender: 'Female',
    dateOfBirth: '1992-03-15',
    age: 32,
    country: 'USA',
    city: 'New York',
    height: '5\'6"',
    email: 'alice.johnson@email.com',
    phoneNumber: '+1-555-0101',
    undergraduateCollege: 'Harvard University',
    degree: 'Computer Science',
    income: 120000,
    currentCompany: 'Tech Corp',
    designation: 'Senior Developer',
    maritalStatus: 'Single',
    languagesKnown: ['English', 'Spanish'],
    siblings: 1,
    caste: 'General',
    religion: 'Christian',
    wantKids: 'Yes',
    openToRelocate: 'Maybe',
    openToPets: 'Yes',
    statusTag: 'Active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Smith',
    gender: 'Male',
    dateOfBirth: '1988-07-22',
    age: 36,
    country: 'Canada',
    city: 'Toronto',
    height: '6\'0"',
    email: 'bob.smith@email.com',
    phoneNumber: '+1-416-555-0102',
    undergraduateCollege: 'University of Toronto',
    degree: 'Business Administration',
    income: 95000,
    currentCompany: 'Finance Inc',
    designation: 'Financial Analyst',
    maritalStatus: 'Divorced',
    languagesKnown: ['English', 'French'],
    siblings: 2,
    caste: 'General',
    religion: 'Catholic',
    wantKids: 'Maybe',
    openToRelocate: 'No',
    openToPets: 'Yes',
    statusTag: 'Matched',
    createdAt: '2024-02-01',
  },
  {
    id: '3',
    firstName: 'Emma',
    lastName: 'Davis',
    gender: 'Female',
    dateOfBirth: '1995-11-08',
    age: 29,
    country: 'UK',
    city: 'London',
    height: '5\'4"',
    email: 'emma.davis@email.com',
    phoneNumber: '+44-20-7946-0958',
    undergraduateCollege: 'Oxford University',
    degree: 'Medicine',
    income: 85000,
    currentCompany: 'NHS Hospital',
    designation: 'Doctor',
    maritalStatus: 'Single',
    languagesKnown: ['English', 'German'],
    siblings: 0,
    caste: 'General',
    religion: 'Anglican',
    wantKids: 'Yes',
    openToRelocate: 'Yes',
    openToPets: 'Maybe',
    statusTag: 'Active',
    createdAt: '2024-01-20',
  },
  {
    id: '4',
    firstName: 'Michael',
    lastName: 'Wilson',
    gender: 'Male',
    dateOfBirth: '1990-05-12',
    age: 34,
    country: 'Australia',
    city: 'Sydney',
    height: '5\'10"',
    email: 'michael.wilson@email.com',
    phoneNumber: '+61-2-9876-5432',
    undergraduateCollege: 'University of Sydney',
    degree: 'Engineering',
    income: 110000,
    currentCompany: 'Engineering Solutions',
    designation: 'Project Manager',
    maritalStatus: 'Single',
    languagesKnown: ['English'],
    siblings: 3,
    caste: 'General',
    religion: 'Protestant',
    wantKids: 'Yes',
    openToRelocate: 'Maybe',
    openToPets: 'No',
    statusTag: 'Pending',
    createdAt: '2024-02-10',
  },
  {
    id: '5',
    firstName: 'Sarah',
    lastName: 'Brown',
    gender: 'Female',
    dateOfBirth: '1993-09-25',
    age: 31,
    country: 'USA',
    city: 'Los Angeles',
    height: '5\'7"',
    email: 'sarah.brown@email.com',
    phoneNumber: '+1-310-555-0105',
    undergraduateCollege: 'UCLA',
    degree: 'Marketing',
    income: 75000,
    currentCompany: 'Creative Agency',
    designation: 'Marketing Manager',
    maritalStatus: 'Single',
    languagesKnown: ['English', 'Italian'],
    siblings: 1,
    caste: 'General',
    religion: 'Jewish',
    wantKids: 'Maybe',
    openToRelocate: 'Yes',
    openToPets: 'Yes',
    statusTag: 'Active',
    createdAt: '2024-01-30',
  },
  {
    id: '6',
    firstName: 'David',
    lastName: 'Taylor',
    gender: 'Male',
    dateOfBirth: '1987-12-03',
    age: 37,
    country: 'USA',
    city: 'Chicago',
    height: '6\'2"',
    email: 'david.taylor@email.com',
    phoneNumber: '+1-312-555-0106',
    undergraduateCollege: 'Northwestern University',
    degree: 'Law',
    income: 150000,
    currentCompany: 'Taylor & Associates',
    designation: 'Partner',
    maritalStatus: 'Divorced',
    languagesKnown: ['English'],
    siblings: 0,
    caste: 'General',
    religion: 'Methodist',
    wantKids: 'No',
    openToRelocate: 'No',
    openToPets: 'Maybe',
    statusTag: 'Inactive',
    createdAt: '2024-01-05',
  },
]
