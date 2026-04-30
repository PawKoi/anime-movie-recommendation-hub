import express from "express";
import { body, param, query } from "express-validator";
import { Review } from "../models/Review.js";
import { requireAuth } from "../middleware/auth.js";
import { handleValidationErrors } from "../middleware/validation.js";

const router = express.Router();

// GET /api/reviews/title/:titleId?page=1&limit=10
router.get(
  "/title/:titleId",
  [
    param("titleId").isMongoId().withMessage("Valid titleId required"),
    query("page").optional().toInt(),
    query("limit").optional().toInt()
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const page = req.query.page && req.query.page > 0 ? req.query.page : 1;
      const limit =
        req.query.limit && req.query.limit > 0 ? req.query.limit : 10;
      const skip = (page - 1) * limit;

      const filter = { titleId: req.params.titleId };

      const [items, total] = await Promise.all([
        Review.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate("userId", "email"),
        Review.countDocuments(filter)
      ]);

      res.json({
        data: items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/reviews/me (for Profile page)
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const reviews = await Review.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("titleId", "name type");
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

const reviewValidators = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("text").optional().isString()
];

// POST /api/reviews/title/:titleId (protected)
router.post(
  "/title/:titleId",
  requireAuth,
  [param("titleId").isMongoId().withMessage("Valid titleId required")],
  reviewValidators,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { rating, text } = req.body;
      const review = await Review.create({
        userId: req.user.id,
        titleId: req.params.titleId,
        rating,
        text
      });
      res.status(201).json(review);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/reviews/:id (protected, owner only)
router.put(
  "/:id",
  requireAuth,
  [param("id").isMongoId().withMessage("Valid review id required")],
  reviewValidators,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const existing = await Review.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: { message: "Review not found" } });
      }
      if (existing.userId.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ error: { message: "Not allowed to edit this review" } });
      }

      existing.rating = req.body.rating;
      existing.text = req.body.text ?? existing.text;
      await existing.save();

      res.json(existing);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/reviews/:id (protected, owner only)
router.delete(
  "/:id",
  requireAuth,
  [param("id").isMongoId().withMessage("Valid review id required")],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const existing = await Review.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: { message: "Review not found" } });
      }
      if (existing.userId.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ error: { message: "Not allowed to delete this review" } });
      }

      await existing.deleteOne();
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
