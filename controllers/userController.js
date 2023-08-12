//npm i express-async-handler
//npm i bcrypt
//npm i jsonwebtoken
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
//@desc Register a user
//@route POST /api/users/register
//@access public

const registerUser = asyncHandler(async (request, response) => {
  const { username, email, password } = request.body;
  if (!username || !email || !password) {
    response.status(400);
    throw new Error("All fields are mandatory");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    response.status(400);
    throw new Error("User already registered");
  }

  //Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log(`User Created ${user}`);
  if (user) {
    response.status(201).json({ _id: user.id, email: user.email });
  } else {
    response.status(400);
    throw new Error("User data is not valid");
  }
  response.json({ message: "Register the user" });
});

//@desc Login user
//@route POST /api/users/login
//@access public

const loginUser = asyncHandler(async (request, response) => {
  const { email, password } = request.body;
  if (!email || !password) {
    response.status(400);
    throw new Error("All fields are mandatory");
  }
  const user = await User.findOne({ email });
  //compare password with hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "15m" }
    );
    response.status(200).json({ accessToken });
  } else {
    response.status(401);
    throw new Error("email or password is not valid");
  }
});

//@desc Current user info
//@route POST /api/users/current
//@access private

const currentUser = asyncHandler(async (request, response) => {
  response.json(request.user);
});

module.exports = { registerUser, loginUser, currentUser };
