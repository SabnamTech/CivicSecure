// Responsive styles for the CivicSecure Dashboard
export const dashboardStyles = {
  // Main dashboard container
  dashboardContainer: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  },

  // Content wrapper with max-width and responsive constraints
  contentWrapper: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: 'clamp(20px, 5vw, 50px) clamp(16px, 4vw, 20px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(20px, 4vw, 30px)',
  },

  // Responsive header banner
  header: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: 'clamp(20px, 5vw, 40px) clamp(16px, 4vw, 32px)',
    textAlign: 'center',
    borderRadius: 'clamp(8px, 1.5vw, 16px)',
    boxShadow: '0 4px 12px rgba(0, 123, 255, 0.15)',
    background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
    position: 'relative',
    overflow: 'hidden',
  },

  headerTitle: {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: '700',
    margin: '0 0 clamp(8px, 2vw, 12px) 0',
    letterSpacing: '-0.025em',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },

  headerSubtitle: {
    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
    margin: '0',
    opacity: '0.9',
    fontWeight: '400',
  },

  // Responsive grid layout for dashboard sections
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'clamp(16px, 3vw, 24px)',
    width: '100%',
  },

  // Profile info card
  profileCard: {
    backgroundColor: 'white',
    padding: 'clamp(20px, 4vw, 32px)',
    borderRadius: 'clamp(12px, 2vw, 16px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },

  profileCardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)',
  },

  profileTitle: {
    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 clamp(16px, 3vw, 20px) 0',
    borderBottom: '2px solid #e9ecef',
    paddingBottom: 'clamp(8px, 2vw, 12px)',
  },

  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(12px, 2.5vw, 16px)',
  },

  profileItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  profileLabel: {
    fontSize: 'clamp(0.875rem, 2vw, 0.95rem)',
    fontWeight: '600',
    color: '#6c757d',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  profileValue: {
    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
    fontWeight: '500',
    color: '#212529',
    wordBreak: 'break-word',
  },

  verificationBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: 'clamp(0.95rem, 2vw, 1rem)',
    fontWeight: '600',
  },

  // Prototype mode box
  prototypeBox: {
    backgroundColor: '#fff8dc',
    border: '2px solid #ffd700',
    borderRadius: 'clamp(12px, 2vw, 16px)',
    padding: 'clamp(20px, 4vw, 32px)',
    boxShadow: '0 4px 16px rgba(255, 215, 0, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },

  prototypeTitle: {
    fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
    fontWeight: '700',
    color: '#856404',
    margin: '0 0 clamp(12px, 2.5vw, 16px) 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  prototypeDescription: {
    fontSize: 'clamp(0.95rem, 2vw, 1rem)',
    color: '#856404',
    margin: '0 0 clamp(16px, 3vw, 20px) 0',
    lineHeight: '1.6',
  },

  prototypeList: {
    margin: '0',
    paddingLeft: 'clamp(16px, 3vw, 20px)',
  },

  prototypeListItem: {
    fontSize: 'clamp(0.9rem, 2vw, 0.95rem)',
    color: '#856404',
    marginBottom: 'clamp(6px, 1.5vw, 8px)',
    lineHeight: '1.5',
  },

  // Logout button section
  logoutSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'clamp(24px, 4vw, 32px)',
    width: '100%',
  },

  logoutButton: {
    padding: 'clamp(12px, 2.5vw, 16px) clamp(24px, 5vw, 32px)',
    fontSize: 'clamp(1rem, 2vw, 1.125rem)',
    fontWeight: '600',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: 'clamp(8px, 1.5vw, 12px)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    textTransform: 'none',
    letterSpacing: '0.025em',
    boxShadow: '0 4px 12px rgba(220, 53, 69, 0.25)',
    position: 'relative',
    overflow: 'hidden',
  },

  logoutButtonHover: {
    backgroundColor: '#c82333',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(220, 53, 69, 0.35)',
  },

  logoutButtonActive: {
    transform: 'translateY(0)',
    boxShadow: '0 2px 8px rgba(220, 53, 69, 0.4)',
  },

  // Responsive breakpoint styles
  '@media (max-width: 768px)': {
    contentWrapper: {
      padding: '20px 16px',
      gap: '20px',
    },

    dashboardGrid: {
      gridTemplateColumns: '1fr',
      gap: '16px',
    },

    profileCard: {
      padding: '20px',
    },

    prototypeBox: {
      padding: '20px',
    },

    logoutSection: {
      marginTop: '24px',
    },

    logoutButton: {
      width: '100%',
      maxWidth: '300px',
    },
  },

  '@media (min-width: 769px) and (max-width: 1024px)': {
    contentWrapper: {
      padding: '40px 24px',
      gap: '24px',
    },

    dashboardGrid: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    },
  },

  '@media (min-width: 1025px)': {
    logoutSection: {
      justifyContent: 'flex-end',
    },

    logoutButton: {
      width: 'auto',
    },
  },

  // Focus and accessibility styles
  focusStyles: {
    outline: 'none',
    boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.25)',
  },

  // Animation keyframes for enhanced interactions
  slideIn: {
    animation: 'slideIn 0.3s ease-out',
  },

  '@keyframes slideIn': {
    from: {
      opacity: '0',
      transform: 'translateY(20px)',
    },
    to: {
      opacity: '1',
      transform: 'translateY(0)',
    },
  },
};