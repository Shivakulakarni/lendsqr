import React, { useState, useEffect } from 'react';
import styles from './SidebarViews.module.scss';

interface SidebarViewsProps {
  view: string;
  triggerToast: (msg: string) => void;
  triggerBroadcast: (banner: { title: string; desc: string; type: 'info' | 'warning' | 'danger' } | null) => void;
}

export const SidebarViews = ({ view, triggerToast, triggerBroadcast }: SidebarViewsProps) => {
  // Shared Dynamic Mock Data Lists
  const [guarantors, setGuarantors] = useState([
    { id: 'G-01', name: 'Sarah Johnson', email: 'sarah.j@example.com', phone: '+2348083902901', relationship: 'Sister', verified: true, userId: 'USER-00042' },
    { id: 'G-02', name: 'Michael Williams', email: 'williams.m@example.com', phone: '+2348039201992', relationship: 'Parent', verified: false, userId: 'USER-00108' },
    { id: 'G-03', name: 'David Smith', email: 'david.smith@example.com', phone: '+2348057201928', relationship: 'Colleague', verified: true, userId: 'USER-00249' },
  ]);

  const [loans, setLoans] = useState([
    { id: 'L-100', user: 'Adedeji Balogun', amount: 150000, product: 'Dev Loan', duration: 12, rate: 5, status: 'disbursed' },
    { id: 'L-101', user: 'Jane Doe', amount: 250000, product: 'Medium Term', duration: 6, rate: 8, status: 'pending' },
    { id: 'L-102', user: 'Chidi Benson', amount: 80000, product: 'Short Term', duration: 3, rate: 4, status: 'repaid' },
  ]);

  const [loanProducts, setLoanProducts] = useState([
    { id: 'LP-01', name: 'Short Term Quick Loan', rate: 4.5, minAmount: 10000, maxAmount: 100000, duration: 3 },
    { id: 'LP-02', name: 'Medium Term Dev Loan', rate: 7.2, minAmount: 50000, maxAmount: 500000, duration: 12 },
    { id: 'LP-03', name: 'Corporate Business Loan', rate: 9.5, minAmount: 1000000, maxAmount: 10000000, duration: 24 },
  ]);

  const [savingsProducts] = useState([
    { id: 'SP-01', name: 'Regular Target Savings', yieldRate: 6.8, lockPeriod: 'None', minDeposit: 1000 },
    { id: 'SP-02', name: 'Fixed Wealth Deposit', yieldRate: 11.5, lockPeriod: '12 Months', minDeposit: 10000 },
  ]);

  const [whitelisted, setWhitelisted] = useState([
    { id: 'W-01', email: 'verified.merchant@gmail.com', phone: '+2348011223344', dateAdded: '2026-05-10', notes: 'Top corporate partner' },
    { id: 'W-02', email: 'lendsqr.director@lendsqr.com', phone: '+2348099887766', dateAdded: '2026-05-22', notes: 'Internal administrator clearance' },
  ]);

  const [karmaList, setKarmaList] = useState([
    { id: 'K-01', identity: 'fraud.buyer@yahoo.com', type: 'Card Chargeback', riskScore: 92, dateFlagged: '2026-04-18' },
    { id: 'K-02', identity: '+2348055443322', type: 'Identity Theft', riskScore: 98, dateFlagged: '2026-05-02' },
  ]);

  const [transactions] = useState([
    { id: 'TXN-9081', user: 'Adedeji Balogun', amount: 15000, type: 'Disbursal', date: '2026-06-01 10:14', status: 'success' },
    { id: 'TXN-9080', user: 'Jane Doe', amount: 8500, type: 'Repayment', date: '2026-05-30 18:22', status: 'success' },
    { id: 'TXN-9079', user: 'Chidi Benson', amount: 50000, type: 'Card Deposit', date: '2026-05-29 09:41', status: 'failed' },
    { id: 'TXN-9078', user: 'David Smith', amount: 12000, type: 'Interest Yield', date: '2026-05-28 23:59', status: 'success' },
  ]);

  const [requests, setRequests] = useState([
    { id: 'REQ-01', applicant: 'Obinna Eze', amount: 200000, product: 'Dev Loan', date: '2026-06-01', score: 720 },
    { id: 'REQ-02', applicant: 'Amara Nwachukwu', amount: 50000, product: 'Short Term', date: '2026-05-31', score: 580 },
    { id: 'REQ-03', applicant: 'Tunde Yusuf', amount: 350000, product: 'Corporate Loan', date: '2026-05-30', score: 810 },
  ]);

  const [services, setServices] = useState([
    { id: 'SRV-01', name: 'Identity Verification (BVN/NIN)', uptime: '99.96%', latency: '240ms', status: 'active' },
    { id: 'SRV-02', name: 'Payment Gateway (Credit Cards)', uptime: '99.84%', latency: '180ms', status: 'active' },
    { id: 'SRV-03', name: 'Sms/Email Gateway Node', uptime: '100%', latency: '95ms', status: 'active' },
  ]);

  // Credit Scoring Weights State
  const [coefAge, setCoefAge] = useState(25);
  const [coefIncome, setCoefIncome] = useState(45);
  const [coefHistory, setCoefHistory] = useState(30);
  const [scoresCalculated, setScoresCalculated] = useState(false);

  // Interest calculator states
  const [calcDeposit, setCalcDeposit] = useState(50000);
  const [calcRate, setCalcRate] = useState(8);
  const [calcDuration, setCalcDuration] = useState(3); // years

  // Wallet top-up state
  const [walletBalance, setWalletBalance] = useState(4829000); // Kobo / Naira base
  const [topupAmount, setTopupAmount] = useState('');

  // Report generator state
  const [reportProgress, setReportProgress] = useState(-1);
  const [reportType, setReportType] = useState('revenue');

  // Preferences toggles
  const [prefDark, setPrefDark] = useState(false);
  const [prefSlack, setPrefSlack] = useState(true);
  const [prefTfa, setPrefTfa] = useState(false);
  const [prefMaint, setPrefMaint] = useState(false);

  // Form Fields State
  const [newGuarantor, setNewGuarantor] = useState({ name: '', email: '', phone: '', relationship: '', userId: '' });
  const [newLoan, setNewLoan] = useState({ user: '', amount: '', product: 'Short Term', duration: '6', rate: '5' });
  const [newProduct, setNewProduct] = useState({ name: '', rate: '', minAmount: '', maxAmount: '', duration: '' });
  const [newWhitelist, setNewWhitelist] = useState({ email: '', phone: '', notes: '' });
  const [newKarma, setNewKarma] = useState({ identity: '', type: 'Card Chargeback', riskScore: '75' });
  const [newBroadcast, setNewBroadcast] = useState({ title: '', desc: '', type: 'info' });

  // 1. SYSTEM ANALYTICS DASHBOARD
  const renderDashboard = () => (
    <div className={styles.panelContainer}>
      <div className={styles.viewHeader}>
        <h2>System Analytics Dashboard</h2>
        <p>Live visual and financial tracking center for Lendsqr engines.</p>
      </div>

      <div className={styles.metricGrid}>
        <div className={styles.metricCard}>
          <div className={styles.iconBadge}>₦</div>
          <div className={styles.cardLabel}>TOTAL LIQUID DISBURSED</div>
          <div className={styles.statsBig}>₦143,200,000</div>
          <span className={`${styles.trendBadge} ${styles.up}`}>↑ 14.2% YoY</span>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.iconBadge}>⚡</div>
          <div className={styles.cardLabel}>DAILY TRANSVOL</div>
          <div className={styles.statsBig}>₦24,890,200</div>
          <span className={`${styles.trendBadge} ${styles.up}`}>↑ 8.4% this week</span>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.iconBadge}>⚠</div>
          <div className={styles.cardLabel}>DEFAULT RATE RATIO</div>
          <div className={styles.statsBig}>0.48%</div>
          <span className={`${styles.trendBadge} ${styles.down}`}>↓ 0.12% decrease</span>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <h3>Volume Outflow Trends (2026)</h3>
          <span style={{ fontSize: '12px', color: '#545F7D' }}>Updated live at {new Date().toLocaleTimeString()}</span>
        </div>
        
        <svg className={styles.svgChart} viewBox="0 0 800 200">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#39CDCC" />
              <stop offset="100%" stopColor="#39CDCC" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          <line x1="50" y1="20" x2="780" y2="20" className={styles.gridLine} />
          <line x1="50" y1="60" x2="780" y2="60" className={styles.gridLine} />
          <line x1="50" y1="100" x2="780" y2="100" className={styles.gridLine} />
          <line x1="50" y1="140" x2="780" y2="140" className={styles.gridLine} />
          <line x1="50" y1="170" x2="780" y2="170" className={styles.gridLine} />

          {/* Spark area */}
          <path d="M 50 170 Q 150 130, 250 145 T 450 60 T 650 90 T 780 30 L 780 170 Z" className={styles.areaFill} />

          {/* Outflow line chart */}
          <path d="M 50 170 Q 150 130, 250 145 T 450 60 T 650 90 T 780 30" className={styles.chartLine} />

          {/* Dots */}
          <circle cx="50" cy="170" r="4" className={styles.dataPoint} />
          <circle cx="178" cy="130" r="4" className={styles.dataPoint} />
          <circle cx="300" cy="142" r="4" className={styles.dataPoint} />
          <circle cx="430" cy="62" r="4" className={styles.dataPoint} />
          <circle cx="560" cy="95" r="4" className={styles.dataPoint} />
          <circle cx="780" cy="30" r="4" className={styles.dataPoint} />

          {/* Labels */}
          <text x="50" y="190" className={styles.axisText}>Jan</text>
          <text x="178" y="190" className={styles.axisText}>Feb</text>
          <text x="300" y="190" className={styles.axisText}>Mar</text>
          <text x="430" y="190" className={styles.axisText}>Apr</text>
          <text x="560" y="190" className={styles.axisText}>May</text>
          <text x="780" y="190" className={styles.axisText}>Jun</text>
        </svg>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeaderActions}>
          <h3>Administrative Ledger</h3>
          <button onClick={() => triggerToast('Real-time ledger synced with core payment node.')} className={styles.btnSecondary}>Sync Core Gateway</button>
        </div>
        <table className={styles.customTable}>
          <thead>
            <tr>
              <th>BATCH ID</th>
              <th>OPERATOR</th>
              <th>ACTION DECLARED</th>
              <th>VOLUME</th>
              <th>SYSTEM TIME</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.textBold}>OP-09882</td>
              <td>Adedeji Balogun</td>
              <td>Initiated Batch Settlement Disbursal</td>
              <td className={styles.textBold}>₦4,890,000</td>
              <td>10 mins ago</td>
            </tr>
            <tr>
              <td className={styles.textBold}>OP-09881</td>
              <td>System Automator</td>
              <td>Dynamic Interest Ledger Accrued</td>
              <td className={styles.textBold}>₦243,100</td>
              <td>1 hour ago</td>
            </tr>
            <tr>
              <td className={styles.textBold}>OP-09880</td>
              <td>Adedeji Balogun</td>
              <td>Blacklisted user fraud alert (BVN check)</td>
              <td>-</td>
              <td>2 hours ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  // 2. GUARANTORS VIEW
  const handleAddGuarantor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuarantor.name || !newGuarantor.email) return;
    const item = {
      id: `G-0${guarantors.length + 1}`,
      name: newGuarantor.name,
      email: newGuarantor.email,
      phone: newGuarantor.phone || '+2348030000000',
      relationship: newGuarantor.relationship || 'Friend',
      verified: false,
      userId: newGuarantor.userId || 'USER-00999',
    };
    setGuarantors([item, ...guarantors]);
    setNewGuarantor({ name: '', email: '', phone: '', relationship: '', userId: '' });
    triggerToast(`Guarantor "${item.name}" registered successfully.`);
  };

  const toggleVerifyGuarantor = (id: string) => {
    setGuarantors(guarantors.map(g => g.id === id ? { ...g, verified: !g.verified } : g));
    triggerToast('Guarantor verification status changed.');
  };

  const renderGuarantors = () => (
    <div className={styles.panelContainer}>
      <div className={styles.viewHeader}>
        <h2>Guarantors Management Directory</h2>
        <p>Audit loan security profiles and associate primary collateral contacts.</p>
      </div>

      <div className={styles.interactiveLayout}>
        <div className={styles.tableContainer}>
          <div className={styles.tableHeaderActions}>
            <h3>Active Guarantors Directory</h3>
          </div>
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>GUARANTOR</th>
                <th>CONTACT EMAIL</th>
                <th>RELATIONSHIP</th>
                <th>ASSOCIATED USER ID</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {guarantors.map(g => (
                <tr key={g.id}>
                  <td className={styles.textBold}>{g.name}</td>
                  <td>{g.email}<br /><small style={{ color: '#545F7D' }}>{g.phone}</small></td>
                  <td>{g.relationship}</td>
                  <td className={styles.textBold}>{g.userId}</td>
                  <td>
                    <span className={`${styles.badge} ${g.verified ? styles.active : styles.pending}`}>
                      {g.verified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => toggleVerifyGuarantor(g.id)} className={styles.btnSecondary}>
                      {g.verified ? 'Revoke Verify' : 'Verify Contact'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.formCard}>
          <h3>Register New Guarantor</h3>
          <form onSubmit={handleAddGuarantor} className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Guarantor Full Name</label>
              <input type="text" value={newGuarantor.name} onChange={e => setNewGuarantor({ ...newGuarantor, name: e.target.value })} placeholder="John Doe" required />
            </div>
            <div className={styles.formGroup}>
              <label>Contact Email</label>
              <input type="email" value={newGuarantor.email} onChange={e => setNewGuarantor({ ...newGuarantor, email: e.target.value })} placeholder="john@example.com" required />
            </div>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input type="text" value={newGuarantor.phone} onChange={e => setNewGuarantor({ ...newGuarantor, phone: e.target.value })} placeholder="+2348000000000" />
            </div>
            <div className={styles.formGroup}>
              <label>Relationship</label>
              <select value={newGuarantor.relationship} onChange={e => setNewGuarantor({ ...newGuarantor, relationship: e.target.value })}>
                <option value="Sibling">Sibling</option>
                <option value="Parent">Parent</option>
                <option value="Spouse">Spouse</option>
                <option value="Colleague">Colleague</option>
                <option value="Friend">Friend</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Associated User ID</label>
              <input type="text" value={newGuarantor.userId} onChange={e => setNewGuarantor({ ...newGuarantor, userId: e.target.value })} placeholder="USER-00042" />
            </div>
            <button type="submit" className={`${styles.btnSubmit} ${styles.fullWidth}`}>Add Guarantor Profile</button>
          </form>
        </div>
      </div>
    </div>
  );

  // 3. LOANS VIEW
  const handleDisburseLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoan.user || !newLoan.amount) return;
    const loan = {
      id: `L-${loans.length + 100}`,
      user: newLoan.user,
      amount: parseFloat(newLoan.amount),
      product: newLoan.product,
      duration: parseInt(newLoan.duration),
      rate: parseFloat(newLoan.rate),
      status: 'pending',
    };
    setLoans([loan, ...loans]);
    setNewLoan({ user: '', amount: '', product: 'Short Term', duration: '6', rate: '5' });
    triggerToast(`Loan application generated for "${loan.user}".`);
  };

  const changeLoanStatus = (id: string, newStatus: string) => {
    setLoans(loans.map(l => l.id === id ? { ...l, status: newStatus } : l));
    triggerToast(`Loan status updated to ${newStatus}.`);
  };

  const renderLoans = () => (
    <div className={styles.panelContainer}>
      <div className={styles.viewHeader}>
        <h2>Loans Catalog & Disbursals</h2>
        <p>Draft new administrative credit lines and disburse funds to eligible profiles.</p>
      </div>

      <div className={styles.interactiveLayout}>
        <div className={styles.tableContainer}>
          <div className={styles.tableHeaderActions}>
            <h3>Active Disbursed Loans</h3>
          </div>
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>LOAN ID</th>
                <th>CUSTOMER</th>
                <th>PRINCIPAL</th>
                <th>PRODUCT TYPE</th>
                <th>PLAN SUMMARY</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loans.map(l => (
                <tr key={l.id}>
                  <td className={styles.textBold}>{l.id}</td>
                  <td className={styles.textBold}>{l.user}</td>
                  <td>₦{l.amount.toLocaleString()}</td>
                  <td>{l.product}</td>
                  <td>{l.duration} mos @ {l.rate}%</td>
                  <td>
                    <span className={`${styles.badge} ${l.status === 'disbursed' ? styles.active : l.status === 'repaid' ? styles.inactive : styles.pending}`}>
                      {l.status}
                    </span>
                  </td>
                  <td>
                    {l.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => changeLoanStatus(l.id, 'disbursed')} className={styles.btnSecondary}>Disburse</button>
                        <button onClick={() => changeLoanStatus(l.id, 'rejected')} className={`${styles.btnActionIcon} ${styles.delete}`}>✕</button>
                      </div>
                    ) : l.status === 'disbursed' ? (
                      <button onClick={() => changeLoanStatus(l.id, 'repaid')} className={styles.btnSecondary}>Mark Repaid</button>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.formCard}>
          <h3>Issue Dynamic Loan Plan</h3>
          <form onSubmit={handleDisburseLoan} className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Recipient Username</label>
              <input type="text" value={newLoan.user} onChange={e => setNewLoan({ ...newLoan, user: e.target.value })} placeholder="Adedeji Balogun" required />
            </div>
            <div className={styles.formGroup}>
              <label>Principal Amount (₦)</label>
              <input type="number" value={newLoan.amount} onChange={e => setNewLoan({ ...newLoan, amount: e.target.value })} placeholder="150000" required />
            </div>
            <div className={styles.formGroup}>
              <label>Select Product Rule</label>
              <select value={newLoan.product} onChange={e => setNewLoan({ ...newLoan, product: e.target.value })}>
                <option value="Short Term">Short Term Quick</option>
                <option value="Medium Term">Medium Term Dev</option>
                <option value="Dev Loan">Dev Capital</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Interest Rate (% Monthly)</label>
              <input type="number" value={newLoan.rate} onChange={e => setNewLoan({ ...newLoan, rate: e.target.value })} placeholder="5" />
            </div>
            <div className={styles.formGroup}>
              <label>Duration Plan (Months)</label>
              <select value={newLoan.duration} onChange={e => setNewLoan({ ...newLoan, duration: e.target.value })}>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
              </select>
            </div>
            <button type="submit" className={`${styles.btnSubmit} ${styles.fullWidth}`}>Create Credit Application</button>
          </form>
        </div>
      </div>
    </div>
  );

  // 4. DECISION MODELS
  const runScoringSimulation = () => {
    setScoresCalculated(true);
    triggerToast('Dynamic credit score rules calculated and updated.');
  };

  const renderDecision = () => (
    <div className={styles.panelContainer}>
      <div className={styles.viewHeader}>
        <h2>Credit Scoring Rules Configurator</h2>
        <p>Configure administrative coefficient models and run real-time user risk scoring simulations.</p>
      </div>

      <div className={styles.interactiveLayout}>
        <div className={styles.sliderCard}>
          <h3>Rule Weights Coefficient Settings</h3>
          
          <div className={styles.sliderGroup}>
            <div className={styles.sliderLabel}>
              <span>Age Factor Weight</span>
              <span>{coefAge}%</span>
            </div>
            <input type="range" min="0" max="100" value={coefAge} onChange={e => {
              const val = parseInt(e.target.value);
              setCoefAge(val);
              setScoresCalculated(false);
            }} />
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderLabel}>
              <span>Income / Debt-to-Revenue Weight</span>
              <span>{coefIncome}%</span>
            </div>
            <input type="range" min="0" max="100" value={coefIncome} onChange={e => {
              const val = parseInt(e.target.value);
              setCoefIncome(val);
              setScoresCalculated(false);
            }} />
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderLabel}>
              <span>Repayment Ledger History Weight</span>
              <span>{coefHistory}%</span>
            </div>
            <input type="range" min="0" max="100" value={coefHistory} onChange={e => {
              const val = parseInt(e.target.value);
              setCoefHistory(val);
              setScoresCalculated(false);
            }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className={styles.simulationStatus}>
              Total coefficient integrity: <strong>{coefAge + coefIncome + coefHistory}%</strong>
              {coefAge + coefIncome + coefHistory !== 100 && (
                <span style={{ color: '#E4033B', display: 'block', marginTop: '6px' }}>✕ Weights must sum to 100% to deploy rules.</span>
              )}
            </div>
            <button onClick={runScoringSimulation} disabled={coefAge + coefIncome + coefHistory !== 100} className={styles.btnSubmit}>Run Simulated Scoring Model</button>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.tableHeaderActions}>
            <h3>Simulation Scoring Output</h3>
          </div>
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>APPLICANT</th>
                <th>REVENUE INPUT</th>
                <th>DRAFT CREDIT SCORE</th>
                <th>DECISION OUTCOME</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.textBold}>Obinna Eze</td>
                <td>₦450,000 / mo</td>
                <td className={styles.textBold} style={{ color: scoresCalculated ? '#39CDCC' : '#545F7D' }}>
                  {scoresCalculated ? Math.floor(650 + (coefIncome * 2.5) + (coefHistory * 3)) : '710'}
                </td>
                <td>
                  <span className={`${styles.badge} ${styles.active}`}>Auto-Approved</span>
                </td>
              </tr>
              <tr>
                <td className={styles.textBold}>Amara Nwachukwu</td>
                <td>₦120,000 / mo</td>
                <td className={styles.textBold} style={{ color: scoresCalculated ? '#E4033B' : '#545F7D' }}>
                  {scoresCalculated ? Math.floor(400 + (coefIncome * 1.5) + (coefAge * 1)) : '480'}
                </td>
                <td>
                  <span className={`${styles.badge} ${styles.pending}`}>Manual Audit</span>
                </td>
              </tr>
              <tr>
                <td className={styles.textBold}>Tunde Yusuf</td>
                <td>₦950,000 / mo</td>
                <td className={styles.textBold} style={{ color: scoresCalculated ? '#39CDCC' : '#545F7D' }}>
                  {scoresCalculated ? Math.floor(700 + (coefIncome * 2.2) + (coefHistory * 2.8)) : '830'}
                </td>
                <td>
                  <span className={`${styles.badge} ${styles.active}`}>Auto-Approved</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // 5. SAVINGS
  const renderSavings = () => {
    const projectedYield = calcDeposit * Math.pow(1 + (calcRate / 100), calcDuration);
    const profit = projectedYield - calcDeposit;

    return (
      <div className={styles.panelContainer}>
        <div className={styles.viewHeader}>
          <h2>Savings Product Yield Calculator</h2>
          <p>Compound interest modeling calculator and active target savings configurations.</p>
        </div>

        <div className={styles.interactiveLayout}>
          <div className={styles.formCard}>
            <h3>Target Yield Planner</h3>
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label>Principal Deposit (₦)</label>
                <input type="number" value={calcDeposit} onChange={e => setCalcDeposit(parseFloat(e.target.value) || 0)} />
              </div>
              <div className={styles.formGroup}>
                <label>Annual Interest Yield (%)</label>
                <input type="number" value={calcRate} onChange={e => setCalcRate(parseFloat(e.target.value) || 0)} />
              </div>
              <div className={styles.formGroup}>
                <label>Investment Term (Years)</label>
                <select value={calcDuration} onChange={e => setCalcDuration(parseInt(e.target.value))}>
                  <option value="1">1 Year</option>
                  <option value="2">2 Years</option>
                  <option value="3">3 Years</option>
                  <option value="5">5 Years</option>
                </select>
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`} style={{ marginTop: '16px', backgroundColor: '#fcfcfd', padding: '16px', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                <span style={{ fontSize: '13px', color: '#545F7D' }}>Projected Yield Projection:</span>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#213F7D', margin: '6px 0' }}>₦{projectedYield.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                <span style={{ fontSize: '12px', color: '#39CDCC', fontWeight: 600 }}>↑ Net Interest Accrued: ₦{profit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <div className={styles.tableHeaderActions}>
              <h3>Yield Tier Products Pool</h3>
            </div>
            <table className={styles.customTable}>
              <thead>
                <tr>
                  <th>SAVINGS PRODUCT</th>
                  <th>ANNUAL YIELD</th>
                  <th>MINIMUM BALANCE</th>
                  <th>LOCKUP PERIOD</th>
                </tr>
              </thead>
              <tbody>
                {savingsProducts.map(s => (
                  <tr key={s.id}>
                    <td className={styles.textBold}>{s.name}</td>
                    <td style={{ color: '#39CDCC', fontWeight: 600 }}>{s.yieldRate}% APY</td>
                    <td>₦{s.minDeposit.toLocaleString()}</td>
                    <td>{s.lockPeriod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 6. LOAN REQUESTS
  const handleUpdateRequestStatus = (id: string, action: 'approve' | 'reject') => {
    setRequests(requests.filter(r => r.id !== id));
    triggerToast(`Loan Request ${id} ${action === 'approve' ? 'Approved & Disbursed' : 'Rejected'}.`);
  };

  const renderLoanRequests = () => (
    <div className={styles.panelContainer}>
      <div className={styles.viewHeader}>
        <h2>Pending Credit Approvals Board</h2>
        <p>Process pending applications and trigger immediate API payouts.</p>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeaderActions}>
          <h3>Active Request Approvals Board ({requests.length})</h3>
        </div>
        {requests.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#545F7D' }}>
            <p>All loan applications processed successfully!</p>
          </div>
        ) : (
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>REQUEST ID</th>
                <th>APPLICANT PROFILE</th>
                <th>PRINCIPAL</th>
                <th>PRODUCT RULE</th>
                <th>DRAFT CREDIT SCORE</th>
                <th>SUBMISSION TIME</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td className={styles.textBold}>{r.id}</td>
                  <td className={styles.textBold}>{r.applicant}</td>
                  <td>₦{r.amount.toLocaleString()}</td>
                  <td>{r.product}</td>
                  <td>
                    <span className={`${styles.badge} ${r.score >= 700 ? styles.active : r.score >= 600 ? styles.pending : styles.blacklisted}`}>
                      {r.score}
                    </span>
                  </td>
                  <td>{r.date}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleUpdateRequestStatus(r.id, 'approve')} className={styles.btnSecondary} style={{ color: '#39CDCC', borderColor: '#39CDCC' }}>Approve</button>
                      <button onClick={() => handleUpdateRequestStatus(r.id, 'reject')} className={styles.btnSecondary} style={{ color: '#E4033B', borderColor: '#E4033B' }}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  // 7. WHITELIST
  const handleAddWhitelist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWhitelist.email && !newWhitelist.phone) return;
    const item = {
      id: `W-0${whitelisted.length + 1}`,
      email: newWhitelist.email || '-',
      phone: newWhitelist.phone || '-',
      dateAdded: new Date().toISOString().split('T')[0],
      notes: newWhitelist.notes || 'Manually approved',
    };
    setWhitelisted([item, ...whitelisted]);
    setNewWhitelist({ email: '', phone: '', notes: '' });
    triggerToast('Identifier appended to global Whitelist.');
  };

  const handleRemoveWhitelist = (id: string) => {
    setWhitelisted(whitelisted.filter(w => w.id !== id));
    triggerToast('Identifier removed from Whitelist.');
  };

  const renderWhitelist = () => (
    <div className={styles.panelContainer}>
      <div className={styles.viewHeader}>
        <h2>Whitelist Managers</h2>
        <p>Exempt highly trusted customers or merchants from default system risk flags.</p>
      </div>

      <div className={styles.interactiveLayout}>
        <div className={styles.tableContainer}>
          <div className={styles.tableHeaderActions}>
            <h3>Active Whitelisted Identifiers</h3>
          </div>
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>IDENTITY IDENTIFIER</th>
                <th>DATE ADDED</th>
                <th>ADMINISTRATIVE MEMO</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {whitelisted.map(w => (
                <tr key={w.id}>
                  <td>
                    <span className={styles.textBold}>{w.email}</span>
                    {w.phone !== '-' && <div style={{ fontSize: '12px', color: '#545F7D' }}>{w.phone}</div>}
                  </td>
                  <td>{w.dateAdded}</td>
                  <td>{w.notes}</td>
                  <td>
                    <button onClick={() => handleRemoveWhitelist(w.id)} className={`${styles.btnActionIcon} ${styles.delete}`} aria-label="Delete">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.formCard}>
          <h3>Add Trusted Identifier</h3>
          <form onSubmit={handleAddWhitelist} className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Customer Email Address</label>
              <input type="email" value={newWhitelist.email} onChange={e => setNewWhitelist({ ...newWhitelist, email: e.target.value })} placeholder="trusted.merchant@gmail.com" />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Phone Number (Optional)</label>
              <input type="text" value={newWhitelist.phone} onChange={e => setNewWhitelist({ ...newWhitelist, phone: e.target.value })} placeholder="+2348000000000" />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Administrative Memo</label>
              <textarea value={newWhitelist.notes} onChange={e => setNewWhitelist({ ...newWhitelist, notes: e.target.value })} placeholder="Internal Director clearance" />
            </div>
            <button type="submit" className={`${styles.btnSubmit} ${styles.fullWidth}`}>Whitelist Identifier</button>
          </form>
        </div>
      </div>
    </div>
  );

  // 8. KARMA
  const handleAddKarma = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKarma.identity) return;
    const item = {
      id: `K-0${karmaList.length + 1}`,
      identity: newKarma.identity,
      type: newKarma.type,
      riskScore: parseInt(newKarma.riskScore) || 80,
      dateFlagged: new Date().toISOString().split('T')[0],
    };
    setKarmaList([item, ...karmaList]);
    setNewKarma({ identity: '', type: 'Card Chargeback', riskScore: '75' });
    triggerToast(`Identifier "${item.identity}" listed on Karma Database.`);
  };

  const handlePardonKarma = (id: string) => {
    setKarmaList(karmaList.filter(k => k.id !== id));
    triggerToast('Identifier pardoned and cleared.');
  };

  const renderKarma = () => (
    <div className={styles.panelContainer}>
      <div className={styles.viewHeader}>
        <h2>Karma Flagged Database</h2>
        <p>Global blacklist tracker preventing fraudulent entities from acquiring lines of credit.</p>
      </div>

      <div className={styles.interactiveLayout}>
        <div className={styles.tableContainer}>
          <div className={styles.tableHeaderActions}>
            <h3>Active Karma Flags blacklist</h3>
          </div>
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>BLACKLISTED IDENTIFIER</th>
                <th>INFRACTION EXECUTED</th>
                <th>RISK SEVERITY SCORE</th>
                <th>DATE BLACKLISTED</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {karmaList.map(k => (
                <tr key={k.id}>
                  <td className={styles.textBold}>{k.identity}</td>
                  <td>{k.type}</td>
                  <td>
                    <span className={`${styles.badge} ${styles.blacklisted}`}>
                      {k.riskScore}% severity
                    </span>
                  </td>
                  <td>{k.dateFlagged}</td>
                  <td>
                    <button onClick={() => handlePardonKarma(k.id)} className={styles.btnSecondary}>Pardon</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.formCard}>
          <h3>Report Fraudulent Infraction</h3>
          <form onSubmit={handleAddKarma} className={styles.formGrid}>
            <div className={`${styles.fullWidth} ${styles.formGroup}`}>
              <label>Identity (Email / Phone / BVN)</label>
              <input type="text" value={newKarma.identity} onChange={e => setNewKarma({ ...newKarma, identity: e.target.value })} placeholder="fraudulent.user@gmail.com" required />
            </div>
            <div className={styles.formGroup}>
              <label>Infraction Type</label>
              <select value={newKarma.type} onChange={e => setNewKarma({ ...newKarma, type: e.target.value })}>
                <option value="Card Chargeback">Card Chargeback</option>
                <option value="Identity Theft">Identity Theft</option>
                <option value="Defaulted Repayments">Defaulted Repayments</option>
                <option value="Multiple Applications">Multiple Applications</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Risk Coefficient (Score 0-100)</label>
              <input type="number" min="1" max="100" value={newKarma.riskScore} onChange={e => setNewKarma({ ...newKarma, riskScore: e.target.value })} placeholder="75" />
            </div>
            <button type="submit" className={`${styles.btnSubmit} ${styles.fullWidth}`}>Publish blacklist Karma Report</button>
          </form>
        </div>
      </div>
    </div>
  );

  // 9. ORGANIZATION
  const renderOrganization = () => (
    <div className={styles.panelContainer}>
      <div className={styles.viewHeader}>
        <h2>Organization Setup & Settings</h2>
        <p>Manage multiple merchant organization keys, limits, and multi-currency rules.</p>
      </div>

      <div className={styles.interactiveLayout}>
        <div className={styles.formCard}>
          <h3>Global Merchant Configurations</h3>
          <div className={styles.toggleRow}>
            <div className={styles.toggleLabel}>
              <h4>Acme Corporation Node</h4>
              <p>Active organization key node.</p>
            </div>
            <span className={`${styles.badge} ${styles.active}`}>Primary Node</span>
          </div>

          <div className={styles.toggleRow}>
            <div className={styles.toggleLabel}>
              <h4>Automatic Disbursement Limit</h4>
              <p>Disburse credit automatically below ₦100,000.</p>
            </div>
            <label className={styles.switch}>
              <input type="checkbox" defaultChecked />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.toggleRow}>
            <div className={styles.toggleLabel}>
              <h4>Multi-Currency Settlement (USD/NGN)</h4>
              <p>Settle platform fees using standard USD currencies exchanges.</p>
            </div>
            <label className={styles.switch}>
              <input type="checkbox" />
              <span className={styles.slider}></span>
            </label>
          </div>

          <button onClick={() => triggerToast('Merchant node configuration updated successfully.')} className={styles.btnSubmit} style={{ marginTop: '20px' }}>Apply Node Changes</button>
        </div>

        <div className={styles.formCard} style={{ backgroundColor: '#fcfcfd' }}>
          <h3>Organization Directory</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ padding: '12px', background: '#fff', borderRadius: '8px', border: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
              <strong>Acme Corp</strong>
              <span style={{ color: '#39CDCC', fontWeight: 600 }}>Active</span>
            </li>
            <li style={{ padding: '12px', background: '#fff', borderRadius: '8px', border: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
              <strong>Finance Solutions</strong>
              <span style={{ color: '#545F7D' }}>Inactive</span>
            </li>
            <li style={{ padding: '12px', background: '#fff', borderRadius: '8px', border: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
              <strong>TechStart Inc</strong>
              <span style={{ color: '#545F7D' }}>Inactive</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  // 10. LOAN PRODUCTS
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.rate) return;
    const item = {
      id: `LP-0${loanProducts.length + 1}`,
      name: newProduct.name,
      rate: parseFloat(newProduct.rate),
      minAmount: parseFloat(newProduct.minAmount) || 10000,
      maxAmount: parseFloat(newProduct.maxAmount) || 500000,
      duration: parseInt(newProduct.duration) || 12,
    };
    setLoanProducts([...loanProducts, item]);
    setNewProduct({ name: '', rate: '', minAmount: '', maxAmount: '', duration: '' });
    triggerToast(`Credit rule "${item.name}" registered successfully.`);
  };

  const renderProducts = () => (
    <div className={styles.panelContainer}>
      <div className={styles.viewHeader}>
        <h2>Loan Products Configurations</h2>
        <p>Configure dynamic credit rules and deployment matrices for customers.</p>
      </div>

      <div className={styles.interactiveLayout}>
        <div className={styles.tableContainer}>
          <div className={styles.tableHeaderActions}>
            <h3>Active Credit Rules Products</h3>
          </div>
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>PRODUCT RULE NAME</th>
                <th>MONTHLY RATE</th>
                <th>LIMIT LIMITS</th>
                <th>MAX PLAN DURATION</th>
              </tr>
            </thead>
            <tbody>
              {loanProducts.map(p => (
                <tr key={p.id}>
                  <td className={styles.textBold}>{p.name}</td>
                  <td style={{ color: '#39CDCC', fontWeight: 600 }}>{p.rate}% / month</td>
                  <td>₦{p.minAmount.toLocaleString()} - ₦{p.maxAmount.toLocaleString()}</td>
                  <td>{p.duration} Months</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.formCard}>
          <h3>Design Credit Product</h3>
          <form onSubmit={handleAddProduct} className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Product Rule Title</label>
              <input type="text" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Student Quick Microcredit" required />
            </div>
            <div className={styles.formGroup}>
              <label>Monthly Interest (%)</label>
              <input type="number" step="0.1" value={newProduct.rate} onChange={e => setNewProduct({ ...newProduct, rate: e.target.value })} placeholder="3.5" required />
            </div>
            <div className={styles.formGroup}>
              <label>Max Plan Duration (Mos)</label>
              <input type="number" value={newProduct.duration} onChange={e => setNewProduct({ ...newProduct, duration: e.target.value })} placeholder="6" />
            </div>
            <div className={styles.formGroup}>
              <label>Minimum Amount (₦)</label>
              <input type="number" value={newProduct.minAmount} onChange={e => setNewProduct({ ...newProduct, minAmount: e.target.value })} placeholder="5000" />
            </div>
            <div className={styles.formGroup}>
              <label>Maximum Amount (₦)</label>
              <input type="number" value={newProduct.maxAmount} onChange={e => setNewProduct({ ...newProduct, maxAmount: e.target.value })} placeholder="100000" />
            </div>
            <button type="submit" className={`${styles.btnSubmit} ${styles.fullWidth}`}>Register Product Rule</button>
          </form>
        </div>
      </div>
    </div>
  );

  // 11. SAVINGS PRODUCTS
  const handleAddSavingsProduct = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('New Savings product template deployed.');
  };

  const renderSavingsProducts = () => (
    <div className={styles.panelContainer}>
      <div className={styles.viewHeader}>
        <h2>Savings Products Matrix</h2>
        <p>Deploy yields rules and locked-term capital products templates.</p>
      </div>

      <div className={styles.interactiveLayout}>
        <div className={styles.tableContainer}>
          <div className={styles.tableHeaderActions}>
            <h3>Active Savings Products templates</h3>
          </div>
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>PRODUCT PLAN</th>
                <th>APY RATE</th>
                <th>LOCK DURATION</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {savingsProducts.map(sp => (
                <tr key={sp.id}>
                  <td className={styles.textBold}>{sp.name}</td>
                  <td style={{ color: '#39CDCC', fontWeight: 600 }}>{sp.yieldRate}% APY</td>
                  <td>{sp.lockPeriod}</td>
                  <td>
                    <span className={`${styles.badge} ${styles.active}`}>Operational</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.formCard}>
          <h3>Design Savings Template</h3>
          <form onSubmit={handleAddSavingsProduct} className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Product Name</label>
              <input type="text" placeholder="Fixed Retirement Growth Deposit" required />
            </div>
            <div className={styles.formGroup}>
              <label>APY Interest Rate (%)</label>
              <input type="number" step="0.1" placeholder="12.5" required />
            </div>
            <div className={styles.formGroup}>
              <label>Locked Lock-in Period</label>
              <select>
                <option value="None">None (Instant access)</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="12 Months">12 Months</option>
              </select>
            </div>
            <button type="submit" className={`${styles.btnSubmit} ${styles.fullWidth}`}>Deploy Yield Product</button>
          </form>
        </div>
      </div>
    </div>
  );

  // 12. FEES AND CHARGES
  const renderFees = () => (
    <div className={styles.panelContainer}>
      <div className={styles.viewHeader}>
        <h2>Fees and Charges Configurator</h2>
        <p>Set sliding platform tariffs, gateway fees, and defaulted repayment penalties.</p>
      </div>

      <div className={styles.interactiveLayout}>
        <div className={styles.formCard}>
          <h3>Core Platform Tariff Config</h3>
          <div className={styles.sliderGroup}>
            <div className={styles.sliderLabel}>
              <span>Loan Processing Fee Rate</span>
              <span>1.5%</span>
            </div>
            <input type="range" min="0" max="5" defaultValue="1" />
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderLabel}>
              <span>Late Payments Default Penalty Fee (Flat rate)</span>
              <span>₦5,000</span>
            </div>
            <input type="range" min="1000" max="15000" defaultValue="5000" />
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderLabel}>
              <span>SMS notification ledger charge</span>
              <span>₦15</span>
            </div>
            <input type="range" min="4" max="50" defaultValue="15" />
          </div>

          <button onClick={() => triggerToast('Core platform tariffs config updated.')} className={styles.btnSubmit} style={{ marginTop: '20px' }}>Apply Platform Tariffs</button>
        </div>

        <div className={styles.formCard} style={{ backgroundColor: '#fcfcfd', fontSize: '13px', color: '#545F7D', lineHeight: 1.6 }}>
          <h3>Tariff Config Rules</h3>
          <p>Lendsqr billing nodes apply late charges exactly <strong>24 hours</strong> past repayment plan timers.</p>
          <p style={{ marginTop: '12px' }}>Transaction settlement processing fee cap limits are capped at <strong>₦2,000 maximum</strong> per individual batch transfer.</p>
        </div>
      </div>
    </div>
  );

  // 13. TRANSACTIONS
  const handleSearchTxn = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('Ledger filtered.');
  };

  const handleDownloadLedger = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Transaction ID,Username,Volume,Action Type,System Time,Status"].join(",") + "\n"
      + transactions.map(t => `${t.id},${t.user},${t.amount},${t.type},${t.date},${t.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Lendsqr_Transactions_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('CSV Ledger file generated and downloaded successfully.');
  };

  const renderTransactions = () => (
    <div className={styles.panelContainer}>
      <div className={styles.viewHeader}>
        <h2>Transactions Ledger Center</h2>
        <p>Complete historical financial transactions ledger for Acme Corp.</p>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeaderActions}>
          <form onSubmit={handleSearchTxn} className={styles.searchInputWrapper}>
            <input type="text" placeholder="Search transactions..." />
            <span className={styles.searchIcon}>🔍</span>
          </form>
          <button onClick={handleDownloadLedger} className={styles.btnSecondary}>Export CSV Ledger</button>
        </div>
        <table className={styles.customTable}>
          <thead>
            <tr>
              <th>TXN ID</th>
              <th>CUSTOMER</th>
              <th>VOLUME</th>
              <th>TRANSACTION TYPE</th>
              <th>SYSTEM TIME</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id}>
                <td className={styles.textBold}>{t.id}</td>
                <td className={styles.textBold}>{t.user}</td>
                <td className={styles.textBold} style={{ color: t.status === 'success' ? '#39CDCC' : '#E4033B' }}>
                  {t.type === 'Repayment' ? '+' : '-'} ₦{t.amount.toLocaleString()}
                </td>
                <td>{t.type}</td>
                <td>{t.date}</td>
                <td>
                  <span className={`${styles.badge} ${t.status === 'success' ? styles.active : styles.blacklisted}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 14. SERVICES
  const handleRestartService = (id: string) => {
    setServices(services.map(s => s.id === id ? { ...s, status: 'restarting' } : s));
    triggerToast('Restart instruction sent to gateway node...');
    setTimeout(() => {
      setServices(services => services.map(s => s.id === id ? { ...s, status: 'active', latency: '120ms' } : s));
      triggerToast('API gateway recovered and operational.');
    }, 2000);
  };

  const renderServices = () => (
    <div className={styles.panelContainer}>
      <div className={styles.viewHeader}>
        <h2>Core API Gateways Monitor</h2>
        <p>Uptime monitoring and status checker for core external authentication and payment channels.</p>
      </div>

      <div className={styles.serviceGrid}>
        {services.map(s => (
          <div key={s.id} className={styles.serviceCard}>
            <div className={styles.serviceHeader}>
              <h4>{s.name}</h4>
              <span className={s.status === 'active' ? styles.pulseGreen : styles.pulseRed}></span>
            </div>
            <div className={styles.serviceMeta}>
              <span>Status: <strong style={{ color: s.status === 'active' ? '#39CDCC' : '#E4033B' }}>{s.status.toUpperCase()}</strong></span>
              <span>Uptime Uptime: <strong>{s.uptime}</strong></span>
              <span>Response Latency: <strong>{s.latency}</strong></span>
            </div>
            <button onClick={() => handleRestartService(s.id)} disabled={s.status === 'restarting'} className={styles.btnSecondary}>
              {s.status === 'restarting' ? 'Restarting Node...' : 'Restart Node Gateway'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // 15. SERVICE ACCOUNT
  const handleTopup = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(topupAmount);
    if (!amt || amt <= 0) return;
    setWalletBalance(walletBalance + amt);
    setTopupAmount('');
    triggerToast(`Simulated credit card checkout success. Wallet funded with ₦${amt.toLocaleString()}.`);
  };

  const renderAccount = () => (
    <div className={styles.panelContainer}>
      <div className={styles.viewHeader}>
        <h2>API Service Account Billing</h2>
        <p>Manage API credits balance and simulated billing wallet fundings.</p>
      </div>

      <div className={styles.interactiveLayout}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className={styles.walletPanel}>
            <div className={styles.walletTitle}>AVAILABLE API CR WALLET BALANCE</div>
            <div className={styles.walletBalance}>₦{(walletBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <div className={styles.walletDetails}>Linked Merchant Node: <strong>Acme Corp Integration</strong></div>
          </div>

          <div className={styles.tableContainer}>
            <div className={styles.tableHeaderActions}>
              <h3>Recent API Credit Statements</h3>
            </div>
            <table className={styles.customTable}>
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>CHARGE PLAN</th>
                  <th>UNITS COMMITTED</th>
                  <th>BALANCE DOCK</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2026-06-01</td>
                  <td>Identity BVN check batch</td>
                  <td>250 checks</td>
                  <td className={styles.textBold} style={{ color: '#E4033B' }}>- ₦12,500.00</td>
                </tr>
                <tr>
                  <td>2026-05-28</td>
                  <td>Card billing webhook nodes</td>
                  <td>1,480 webhooks</td>
                  <td className={styles.textBold} style={{ color: '#E4033B' }}>- ₦14,800.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.formCard}>
          <h3>Top-up Wallet simulator</h3>
          <form onSubmit={handleTopup} className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Funding Amount (₦)</label>
              <input type="number" value={topupAmount} onChange={e => setTopupAmount(e.target.value)} placeholder="50000" required />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Mock Mastercard digits</label>
              <input type="text" placeholder="5412 •••• •••• 9081" disabled />
            </div>
            <button type="submit" className={`${styles.btnSubmit} ${styles.fullWidth}`}>Checkout Simulated payment</button>
          </form>
        </div>
      </div>
    </div>
  );

  // 16. SETTLEMENTS
  const renderSettlements = () => (
    <div className={styles.panelContainer}>
      <div className={styles.viewHeader}>
        <h2>Payout Settlement Batches</h2>
        <p>Approve and clear merchant settlement batches to destination commercial banks.</p>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeaderActions}>
          <h3>Pending Payout Batches</h3>
        </div>
        <table className={styles.customTable}>
          <thead>
            <tr>
              <th>BATCH NO</th>
              <th>MERCHANT NODE</th>
              <th>TOTAL VOLUME</th>
              <th>PLAN CHANNELS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.textBold}>SET-0918</td>
              <td>Finance Solutions Ltd</td>
              <td className={styles.textBold}>₦14,890,000</td>
              <td>GTBank Settlement Node</td>
              <td>
                <button onClick={() => triggerToast('Payout batch SET-0918 settled completely.')} className={styles.btnSecondary}>Clear Payout</button>
              </td>
            </tr>
            <tr>
              <td className={styles.textBold}>SET-0917</td>
              <td>TechStart Inc</td>
              <td className={styles.textBold}>₦2,430,000</td>
              <td>Zenith Bank Node</td>
              <td>
                <button onClick={() => triggerToast('Payout batch SET-0917 settled completely.')} className={styles.btnSecondary}>Clear Payout</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  // 17. REPORTS
  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReportProgress(0);
  };

  useEffect(() => {
    if (reportProgress >= 0 && reportProgress < 100) {
      const interval = setInterval(() => {
        setReportProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            triggerToast('Report compilation finished successfully.');
            return 100;
          }
          return prev + 10;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [reportProgress]);

  const renderReports = () => (
    <div className={styles.panelContainer}>
      <div className={styles.viewHeader}>
        <h2>Administrative Reports Generator</h2>
        <p>Export summarized financial statements, credit scores distributions, and default risks reports.</p>
      </div>

      <div className={styles.interactiveLayout}>
        <div className={styles.formCard}>
          <h3>Custom Report Parameters</h3>
          <form onSubmit={handleGenerateReport} className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Report Type Target</label>
              <select value={reportType} onChange={e => {
                setReportType(e.target.value);
                setReportProgress(-1);
              }}>
                <option value="revenue">Financial Revenue & Outflow</option>
                <option value="defaults">Default Risk Matrix</option>
                <option value="demographics">Customer Demographics Growth</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Date From</label>
              <input type="date" defaultValue="2026-05-01" />
            </div>
            <div className={styles.formGroup}>
              <label>Date To</label>
              <input type="date" defaultValue="2026-06-01" />
            </div>
            <button type="submit" className={`${styles.btnSubmit} ${styles.fullWidth}`}>Compile Report Document</button>
          </form>
        </div>

        {reportProgress >= 0 && (
          <div className={styles.reportPreview}>
            <h3>Compiling Document Stream...</h3>
            <div className={styles.progressBarContainer}>
              <div className={styles.progressBar} style={{ width: `${reportProgress}%` }}></div>
            </div>
            {reportProgress === 100 && (
              <div className={styles.formGrid} style={{ marginTop: '16px' }}>
                <div className={styles.reportField}>
                  Document Name:
                  <strong>Lendsqr_{reportType.toUpperCase()}_Report_Q2.pdf</strong>
                </div>
                <div className={styles.reportField}>
                  Compiled Size:
                  <strong>2.48 MB</strong>
                </div>
                <button onClick={() => triggerToast('PDF Report downloaded successfully.')} className={`${styles.btnSubmit} ${styles.fullWidth}`}>Download PDF Document</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // 18. PREFERENCES
  const renderPreferences = () => (
    <div className={styles.panelContainer}>
      <div className={styles.viewHeader}>
        <h2>Administrative Preferences</h2>
        <p>Set dynamic security settings and developer integrations settings.</p>
      </div>

      <div className={styles.interactiveLayout}>
        <div className={styles.formCard}>
          <h3>Security & Automation Switches</h3>
          <div className={styles.toggleRow}>
            <div className={styles.toggleLabel}>
              <h4>Developer Dark Mode Interface</h4>
              <p>Apply dark mode background.</p>
            </div>
            <label className={styles.switch}>
              <input type="checkbox" checked={prefDark} onChange={e => {
                setPrefDark(e.target.checked);
                triggerToast(`Theme switched to ${e.target.checked ? 'Dark Mode' : 'Light Mode'}.`);
              }} />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.toggleRow}>
            <div className={styles.toggleLabel}>
              <h4>Slack Integration Alerts</h4>
              <p>Forward default credit alerts directly to corporate Slack channels.</p>
            </div>
            <label className={styles.switch}>
              <input type="checkbox" checked={prefSlack} onChange={e => {
                setPrefSlack(e.target.checked);
                triggerToast(`Slack notification channels ${e.target.checked ? 'Enabled' : 'Disabled'}.`);
              }} />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.toggleRow}>
            <div className={styles.toggleLabel}>
              <h4>Two-Factor Admin Authentication (2FA)</h4>
              <p>Require verification OTP upon each administrative session.</p>
            </div>
            <label className={styles.switch}>
              <input type="checkbox" checked={prefTfa} onChange={e => {
                setPrefTfa(e.target.checked);
                triggerToast(`Two-factor security layer ${e.target.checked ? 'Activated' : 'Revoked'}.`);
              }} />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.toggleRow}>
            <div className={styles.toggleLabel}>
              <h4>Global Maintenance Gateway</h4>
              <p>Lock platform disbursals for routine database operations.</p>
            </div>
            <label className={styles.switch}>
              <input type="checkbox" checked={prefMaint} onChange={e => {
                setPrefMaint(e.target.checked);
                triggerToast(`Global Maintenance Gateway ${e.target.checked ? 'ON' : 'OFF'}.`);
              }} />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  // 19. PRICING
  const renderPricing = () => (
    <div className={styles.panelContainer}>
      <div className={styles.viewHeader}>
        <h2>Multi-Tiered Pricing Models</h2>
        <p>Adjust billing tier packages and interest scale caps based on customer transacted volumes.</p>
      </div>

      <div className={styles.interactiveLayout}>
        <div className={styles.formCard}>
          <h3>Volume Pricing Sliders</h3>
          <div className={styles.sliderGroup}>
            <div className={styles.sliderLabel}>
              <span>Tier 1 Microcredit Interest Cap</span>
              <span>8.5%</span>
            </div>
            <input type="range" min="3" max="15" defaultValue="8.5" step="0.5" />
          </div>

          <div className={styles.sliderGroup}>
            <div className={styles.sliderLabel}>
              <span>Tier 2 Commercial Business Outflow cut</span>
              <span>1.2%</span>
            </div>
            <input type="range" min="0.5" max="5" defaultValue="1.2" step="0.1" />
          </div>

          <button onClick={() => triggerToast('Multi-tiered pricing modules re-calibrated.')} className={styles.btnSubmit} style={{ marginTop: '20px' }}>Apply Pricing calibration</button>
        </div>
      </div>
    </div>
  );

  // 20. LOGS
  const renderLogs = () => (
    <div className={styles.panelContainer}>
      <div className={styles.viewHeader}>
        <h2>Administrative Security Audit Logs</h2>
        <p>Live chronological records of security authentications and disbursement audits.</p>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeaderActions}>
          <h3>Acme Corp security log trail</h3>
        </div>
        <table className={styles.customTable}>
          <thead>
            <tr>
              <th>LOG OPERATOR</th>
              <th>OPERATIONAL SCOPE</th>
              <th>EVENT DESCRIPTION</th>
              <th>CLIENT PROTOCOL IP</th>
              <th>EVENT TIMESTAMP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.textBold}>Adedeji Balogun</td>
              <td>MERCHANT_CONFIG</td>
              <td>Enabled dynamic auto-disbursement checking</td>
              <td>192.168.1.104</td>
              <td>Just now</td>
            </tr>
            <tr>
              <td className={styles.textBold}>Adedeji Balogun</td>
              <td>USER_MANAGEMENT</td>
              <td>Blacklisted BVN flag matching identifier</td>
              <td>192.168.1.104</td>
              <td>28 mins ago</td>
            </tr>
            <tr>
              <td className={styles.textBold}>System gateway</td>
              <td>CREDIT_ENGINE</td>
              <td>Simulated coefficient weights deployed successfully</td>
              <td>10.0.0.8</td>
              <td>1 hour ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  // 21. SYSTEMS MESSAGES BROADCAST
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBroadcast.title || !newBroadcast.desc) return;
    triggerBroadcast({
      title: newBroadcast.title,
      desc: newBroadcast.desc,
      type: newBroadcast.type as any,
    });
    setNewBroadcast({ title: '', desc: '', type: 'info' });
    triggerToast('System Broadcast published live to active layout dashboard!');
  };

  const renderMessages = () => (
    <div className={styles.panelContainer}>
      <div className={styles.viewHeader}>
        <h2>System Messages Broadcast Center</h2>
        <p>Publish global emergency alert banners or maintenance headers to the layouts instantly.</p>
      </div>

      <div className={styles.interactiveLayout}>
        <div className={styles.formCard}>
          <h3>Compose global notification banner</h3>
          <form onSubmit={handleSendBroadcast} className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Banner Alert Title</label>
              <input type="text" value={newBroadcast.title} onChange={e => setNewBroadcast({ ...newBroadcast, title: e.target.value })} placeholder="Scheduled Core Maintenance" required />
            </div>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Detailed Broadcast Message</label>
              <textarea value={newBroadcast.desc} onChange={e => setNewBroadcast({ ...newBroadcast, desc: e.target.value })} placeholder="All disbursements locked from 2:00 AM to 4:00 AM NGN time." required />
            </div>
            <div className={styles.formGroup}>
              <label>Select Banner Type Style</label>
              <select value={newBroadcast.type} onChange={e => setNewBroadcast({ ...newBroadcast, type: e.target.value })}>
                <option value="info">Info Accent (Teal highlight)</option>
                <option value="warning">Warning Accent (Orange highlight)</option>
                <option value="danger">Emergency Alert (Red highlight)</option>
              </select>
            </div>
            <button type="submit" className={`${styles.btnSubmit} ${styles.fullWidth}`}>Deploy Global Broadcast</button>
          </form>
        </div>
      </div>
    </div>
  );

  // Primary routing gateway
  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return renderDashboard();
      case 'guarantors':
        return renderGuarantors();
      case 'loans':
        return renderLoans();
      case 'decision':
        return renderDecision();
      case 'savings':
        return renderSavings();
      case 'requests':
        return renderLoanRequests();
      case 'whitelist':
        return renderWhitelist();
      case 'karma':
        return renderKarma();
      case 'organization':
        return renderOrganization();
      case 'products':
        return renderProducts();
      case 'savings-products':
        return renderSavingsProducts();
      case 'fees':
        return renderFees();
      case 'transactions':
        return renderTransactions();
      case 'services':
        return renderServices();
      case 'account':
        return renderAccount();
      case 'settlements':
        return renderSettlements();
      case 'reports':
        return renderReports();
      case 'preferences':
        return renderPreferences();
      case 'pricing':
        return renderPricing();
      case 'logs':
        return renderLogs();
      case 'messages':
        return renderMessages();
      default:
        return null;
    }
  };

  return <React.Fragment key={view}>{renderContent()}</React.Fragment>;
};
