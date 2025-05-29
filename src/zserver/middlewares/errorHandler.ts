// const STATUS = require('../utils/statusCodes');

// export (err, req, res, _next) => {
//   console.error(err.stack); // Log error stack trace

//   const statusCode = err.statusCode || STATUS.SERVER_ERROR;

//   res.status(statusCode).json({
//     success: false,
//     message: err.message || 'Internal Server Error',
//     stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
//   });
// };
