export const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 400;
  const message = err.message || `backend Error`;
  // console.log(err);
  return res
    .status(status)
    .json({ message: message, description: err?.error?.description });
};
