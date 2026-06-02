import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock useParams and useNavigate (hoisted above other imports)
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ userId: 'USER-00001' }),
    useNavigate: () => vi.fn()
  };
});

// Mock services/api
vi.mock('../services/api', () => {
  return {
    authService: {
      logout: vi.fn(),
      isAuthenticated: () => true,
      getCurrentUser: () => ({ email: 'admin@lendsqr.com', fullName: 'Super Admin' }),
    },
    userService: {
      getUserById: vi.fn().mockResolvedValue({
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
        bvn: '98765432101',
        accountNumber: '0123456789',
        accountType: 'Savings',
        bankName: 'GTBank',
        accountBalance: 320000,
      })
    }
  };
});

// Mock services/storage
vi.mock('../services/storage', () => {
  return {
    storageService: {
      init: vi.fn().mockResolvedValue(true),
      saveUser: vi.fn().mockResolvedValue(true),
      getUser: vi.fn().mockResolvedValue(null)
    }
  };
});

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserDetails from '../pages/UserDetails';

describe('UserDetails Page and STATEFUL INTERACTIVE TABS', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user details header card and primary stats', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <UserDetails />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getAllByText('Adedeji Balogun').length).toBeGreaterThan(0);
      expect(screen.getByText('USER-00001')).toBeInTheDocument();
      
      // Resilient text content assertion on the parent element
      const bankElement = screen.getByText(/0123456789/);
      expect(bankElement).toBeInTheDocument();
      const parent = bankElement.parentElement;
      expect(parent?.textContent).toContain((320000).toLocaleString());
      expect(parent?.textContent).toContain('0123456789');
    }, { timeout: 3000 });
  });

  it('navigates between dynamic tabs and renders their unique state structures', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <UserDetails />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getAllByText('Adedeji Balogun').length).toBeGreaterThan(0);
    }, { timeout: 3000 });

    // 1. Documents Tab Click
    const docsTab = screen.getByRole('button', { name: /Documents Details/i });
    fireEvent.click(docsTab);
    expect(screen.getByText('Compliance Verification Files')).toBeInTheDocument();
    expect(screen.getByText('government_identification_card.pdf')).toBeInTheDocument();

    // 2. Bank Details Tab Click
    const bankTab = screen.getByRole('button', { name: /Bank Details/i });
    fireEvent.click(bankTab);
    expect(screen.getByText('Financial Accounts & Bank Connections')).toBeInTheDocument();
    expect(screen.getAllByText('Providus Bank Connect').length).toBeGreaterThan(0);

    // 3. Loans Tab Click
    const loansTab = screen.getByRole('button', { name: /Loans Details/i });
    fireEvent.click(loansTab);
    expect(screen.getByText('Composite Outstanding Debt')).toBeInTheDocument();
    expect(screen.getByText('Active Credit Contracts and History')).toBeInTheDocument();

    // 4. Savings Tab Click
    const savingsTab = screen.getByRole('button', { name: /Savings Details/i });
    fireEvent.click(savingsTab);
    expect(screen.getByText('Target Savings & High-Yield Projection Planner')).toBeInTheDocument();
    expect(screen.getByText('Target Annual Vacation Goal')).toBeInTheDocument();

    // 5. App and System Tab Click
    const systemTab = screen.getByRole('button', { name: /System Details/i });
    fireEvent.click(systemTab);
    expect(screen.getByText('System Parameters & Credit Commentary')).toBeInTheDocument();
    expect(screen.getByText('Force Multi-Factor Authentication')).toBeInTheDocument();
  });

  it('Documents Tab: allows approving staged files', async () => {
    render(
      <BrowserRouter>
        <UserDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Adedeji Balogun').length).toBeGreaterThan(0);
    });

    const docsTab = screen.getByRole('button', { name: /Documents Details/i });
    fireEvent.click(docsTab);

    // Let's find utilityelectric bill which is staged as "Pending Review" and click Approve
    const electricBillRow = screen.getByText('utility_electric_bill_june.png').closest('tr');
    expect(electricBillRow).toBeInTheDocument();

    // Index 0 Approve is disabled (government ID is already Verified), so we click Index 1 (Utility bill)
    const approveBtn = screen.getAllByRole('button', { name: 'Approve' })[1];
    fireEvent.click(approveBtn);

    // Staged status should update and toast feedback flashes
    await waitFor(() => {
      expect(screen.getByText('Document compliance status updated: Verified')).toBeInTheDocument();
    });
  });

  it('Bank Tab: runs BVN KYC check queries', async () => {
    render(
      <BrowserRouter>
        <UserDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Adedeji Balogun').length).toBeGreaterThan(0);
    });

    const bankTab = screen.getByRole('button', { name: /Bank Details/i });
    fireEvent.click(bankTab);

    // Prefilled BVN lookup triggers registry results
    const lookupBtn = screen.getByRole('button', { name: 'Run KYC Lookup' });
    fireEvent.click(lookupBtn);

    // Result should load matches
    await waitFor(() => {
      expect(screen.getByText('REGISTRY FULL NAME')).toBeInTheDocument();
      expect(screen.getByText('Active & Verified')).toBeInTheDocument();
      expect(screen.getByText('BVN identity matches perfectly!')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('Loans Tab: opens modal and records manual repayments', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <UserDetails />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getAllByText('Adedeji Balogun').length).toBeGreaterThan(0);
    }, { timeout: 3000 });

    const loansTab = screen.getByRole('button', { name: /Loans Details/i });
    fireEvent.click(loansTab);

    // Open repay modal
    const repayTriggerBtn = screen.getByRole('button', { name: 'Repay Outstanding Loan Balance' });
    fireEvent.click(repayTriggerBtn);

    expect(screen.getByText('Process Administrative Repayment')).toBeInTheDocument();

    // Input repayment amount
    const repayInput = screen.getByPlaceholderText('Enter repayment amount (e.g. 50000)');
    fireEvent.change(repayInput, { target: { value: '50000' } });

    // Submit repayment
    const submitBtn = screen.getByRole('button', { name: 'Record Repayment' });
    fireEvent.click(submitBtn);

    // State balance deducts amount (original debt 150000 - 50000 = 100000)
    await waitFor(() => {
      expect(screen.getByText(/Successfully processed loan repayment/)).toBeInTheDocument();
      
      // Resilient text content assertion on parent element
      const debtLabel = screen.getByText(/Composite Outstanding Debt/);
      expect(debtLabel).toBeInTheDocument();
      const parent = debtLabel.parentElement;
      expect(parent?.textContent).toContain((100000).toLocaleString());
    });
  });

  it('Savings Tab: creates new savings target goals', async () => {
    render(
      <BrowserRouter>
        <UserDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Adedeji Balogun').length).toBeGreaterThan(0);
    });

    const savingsTab = screen.getByRole('button', { name: /Savings Details/i });
    fireEvent.click(savingsTab);

    // Enter goal title, target, and monthly
    const titleInput = screen.getByPlaceholderText('Plan Goal Title (e.g. Annual Travel Fund)');
    const targetInput = screen.getByPlaceholderText('Total Target Amount Needed (₦)');
    const monthlyInput = screen.getByPlaceholderText('Configured Monthly Auto-Deposit (₦)');

    fireEvent.change(titleInput, { target: { value: 'Corporate Pension Target' } });
    fireEvent.change(targetInput, { target: { value: '900000' } });
    fireEvent.change(monthlyInput, { target: { value: '60000' } });

    const submitBtn = screen.getByRole('button', { name: 'Publish Savings Target' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('New target savings plan constructed!')).toBeInTheDocument();
      expect(screen.getByText('Corporate Pension Target')).toBeInTheDocument();
    });
  });

  it('System Tab: writes admin memos and saves internal reviews', async () => {
    render(
      <BrowserRouter>
        <UserDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Adedeji Balogun').length).toBeGreaterThan(0);
    });

    const systemTab = screen.getByRole('button', { name: /System Details/i });
    fireEvent.click(systemTab);

    // Edit private memo
    const memoTextarea = screen.getByPlaceholderText('Type internal memo annotations...');
    fireEvent.change(memoTextarea, { target: { value: 'Premium account reviewed. Repayment patterns stable.' } });

    const saveBtn = screen.getByRole('button', { name: 'Save Internal Memo' });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByText('Internal admin comments saved to database cache.')).toBeInTheDocument();
    });
  });
});
