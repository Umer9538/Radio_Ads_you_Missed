import toast from 'react-hot-toast'

/**
 * Toast notification utilities with consistent styling
 */

export const showToast = {
  /**
   * Show success message
   */
  success: (message: string) => {
    toast.success(message)
  },

  /**
   * Show error message
   */
  error: (message: string) => {
    toast.error(message)
  },

  /**
   * Show loading message with promise
   */
  loading: (message: string) => {
    return toast.loading(message)
  },

  /**
   * Show promise-based toast with loading, success, and error states
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return toast.promise(promise, messages)
  },

  /**
   * Dismiss a specific toast
   */
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId)
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    toast.dismiss()
  },

  /**
   * Custom toast with custom styling
   */
  custom: (message: string, options?: any) => {
    toast(message, options)
  },
}

/**
 * API error handler - extracts error message from API response
 */
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.error) {
    return error.response.data.error
  }
  if (error?.message) {
    return error.message
  }
  return 'An unexpected error occurred'
}

/**
 * Show API error toast
 */
export const showApiError = (error: any, fallbackMessage?: string) => {
  const message = handleApiError(error)
  showToast.error(fallbackMessage || message)
}

/**
 * Form validation error handler
 */
export const showValidationError = (field: string, message: string) => {
  showToast.error(`${field}: ${message}`)
}

/**
 * Network error handler
 */
export const showNetworkError = () => {
  showToast.error('Network error. Please check your connection and try again.')
}

/**
 * Generic success messages
 */
export const TOAST_MESSAGES = {
  // Favorites
  FAVORITE_ADDED: 'Added to favorites',
  FAVORITE_REMOVED: 'Removed from favorites',

  // Offers
  OFFER_CLAIMED: 'Offer claimed successfully',

  // Profile
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',

  // Contact
  CONTACT_SENT: 'Message sent successfully',

  // Auth
  SIGNIN_SUCCESS: 'Welcome back!',
  SIGNOUT_SUCCESS: 'Signed out successfully',
  SIGNUP_SUCCESS: 'Account created successfully',

  // Generic
  SAVE_SUCCESS: 'Changes saved successfully',
  DELETE_SUCCESS: 'Deleted successfully',
  COPY_SUCCESS: 'Copied to clipboard',

  // Errors
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  AUTH_ERROR: 'Authentication failed. Please sign in again.',
  PERMISSION_ERROR: 'You don\'t have permission to perform this action.',
}
