import axios from 'axios';
import { UseFormSetError, FieldValues } from 'react-hook-form';

/**
 * Handles server-side API errors by mapping field-specific validation errors
 * back to react-hook-form fields and setting a global error message.
 */
export function handleFormError<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
  setGlobalError?: (msg: string) => void
) {
  if (axios.isAxiosError(error)) {
    const apiResponse = error.response?.data;
    
    if (apiResponse && typeof apiResponse === 'object') {
      // 1. Map validation field errors
      if (apiResponse.details && typeof apiResponse.details === 'object') {
        Object.entries(apiResponse.details).forEach(([key, message]) => {
          // Normalize backend field names to match frontend form names
          let formField = key;
          if (key === 'markdownContent') formField = 'content';
          if (key === 'eventDate' || key === 'publishedAt') formField = 'publishDate';
          if (key === 'orderIndex') formField = 'displayOrder';
          if (key === 'summary') formField = 'content';

          setError(formField as any, {
            type: 'server',
            message: message as string,
          });
        });
      }

      // 2. Set global display error
      if (setGlobalError) {
        setGlobalError(apiResponse.message || 'An error occurred while saving.');
      }
    } else {
      if (setGlobalError) {
        setGlobalError(error.message || 'Network communication error.');
      }
    }
  } else {
    if (setGlobalError) {
      setGlobalError('An unexpected error occurred.');
    }
  }
}
