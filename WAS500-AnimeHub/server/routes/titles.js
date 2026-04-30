import express from "express";
import { body, query } from "express-validator";
import { Title } from "../models/Title.js";
import { requireAuth } from "../middleware/auth.js";
import { handleValidationErrors } from "../middleware/validation.js";

const router = express.Router();

// GET /api/titles?type=anime&genre=action&q=naruto&page=1&limit=10&sort=year
router.get(
  "/",
  [
    query("page").optional().toInt(),
    query("limit").optional().toInt(),
    query("sort").optional().trim()
  ],
  async (req, res, next) => {
    try {
      const page = req.query.page && req.query.page > 0 ? req.query.page : 1;
      const limit =
        req.query.limit && req.query.limit > 0 ? req.query.limit : 10;
      const skip = (page - 1) * limit;

      const filter = {};
      if (req.query.type) filter.type = req.query.type;
      if (req.query.genre) filter.genres = req.query.genre;
      if (req.query.q) filter.name = { $regex: req.query.q, $options: "i" };

      let sort = { createdAt: -1 };
      if (req.query.sort) {
        const field = req.query.sort.replace("-", "");
        const direction = req.query.sort.startsWith("-") ? -1 : 1;
        sort = { [field]: direction };
      }

      const [items, total] = await Promise.all([
        Title.find(filter).sort(sort).skip(skip).limit(limit),
        Title.countDocuments(filter)
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

// GET /api/titles/:id
router.get("/:id", async (req, res, next) => {
  try {
    const title = await Title.findById(req.params.id);
    if (!title) {
      return res.status(404).json({ error: { message: "Title not found" } });
    }
    res.json(title);
  } catch (err) {
    next(err);
  }
});

const titleValidators = [
  body("name").notEmpty().withMessage("Name is required"),
  body("type")
    .isIn(["Anime", "Movie"])
    .withMessage("Type must be 'Anime' or 'Movie'")
];

// POST /api/titles  (protected)
router.post(
  "/",
  requireAuth,
  titleValidators,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { name, type, genres, year, synopsis, poster } = req.body;
      const title = await Title.create({
        name,
        type,
        genres: genres || [],
        year,
        synopsis,
        poster,
        ownerId: req.user.id
      });
      res.status(201).json(title);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/titles/:id  (protected)
router.put(
  "/:id",
  requireAuth,
  titleValidators,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const existing = await Title.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: { message: "Title not found" } });
      }
      if (existing.ownerId.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ error: { message: "Not allowed to edit this title" } });
      }

      const { name, type, genres, year, synopsis, poster } = req.body;
      existing.name = name;
      existing.type = type;
      existing.genres = genres || [];
      existing.year = year;
      existing.synopsis = synopsis;
      existing.poster = poster;
      await existing.save();

      res.json(existing);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/titles/:id  (protected)
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const existing = await Title.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: { message: "Title not found" } });
    }
    if (existing.ownerId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: { message: "Not allowed to delete this title" } });
    }
    await existing.deleteOne();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});


// GET /api/titles/ai/recommendation  (mock AI suggestion)
router.get("/ai/recommendation", async (req, res, next) => {
  try {
    const count = await Title.countDocuments({});
    if (count === 0) {
      return res.json({
        title: null,
        message: "No titles available for recommendation."
      });
    }

    const randomIndex = Math.floor(Math.random() * count);
    const [picked] = await Title.find({}).skip(randomIndex).limit(1);

    const reasons = [
      "based on recent trends in fantasy and drama",
      "because similar users rated it highly",
      "due to a strong combination of genre and year",
      "because it balances story, visuals, and pacing well"
    ];
    const reason = reasons[Math.floor(Math.random() * reasons.length)];

    res.json({
      title: picked,
      explanation: `Suggested ${picked.type} recommendation ${reason}.`
    });
  } catch (err) {
    next(err);
  }
});

export default router;
