const { user } = require("../../model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, role, scope, permissions } = req.body;

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new user({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      scope,
      permissions,
    });

    await newUser.save();
    res.status(200).json({
      status: true,
      message: "User Added",
      data: newUser,
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      status: true,
      message: "Internal Server Error",
      err,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const usersList = await user.find();
    res.status(200).json({
      status: true,
      message: "Users listed",
      data: usersList,
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      status: true,
      message: "Internal Server Error",
      err,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(404).json({ status: true, message: "User not found" });
    } else {
      const userDetails = await user.findOne({ _id: userId });
      return res
        .status(200)
        .json({ status: true, message: "User Details", data: userDetails });
    }
  } catch (error) {
    return res.status(500).json({
      status: true,
      message: "Error occured while getting user details",
      error: error,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userDelete = await user.findByIdAndDelete(req.query.id);
    if (!userDelete) {
      return res.status(200).json({
        status: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "User Deleted",
      data: userDelete,
    });
  } catch (err) {
    res.status(500).json({
      status: true,
      message: "Internal Server Error",
      err,
    });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updateDataOfUser = { ...req.body };

    // Fetch the original product data
    const originalUserData = await user.findById(req.query.id);

    const updateUserData = await user.findByIdAndUpdate(
      req.query.id,
      updateDataOfUser,
      { new: true }
    );

    const updatedUserData = {
      ...originalUserData.toObject(),
      ...updateDataOfUser,
    };

    if (!updateUserData) {
      return res.status(500).json({
        status: false,
        message: "Failed to update user data",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Updating user data successfully",
      data: updatedUserData,
    });
  } catch (error) {
    console.log(error);
    next();
    return res.status(500).json({
      status: false,
      message: "Error occurred while updating user",
      error,
    });
  }
};

const searchUsers = async (req, res) => {
  try {
    const searchParameter = req.query.search;

    let searchQuery = {};

    if (searchParameter) {
      searchQuery = {
        $or: [
          { firstName: { $regex: searchParameter, $options: "i" } },
          { lastName: { $regex: searchParameter, $options: "i" } },
          { role: { $regex: searchParameter, $options: "i" } },
        ],
      };
    }

    const searchUsers = await user.find(searchQuery);

    res.status(200).json({
      data: searchUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An error occurred while searching for users.",
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userData = await user.findOne({ email });

    if (!userData) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    // const { password: _, ...userDataWithoutPassword } = userData._doc;

    // Exclude the 'password' property from the token payload
    const userDataWithoutPassword = { ...userData.toObject() };
    delete userDataWithoutPassword.password;

    jwt.sign(
      { userDataWithoutPassword },
      process.env.JWT_SECRETE_KEY,
      (err, token) => {
        return res.json({
          token,
        });
      }
    );

    // return res.json({
    //   data: {
    //     ...userDataWithoutPassword,
    //     isPasswordValid,
    //   },
    // });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An error occurred while processing your request.",
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  searchUsers,
  login,
};
