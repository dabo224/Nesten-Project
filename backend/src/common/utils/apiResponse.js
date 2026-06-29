// SRP : format de réponse HTTP uniforme pour toute l'API
export const success = (res, data, statusCode = 200, message = 'Succès') =>
  res.status(statusCode).json({ success: true, message, data });

export const error = (res, message, statusCode = 500) =>
  res.status(statusCode).json({ success: false, message, data: null });
