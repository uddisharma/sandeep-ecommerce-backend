const jwt = require('jsonwebtoken');

exports.authUser = async (req, res, next) => {
  try {
    let token = req.header('Authorization');

    if (token?.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login Again"
      });
    }

    const token_Decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = token_Decode.id;

    next();

  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token"
    });
  }
};
