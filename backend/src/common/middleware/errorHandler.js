// SRP : centralise la gestion de toutes les erreurs (opérationnelles + Prisma)
const errorHandler = (err, req, res, _next) => {
  // Contrainte d'unicité Prisma
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'Une ressource avec ces données existe déjà.',
      data: null,
    });
  }

  // Enregistrement introuvable Prisma
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Ressource introuvable.',
      data: null,
    });
  }

  // Erreurs métier levées via AppError
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null,
    });
  }

  // Erreurs inattendues (bugs)
  console.error('[ERROR]', err);
  return res.status(500).json({
    success: false,
    message: 'Une erreur interne est survenue.',
    data: null,
  });
};

export default errorHandler;
