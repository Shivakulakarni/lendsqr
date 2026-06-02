import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userService, authService } from '../services/api';
import { storageService } from '../services/storage';
import { FilterOptions, User } from '../types';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { SidebarViews } from '../components/SidebarViews';
import styles from './UsersList.module.scss';

export const UsersList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterPopoverColumn, setFilterPopoverColumn] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState({
    organization: '', username: '', email: '', phone: '', date: '', status: ''
  });
  const [actionMenuRow, setActionMenuRow] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [broadcast, setBroadcast] = useState<{ title: string; desc: string; type: 'info' | 'warning' | 'danger' } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const broadcastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentView = searchParams.get('view') || '';

  const fetchUsers = useCallback(async (p: number, pp: number, search?: string, status?: string) => {
    setLoading(true);
    setError('');
    try {
      const filters: FilterOptions = { page: p, perPage: pp, search: search || '' };
      if (status) filters.status = status as FilterOptions['status'];
      const response = await userService.getUsers(filters);
      setAllUsers(response.data);
      setTotal(response.total);
      setPage(response.page);
      setPerPage(response.perPage);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (fetchUsers) fetchUsers(page, perPage);
  }, [fetchUsers, perPage]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (broadcastTimerRef.current) clearTimeout(broadcastTimerRef.current);
    };
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilterValues({ organization: '', username: '', email: '', phone: '', date: '', status: '' });
    fetchUsers(1, perPage, query || undefined);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setActionMenuRow(null);
    setFilterPopoverColumn(null);
    fetchUsers(newPage, perPage, searchQuery || undefined);
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = parseInt(e.target.value);
    setPerPage(newPerPage);
    setFilterPopoverColumn(null);
    setActionMenuRow(null);
    fetchUsers(1, newPerPage, searchQuery || undefined);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const toggleFilter = (column: string) => {
    setActionMenuRow(null);
    setFilterPopoverColumn(prev => prev === column ? null : column);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyFilter = () => {
    setFilterPopoverColumn(null);
    fetchUsers(1, perPage, searchQuery || undefined, filterValues.status || undefined);
  };

  const handleResetFilter = () => {
    setFilterValues({ organization: '', username: '', email: '', phone: '', date: '', status: '' });
    setFilterPopoverColumn(null);
    fetchUsers(1, perPage, searchQuery || undefined);
  };

  const toggleActionMenu = (userId: string | null) => {
    setFilterPopoverColumn(null);
    setActionMenuRow(prev => prev === userId ? null : userId);
  };

  const handleViewDetails = (userId: string) => {
    setActionMenuRow(null);
    navigate(`/users/${userId}`);
  };

  const handleBlacklist = async (user: User) => {
    setActionMenuRow(null);
    const updatedUser = { ...user, status: 'blacklisted' as const };
    try {
      await storageService.init();
      await storageService.saveUser(updatedUser);
    } catch (_) { /* storage unavailable */ }
    setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
  };

  const handleActivate = async (user: User) => {
    setActionMenuRow(null);
    const updatedUser = { ...user, status: 'active' as const };
    try {
      await storageService.init();
      await storageService.saveUser(updatedUser);
    } catch (_) { /* storage unavailable */ }
    setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active': return styles.badgeActive;
      case 'inactive': return styles.badgeInactive;
      case 'pending': return styles.badgePending;
      case 'blacklisted': return styles.badgeBlacklisted;
      default: return '';
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getFilteredUsers = (): User[] => {
    let data = allUsers;
    if (filterValues.organization) {
      data = data.filter(u => u.orgName.toLowerCase().includes(filterValues.organization.toLowerCase()));
    }
    if (filterValues.username) {
      data = data.filter(u =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(filterValues.username.toLowerCase())
      );
    }
    if (filterValues.email) {
      data = data.filter(u => u.email.toLowerCase().includes(filterValues.email.toLowerCase()));
    }
    if (filterValues.phone) {
      data = data.filter(u => u.phoneNumber.includes(filterValues.phone));
    }
    if (filterValues.date) {
      data = data.filter(u => u.dateJoined.includes(filterValues.date));
    }
    return data;
  };

  const displayUsers = getFilteredUsers();

  const activeUsersCount = allUsers.filter(u => u.status === 'active').length;
  const usersWithLoansCount = allUsers.filter(u => u.numOfLoans > 0).length;
  const usersWithSavingsCount = allUsers.filter(u => u.savingsAmount > 0).length;

  const getUniqueOrgs = (): string[] => {
    const orgs = allUsers.map(u => u.orgName);
    return [...new Set(orgs)];
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMsg('');
      toastTimerRef.current = null;
    }, 3000);
  };

  const triggerBroadcast = (banner: typeof broadcast) => {
    setBroadcast(banner);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    if (banner) {
      broadcastTimerRef.current = setTimeout(() => {
        setBroadcast(null);
        broadcastTimerRef.current = null;
      }, 5000);
    }
  };

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 1) {
      if (totalPages === 1) pages.push(1);
      return pages;
    }
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    let start = Math.max(2, page - 2);
    let end = Math.min(totalPages - 1, page + 2);
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className={styles.dashboardContainer}>
      <Navbar onMenuToggle={() => setSidebarOpen(prev => !prev)} onSearch={handleSearch} />

      <div className={styles.bodyWrapper}>
        <main className={styles.mainContent}>
          {toastMsg && <div className={styles.toastAlert}>{toastMsg}</div>}
          {broadcast && (
            <div className={`${styles.broadcastBanner} ${styles[broadcast.type]}`}>
              <strong>{broadcast.title}</strong> {broadcast.desc}
            </div>
          )}

          {currentView ? (
            <SidebarViews view={currentView} triggerToast={triggerToast} triggerBroadcast={triggerBroadcast} />
          ) : (
            <>
          <div className={styles.pageTitleWrapper}>
            <h1 className={styles.pageTitle}>Users</h1>
          </div>

          {error && <div className={styles.errorBanner}>{error}</div>}

          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={`${styles.iconBadge} ${styles.iconPink}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DF18FF" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className={styles.cardLabel}>USERS</span>
              <span className={styles.cardValue}>{total.toLocaleString()}</span>
            </div>
            <div className={styles.metricCard}>
              <div className={`${styles.iconBadge} ${styles.iconPurple}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5718FF" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                </svg>
              </div>
              <span className={styles.cardLabel}>ACTIVE USERS</span>
              <span className={styles.cardValue}>{activeUsersCount.toLocaleString()}</span>
            </div>
            <div className={styles.metricCard}>
              <div className={`${styles.iconBadge} ${styles.iconOrange}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F55F44" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <span className={styles.cardLabel}>USERS WITH LOANS</span>
              <span className={styles.cardValue}>{usersWithLoansCount.toLocaleString()}</span>
            </div>
            <div className={styles.metricCard}>
              <div className={`${styles.iconBadge} ${styles.iconRed}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF3366" strokeWidth="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                  <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
                </svg>
              </div>
              <span className={styles.cardLabel}>USERS WITH SAVINGS</span>
              <span className={styles.cardValue}>{usersWithSavingsCount.toLocaleString()}</span>
            </div>
          </div>

          <div className={styles.dataCard}>
            {loading ? (
              <div className={styles.loadingSpinner}>
                <div className={styles.spinner}></div>
                <span>Loading users...</span>
              </div>
            ) : displayUsers.length === 0 && !error ? (
              <div className={styles.emptyState}>
                <span>No users found matching your criteria.</span>
                <button onClick={handleResetFilter} className={styles.resetLink}>Reset Filters</button>
              </div>
            ) : (
              <>
                <div className={styles.tableWrapper}>
                  <table className={styles.usersTable}>
                    <thead>
                      <tr>
                        {['organization', 'username', 'email', 'phone number', 'date joined', 'status'].map(col => (
                          <th key={col}>
                            <div className={styles.headerCell}>
                              <span>{col.toUpperCase()}</span>
                              <button
                                className={styles.filterIconBtn}
                                aria-label={`Filter ${col.charAt(0).toUpperCase() + col.slice(1)}`}
                                onClick={() => toggleFilter(col)}
                              >
                                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                                  <path d="M6.22222 12H9.77778V10H6.22222V12ZM0 0V2H16V0H0ZM2.66667 7H13.3333V5H2.66667V7Z" fill="#545F7D"/>
                                </svg>
                              </button>
                              {filterPopoverColumn === col && (
                                <div className={styles.filterPopover} onClick={(e) => e.stopPropagation()}>
                                  <div className={styles.filterFormGroup}>
                                    <label className={styles.filterLabel}>Organization</label>
                                    <select
                                      className={styles.filterSelect}
                                      value={filterValues.organization}
                                      onChange={(e) => handleFilterChange('organization', e.target.value)}
                                    >
                                      <option value="">Select</option>
                                      {getUniqueOrgs().map(org => (
                                        <option key={org} value={org}>{org}</option>
                                      ))}
                                    </select>
                                  </div>
                                  
                                  <div className={styles.filterFormGroup}>
                                    <label className={styles.filterLabel}>Username</label>
                                    <input
                                      className={styles.filterInput}
                                      placeholder="Username"
                                      value={filterValues.username}
                                      onChange={(e) => handleFilterChange('username', e.target.value)}
                                    />
                                  </div>

                                  <div className={styles.filterFormGroup}>
                                    <label className={styles.filterLabel}>Email</label>
                                    <input
                                      className={styles.filterInput}
                                      placeholder="Email"
                                      value={filterValues.email}
                                      onChange={(e) => handleFilterChange('email', e.target.value)}
                                    />
                                  </div>

                                  <div className={styles.filterFormGroup}>
                                    <label className={styles.filterLabel}>Phone Number</label>
                                    <input
                                      className={styles.filterInput}
                                      placeholder="Phone Number"
                                      value={filterValues.phone}
                                      onChange={(e) => handleFilterChange('phone', e.target.value)}
                                    />
                                  </div>

                                  <div className={styles.filterFormGroup}>
                                    <label className={styles.filterLabel}>Date</label>
                                    <input
                                      type="date"
                                      className={styles.filterInput}
                                      value={filterValues.date}
                                      onChange={(e) => handleFilterChange('date', e.target.value)}
                                    />
                                  </div>

                                  <div className={styles.filterFormGroup}>
                                    <label className={styles.filterLabel}>Status</label>
                                    <select
                                      className={styles.filterSelect}
                                      value={filterValues.status}
                                      onChange={(e) => handleFilterChange('status', e.target.value)}
                                    >
                                      <option value="">Select</option>
                                      <option value="active">Active</option>
                                      <option value="inactive">Inactive</option>
                                      <option value="pending">Pending</option>
                                      <option value="blacklisted">Blacklisted</option>
                                    </select>
                                  </div>

                                  <div className={styles.filterButtons}>
                                    <button onClick={handleResetFilter} className={styles.filterResetBtn}>Reset</button>
                                    <button onClick={handleApplyFilter} className={styles.filterSubmitBtn}>Filter</button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </th>
                        ))}
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayUsers.map(user => (
                        <tr key={user.id} className={styles.userRow} onClick={() => navigate(`/users/${user.id}`)}>
                          <td className={styles.boldCell}>{user.orgName}</td>
                          <td>{user.firstName} {user.lastName}</td>
                          <td>{user.email}</td>
                          <td>{user.phoneNumber}</td>
                          <td>{formatDate(user.dateJoined)}</td>
                          <td>
                            <span className={`${styles.badge} ${getStatusClass(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className={styles.actionCell} onClick={(e) => e.stopPropagation()}>
                            <button
                              className={styles.actionDots}
                              onClick={() => toggleActionMenu(user.id)}
                              aria-label="Actions"
                            >
                              <svg width="4" height="16" viewBox="0 0 4 16" fill="none">
                                <path d="M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z" fill="#545F7D"/>
                              </svg>
                            </button>
                            {actionMenuRow === user.id && (
                              <div className={styles.rowActionMenu}>
                                <button className={styles.menuItem} onClick={() => handleViewDetails(user.id)}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#545F7D" strokeWidth="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                  <span>View Details</span>
                                </button>
                                <button className={styles.menuItem} onClick={() => handleBlacklist(user)}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#545F7D" strokeWidth="2">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                                    <line x1="18" y1="8" x2="23" y2="13" />
                                    <line x1="23" y1="8" x2="18" y2="13" />
                                  </svg>
                                  <span>Blacklist User</span>
                                </button>
                                <button className={styles.menuItem} onClick={() => handleActivate(user)}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#545F7D" strokeWidth="2">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                                    <polyline points="17 11 19 13 23 9" />
                                  </svg>
                                  <span>Activate User</span>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className={styles.paginationSection}>
                  <div className={styles.paginationInfo}>
                    <span>Showing</span>
                    <select className={styles.perPageSelect} value={perPage} onChange={handlePerPageChange}>
                      <option value="7">7</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                    <span>out of {total.toLocaleString()}</span>
                  </div>

                  <div className={styles.paginationControls}>
                    <button className={styles.pagBtn} onClick={() => handlePageChange(1)} disabled={page === 1} aria-label="First page">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="#545F7D">
                        <polyline points="11,3 6,8 11,13" fill="none" stroke="#545F7D" strokeWidth="1.5" strokeLinecap="round"/>
                        <line x1="5" y1="3" x2="5" y2="13" stroke="#545F7D" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <button className={styles.pagBtn} onClick={() => handlePageChange(page - 1)} disabled={page === 1} aria-label="Previous page">
                      <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                        <path d="M6 1L1 6L6 11" stroke="#545F7D" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                    {getPageNumbers().map((p, idx) =>
                      typeof p === 'string' ? (
                        <span key={`e-${idx}`} className={styles.pagBtn} style={{ background: 'none', cursor: 'default' }}>...</span>
                      ) : (
                        <button key={p} className={`${styles.pagBtn} ${p === page ? styles.pagBtnActive : ''}`} onClick={() => handlePageChange(p)}>
                          {p}
                        </button>
                      )
                    )}
                    <button className={styles.pagBtn} onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} aria-label="Next page">
                      <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                        <path d="M2 1L7 6L2 11" stroke="#545F7D" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <button className={styles.pagBtn} onClick={() => handlePageChange(totalPages)} disabled={page === totalPages} aria-label="Last page">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="#545F7D">
                        <polyline points="5,3 10,8 5,13" fill="none" stroke="#545F7D" strokeWidth="1.5" strokeLinecap="round"/>
                        <line x1="11" y1="3" x2="11" y2="13" stroke="#545F7D" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </>
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

export default UsersList;
