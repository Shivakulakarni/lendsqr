import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Sidebar.module.scss';

interface SidebarProps {
  isOpen: boolean;
  activePath: string;
  onLogout: () => void;
}

export const Sidebar = ({ isOpen, activePath, onLogout }: SidebarProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentView = searchParams.get('view') || '';

  const isActive = (viewName: string) => {
    if (viewName === 'users') {
      return (activePath.startsWith('/users') && !currentView) || currentView === 'users' ? styles.sidebarLinkActive : '';
    }
    if (viewName === 'dashboard') {
      return (activePath === '/dashboard' || currentView === 'dashboard') ? styles.sidebarLinkActive : '';
    }
    return currentView === viewName ? styles.sidebarLinkActive : '';
  };

  const handleLinkClick = (viewName: string) => {
    if (viewName === 'users') {
      navigate('/users');
    } else if (viewName === 'dashboard') {
      navigate('/dashboard');
    } else {
      navigate(`/users?view=${viewName}`);
    }
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.orgPicker} onClick={() => handleLinkClick('organization')}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#213F7D" strokeWidth="1.5">
          <rect x="2" y="3" width="12" height="11" rx="2" />
          <path d="M5 3V1H11V3" />
        </svg>
        <span>Switch Organization</span>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className={styles.chevron}>
          <path d="M5 7.5L10 12.5L15 7.5" stroke="#213F7D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div onClick={() => handleLinkClick('dashboard')} className={`${styles.sidebarLink} ${isActive('dashboard')}`}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 15V6L8 1L15 6V15H1Z" />
        </svg>
        <span>Dashboard</span>
      </div>

      <div className={styles.sidebarGroup}>
        <h3 className={styles.groupTitle}>CUSTOMERS</h3>
        
        <div onClick={() => handleLinkClick('users')} className={`${styles.sidebarLink} ${isActive('users')}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" />
            <path d="M14 16C14 12.6863 11.3137 10 8 10C4.68629 10 2 12.6863 2 16" />
          </svg>
          <span>Users</span>
        </div>

        <div onClick={() => handleLinkClick('guarantors')} className={`${styles.sidebarLink} ${isActive('guarantors')}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14H4C2.9 14 2 13.1 2 12V4C2 2.9 2.9 2 4 2H12Z" />
            <circle cx="6" cy="6" r="2" />
            <path d="M10 12C10 10.3 8.7 9 7 9C5.3 9 4 10.3 4 12" />
          </svg>
          <span>Guarantors</span>
        </div>

        <div onClick={() => handleLinkClick('loans')} className={`${styles.sidebarLink} ${isActive('loans')}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="12" height="12" rx="2" />
            <path d="M2 7H14" />
            <path d="M7 2V14" />
          </svg>
          <span>Loans</span>
        </div>

        <div onClick={() => handleLinkClick('decision')} className={`${styles.sidebarLink} ${isActive('decision')}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 1L8 5L4 1" />
            <path d="M12 15L8 11L4 15" />
          </svg>
          <span>Decision Models</span>
        </div>

        <div onClick={() => handleLinkClick('savings')} className={`${styles.sidebarLink} ${isActive('savings')}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="7" />
            <path d="M8 3V13" />
            <path d="M5 8H11" />
          </svg>
          <span>Savings</span>
        </div>

        <div onClick={() => handleLinkClick('requests')} className={`${styles.sidebarLink} ${isActive('requests')}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 14H13" />
            <path d="M4 11V3H12V11" />
          </svg>
          <span>Loan Requests</span>
        </div>

        <div onClick={() => handleLinkClick('whitelist')} className={`${styles.sidebarLink} ${isActive('whitelist')}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1H15V15H1V1Z" />
            <path d="M5 5L11 11" />
          </svg>
          <span>Whitelist</span>
        </div>

        <div onClick={() => handleLinkClick('karma')} className={`${styles.sidebarLink} ${isActive('karma')}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 13V12C12 9.2 9.8 7 7 7C4.2 7 2 9.2 2 12V13" />
            <circle cx="7" cy="4" r="3" />
          </svg>
          <span>Karma</span>
        </div>
      </div>

      <div className={styles.sidebarGroup}>
        <h3 className={styles.groupTitle}>BUSINESSES</h3>

        <div onClick={() => handleLinkClick('organization')} className={`${styles.sidebarLink} ${isActive('organization')}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="3" width="12" height="11" rx="2" />
          </svg>
          <span>Organization</span>
        </div>

        <div onClick={() => handleLinkClick('products')} className={`${styles.sidebarLink} ${isActive('products')}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 14V3H13V14" />
          </svg>
          <span>Loan Products</span>
        </div>

        <div onClick={() => handleLinkClick('savings-products')} className={`${styles.sidebarLink} ${isActive('savings-products')}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 1L1 4L8 7L15 4L8 1Z" />
          </svg>
          <span>Savings Products</span>
        </div>

        <div onClick={() => handleLinkClick('fees')} className={`${styles.sidebarLink} ${isActive('fees')}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="6" />
          </svg>
          <span>Fees and Charges</span>
        </div>

        <div onClick={() => handleLinkClick('transactions')} className={`${styles.sidebarLink} ${isActive('transactions')}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="3" width="12" height="10" rx="1" />
          </svg>
          <span>Transactions</span>
        </div>

        <div onClick={() => handleLinkClick('services')} className={`${styles.sidebarLink} ${isActive('services')}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="7" />
          </svg>
          <span>Services</span>
        </div>

        <div onClick={() => handleLinkClick('account')} className={`${styles.sidebarLink} ${isActive('account')}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 1L13 15" />
          </svg>
          <span>Service Account</span>
        </div>

        <div onClick={() => handleLinkClick('settlements')} className={`${styles.sidebarLink} ${isActive('settlements')}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 14H14" />
          </svg>
          <span>Settlements</span>
        </div>

        <div onClick={() => handleLinkClick('reports')} className={`${styles.sidebarLink} ${isActive('reports')}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 2H14V14H2V2Z" />
          </svg>
          <span>Reports</span>
        </div>
      </div>

      <div className={styles.sidebarGroup}>
        <h3 className={styles.groupTitle}>SETTINGS</h3>

        <div onClick={() => handleLinkClick('preferences')} className={`${styles.sidebarLink} ${isActive('preferences')}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="3" />
          </svg>
          <span>Preferences</span>
        </div>

        <div onClick={() => handleLinkClick('pricing')} className={`${styles.sidebarLink} ${isActive('pricing')}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 14V2H12V14" />
          </svg>
          <span>Fees and Pricing</span>
        </div>

        <div onClick={() => handleLinkClick('logs')} className={`${styles.sidebarLink} ${isActive('logs')}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 14V2H14V14" />
          </svg>
          <span>Audit Logs</span>
        </div>

        <div onClick={() => handleLinkClick('messages')} className={`${styles.sidebarLink} ${isActive('messages')}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 3H14V13H2V3Z" />
          </svg>
          <span>Systems Messages</span>
        </div>
      </div>

      <hr className={styles.divider} />

      <div>
        <button onClick={onLogout} className={styles.logoutBtn}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#213F7D" strokeWidth="1.5">
            <path d="M9 3H13V13H9" />
            <path d="M1 8H10L8 6M8 10L10 8" />
          </svg>
          <span>Logout</span>
        </button>
        <div className={styles.versionInfo}>v1.0.0</div>
      </div>
    </aside>
  );
};

export default Sidebar;
