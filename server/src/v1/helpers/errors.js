export default {
  duplicateEmail: {
    status: 409,
    message: 'Email address already in use.'
  },
  authFailed: {
    status: 401,
    message: 'Invalid credentials.'
  },
  authRequired: {
    status: 401,
    message: 'Authorization token not provided.'
  },
  invalidToken: {
    status: 401,
    message: 'Invalid token.'
  },
  serverError: {
    status: 500,
    message: 'An error occured while processing your request.'
  },
  resourceNotExists: {
    status: 404,
    message: 'does not exist'
  },
  accessDenied: {
    status: 403,
    message: 'Access denied'
  },
  resourceConflict: {
    status: 409,
    message: ''
  },
  validationErrors: {
    status: 422,
    message: 'Request failed validation.'
  }
};
