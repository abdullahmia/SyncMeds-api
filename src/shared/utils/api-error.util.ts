/**
 * Simple API Error Class
 *
 * A streamlined error class for API responses with essential error information.
 *
 * @class ApiError
 * @extends {Error}
 *
 * @param {number} status_code - HTTP status code
 * @param {string} message - Error message
 * @param {boolean} [status=false] - Success status (always false for errors)
 *
 * @property {number} status_code - HTTP status code
 * @property {string} message - Error message
 * @property {boolean} status - Always false
 * @property {string} timestamp - Error occurrence timestamp
 */
export class ApiError extends Error {
  status_code: number;
  status: boolean;
  timestamp: string;

  constructor(status_code: number, message: string, status: boolean = false) {
    super(message);
    this.status_code = status_code;
    this.status = status;
    this.timestamp = new Date().toISOString();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}
