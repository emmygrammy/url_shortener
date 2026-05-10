export const validateUrlInput = (req, res, next) => {
  const { originalUrl } = req.body;

  if (!originalUrl || originalUrl.trim() === "") {
    return res.status(400).json({
      message: "originalUrl is required",
    });
  }

  try {
    new URL(originalUrl);
  } catch {
    return res.status(400).json({
      message: "Invalid URL format",
    });
  }

  next();
};