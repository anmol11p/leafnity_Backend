export const zodMiddleware = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
    next();
  } catch (err) {
    const error = { message: err.errors[0].message };
    next(error);
  }
};
