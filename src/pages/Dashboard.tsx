import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import styles from './Dashboard.module.scss';

export const Dashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className={styles.dashboardContainer}>
      <Navbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />

      <div className={styles.bodyWrapper}>
        <Sidebar isOpen={sidebarOpen} activePath="/dashboard" onLogout={handleLogout} />

        <main className={styles.mainContent}>
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Welcome back!</h2>
              {user && <p className={styles.cardSubtitle}>Logged in as: {user.email}</p>}
            </div>

            <div className={styles.cardContent}>
              <p className={styles.cardText}>
                This is your Lendsqr Administration Dashboard. Navigate to the Users section to view and manage customer information.
              </p>

              <div className={styles.buttonGroup}>
                <button
                  onClick={() => navigate('/users')}
                  className={styles.primaryButton}
                >
                  View Users List
                </button>
              </div>
            </div>
          </div>

          <div className={styles.dashboardStats}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>500</div>
              <div className={styles.statLabel}>Total Users</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>100%</div>
              <div className={styles.statLabel}>Database Ready</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
