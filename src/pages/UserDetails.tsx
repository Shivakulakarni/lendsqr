import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService, authService } from '../services/api';
import { storageService } from '../services/storage';
import { User } from '../types';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import styles from './UserDetails.module.scss';

// Types for profile stateful elements
interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: 'Verified' | 'Pending Review' | 'Rejected';
}

interface SavingsPlanItem {
  id: string;
  title: string;
  target: number;
  current: number;
  monthlyDeposit: number;
}

export const UserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  // Core user states
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFromCache, setIsFromCache] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Stateful feedback
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'info'>('success');
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Documents Tab State
  const [documents, setDocuments] = useState<DocumentItem[]>([
    { id: '1', name: 'government_identification_card.pdf', type: 'PDF Document', size: '2.4 MB', uploadedAt: '2026-05-10', status: 'Verified' },
    { id: '2', name: 'utility_electric_bill_june.png', type: 'PNG Image', size: '1.1 MB', uploadedAt: '2026-05-18', status: 'Pending Review' },
    { id: '3', name: 'formal_employment_contract.pdf', type: 'PDF Document', size: '4.8 MB', uploadedAt: '2026-05-20', status: 'Pending Review' }
  ]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Bank Details Tab State
  const [bvnPrefill, setBvnPrefill] = useState('');
  const [bvnVerifying, setBvnVerifying] = useState(false);
  const [bvnLookupResult, setBvnLookupResult] = useState<{
    status: 'success' | 'failed' | 'idle';
    fullName: string;
    dob: string;
    phoneMatch: string;
    bvnStatus: string;
  }>({ status: 'idle', fullName: '', dob: '', phoneMatch: '', bvnStatus: '' });

  const [ledgerTransactions, setLedgerTransactions] = useState([
    { id: 'TX-901', bank: 'Providus Bank Connect', amount: 150000, date: '2026-05-02', status: 'Pending Reconcile' },
    { id: 'TX-902', bank: 'Guaranty Trust Bank Link', amount: 45000, date: '2026-05-15', status: 'Reconciled' },
    { id: 'TX-903', bank: 'Providus Bank Connect', amount: 20000, date: '2026-05-25', status: 'Reconciled' }
  ]);

  // Loans Tab State
  const [repayAmount, setRepayAmount] = useState('');
  const [repayError, setRepayError] = useState('');
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);
  const [loanHistory, setLoanHistory] = useState([
    { id: 'LN-77', principal: 100000, interestRate: '15%', tenure: '6 Months', status: 'Active' },
    { id: 'LN-51', principal: 50000, interestRate: '12%', tenure: '3 Months', status: 'Paid Off' }
  ]);
  const [repaymentLedger, setRepaymentLedger] = useState([
    { paymentId: 'PM-881', amount: 35000, date: '2026-05-01', method: 'Direct Bank Settlement' },
    { paymentId: 'PM-882', amount: 20000, date: '2026-05-15', method: 'Debit Card Settlement' }
  ]);

  // Savings Tab State
  const [savingsPlans, setSavingsPlans] = useState<SavingsPlanItem[]>([
    { id: 'SP-1', title: 'Target Annual Vacation Goal', target: 500000, current: 120000, monthlyDeposit: 30000 },
    { id: 'SP-2', title: 'Emergency Reserves Cushion', target: 200000, current: 85000, monthlyDeposit: 15000 }
  ]);
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanTarget, setNewPlanTarget] = useState('');
  const [newPlanMonthly, setNewPlanMonthly] = useState('');
  const [projectionPrincipal, setProjectionPrincipal] = useState(50000);
  const [projectionRate, setProjectionRate] = useState(8);
  const [projectionYears, setProjectionYears] = useState(5);

  // App & System Tab State
  const [adminMemo, setAdminMemo] = useState('');
  const [sysConfig, setSysConfig] = useState({
    forceMfa: true,
    allowWebhooks: false,
    developerMode: false,
    smsAlerts: true
  });

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError('');

      try {
        if (!userId) {
          setError('User ID not provided');
          setLoading(false);
          return;
        }

        try {
          const userData = await userService.getUserById(userId);
          setUser(userData);
          setBvnPrefill(userData.bvn || '');
          // If the user has a stored memo in their object, load it
          setAdminMemo(userData.adminNotes || 'Client shows consistent creditworthiness. Approved for standard tiered credit line products. Audit logs check out stable.');
          setIsFromCache(false);
          await storageService.saveUser(userData);
        } catch (apiError) {
          const cachedUser = await storageService.getUser(userId);
          if (cachedUser) {
            setUser(cachedUser);
            setBvnPrefill(cachedUser.bvn || '');
            setAdminMemo(cachedUser.adminNotes || 'Client shows consistent creditworthiness. Approved for standard tiered credit line products. Audit logs check out stable.');
            setIsFromCache(true);
          } else {
            setError('User not found and no cached data available');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    storageService.init().then(() => {
      fetchUser();
    });
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [userId]);

  const triggerToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage('');
      toastTimerRef.current = null;
    }, 4000);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleStatusUpdate = async (newStatus: 'active' | 'blacklisted') => {
    if (!user) return;
    try {
      const updatedUser = { ...user, status: newStatus };
      await storageService.saveUser(updatedUser);
      setUser(updatedUser);
      triggerToast(`Customer account status set to ${newStatus.toUpperCase()}`);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return styles.badgeActive;
      case 'inactive':
        return styles.badgeInactive;
      case 'pending':
        return styles.badgePending;
      case 'blacklisted':
        return styles.badgeBlacklisted;
      default:
        return '';
    }
  };

  // Uploader operations
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      simulateFileUpload(e.dataTransfer.files[0].name, `${(e.dataTransfer.files[0].size / (1024 * 1024)).toFixed(1)} MB`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateFileUpload(e.target.files[0].name, `${(e.target.files[0].size / (1024 * 1024)).toFixed(1)} MB`);
    }
  };

  const simulateFileUpload = (filename: string, filesize: string) => {
    if (isUploading) return;
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newDoc: DocumentItem = {
              id: Math.random().toString(36).substring(7),
              name: filename,
              type: (filename.split('.').pop()?.toUpperCase() || 'BINARY') + ' File',
              size: filesize,
              uploadedAt: new Date().toISOString().split('T')[0],
              status: 'Pending Review'
            };
            setDocuments(prevDocs => [newDoc, ...prevDocs]);
            setIsUploading(false);
            triggerToast('Compliance document uploaded successfully!');
          }, 50);
          return 100;
        }
        return prev + 20;
      });
    }, 10);
  };

  const toggleDocStatus = (id: string, action: 'Verified' | 'Rejected') => {
    setDocuments(prev => 
      prev.map(d => d.id === id ? { ...d, status: action } : d)
    );
    triggerToast(`Document compliance status updated: ${action}`);
  };

  // BVN Verification Lookup
  const handleBvnVerifyCheck = () => {
    if (!bvnPrefill) {
      triggerToast('Please provide a valid BVN', 'info');
      return;
    }
    setBvnVerifying(true);
    setBvnLookupResult({ status: 'idle', fullName: '', dob: '', phoneMatch: '', bvnStatus: '' });

    setTimeout(() => {
      setBvnVerifying(false);
      if (bvnPrefill.length === 11) {
        setBvnLookupResult({
          status: 'success',
          fullName: user ? `${user.firstName} ${user.lastName}` : 'Adedeji Lendsqr Client',
          dob: '1995-10-15',
          phoneMatch: '100% Match with Carrier Database',
          bvnStatus: 'Active & Verified'
        });
        triggerToast('BVN identity matches perfectly!');
      } else {
        setBvnLookupResult({
          status: 'failed',
          fullName: 'Not Found',
          dob: '-',
          phoneMatch: '0% Match',
          bvnStatus: 'Invalid BVN Length'
        });
        triggerToast('BVN Verification failed. Invalid records.', 'info');
      }
    }, 150);
  };

  const reconcileTransaction = (id: string) => {
    setLedgerTransactions(prev =>
      prev.map(tx => tx.id === id ? { ...tx, status: 'Reconciled' } : tx)
    );
    triggerToast(`Transaction ${id} marked as Reconciled`);
  };

  // Repay Loan processing
  const handleRepaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRepayError('');

    if (!user) return;

    const amountNum = parseFloat(repayAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setRepayError('Provide a positive numeric repayment amount');
      return;
    }

    if (amountNum > user.loanAmount) {
      setRepayError(`Repayment exceeds total outstanding loan amount (₦${user.loanAmount.toLocaleString()})`);
      return;
    }

    if (amountNum > user.accountBalance) {
      setRepayError(`Repayment exceeds client's wallet bank balance (₦${user.accountBalance.toLocaleString()})`);
      return;
    }

    try {
      const updatedUser = {
        ...user,
        loanAmount: user.loanAmount - amountNum,
        accountBalance: user.accountBalance - amountNum
      };

      await storageService.saveUser(updatedUser);
      setUser(updatedUser);
      
      // Update local repayment lists
      const newPayment = {
        paymentId: 'PM-' + Math.floor(100 + Math.random() * 900),
        amount: amountNum,
        date: new Date().toISOString().split('T')[0],
        method: 'Admin Manual Settlement Office'
      };
      
      setRepaymentLedger(prev => [newPayment, ...prev]);
      
      // If loan is fully paid off, update active loans history
      if (updatedUser.loanAmount === 0) {
        setLoanHistory(prev =>
          prev.map(ln => ln.id === 'LN-77' ? { ...ln, status: 'Paid Off' } : ln)
        );
      }

      setIsRepayModalOpen(false);
      setRepayAmount('');
      triggerToast(`Successfully processed loan repayment of ₦${amountNum.toLocaleString()}`);
    } catch (err) {
      console.error(err);
      setRepayError('Failed to verify repayment balance caching.');
    }
  };

  // Savings target creation
  const handleCreateSavingsGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAmt = parseFloat(newPlanTarget);
    const monthlyAmt = parseFloat(newPlanMonthly);

    if (!newPlanTitle || isNaN(targetAmt) || targetAmt <= 0 || isNaN(monthlyAmt) || monthlyAmt <= 0) {
      triggerToast('All savings goals parameters are required', 'info');
      return;
    }

    const newGoal: SavingsPlanItem = {
      id: 'SP-' + Math.floor(100 + Math.random() * 900),
      title: newPlanTitle,
      target: targetAmt,
      current: 0,
      monthlyDeposit: monthlyAmt
    };

    setSavingsPlans(prev => [...prev, newGoal]);
    setNewPlanTitle('');
    setNewPlanTarget('');
    setNewPlanMonthly('');
    triggerToast('New target savings plan constructed!');
  };

  // Savings yield calculations
  const calculateCompoundYield = () => {
    const principal = projectionPrincipal;
    const rate = projectionRate / 100;
    const years = projectionYears;
    const compoundFrequency = 12; // Monthly compound interest
    
    const amount = principal * Math.pow((1 + rate / compoundFrequency), compoundFrequency * years);
    return Math.round(amount);
  };

  // System notes memo saving
  const handleSaveMemo = async () => {
    if (!user) return;
    try {
      const updatedUser = { ...user, adminNotes: adminMemo };
      await storageService.saveUser(updatedUser);
      setUser(updatedUser);
      triggerToast('Internal admin comments saved to database cache.');
    } catch (err) {
      console.error(err);
      triggerToast('Failed to save memo configurations.', 'info');
    }
  };

  const handleConfigToggle = (field: keyof typeof sysConfig) => {
    setSysConfig(prev => {
      const next = { ...prev, [field]: !prev[field] };
      triggerToast(`System preference modified: ${field.toUpperCase()} is now ${next[field] ? 'ENABLED' : 'DISABLED'}`);
      return next;
    });
  };

  return (
    <div className={styles.dashboardContainer}>
      <Navbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
      
      {/* Toast Alert Widget */}
      {toastMessage && (
        <div className={`${styles.toastAlert} ${toastType === 'info' ? styles.toastInfo : ''}`}>
          <div className={styles.toastIcon}>✓</div>
          <div className={styles.toastBody}>
            <p>{toastMessage}</p>
          </div>
        </div>
      )}

      <div className={styles.bodyWrapper}>
        <main className={styles.mainContent}>
          <div className={styles.backButtonWrapper}>
            <button onClick={() => navigate('/users')} className={styles.backLink}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{marginRight: '8px'}}>
                <path d="M12.5 15L7.5 10L12.5 5" stroke="#545F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Users
            </button>
          </div>

          {loading && (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Loading user details...</p>
            </div>
          )}

          {error && (
            <div className={styles.errorState}>
              <p className={styles.errorMessage}>{error}</p>
              <button onClick={() => navigate('/users')} className={styles.backToUsersBtn}>
                Return to Users List
              </button>
            </div>
          )}

          {!loading && !error && user && (
            <>
              {isFromCache && (
                <div className={styles.cacheNotice}>
                  Offline Mode: Displaying locally cached user data.
                </div>
              )}

              <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>User Details</h1>
                <div className={styles.headerActionBtns}>
                  <button
                    onClick={() => handleStatusUpdate('blacklisted')}
                    className={styles.blacklistBtn}
                  >
                    BLACKLIST USER
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('active')}
                    className={styles.activateBtn}
                  >
                    ACTIVATE USER
                  </button>
                </div>
              </div>

              <div className={styles.headerCard}>
                <div className={styles.cardTop}>
                  <div className={styles.profileSummary}>
                    <div className={styles.avatarCircle}>
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <div className={styles.profileText}>
                      <h2 className={styles.userName}>{user.firstName} {user.lastName}</h2>
                      <p className={styles.userId}>{user.id}</p>
                    </div>
                  </div>

                  <div className={styles.userTier}>
                    <span className={styles.tierLabel}>User's Tier</span>
                    <div className={styles.stars}>
                      {Array.from({ length: 3 }).map((_, i) => (
                        <svg
                          key={i}
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill={i < (user.level % 3 + 1) ? "#E9B200" : "none"}
                          stroke="#E9B200"
                        >
                          <path d="M8 .25l2.4 4.87 5.37.78-3.89 3.79.92 5.35-4.8-2.52-4.8 2.52.92-5.35L.23 5.9l5.37-.78L8 .25z"/>
                        </svg>
                      ))}
                    </div>
                  </div>

                  <div className={styles.accountSummary}>
                    <span className={styles.balanceAmount}>₦{user.accountBalance.toLocaleString()}</span>
                    <span className={styles.bankText}>{user.accountNumber}/{user.bankName}</span>
                  </div>
                </div>

                <div className={styles.tabsList}>
                  {['general', 'documents', 'bank', 'loans', 'savings', 'system'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`${styles.tabItem} ${activeTab === tab ? styles.tabActive : ''}`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)} Details
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.contentPanel}>
                
                {/* 1. GENERAL TAB */}
                {activeTab === 'general' && (
                  <div key="general" className={styles.fadeTab}>
                    <div className={styles.infoSection}>
                      <h3 className={styles.sectionTitle}>Personal Information</h3>
                      <div className={styles.infoGrid}>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>FULL NAME</span>
                          <span className={styles.infoVal}>{user.firstName} {user.lastName}</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>PHONE NUMBER</span>
                          <span className={styles.infoVal}>{user.phoneNumber}</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>EMAIL ADDRESS</span>
                          <span className={styles.infoVal}>{user.email}</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>BVN</span>
                          <span className={styles.infoVal}>{user.bvn}</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>GENDER</span>
                          <span className={styles.infoVal}>Female</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>MARITAL STATUS</span>
                          <span className={styles.infoVal}>Single</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>CHILDREN</span>
                          <span className={styles.infoVal}>None</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>TYPE OF RESIDENCE</span>
                          <span className={styles.infoVal}>Parent's Apartment</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>STATUS BADGE</span>
                          <span className={`${styles.badge} ${getStatusClass(user.status)}`}>
                            {user.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <hr className={styles.sectionDivider} />

                    <div className={styles.infoSection}>
                      <h3 className={styles.sectionTitle}>Education and Employment</h3>
                      <div className={styles.infoGrid}>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>LEVEL OF EDUCATION</span>
                          <span className={styles.infoVal}>B.Sc (Level {user.level})</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>EMPLOYMENT STATUS</span>
                          <span className={styles.infoVal}>Employed</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>SECTOR OF EMPLOYMENT</span>
                          <span className={styles.infoVal}>Fintech</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>DURATION OF EMPLOYMENT</span>
                          <span className={styles.infoVal}>2 Years</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>OFFICE EMAIL</span>
                          <span className={styles.infoVal}>{user.orgEmail}</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>MONTHLY INCOME</span>
                          <span className={styles.infoVal}>₦200,000.00 - ₦400,000.00</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>OUTSTANDING LOAN DEBT</span>
                          <span className={styles.infoVal} style={{color: user.loanAmount > 0 ? 'var(--color-blacklisted)' : 'var(--color-success)'}}>
                            ₦{user.loanAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <hr className={styles.sectionDivider} />

                    <div className={styles.infoSection}>
                      <h3 className={styles.sectionTitle}>Socials</h3>
                      <div className={styles.infoGrid}>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>TWITTER</span>
                          <span className={styles.infoVal}>@{user.firstName.toLowerCase()}_{user.lastName.toLowerCase()}</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>FACEBOOK</span>
                          <span className={styles.infoVal}>{user.firstName} {user.lastName}</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>INSTAGRAM</span>
                          <span className={styles.infoVal}>@{user.firstName.toLowerCase()}__</span>
                        </div>
                      </div>
                    </div>

                    <hr className={styles.sectionDivider} />

                    <div className={styles.infoSection}>
                      <h3 className={styles.sectionTitle}>Guarantor</h3>
                      <div className={styles.infoGrid}>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>FULL NAME</span>
                          <span className={styles.infoVal}>{user.guarantorName}</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>PHONE NUMBER</span>
                          <span className={styles.infoVal}>{user.guarantorPhoneNumber}</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>EMAIL ADDRESS</span>
                          <span className={styles.infoVal}>{user.guarantorEmail}</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>RELATIONSHIP</span>
                          <span className={styles.infoVal}>Sister / Friend</span>
                        </div>
                      </div>
                    </div>

                    <hr className={styles.sectionDivider} />

                    <div className={styles.infoSection}>
                      <h3 className={styles.sectionTitle}>Next of Kin</h3>
                      <div className={styles.infoGrid}>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>FULL NAME</span>
                          <span className={styles.infoVal}>{user.nameOfNextOfKin}</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>PHONE NUMBER</span>
                          <span className={styles.infoVal}>{user.nextOfKinPhoneNumber}</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>EMAIL ADDRESS</span>
                          <span className={styles.infoVal}>{user.nextOfKinEmail}</span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.infoLabel}>RELATIONSHIP</span>
                          <span className={styles.infoVal}>{user.nextOfKinRelationship}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. DOCUMENTS TAB */}
                {activeTab === 'documents' && (
                  <div key="documents" className={styles.fadeTab}>
                    <div className={styles.tabSectionHeader}>
                      <h3>Compliance Verification Files</h3>
                      <p>Audit government issued IDs, utility statements, and contracts supporting this customer.</p>
                    </div>

                    {/* Drag-and-drop compliance uploader */}
                    <div 
                      className={`${styles.dragUploader} ${dragOver ? styles.uploaderActive : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <p>Drag compliance documentation files here or <span>browse local directory</span></p>
                      <input 
                        type="file" 
                        onChange={handleFileSelect} 
                        className={styles.hiddenFileInput} 
                        disabled={isUploading}
                      />
                    </div>

                    {isUploading && (
                      <div className={styles.progressContainer}>
                        <div className={styles.progressBarWrapper}>
                          <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }} />
                        </div>
                        <span className={styles.progressText}>Encrypting & staging file: {uploadProgress}%</span>
                      </div>
                    )}

                    <div className={styles.docTableWrapper}>
                      <table className={styles.documentsTable}>
                        <thead>
                          <tr>
                            <th>Document Name</th>
                            <th>Type</th>
                            <th>Size</th>
                            <th>Staged Date</th>
                            <th>Compliance Status</th>
                            <th style={{ textAlign: 'right' }}>Verify Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {documents.map(doc => (
                            <tr key={doc.id}>
                              <td className={styles.docNameCell}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px', color: 'var(--color-text-gray)'}}>
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                </svg>
                                <span>{doc.name}</span>
                              </td>
                              <td>{doc.type}</td>
                              <td>{doc.size}</td>
                              <td>{doc.uploadedAt}</td>
                              <td>
                                <span className={`${styles.miniBadge} ${
                                  doc.status === 'Verified' ? styles.badgeSuccess : 
                                  doc.status === 'Rejected' ? styles.badgeDanger : styles.badgeInfo
                                }`}>
                                  {doc.status}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <div className={styles.actionsBtnWrapper}>
                                  <button 
                                    className={styles.docApproveBtn}
                                    onClick={() => toggleDocStatus(doc.id, 'Verified')}
                                    disabled={doc.status === 'Verified'}
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    className={styles.docRejectBtn}
                                    onClick={() => toggleDocStatus(doc.id, 'Rejected')}
                                    disabled={doc.status === 'Rejected'}
                                  >
                                    Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 3. BANK DETAILS TAB */}
                {activeTab === 'bank' && (
                  <div key="bank" className={styles.fadeTab}>
                    <div className={styles.tabSectionHeader}>
                      <h3>Financial Accounts & Bank Connections</h3>
                      <p>Perform automated KYC lookup checks and manage reconciliations of linked ledgers.</p>
                    </div>

                    <div className={styles.bankCardsGrid}>
                      <div className={styles.bankDetailsCard}>
                        <div className={styles.bankCardHeader}>
                          <span className={styles.bankTag}>Primary Link</span>
                          <h4>Providus Bank Connect</h4>
                        </div>
                        <div className={styles.bankCardBody}>
                          <div className={styles.cardStat}>
                            <span>Ledger Account Balance</span>
                            <strong>₦{(user.accountBalance * 0.7).toLocaleString()}</strong>
                          </div>
                          <div className={styles.cardStat}>
                            <span>Account Number</span>
                            <strong>{user.accountNumber}</strong>
                          </div>
                        </div>
                      </div>

                      <div className={styles.bankDetailsCard}>
                        <div className={styles.bankCardHeader}>
                          <span className={styles.bankTagSec}>Backup Link</span>
                          <h4>Guaranty Trust Bank Link</h4>
                        </div>
                        <div className={styles.bankCardBody}>
                          <div className={styles.cardStat}>
                            <span>Ledger Account Balance</span>
                            <strong>₦{(user.accountBalance * 0.3).toLocaleString()}</strong>
                          </div>
                          <div className={styles.cardStat}>
                            <span>Routing Transit Code</span>
                            <strong>058-150-901</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BVN KYC verification search simulator */}
                    <div className={styles.kycLookupEngine}>
                      <h4 className={styles.kycTitle}>KYC Bank Verification Number (BVN) Registry Check</h4>
                      <p className={styles.kycDesc}>Execute queries against central financial intelligence networks to verify account registry.</p>
                      
                      <div className={styles.kycInputRow}>
                        <input 
                          type="text" 
                          placeholder="Verify 11-digit BVN"
                          className={styles.kycInputField}
                          value={bvnPrefill}
                          onChange={(e) => setBvnPrefill(e.target.value.replace(/\D/g, ''))}
                          maxLength={11}
                        />
                        <button 
                          className={styles.kycVerifyBtn} 
                          onClick={handleBvnVerifyCheck}
                          disabled={bvnVerifying}
                        >
                          {bvnVerifying ? 'Running Query...' : 'Run KYC Lookup'}
                        </button>
                      </div>

                      {bvnVerifying && (
                        <div className={styles.searchingPulse}>
                          <div className={styles.pulsingCircle} />
                          <span>Searching central banking network directories...</span>
                        </div>
                      )}

                      {bvnLookupResult.status === 'success' && (
                        <div className={styles.kycResultPanel}>
                          <div className={styles.resGrid}>
                            <div className={styles.resItem}>
                              <span>REGISTRY FULL NAME</span>
                              <strong>{bvnLookupResult.fullName}</strong>
                            </div>
                            <div className={styles.resItem}>
                              <span>REGISTRY DATE OF BIRTH</span>
                              <strong>{bvnLookupResult.dob}</strong>
                            </div>
                            <div className={styles.resItem}>
                              <span>CARRIER PHONE LINK</span>
                              <strong>{bvnLookupResult.phoneMatch}</strong>
                            </div>
                            <div className={styles.resItem}>
                              <span>BVN STATUS</span>
                              <strong style={{ color: 'var(--color-success)' }}>{bvnLookupResult.bvnStatus}</strong>
                            </div>
                          </div>
                        </div>
                      )}

                      {bvnLookupResult.status === 'failed' && (
                        <div className={styles.kycFailedPanel}>
                          <p>Registry Match Failed: The provided credit verification profile does not exist.</p>
                        </div>
                      )}
                    </div>

                    {/* Settlements reconciliation list */}
                    <div className={styles.settlementsSection}>
                      <h4 className={styles.sectionTitle}>Manual Settlement Clearings Reconciliation</h4>
                      <div className={styles.tableWrapper}>
                        <table className={styles.reconcileTable}>
                          <thead>
                            <tr>
                              <th>Transfer ID</th>
                              <th>Account Connection</th>
                              <th>Amount Staged</th>
                              <th>Payout Date</th>
                              <th>Status</th>
                              <th style={{ textAlign: 'right' }}>Manual Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ledgerTransactions.map(tx => (
                              <tr key={tx.id}>
                                <td className={styles.txCell}>{tx.id}</td>
                                <td>{tx.bank}</td>
                                <td>₦{tx.amount.toLocaleString()}</td>
                                <td>{tx.date}</td>
                                <td>
                                  <span className={`${styles.miniBadge} ${tx.status === 'Reconciled' ? styles.badgeSuccess : styles.badgeWarning}`}>
                                    {tx.status}
                                  </span>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                  {tx.status === 'Pending Reconcile' ? (
                                    <button 
                                      className={styles.reconcileBtn}
                                      onClick={() => reconcileTransaction(tx.id)}
                                    >
                                      Reconcile
                                    </button>
                                  ) : (
                                    <span style={{ fontSize: '12px', color: 'var(--color-text-light)', fontWeight: 500 }}>Reconciled ✓</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. LOANS TAB */}
                {activeTab === 'loans' && (
                  <div key="loans" className={styles.fadeTab}>
                    <div className={styles.loansHero}>
                      <div className={styles.loansSummaryPanel}>
                        <div className={styles.heroStat}>
                          <span>Composite Outstanding Debt</span>
                          <strong style={{ color: user.loanAmount > 0 ? 'var(--color-blacklisted)' : 'var(--color-success)' }}>
                            ₦{user.loanAmount.toLocaleString()}
                          </strong>
                        </div>
                        <div className={styles.heroStat}>
                          <span>Active Credit Facilities</span>
                          <strong>{loanHistory.filter(l => l.status === 'Active').length}</strong>
                        </div>
                      </div>
                      <div className={styles.heroAction}>
                        <button 
                          className={styles.activateBtnRepay}
                          onClick={() => setIsRepayModalOpen(true)}
                          disabled={user.loanAmount === 0}
                        >
                          Repay Outstanding Loan Balance
                        </button>
                      </div>
                    </div>

                    {/* Repay Loan Form Modal Overlay */}
                    {isRepayModalOpen && (
                      <div className={styles.modalOverlay} onClick={() => setIsRepayModalOpen(false)}>
                        <div className={styles.repayModal} onClick={(e) => e.stopPropagation()}>
                          <div className={styles.modalHeader}>
                            <h3>Process Administrative Repayment</h3>
                            <button className={styles.closeModalBtn} onClick={() => setIsRepayModalOpen(false)}>×</button>
                          </div>
                          <form onSubmit={handleRepaySubmit} className={styles.modalForm}>
                            <p className={styles.modalSub}>
                              Record a direct settlement payout from the client wallet bank accounts.
                            </p>

                            <div className={styles.modalBalances}>
                              <div className={styles.balTile}>
                                <span>Outstanding Loan:</span>
                                <strong>₦{user.loanAmount.toLocaleString()}</strong>
                              </div>
                              <div className={styles.balTile}>
                                <span>Available Wallet:</span>
                                <strong>₦{user.accountBalance.toLocaleString()}</strong>
                              </div>
                            </div>

                            <div className={styles.formGroup}>
                              <label htmlFor="repayAmount" className={styles.repayLabel}>Amount to Repay (₦)</label>
                              <input 
                                id="repayAmount"
                                type="text" 
                                className={styles.repayInput}
                                placeholder="Enter repayment amount (e.g. 50000)"
                                value={repayAmount}
                                onChange={(e) => setRepayAmount(e.target.value.replace(/\D/g, ''))}
                                autoFocus
                              />
                            </div>

                            {repayError && <div className={styles.repayErrorPanel}>{repayError}</div>}

                            <div className={styles.modalButtons}>
                              <button 
                                type="button" 
                                className={styles.cancelBtn} 
                                onClick={() => setIsRepayModalOpen(false)}
                              >
                                Cancel
                              </button>
                              <button 
                                type="submit" 
                                className={styles.submitRepaymentBtn}
                              >
                                Record Repayment
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}

                    <div className={styles.loansSection}>
                      <h4 className={styles.sectionTitle}>Active Credit Contracts and History</h4>
                      <table className={styles.loansTable}>
                        <thead>
                          <tr>
                            <th>Contract ID</th>
                            <th>Principal Staged</th>
                            <th>Interest Coefficient</th>
                            <th>Tenure Terms</th>
                            <th>Contract Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loanHistory.map(ln => (
                            <tr key={ln.id}>
                              <td className={styles.loanIdCell}>{ln.id}</td>
                              <td>₦{ln.principal.toLocaleString()}</td>
                              <td>{ln.interestRate}</td>
                              <td>{ln.tenure}</td>
                              <td>
                                <span className={`${styles.miniBadge} ${ln.status === 'Active' ? styles.badgeWarning : styles.badgeSuccess}`}>
                                  {ln.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className={styles.repaymentHistoryLedger}>
                      <h4 className={styles.sectionTitle}>Direct Repayments Ledger Logs</h4>
                      <table className={styles.repaymentsHistoryTable}>
                        <thead>
                          <tr>
                            <th>Receipt ID</th>
                            <th>Settlement Credit Amount</th>
                            <th>Payment Date</th>
                            <th>Clearing Method</th>
                          </tr>
                        </thead>
                        <tbody>
                          {repaymentLedger.map(rm => (
                            <tr key={rm.paymentId}>
                              <td className={styles.receiptCell}>{rm.paymentId}</td>
                              <td style={{ color: 'var(--color-active)', fontWeight: 600 }}>+ ₦{rm.amount.toLocaleString()}</td>
                              <td>{rm.date}</td>
                              <td>{rm.method}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 5. SAVINGS TAB */}
                {activeTab === 'savings' && (
                  <div key="savings" className={styles.fadeTab}>
                    <div className={styles.tabSectionHeader}>
                      <h3>Target Savings & High-Yield Projection Planner</h3>
                      <p>Monitor active savings goals portfolios and project compound earnings metrics.</p>
                    </div>

                    <div className={styles.savingsConstructorGrid}>
                      {/* Active Goals list with dynamic progress */}
                      <div className={styles.activeGoalsWrapper}>
                        <h4 className={styles.savingsGoalTitle}>Active Customer Target Plans</h4>
                        <div className={styles.savingsGoalsList}>
                          {savingsPlans.map(sp => {
                            const percent = Math.min(Math.round((sp.current / sp.target) * 100), 100);
                            return (
                              <div key={sp.id} className={styles.goalProgressCard}>
                                <div className={styles.goalInfoText}>
                                  <strong>{sp.title}</strong>
                                  <span>{percent}% Saved</span>
                                </div>
                                <div className={styles.progressTrackBar}>
                                  <div className={styles.progressFillBar} style={{ width: `${percent}%` }} />
                                </div>
                                <div className={styles.goalDetailRow}>
                                  <span>₦{sp.current.toLocaleString()} / ₦{sp.target.toLocaleString()}</span>
                                  <span>+₦{sp.monthlyDeposit.toLocaleString()}/mo</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Construction form for new goals */}
                      <div className={styles.newGoalConstructor}>
                        <h4 className={styles.savingsGoalTitle}>Construct New Savings Target Goal</h4>
                        <form onSubmit={handleCreateSavingsGoal} className={styles.goalForm}>
                          <div className={styles.formGroup}>
                            <input 
                              type="text" 
                              placeholder="Plan Goal Title (e.g. Annual Travel Fund)" 
                              className={styles.kycInputField}
                              value={newPlanTitle}
                              onChange={(e) => setNewPlanTitle(e.target.value)}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <input 
                              type="text" 
                              placeholder="Total Target Amount Needed (₦)" 
                              className={styles.kycInputField}
                              value={newPlanTarget}
                              onChange={(e) => setNewPlanTarget(e.target.value.replace(/\D/g, ''))}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <input 
                              type="text" 
                              placeholder="Configured Monthly Auto-Deposit (₦)" 
                              className={styles.kycInputField}
                              value={newPlanMonthly}
                              onChange={(e) => setNewPlanMonthly(e.target.value.replace(/\D/g, ''))}
                            />
                          </div>
                          <button type="submit" className={styles.submitGoalBtn}>Publish Savings Target</button>
                        </form>
                      </div>
                    </div>

                    {/* Interactive yield compound projection engine */}
                    <div className={styles.compoundProjectionEngine}>
                      <h4 className={styles.savingsGoalTitle}>High-Yield Interest Compound Projector</h4>
                      <p className={styles.projectionDesc}>Slide investment values to simulate future savings returns on a compound annual basis.</p>
                      
                      <div className={styles.projectorSlidersGrid}>
                        <div className={styles.sliderControlTile}>
                          <div className={styles.sliderLabelVal}>
                            <span>Initial Principal Deposit</span>
                            <strong>₦{projectionPrincipal.toLocaleString()}</strong>
                          </div>
                          <input 
                            type="range" 
                            min={10000}
                            max={1000000}
                            step={10000}
                            value={projectionPrincipal}
                            onChange={(e) => setProjectionPrincipal(parseInt(e.target.value))}
                            className={styles.projectorSlider}
                          />
                        </div>

                        <div className={styles.sliderControlTile}>
                          <div className={styles.sliderLabelVal}>
                            <span>Annual Yield Rate (%)</span>
                            <strong>{projectionRate}% APR</strong>
                          </div>
                          <input 
                            type="range" 
                            min={3}
                            max={20}
                            step={1}
                            value={projectionRate}
                            onChange={(e) => setProjectionRate(parseInt(e.target.value))}
                            className={styles.projectorSlider}
                          />
                        </div>

                        <div className={styles.sliderControlTile}>
                          <div className={styles.sliderLabelVal}>
                            <span>Savings Timeframe Tenure</span>
                            <strong>{projectionYears} Years</strong>
                          </div>
                          <input 
                            type="range" 
                            min={1}
                            max={15}
                            step={1}
                            value={projectionYears}
                            onChange={(e) => setProjectionYears(parseInt(e.target.value))}
                            className={styles.projectorSlider}
                          />
                        </div>
                      </div>

                      <div className={styles.projectionYieldResult}>
                        <span>ESTIMATED END BALANCES (MONTHLY COMPOUNDING)</span>
                        <h3>₦{calculateCompoundYield().toLocaleString()}</h3>
                        <p>Simulated earnings based on an adjusted Lendsqr savings product parameters.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. APP AND SYSTEM TAB */}
                {activeTab === 'system' && (
                  <div key="system" className={styles.fadeTab}>
                    <div className={styles.tabSectionHeader}>
                      <h3>System Parameters & Credit Commentary</h3>
                      <p>Maintain internal memo records and authorize technical security preferences for this user profile.</p>
                    </div>

                    <div className={styles.systemContentGrid}>
                      {/* Interactive internal admin notes compiler */}
                      <div className={styles.adminNotesCompiler}>
                        <h4 className={styles.systemSectionTitle}>Internal Administrative Memo Workspace</h4>
                        <p className={styles.systemDesc}>Write private comments regarding identity audits, security flags, or repayment commentary.</p>
                        
                        <textarea 
                          className={styles.memoTextarea} 
                          value={adminMemo}
                          onChange={(e) => setAdminMemo(e.target.value)}
                          placeholder="Type internal memo annotations..."
                          rows={6}
                        />
                        <button className={styles.saveMemoBtn} onClick={handleSaveMemo}>
                          Save Internal Memo
                        </button>
                      </div>

                      {/* Stateful preference toggles */}
                      <div className={styles.systemSwitchesPanel}>
                        <h4 className={styles.systemSectionTitle}>Security Clearance Configuration</h4>
                        <p className={styles.systemDesc}>Authorize global settings corresponding to API clearances and login gates.</p>
                        
                        <div className={styles.togglesList}>
                          <div className={styles.toggleTile}>
                            <div className={styles.toggleTextInfo}>
                              <strong>Force Multi-Factor Authentication</strong>
                              <span>Prompt user with OTP checks during session initiations.</span>
                            </div>
                            <button 
                              className={`${styles.switchBtn} ${sysConfig.forceMfa ? styles.switchActive : ''}`}
                              onClick={() => handleConfigToggle('forceMfa')}
                            />
                          </div>

                          <div className={styles.toggleTile}>
                            <div className={styles.toggleTextInfo}>
                              <strong>Allow Webhook Callback Integrations</strong>
                              <span>Broadcast transaction alerts to registered endpoint URLs.</span>
                            </div>
                            <button 
                              className={`${styles.switchBtn} ${sysConfig.allowWebhooks ? styles.switchActive : ''}`}
                              onClick={() => handleConfigToggle('allowWebhooks')}
                            />
                          </div>

                          <div className={styles.toggleTile}>
                            <div className={styles.toggleTextInfo}>
                              <strong>Developer Sandboxed Access</strong>
                              <span>Grant keys to test endpoints and staging ledger lists.</span>
                            </div>
                            <button 
                              className={`${styles.switchBtn} ${sysConfig.developerMode ? styles.switchActive : ''}`}
                              onClick={() => handleConfigToggle('developerMode')}
                            />
                          </div>

                          <div className={styles.toggleTile}>
                            <div className={styles.toggleTextInfo}>
                              <strong>Transaction SMS Broadcast Alerts</strong>
                              <span>Push instant mobile notifications on ledger payouts.</span>
                            </div>
                            <button 
                              className={`${styles.switchBtn} ${sysConfig.smsAlerts ? styles.switchActive : ''}`}
                              onClick={() => handleConfigToggle('smsAlerts')}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </>
          )}
        </main>
        <Sidebar isOpen={sidebarOpen} activePath="/users" onLogout={handleLogout} />
      </div>
    </div>
  );
};

export default UserDetails;
