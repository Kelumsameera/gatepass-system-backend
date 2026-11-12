// Verify the JWT before allowing access to gate-pass actions.
export function requireAuth(req, res, next) {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
}
