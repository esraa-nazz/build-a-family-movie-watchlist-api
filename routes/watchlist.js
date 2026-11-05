
import express from "express";

import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";

import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie
} from "../utils/db.js";

const router = express.Router();

// GET: View a user's watchlist
router.get("/:userId", authenticate, (req, res) => {
  const { userId } = req.params;

  const watchlist = getWatchlist(Number(userId));

  if (watchlist === null) {
    return res.status(404).json({
      error: "User not found."
    });
  }

  return res.status(200).json(watchlist);
});

// POST: Add a movie
router.post(
  "/:userId/movies",
  authenticate,
  authorizeModification,
  (req, res) => {
    const { userId } = req.params;
    const { title, genre } = req.body;

    const movie = addMovie(Number(userId), { title, genre });

    if (movie === null) {
      return res.status(404).json({
        error: "User not found."
      });
    }

    return res.status(201).json(movie);
  }
);

// PUT: Update a movie
router.put(
  "/:userId/movies/:movieId",
  authenticate,
  authorizeModification,
  (req, res) => {
    const { userId, movieId } = req.params;

    const movie = updateMovie(
      Number(userId),
      Number(movieId),
      req.body
    );

    if (movie === null) {
      return res.status(404).json({
        error: "Movie or user not found."
      });
    }

    return res.status(200).json(movie);
  }
);

// DELETE: Remove a movie
router.delete(
  "/:userId/movies/:movieId",
  authenticate,
  authorizeModification,
  (req, res) => {
    const { userId, movieId } = req.params;

    const deleted = deleteMovie(
      Number(userId),
      Number(movieId)
    );

    if (deleted === null) {
      return res.status(404).json({
        error: "Movie or user not found."
      });
    }

    return res.status(200).json({
      message: "Movie deleted successfully."
    });
  }
);

export default router;
