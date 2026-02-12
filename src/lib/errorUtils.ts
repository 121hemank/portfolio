/**
 * Maps Supabase/Postgres error codes to user-friendly messages.
 * This prevents leaking internal database details to users.
 */

interface PostgrestError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

const errorMessages: Record<string, string> = {
  // Unique constraint violations
  '23505': 'This record already exists.',
  // Foreign key violations
  '23503': 'Cannot complete this action: the item is being used elsewhere.',
  // Not null violations
  '23502': 'A required field is missing.',
  // Check constraint violations
  '23514': 'The provided data does not meet the requirements.',
  // Permission denied
  '42501': 'You do not have permission to perform this action.',
  // Invalid input
  '22P02': 'Invalid data format provided.',
  // Row level security
  'PGRST301': 'You do not have permission to access this resource.',
  // JWT expired
  'PGRST302': 'Your session has expired. Please sign in again.',
  // No rows returned
  'PGRST116': 'The requested item was not found.',
};

/**
 * Get a user-friendly error message from a Supabase/Postgres error.
 * Logs the full error for debugging while returning a safe message.
 */
export function getUserFriendlyError(error: PostgrestError | null | undefined): string {
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  // Log full error details for debugging (only in development)
  if (import.meta.env.DEV) {
    console.error('Database error:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
  }

  // Check if we have a mapped message for this error code
  if (error.code && errorMessages[error.code]) {
    return errorMessages[error.code];
  }

  // Default generic message
  return 'An error occurred. Please try again.';
}

/**
 * Get a user-friendly error message for save operations
 */
export function getSaveErrorMessage(error: PostgrestError | null | undefined): string {
  return getUserFriendlyError(error) || 'Failed to save changes. Please try again.';
}

/**
 * Get a user-friendly error message for delete operations
 */
export function getDeleteErrorMessage(error: PostgrestError | null | undefined): string {
  const message = getUserFriendlyError(error);
  if (message.includes('being used elsewhere')) {
    return 'Cannot delete: this item is being used elsewhere.';
  }
  return message || 'Failed to delete. Please try again.';
}
