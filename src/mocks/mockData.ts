import { User } from '../types';

const firstNames = [
  'John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'James', 'Jessica',
  'Robert', 'Amanda', 'William', 'Michelle', 'Richard', 'Melissa', 'Joseph',
  'Rebecca', 'Thomas', 'Stephanie', 'Charles', 'Catherine', 'Christopher',
  'Carol', 'Daniel', 'Nancy', 'Matthew', 'Lisa', 'Anthony', 'Betty',
  'Donald', 'Margaret', 'Steven', 'Sandra', 'Paul', 'Ashley', 'Andrew',
  'Kimberly', 'Joshua', 'Donna', 'Kenneth', 'Carol', 'Kevin', 'Barbara',
  'Brian', 'Deborah', 'George', 'Debra', 'Edward', 'Heather', 'Ronald',
  'Diane', 'Timothy', 'Virginia', 'Jason', 'Julie', 'Jeffrey'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark',
  'Ramirez', 'Lewis', 'Robinson', 'Young', 'Stroh', 'King', 'Wright',
  'Morales', 'Gutierrez', 'Ortiz', 'Jimenez', 'Romero', 'Vargas',
  'Vazquez', 'Cervantes', 'Soto', 'Pacheco', 'Medina', 'Asencio'
];

const companies = [
  'Acme Corp', 'TechStart Inc', 'Finance Solutions', 'Digital Dreams',
  'Innovation Labs', 'Global Trading', 'Smart Finance', 'NextGen Systems',
  'Prime Services', 'Apex Consulting', 'Quantum Tech', 'Stellar Finance',
  'Dynamic Solutions', 'Future Ventures', 'Capital Growth', 'Elite Trading'
];

const statuses: Array<'active' | 'inactive' | 'pending' | 'blacklisted'> = [
  'active', 'inactive', 'pending', 'blacklisted'
];

function generateEmail(firstName: string, lastName: string, index: number): string {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@lendsqr.com`;
}

function generatePhoneNumber(): string {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const exchCode = Math.floor(Math.random() * 900) + 100;
  const lineNum = Math.floor(Math.random() * 9000) + 1000;
  return `+1${areaCode}${exchCode}${lineNum}`;
}

function generateRandomDate(): string {
  const start = new Date(2020, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString()
    .split('T')[0];
}

export function generateMockUsers(count: number = 500): User[] {
  const users: User[] = [];

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];

    users.push({
      id: `USER-${String(i).padStart(5, '0')}`,
      firstName,
      lastName,
      email: generateEmail(firstName, lastName, i),
      phoneNumber: generatePhoneNumber(),
      dateJoined: generateRandomDate(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      orgName: company,
      orgEmail: `info@${company.toLowerCase().replace(/\s+/g, '')}.com`,
      level: Math.floor(Math.random() * 8) + 1,
      numOfLoans: Math.floor(Math.random() * 15),
      loanAmount: Math.floor(Math.random() * 1000000),
      savingsAmount: Math.floor(Math.random() * 500000),
      guarantorName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      guarantorEmail: `guarantor${i}@example.com`,
      guarantorPhoneNumber: generatePhoneNumber(),
      nameOfNextOfKin: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      nextOfKinEmail: `nextofkin${i}@example.com`,
      nextOfKinPhoneNumber: generatePhoneNumber(),
      nextOfKinRelationship: ['Spouse', 'Parent', 'Sibling', 'Child'][Math.floor(Math.random() * 4)],
      ssn: `${Math.floor(Math.random() * 900000000) + 100000000}`,
      bvn: `${Math.floor(Math.random() * 9000000000000000) + 1000000000000000}`,
      accountNumber: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      accountType: Math.random() > 0.5 ? 'Savings' : 'Checking',
      bankName: ['First Bank', 'Zenith Bank', 'GTBank', 'Access Bank', 'UBA'][Math.floor(Math.random() * 5)],
      accountBalance: Math.floor(Math.random() * 5000000),
    });
  }

  return users;
}
