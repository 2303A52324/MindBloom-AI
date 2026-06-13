const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = (req, res, next) => {
  let token;

  // Check for token in cookies or Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // In express 4, we use .then().catch() or just promise resolution,
    // but middleware can just assign the decoded ID.
    // It's safer to fetch the user to ensure they still exist.
    User.findById(decoded.id)
      .then(user => {
        if (!user) {
          return res.status(401).json({ success: false, error: 'User not found' });
        }
        req.user = user;
        next();
      })
      .catch(err => {
        res.status(500).json({ success: false, error: 'Server error during authentication' });
      });
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `User role ${req.user ? req.user.role : 'unknown'} is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
