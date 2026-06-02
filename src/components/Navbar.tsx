import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import styles from './Navbar.module.scss';

interface NavbarProps {
  onMenuToggle: () => void;
  onSearch?: (query: string) => void;
}

interface NotificationItem {
  id: string;
  type: 'critical' | 'action' | 'success' | 'info';
  text: string;
  time: string;
  unread: boolean;
}

interface DocArticle {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string;
}

export const Navbar = ({ onMenuToggle, onSearch }: NavbarProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<{ email?: string; fullName?: string } | null>(null);

  useEffect(() => {
    try {
      const u = localStorage.getItem('user');
      if (u) {
        const parsed = JSON.parse(u);
        
        // Resolve fullName dynamically if it is missing
        if (!parsed.fullName && parsed.email) {
          const emailLower = parsed.email.toLowerCase();
          if (emailLower === 'admin@lendsqr.com') {
            parsed.fullName = 'Adedeji';
          } else if (emailLower === 'risk@lendsqr.com') {
            parsed.fullName = 'Risk Manager';
          } else {
            const prefix = parsed.email.split('@')[0];
            parsed.fullName = prefix
              .split(/[._-]/)
              .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
              .join(' ');
          }
        }

        // Normalize default/email prefix names
        if (parsed.fullName === 'admin' && parsed.email?.toLowerCase() === 'admin@lendsqr.com') {
          parsed.fullName = 'Adedeji';
        } else if (parsed.fullName === 'risk' && parsed.email?.toLowerCase() === 'risk@lendsqr.com') {
          parsed.fullName = 'Risk Manager';
        } else if (parsed.fullName && !parsed.fullName.includes(' ') && parsed.email) {
          // If the name is just a single word matching the email prefix, format it nicely
          const prefix = parsed.email.split('@')[0];
          if (parsed.fullName.toLowerCase() === prefix.toLowerCase()) {
            parsed.fullName = prefix
              .split(/[._-]/)
              .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
              .join(' ');
          }
        }
        setCurrentUser(parsed);
      }
    } catch (e) {
      console.error('Failed to parse user session', e);
    }
  }, []);

  const getAvatarSrc = () => {
    const name = getDisplayName();
    
    // Curated list of high-fidelity profile photos
    const avatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100', // Female 1 (Original)
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100', // Male 1
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100', // Female 2
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100', // Male 2
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100', // Female 3
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100'  // Male 3
    ];

    if (name === 'Adedeji') {
      return avatars[0];
    }
    if (name.toLowerCase().includes('super admin') || name.toLowerCase().includes('admin')) {
      return avatars[5]; // Consistently Super Admin gets a specific clean avatar
    }
    if (name.toLowerCase().includes('risk manager') || name.toLowerCase().includes('risk')) {
      return avatars[1]; // Consistently Risk Manager gets a specific clean avatar
    }

    // Stable selection based on hash of the user's name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % avatars.length;
    return avatars[index];
  };

  const getInitialsSvg = (name: string) => {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'AD';
      
    const colors = [
      '#39CDCC', // Lendsqr Teal
      '#213F7D', // Lendsqr Dark Blue
      '#57a1f8', // Soft Blue
      '#7b61ff', // Violet
      '#f53d56', // Soft Red
      '#2ecc71'  // Emerald Green
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = colors[Math.abs(hash) % colors.length];
    
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="50" fill="${color}"/>
        <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="'Work Sans', sans-serif" font-weight="700" font-size="38" fill="#ffffff">${initials}</text>
      </svg>
    `.trim();
    
    return `data:image/svg+xml;base64,${window.btoa(svg)}`;
  };

  const getDisplayName = (): string => {
    return currentUser?.fullName || authService.getCurrentUser()?.fullName || 'User';
  };

  const getDisplayEmail = (): string => {
    return currentUser?.email || authService.getCurrentUser()?.email || '';
  };

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'critical',
      text: 'Fraud Alert: BVN 2248**** matches Karma Blacklist records.',
      time: '2 mins ago',
      unread: true,
    },
    {
      id: '2',
      type: 'action',
      text: 'Pending Loan: ₦150,000 disbursement request queued.',
      time: '10 mins ago',
      unread: true,
    },
    {
      id: '3',
      type: 'success',
      text: 'System Health: Credit decision model API online.',
      time: '1 hr ago',
      unread: true,
    },
    {
      id: '4',
      type: 'info',
      text: 'MFA Updates: Multi-Factor Authentication active for org "Lendsqr".',
      time: '5 hrs ago',
      unread: false,
    },
  ]);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Profile dropdown state
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  // Docs Modal State
  const [showDocs, setShowDocs] = useState(false);
  const [docsSearch, setDocsSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const docArticles: DocArticle[] = [
    {
      id: '1',
      category: 'User Management',
      title: 'Administrative Operations Overview',
      summary: 'Learn the fundamentals of navigating, auditing, and managing customer portfolios.',
      content: 'Lendsqr Administrator Portal is designed to give you 360-degree control over your loan portfolio. As an admin, you can filter customer lists, review identity documents, activate accounts, or flag suspicious users. The header card displays the tier rating, bank account details, and outstanding balances. Navigate between General, Documents, Bank Details, and Loan tabs to review dynamic details.',
    },
    {
      id: '2',
      category: 'Risk Scoring',
      title: 'Decision Scoring & Credit Policies',
      summary: 'Understand the parameters governing automated loan request approvals.',
      content: 'Our Decision Scoring engines run real-time multi-coefficient simulators. You can adjust weights for age, income level, repayment history, and debt ratios. The composite credit rating determines default probability. If a client falls into a high-risk category, automated whitelist parameters are disabled, and karma reports are generated automatically.',
    },
    {
      id: '3',
      category: 'Loan Underwriting',
      title: 'Configuring New Loan Products',
      summary: 'Step-by-step documentation on setting terms, pricing scales, and disbursements.',
      content: 'To establish a new loan product: 1. Specify the minimum and maximum ranges. 2. Configure processing rates and interest percentages. 3. Define late-repayment penalties. Once a product is published, borrowers can apply, and requests will enter the Pending Queue for admin review.',
    },
    {
      id: '4',
      category: 'Settlements',
      title: 'Clearing Transactions & Payouts',
      summary: 'Manual reconciliation procedures, wallet balances, and settlement structures.',
      content: 'Transactions are cleared in settlement batches. If the API wallet credit is low, top up the credit balance using the mock billing portal. If an automated API payout fails, click "Restart Service" inside the Services Monitor, then select "Manually Reconcile" inside the customer\'s Bank Details tab.',
    },
    {
      id: '5',
      category: 'Developer API',
      title: 'Webhook Callbacks & Integration Keys',
      summary: 'Integrating administrative triggers into third-party business services.',
      content: 'Webhook integrations broadcast transaction states, fraud records, and KYC matching details. Go to "App and System" under any user profile to toggle developer modes, allow custom webhook notifications, or trigger manual webhook testing payloads with custom internal admin memos.',
    },
  ];

  const [selectedArticle, setSelectedArticle] = useState<DocArticle>(docArticles[0]);

  // Count of unread notifications
  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const filteredArticles = docArticles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(docsSearch.toLowerCase()) || 
                          art.content.toLowerCase().includes(docsSearch.toLowerCase()) ||
                          art.summary.toLowerCase().includes(docsSearch.toLowerCase());
    const matchesCategory = activeCategory === 'All' || art.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return (
          <span className={`${styles.notiIcon} ${styles.notiCritical}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </span>
        );
      case 'action':
        return (
          <span className={`${styles.notiIcon} ${styles.notiAction}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </span>
        );
      case 'success':
        return (
          <span className={`${styles.notiIcon} ${styles.notiSuccess}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </span>
        );
      default:
        return (
          <span className={`${styles.notiIcon} ${styles.notiInfo}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </span>
        );
    }
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.navLeft}>
        <button
          className={styles.hamburger}
          onClick={onMenuToggle}
          aria-label="Toggle Sidebar"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#213F7D" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
 
        <div className={styles.brandLogo} onClick={() => navigate('/users')}>
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzMiIGhlaWdodD0iMzYiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAxNzMgMzYiPjxwYXRoIGQ9Ik0yNS4wNDggMEgxMC45NTJDNC45MDMgMCAwIDQuOTAzIDAgMTAuOTUyVjI1LjA0OEMwIDMxLjA5NyA0LjkwMyAzNiAxMC45NTIgMzZIMjUuMDQ4QzMxLjA5NyAzNiAzNiAzMS4wOTcgMzYgMjUuMDQ4VjEwLjk1MkMzNiA0LjkwMyAzMS4wOTcgMCAyNS4wNDggMFoiIGZpbGw9IiMzOUNEQ0MiLz48cGF0aCBkPSJNMTIgMTJIMjRWMjRIMTJWMTJaIiBmaWxsPSJ3aGl0ZSIvPjxwYXRoIGQ9Ik0xNSAxNUgyMVYyMUgxNVYxNVoiIGZpbGw9IiMyMTNGN0QiLz48dGV4dCB4PSI0NiIgeT0iMjYiIGZpbGw9IiMyMTNGN0QiIGZvbnQtZmFtaWx5PSInV29yayBTYW5zJywgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNSIgZm9udC13ZWlnaHQ9IjcwMCIgbGV0dGVyLXNwYWNpbmc9Ii0xIj5sZW5kc3FyPC90ZXh0Pjwvc3ZnPg==" alt="Lendsqr Logo" width="145" height="30" />
        </div>
 
        <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
          <input
            className={styles.searchInput}
            placeholder="Search for users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className={styles.searchButton} aria-label="Search">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6.5" cy="6.5" r="5.5" stroke="white" strokeWidth="1.5"/><line x1="10.5" y1="10.5" x2="13" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </form>
      </div>
 
      <div className={styles.navRight}>
        <button 
          onClick={() => {
            setShowDocs(true);
            setSelectedArticle(docArticles[0]);
          }} 
          className={styles.docsLinkButton}
        >
          Docs
        </button>
 
        <div className={styles.notificationsWrapper} ref={dropdownRef}>
          <button 
            className={`${styles.iconButton} ${unreadCount > 0 ? styles.hasUnread : ''}`} 
            aria-label="Notifications"
            onClick={toggleNotifications}
          >
            <svg width="20" height="22" viewBox="0 0 20 22" fill="none"><path d="M10 21C11.1046 21 12 20.1046 12 19H8C8 20.1046 8.89543 21 10 21Z" fill="#213F7D"/><path d="M17 14V9C17 5.93 15.36 3.25 12.5 2.58V2C12.5 0.9 11.6 0 10.5 0C9.4 0 8.5 0.9 8.5 2V2.58C5.64 3.25 4 5.92 4 9V14L2 16V17H18V16L17 14Z" fill="#213F7D"/></svg>
            {unreadCount > 0 && <span className={styles.badgeCount}>{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className={styles.notiDropdown}>
              <div className={styles.notiHeader}>
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className={styles.markAllBtn}>
                    Mark all read
                  </button>
                )}
              </div>
              <div className={styles.notiList}>
                {notifications.length === 0 ? (
                  <div className={styles.emptyState}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#b8b8b8" strokeWidth="1.5">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    <p>All caught up!</p>
                    <span>No unread notifications to show.</span>
                  </div>
                ) : (
                  notifications.map(noti => (
                    <div 
                      key={noti.id} 
                      className={`${styles.notiItem} ${noti.unread ? styles.unreadItem : ''}`}
                      onClick={() => markAsRead(noti.id)}
                    >
                      {getNotificationIcon(noti.type)}
                      <div className={styles.notiContent}>
                        <p className={styles.notiText}>{noti.text}</p>
                        <span className={styles.notiTime}>{noti.time}</span>
                      </div>
                      {noti.unread && <span className={styles.unreadDot}></span>}
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className={styles.notiFooter}>
                  <button onClick={clearAllNotifications} className={styles.clearAllBtn}>
                    Clear all logs
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.profileWrapper} ref={profileMenuRef}>
          <div 
            className={styles.profileWidget} 
            onClick={() => setShowProfileDropdown(prev => !prev)}
            role="button"
            aria-haspopup="true"
            aria-expanded={showProfileDropdown}
          >
            <div className={styles.avatar}>
              <img 
                src={getAvatarSrc()} 
                alt="User avatar" 
                onError={(e) => {
                  e.currentTarget.src = getInitialsSvg(getDisplayName());
                }}
              />
            </div>
            <span className={styles.profileName}>{getDisplayName()}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={`${styles.arrowIcon} ${showProfileDropdown ? styles.rotated : ''}`}>
              <path d="M5 7.5L10 12.5L15 7.5" stroke="#213F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {showProfileDropdown && (
            <div className={styles.profileDropdown}>
              <div className={styles.profileDropdownHeader}>
                <div className={styles.dropdownAvatar}>
                  <img 
                    src={getAvatarSrc()} 
                    alt="User avatar" 
                onError={(e) => {
                  e.currentTarget.src = getInitialsSvg(getDisplayName());
                }}
              />
                </div>
                <div className={styles.profileInfo}>
                  <div className={styles.dropdownName}>{getDisplayName()}</div>
                  <div className={styles.dropdownEmail}>{getDisplayEmail()}</div>
                </div>
              </div>
              <div className={styles.dropdownDivider}></div>
              <ul className={styles.dropdownMenu}>
                <li>
                  <button onClick={() => { navigate('/users'); setShowProfileDropdown(false); }} className={styles.dropdownItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="9" />
                      <rect x="14" y="3" width="7" height="5" />
                      <rect x="14" y="12" width="7" height="9" />
                      <rect x="3" y="16" width="7" height="5" />
                    </svg>
                    <span>Dashboard</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => { navigate('/users'); setShowProfileDropdown(false); }} className={styles.dropdownItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>Users List</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { 
                      setShowDocs(true); 
                      setSelectedArticle(docArticles[0]); 
                      setShowProfileDropdown(false); 
                    }} 
                    className={styles.dropdownItem}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    <span>Documentation</span>
                  </button>
                </li>
                <li className={styles.dropdownDivider}></li>
                <li>
                  <button 
                    onClick={() => { 
                      authService.logout(); 
                      navigate('/login'); 
                    }} 
                    className={`${styles.dropdownItem} ${styles.logoutItem}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* SEARCHABLE GLOBAL DOCUMENTATION MODAL OVERLAY */}
      {showDocs && (
        <div className={styles.docsModalOverlay} onClick={() => setShowDocs(false)}>
          <div className={styles.docsModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.docsHeader}>
              <div className={styles.docsHeaderLeft}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '10px'}}>
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#39CDCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#213F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h2>Lendsqr Operational Knowledgebase</h2>
              </div>
              <button className={styles.closeDocsBtn} onClick={() => setShowDocs(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className={styles.docsSubHeader}>
              <div className={styles.docsSearchWrapper}>
                <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search documentation (e.g. risk, loan, scoring...)" 
                  value={docsSearch}
                  onChange={(e) => setDocsSearch(e.target.value)}
                  className={styles.docsSearchInput}
                />
              </div>
              <div className={styles.docsCategoryFilter}>
                {['All', 'User Management', 'Risk Scoring', 'Loan Underwriting', 'Settlements', 'Developer API'].map(cat => (
                  <button 
                    key={cat} 
                    className={`${styles.catBtn} ${activeCategory === cat ? styles.activeCatBtn : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.docsBody}>
              <div className={styles.docsSidebar}>
                {filteredArticles.length === 0 ? (
                  <p className={styles.noArticles}>No documentation matches search criteria.</p>
                ) : (
                  filteredArticles.map(art => (
                    <div 
                      key={art.id} 
                      className={`${styles.articleCard} ${selectedArticle.id === art.id ? styles.activeArticleCard : ''}`}
                      onClick={() => setSelectedArticle(art)}
                    >
                      <span className={styles.artBadge}>{art.category}</span>
                      <h4>{art.title}</h4>
                      <p>{art.summary}</p>
                    </div>
                  ))
                )}
              </div>
              <div className={styles.docsViewer}>
                <div className={styles.viewerHeader}>
                  <span className={styles.viewerCat}>{selectedArticle.category}</span>
                  <h1>{selectedArticle.title}</h1>
                </div>
                <div className={styles.viewerContent}>
                  <p>{selectedArticle.content}</p>
                  
                  <div className={styles.tipBox}>
                    <strong>Pro-Tip for Administrators</strong>
                    <p>To execute changes corresponding to this operational article, use the sidebar panels or verify client-specific parameters inside their User Profile Detail tabs directly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
