import { toast as hotToast } from 'react-hot-toast';

export const toast = {
  success: (message) => hotToast.success(message),
  error: (message) => hotToast.error(message),
  info: (message) => hotToast(message),
  warning: (message) => hotToast(message, { icon: '⚠️' }),
};

export const showSuccess = (message, options) => hotToast.success(message, options);
export const showError = (message, options) => hotToast.error(message, options);