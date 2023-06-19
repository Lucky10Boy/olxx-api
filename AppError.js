class AppError extends Error {
  constructor(message, res) {
    super(message);

    this.isOperational = true;

    res.json({
      message,
      status: 'fail',
    });
  }
}
module.exports = AppError;
