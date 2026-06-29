// SRP : gère uniquement les routes inexistantes (404)
const notFound = (req, res) =>
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} introuvable.`,
    data: null,
  });

export default notFound;
