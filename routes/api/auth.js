const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../../controllers/authController");
const User = require("../../models/userModel");
const tokenHandler = require("../../middleware/tokenHandler");
const { validate } = require("../../middleware/catchValidator");

router.post(
  "/login",
  body("identifier").notEmpty().withMessage("Username cannot be empty"),
  body("password").notEmpty().withMessage("Password cannot be empty"),
  validate,
  authController.login
);
router.post(
  "/register",
  body("username")
    .notEmpty()
    .withMessage("Username cannot be empty")
    .isString()
    .withMessage("Username must be a string"),
  body("email")
    .notEmpty()
    .withMessage('"email" is not allowed to be empty')
    .isEmail()
    .withMessage("Not a valid e-mail address")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ where: { email: req.body.email } });
      if (user) {
        throw new Error("User already exists");
      }
    }),
  body("password").notEmpty().withMessage("Password cannot be empty"),
  body("password2")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  validate,
  authController.register
);

router.get("/logout", authController.logout);
router.get("/refresh", authController.refresh);

router.get("/verify", tokenHandler.verifyAccessToken, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;
