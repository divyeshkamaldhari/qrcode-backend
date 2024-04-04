const { Router } = require("express");
const multer = require("multer");
const { userController } = require("../../controller");
const auth = require("../../middleware/auth");

const upload = multer();

const userRouter = new Router();

// CREATE USERS
userRouter.post("/createUser", auth, upload.none(), userController?.createUser);

// GET ALL USERS
userRouter.get(
  "/getAllUsers",
  auth,
  upload.none(),
  userController?.getAllUsers
);

// GET USER DETAILS
userRouter.get("/getUser", auth, upload.none(), userController?.getUser);
// DELETE USERS
userRouter.delete(
  "/deleteUser",
  auth,
  upload.none(),
  userController?.deleteUser
);

// UPDATE USERS
userRouter.put("/updateUser", auth, upload.none(), userController?.updateUser);

// SEARCH USERS
userRouter.put("/searchUsers", auth, userController.searchUsers);

// LOG IN USER
userRouter.post("/login", userController.login);

module.exports = {
  userRouter,
};
