import toast from 'react-hot-toast';

// Custom toast configurations with theme colors
export const showToast = {
  // Success operations
  success: (message, options = {}) => {
    return toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#ffffff',
        fontWeight: '600',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)',
      },
      iconTheme: {
        primary: '#ffffff',
        secondary: '#10b981',
      },
      ...options
    });
  },

  // Error operations
  error: (message, options = {}) => {
    return toast.error(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#ffffff',
        fontWeight: '600',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 10px 25px rgba(239, 68, 68, 0.2)',
      },
      iconTheme: {
        primary: '#ffffff',
        secondary: '#ef4444',
      },
      ...options
    });
  },

  // Warning operations
  warning: (message, options = {}) => {
    return toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: '⚠️',
      style: {
        background: '#f59e0b',
        color: '#ffffff',
        fontWeight: '600',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 10px 25px rgba(245, 158, 11, 0.2)',
      },
      ...options
    });
  },

  // Info operations
  info: (message, options = {}) => {
    return toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#ffffff',
        fontWeight: '600',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)',
      },
      ...options
    });
  },

  // Custom operations with specific icons
  approved: (message) => {
    return toast.success(message, {
      duration: 4000,
      position: 'top-right',
      icon: '✅',
      style: {
        background: '#059669',
        color: '#ffffff',
        fontWeight: '600',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 10px 25px rgba(5, 150, 105, 0.2)',
      },
    });
  },

  rejected: (message) => {
    return toast.error(message, {
      duration: 4000,
      position: 'top-right',
      icon: '❌',
      style: {
        background: '#dc2626',
        color: '#ffffff',
        fontWeight: '600',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 10px 25px rgba(220, 38, 38, 0.2)',
      },
    });
  },

  created: (message) => {
    return toast.success(message, {
      duration: 4000,
      position: 'top-right',
      icon: '🎉',
      style: {
        background: '#7c3aed',
        color: '#ffffff',
        fontWeight: '600',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 10px 25px rgba(124, 58, 237, 0.2)',
      },
    });
  },

  updated: (message) => {
    return toast.success(message, {
      duration: 4000,
      position: 'top-right',
      icon: '🔄',
      style: {
        background: '#0891b2',
        color: '#ffffff',
        fontWeight: '600',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 10px 25px rgba(8, 145, 178, 0.2)',
      },
    });
  },

  deleted: (message) => {
    return toast.error(message, {
      duration: 4000,
      position: 'top-right',
      icon: '🗑️',
      style: {
        background: '#be123c',
        color: '#ffffff',
        fontWeight: '600',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 10px 25px rgba(190, 18, 60, 0.2)',
      },
    });
  },

  assigned: (message) => {
    return toast.success(message, {
      duration: 4000,
      position: 'top-right',
      icon: '🏠',
      style: {
        background: '#16a34a',
        color: '#ffffff',
        fontWeight: '600',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 10px 25px rgba(22, 163, 74, 0.2)',
      },
    });
  },

  vacated: (message) => {
    return toast.warning(message, {
      duration: 4000,
      position: 'top-right',
      icon: '🏃‍♂️',
      style: {
        background: '#ea580c',
        color: '#ffffff',
        fontWeight: '600',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 10px 25px rgba(234, 88, 12, 0.2)',
      },
    });
  },

  paid: (message) => {
    return toast.success(message, {
      duration: 4000,
      position: 'top-right',
      icon: '💰',
      style: {
        background: '#059669',
        color: '#ffffff',
        fontWeight: '600',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 10px 25px rgba(5, 150, 105, 0.2)',
      },
    });
  },

  loading: (message) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#6b7280',
        color: '#ffffff',
        fontWeight: '600',
        borderRadius: '12px',
        padding: '16px 20px',
      },
    });
  }
};

export default showToast;