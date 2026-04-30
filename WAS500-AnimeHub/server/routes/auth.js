import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { User } from "../models/User.js";
import { handleValidationErrors } from "../middleware/validation.js";

const router = express.Router();

const registerValidators = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
];

router.post(
  "/register",
  registerValidators,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const existing = await User.findOne({ email });
      if (existing) {
        return res
          .status(409)
          .json({ error: { message: "Email already registered" } });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ email, passwordHash });

      const token = jwt.sign(
        { sub: user._id.toString(), email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(201).json({
        user: { id: user._id, email: user.email, role: user.role },
        token
      });
    } catch (err) {
      next(err);
    }
  }
);

const loginValidators = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required")
];

router.post(
  "/login",
  loginValidators,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(401)
          .json({ error: { message: "Invalid email or password" } });
      }

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) {
        return res
          .status(401)
          .json({ error: { message: "Invalid email or password" } });
      }

      const token = jwt.sign(
        { sub: user._id.toString(), email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        user: { id: user._id, email: user.email, role: user.role },
        token
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
