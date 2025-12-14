import jwt from "jsonwebtoken";

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    // automatically read token from cookies
    // const token = req.cookies.token;
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : null);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach decoded payload (id, role, etc.)

      // Role check (if roles array provided)
      if (roles.length && !roles.includes(req.user.role)) {
        console.log("Forbidden - Role not allowed");
        return res.status(403).json({
          success: false,
          message: "Forbidden - Access denied",
        });
      }

      // ✅ Send success info (optional)
      console.log("Token valid:", req.user);
      // You can attach success info to req if needed
      req.success = {
        success: true,
        message: "Authorized successfully",
      };

      next(); // proceed to the route handler
    } catch (err) {
      console.log("Token invalid");
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  };
};

export default authMiddleware;
