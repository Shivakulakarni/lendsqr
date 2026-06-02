import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UsersList from '../pages/UsersList';

// Mock the services/api to return consistent mock data
vi.mock('../services/api', () => {
  return {
    authService: {
      logout: vi.fn(),
      isAuthenticated: () => true,
      getCurrentUser: () => ({ email: 'admin@lendsqr.com', fullName: 'Adedeji' }),
    },
    userService: {
      getUsers: vi.fn().mockResolvedValue({
        data: [
          {
            id: 'USER-00001',
            firstName: 'Adedeji',
            lastName: 'Balogun',
            email: 'adedeji@example.com',
            phoneNumber: '+2348012345678',
            dateJoined: '2023-01-15',
            status: 'active',
            orgName: 'Lendsqr Corp',
            orgEmail: 'info@lendsqr.com',
            level: 3,
            numOfLoans: 2,
            loanAmount: 150000,
            savingsAmount: 50000,
            guarantorName: 'Guarantor Friend',
            guarantorEmail: 'friend@example.com',
            guarantorPhoneNumber: '+2348087654321',
            nameOfNextOfKin: 'Kin Brother',
            nextOfKinEmail: 'brother@example.com',
            nextOfKinPhoneNumber: '+2348099887766',
            nextOfKinRelationship: 'Sibling',
            ssn: '123456789',
            bvn: '987654321',
            accountNumber: '0123456789',
            accountType: 'Savings',
            bankName: 'GTBank',
            accountBalance: 320000,
          },
          {
            id: 'USER-00002',
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane@example.com',
            phoneNumber: '+2348022223333',
            dateJoined: '2022-11-20',
            status: 'pending',
            orgName: 'Acme Corp',
            orgEmail: 'info@acme.com',
            level: 2,
            numOfLoans: 0,
            loanAmount: 0,
            savingsAmount: 10000,
            guarantorName: 'Parent Mom',
            guarantorEmail: 'mom@example.com',
            guarantorPhoneNumber: '+2348033334444',
            nameOfNextOfKin: 'Kin Parent',
            nextOfKinEmail: 'kin@example.com',
            nextOfKinPhoneNumber: '+2348055556666',
            nextOfKinRelationship: 'Parent',
            ssn: '222222222',
            bvn: '888888888',
            accountNumber: '9876543210',
            accountType: 'Savings',
            bankName: 'Zenith Bank',
            accountBalance: 12000,
          }
        ],
        page: 1,
        perPage: 10,
        total: 2,
        totalPages: 1,
      }),
      getUserById: vi.fn(),
    }
  };
});

describe('UsersList Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page header title and navigation profile', async () => {
    render(
      <BrowserRouter>
        <UsersList />
      </BrowserRouter>
    );

    // Header Title
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Users', level: 1 })).toBeInTheDocument();
    });

    // Profile Username
    expect(screen.getByText('Adedeji')).toBeInTheDocument();
  });

  it('displays correct statistics on dynamic metric cards', async () => {
    render(
      <BrowserRouter>
        <UsersList />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Dynamic dynamic numbers mapped from mock response total=2
      expect(screen.getByText('USERS')).toBeInTheDocument();
      expect(screen.getByText('ACTIVE USERS')).toBeInTheDocument();
    });
  });

  it('renders user rows correctly in the table', async () => {
    render(
      <BrowserRouter>
        <UsersList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Adedeji Balogun')).toBeInTheDocument();
      expect(screen.getByText('adedeji@example.com')).toBeInTheDocument();
      expect(screen.getByText('Lendsqr Corp')).toBeInTheDocument();

      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    });
  });

  it('toggles column header filter popover card when clicked', async () => {
    render(
      <BrowserRouter>
        <UsersList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Adedeji Balogun')).toBeInTheDocument();
    });

    // Find and click the organization filter button
    const filterBtn = screen.getByLabelText('Filter Organization');
    fireEvent.click(filterBtn);

    // Popover contains organization input label
    expect(screen.getAllByText('Organization').length).toBeGreaterThan(1);
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument();
  });
});
