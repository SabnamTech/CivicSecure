// Shared styles for authentication components
export const authStyles = {
  // Main container that centers the auth box
  authPageContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8f9fa',
  },

  // Header styles
  header: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '24px 20px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },

  headerTitle: {
    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: '600',
    margin: '0 0 8px 0',
    letterSpacing: '-0.025em',
  },

  headerSubtitle: {
    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
    margin: '0',
    opacity: '0.9',
  },

  // Main content area
  mainContent: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },

  // Auth form container
  authContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: 'clamp(24px, 5vw, 40px)',
    maxWidth: '480px',
    width: '100%',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 5px 10px rgba(0,0,0,0.05)',
    border: '1px solid rgba(0,0,0,0.05)',
  },

  // Title within auth container
  authTitle: {
    fontSize: 'clamp(1.4rem, 3vw, 1.75rem)',
    fontWeight: '600',
    textAlign: 'center',
    margin: '0 0 32px 0',
    color: '#333',
  },

  // Form styles
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  // Form field container
  formField: {
    display: 'flex',
    flexDirection: 'column',
  },

  // Label styles
  label: {
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#555',
    marginBottom: '8px',
  },

  // Input styles
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '1rem',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
    color: '#333333',
    WebkitAppearance: 'none',
    MozAppearance: 'textfield',
  },

  inputFocus: {
    outline: 'none',
    borderColor: '#007bff',
    boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.1)',
  },

  // Button styles
  primaryButton: {
    width: '100%',
    padding: '14px 20px',
    fontSize: '1.05rem',
    fontWeight: '500',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },

  primaryButtonHover: {
    backgroundColor: '#0056b3',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
  },

  primaryButtonDisabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
  },

  successButton: {
    width: '100%',
    padding: '14px 20px',
    fontSize: '1.05rem',
    fontWeight: '500',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },

  successButtonHover: {
    backgroundColor: '#218838',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)',
  },

  // OTP display box
  otpDisplayBox: {
    backgroundColor: '#f8f9fa',
    border: '2px solid #e9ecef',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '24px',
    textAlign: 'center',
  },

  otpTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#495057',
    margin: '0 0 12px 0',
  },

  otpValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#007bff',
    fontFamily: 'monospace',
    letterSpacing: '2px',
    margin: '8px 0',
  },

  otpSubtext: {
    fontSize: '0.85rem',
    color: '#6c757d',
    margin: '8px 0 0 0',
  },

  // Message styles
  messageBox: {
    padding: '14px 16px',
    borderRadius: '8px',
    marginTop: '20px',
    fontSize: '0.95rem',
    fontWeight: '500',
  },

  successMessage: {
    backgroundColor: '#d4edda',
    border: '2px solid #c3e6cb',
    color: '#155724',
  },

  errorMessage: {
    backgroundColor: '#f8d7da',
    border: '2px solid #f5c6cb',
    color: '#721c24',
  },

  // Switch auth mode
  switchAuth: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '0.95rem',
    color: '#6c757d',
  },

  switchAuthButton: {
    color: '#007bff',
    background: 'none',
    border: 'none',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'color 0.2s ease',
  },

  switchAuthButtonHover: {
    color: '#0056b3',
  },

  // Footer
  footer: {
    backgroundColor: 'white',
    textAlign: 'center',
    padding: '20px',
    borderTop: '1px solid #e9ecef',
    color: '#6c757d',
    fontSize: '0.9rem',
  },

  // Responsive breakpoints
  '@media (max-width: 768px)': {
    authContainer: {
      margin: '20px',
      padding: '24px',
      borderRadius: '8px',
    },
    
    mainContent: {
      padding: '20px',
      alignItems: 'flex-start',
    },
  },
};