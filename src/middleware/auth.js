const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      let user = jwt.verify(token, process.env.JWT_SECRETE_KEY);
      req.userId = user.userDataWithoutPassword._id;
    } else {
      res.status(401).json({ message: "Unauthorized User" });
    }
    next();
  } catch (err) {
    console.log("error", err);
    res.status(401).json({ message: "Unauthorized User" });
  }
};

module.exports = auth;
