const router = require("express").Router();
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

const reviewsRouter = require("../reviews/reviews.router");
const theatersRouter = require("../theaters/theaters.router");

// TODO: Add your routes here
//router.route("/:movieId/theaters").get(controller.getMovieTheaterNames).all(methodNotAllowed);
// moving this to use theatersRouter after original implementation
router.use("/:movieId/theaters", theatersRouter);

router.use("/:movieId/reviews", reviewsRouter);

router.route("/:movieId").get(controller.read).all(methodNotAllowed);
router.route("/").get(controller.list).all(methodNotAllowed);

module.exports = router;
