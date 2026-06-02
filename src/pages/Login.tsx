import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import styles from './Login.module.scss';

export const Login = () => {
  const navigate = useNavigate();
  
  // Tab control: 'login' | 'signup' | '2fa' | 'registered'
  const [authStep, setAuthStep] = useState<'login' | 'signup' | '2fa' | 'registered'>('login');
  
  // Login Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Signup Form fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupOrg, setSignupOrg] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);
  const [checkingCaptcha, setCheckingCaptcha] = useState(false);
  
  // 2FA OTP Fields
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [showOtpHint] = useState(true);
  
  // General status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password strength estimation
  const [pwdStrength, setPwdStrength] = useState<'none' | 'weak' | 'good' | 'strong'>('none');
  const [pwdPercentage, setPwdPercentage] = useState(0);

  useEffect(() => {
    if (!signupPassword) {
      setPwdStrength('none');
      setPwdPercentage(0);
      return;
    }
    
    let score = 0;
    if (signupPassword.length >= 6) score += 33;
    if (/[A-Z]/.test(signupPassword)) score += 33;
    if (/[0-9]/.test(signupPassword) || /[^A-Za-z0-9]/.test(signupPassword)) score += 34;

    setPwdPercentage(score);
    if (score <= 33) {
      setPwdStrength('weak');
    } else if (score <= 66) {
      setPwdStrength('good');
    } else {
      setPwdStrength('strong');
    }
  }, [signupPassword]);

  // Demo accounts helper
  const handleDemoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  const handleCaptchaClick = () => {
    if (checkingCaptcha || isCaptchaChecked) return;
    setCheckingCaptcha(true);
    setTimeout(() => {
      setCheckingCaptcha(false);
      setIsCaptchaChecked(true);
    }, 1200);
  };

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Check credentials using authService (loads matches from localStorage registered database)
      // This will succeed for ANY credentials as per MSW design, but custom names persist
      await authService.login(email, password);
      
      setLoading(false);
      navigate('/users');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  // Verify 2FA OTP
  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    if (otpCode !== '123456') {
      setOtpError('Incorrect 6-digit verification code. Please try again.');
      return;
    }

    setOtpVerifying(true);
    setTimeout(() => {
      setOtpVerifying(false);
      navigate('/users');
    }, 1500);
  };

  // Submit Registration
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword || !signupOrg) {
      setError('All fields are required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setError('You must accept the terms & conditions');
      return;
    }

    if (!isCaptchaChecked) {
      setError('Please verify you are not a robot');
      return;
    }

    setLoading(true);

    try {
      await authService.register(signupEmail, signupPassword, signupOrg, signupName);
      setLoading(false);
      setAuthStep('registered');
      // Set the login email field to the newly registered email
      setEmail(signupEmail);
      setPassword('');
      // Clean up signup fields
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupConfirmPassword('');
      setSignupOrg('');
      setAgreeTerms(false);
      setIsCaptchaChecked(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Left Column - Brand Showcase */}
      <div className={styles.brandShowcase}>
        <div className={styles.logoContainer}>
          <svg width="173" height="36" viewBox="0 0 173 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.048 0H10.952C4.903 0 0 4.903 0 10.952V25.048C0 31.097 4.903 36 10.952 36H25.048C31.097 36 36 31.097 36 25.048V10.952C36 4.903 31.097 0 25.048 0Z" fill="#39CDCC"/>
            <path d="M12 12H24V24H12V12Z" fill="white"/>
            <path d="M15 15H21V21H15V15Z" fill="#213F7D"/>
            <text x="46" y="26" fontFamily="'Work Sans', sans-serif" fontSize="25" fontWeight="700" fill="#213F7D" letterSpacing="-1">lendsqr</text>
          </svg>
        </div>
        <div className={styles.illustrationWrapper}>
          <img src="/login-illustration.png" alt="Lendsqr Portal Illustration" />
        </div>
      </div>

      {/* Right Column - Forms Card Container */}
      <div className={styles.formContainer}>
        {/* Mobile Header Logo */}
        <div className={styles.mobileLogo}>
          <svg width="145" height="30" viewBox="0 0 173 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.048 0H10.952C4.903 0 0 4.903 0 10.952V25.048C0 31.097 4.903 36 10.952 36H25.048C31.097 36 36 31.097 36 25.048V10.952C36 4.903 31.097 0 25.048 0Z" fill="#39CDCC"/>
            <path d="M12 12H24V24H12V12Z" fill="white"/>
            <path d="M15 15H21V21H15V15Z" fill="#213F7D"/>
            <text x="46" y="26" fontFamily="'Work Sans', sans-serif" fontSize="25" fontWeight="700" fill="#213F7D" letterSpacing="-1">lendsqr</text>
          </svg>
        </div>

        <div className={styles.formCard}>
          {/* STEP 1: LOGIN / SIGNUP VIEW */}
          {(authStep === 'login' || authStep === 'signup') && (
            <>
              {/* Tab Selector Headers */}
              <div className={styles.authTabs}>
                <button 
                  className={`${styles.tabTrigger} ${authStep === 'login' ? styles.activeTab : ''}`}
                  onClick={() => { setAuthStep('login'); setError(''); }}
                >
                  Sign In
                </button>
                <button 
                  className={`${styles.tabTrigger} ${authStep === 'signup' ? styles.activeTab : ''}`}
                  onClick={() => { setAuthStep('signup'); setError(''); }}
                >
                  Create Account
                </button>
              </div>

              {authStep === 'login' ? (
                /* LOGIN FORM TRIGGER */
                <div className={styles.fadeContainer}>
                  <div className={styles.formHeader}>
                    <h1 className={styles.formTitle}>Welcome!</h1>
                    <p className={styles.formSubtitle}>Enter details to login.</p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className={styles.loginForm} noValidate>
                    <div className={styles.formGroup}>
                      <input
                        id="email"
                        type="email"
                        className={styles.formInput}
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <div className={styles.passwordWrapper}>
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          className={styles.formInput}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={loading}
                        />
                        <button
                          type="button"
                          className={styles.passwordToggle}
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? 'HIDE' : 'SHOW'}
                        </button>
                      </div>
                    </div>

                    <div className={styles.formLinks}>
                      <a href="#forgot" className={styles.forgotLink}>FORGOT PASSWORD?</a>
                    </div>

                    {error && <div className={styles.formError}>{error}</div>}

                    <button
                      type="submit"
                      className={styles.loginButton}
                      disabled={loading}
                    >
                      {loading ? 'LOGGING IN...' : 'LOG IN'}
                    </button>
                  </form>

                  {/* QUICK DEMO CREDENTIALS */}
                  <div className={styles.demoAccountsSection}>
                    <span className={styles.demoTitle}>Quick Access Admin Demo Accounts</span>
                    <div className={styles.demoGrid}>
                      <button 
                        onClick={() => handleDemoLogin('admin@lendsqr.com', 'admin123')}
                        className={styles.demoCard}
                      >
                        <strong>Super Admin</strong>
                        <span>admin@lendsqr.com</span>
                      </button>
                      <button 
                        onClick={() => handleDemoLogin('risk@lendsqr.com', 'risk123')}
                        className={styles.demoCard}
                      >
                        <strong>Risk Manager</strong>
                        <span>risk@lendsqr.com</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* REGISTRATION WORKFLOW */
                <div className={styles.fadeContainer}>
                  <div className={styles.formHeader}>
                    <h1 className={styles.formTitle}>Get Started</h1>
                    <p className={styles.formSubtitle}>Create an administrative account.</p>
                  </div>

                  <form onSubmit={handleSignupSubmit} className={styles.loginForm} noValidate>
                    <div className={styles.formGroup}>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Full Name"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        disabled={loading}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="Organization Name"
                        value={signupOrg}
                        onChange={(e) => setSignupOrg(e.target.value)}
                        disabled={loading}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <input
                        type="email"
                        className={styles.formInput}
                        placeholder="Email Address"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <input
                        type="password"
                        className={styles.formInput}
                        placeholder="Choose Password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        disabled={loading}
                      />
                      
                      {/* Password Strength Indicator */}
                      {pwdStrength !== 'none' && (
                        <div className={styles.strengthMeter}>
                          <div className={styles.strengthTracks}>
                            <div 
                              className={`${styles.strengthFill} ${styles[pwdStrength]}`}
                              style={{ width: `${pwdPercentage}%` }}
                            />
                          </div>
                          <span className={`${styles.strengthText} ${styles[pwdStrength]}`}>
                            Strength: {pwdStrength.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <input
                        type="password"
                        className={styles.formInput}
                        placeholder="Confirm Password"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>

                    {/* MOCK RECAPTCHA BOX */}
                    <div className={styles.captchaBox} onClick={handleCaptchaClick}>
                      <div className={`${styles.checkbox} ${isCaptchaChecked ? styles.checked : ''}`}>
                        {checkingCaptcha ? <div className={styles.captchaSpinner} /> : isCaptchaChecked && '✓'}
                      </div>
                      <span className={styles.captchaText}>I am not a robot</span>
                      <img 
                        src="https://www.gstatic.com/recaptcha/api2/logo_48.png" 
                        alt="reCAPTCHA logo" 
                        className={styles.captchaLogo}
                      />
                    </div>

                    {/* Terms Toggles */}
                    <label className={styles.termsToggle}>
                      <input 
                        type="checkbox" 
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      <span>I agree to Lendsqr's Terms of Service and Privacy Policy</span>
                    </label>

                    {error && <div className={styles.formError}>{error}</div>}

                    <button
                      type="submit"
                      className={styles.loginButton}
                      disabled={loading}
                    >
                      {loading ? 'CREATING PORTAL...' : 'CREATE ACCOUNT'}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

          {/* STEP 2: TWO-FACTOR OTP CODE VERIFICATION OVERLAY */}
          {authStep === '2fa' && (
            <div className={styles.otpOverlay}>
              <div className={styles.otpIconWrapper}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#39CDCC" strokeWidth="2">
                  <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
                  <path d="M12 11V7a4 4 0 0 1 8 0v4" />
                </svg>
              </div>

              <h2 className={styles.otpTitle}>Two-Factor Verification</h2>
              <p className={styles.otpSubtitle}>
                A secure login authorization request has been initiated. Enter the verification passcode sent to your device.
              </p>

              <form onSubmit={handleOtpVerify} className={styles.otpForm}>
                <div className={styles.formGroup}>
                  <input 
                    type="text" 
                    placeholder="Enter 6-Digit OTP"
                    maxLength={6}
                    className={`${styles.formInput} ${styles.otpInput}`}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    disabled={otpVerifying}
                    autoFocus
                  />
                </div>

                {otpError && <div className={styles.otpErrorText}>{otpError}</div>}

                <button 
                  type="submit" 
                  className={styles.loginButton}
                  disabled={otpVerifying || otpCode.length < 6}
                >
                  {otpVerifying ? 'VERIFYING CODE...' : 'VERIFY PASSCODE'}
                </button>
              </form>

              {showOtpHint && (
                <div className={styles.otpHintBanner}>
                  <span className={styles.hintTitle}>DEVELOPER GATEWAY</span>
                  <p>Your simulated verification passcode is: <strong>123456</strong></p>
                </div>
              )}

              <button 
                onClick={() => {
                  setAuthStep('login');
                  setError('');
                }} 
                className={styles.backToLoginBtn}
                disabled={otpVerifying}
              >
                Back to credentials login
              </button>
            </div>
          )}

          {/* STEP 3: REGISTRATION SUCCESS CARD */}
          {authStep === 'registered' && (
            <div className={styles.successCard}>
              <div className={styles.successIcon}>✓</div>
              <h2 className={styles.successTitle}>Account Verified</h2>
              <p className={styles.successText}>
                Your administrative portal has been set up successfully. You can now log in using your email and password.
              </p>
              <button 
                onClick={() => setAuthStep('login')} 
                className={styles.loginButton}
              >
                PROCEED TO LOGIN
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
