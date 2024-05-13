const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(req, res, next) {
  const reviewId = Number(req.params.reviewId);
  const review = await service.read(reviewId);

  if (review) {
    res.locals.reviewId = reviewId;
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
}

async function destroy(request, response) {
  // TODO: Write your code here
  const reviewId = response.locals.reviewId;
  //console.log("review_id is", reviewId);
  await service.destroy(reviewId);
  response.sendStatus(204);
}

async function list(request, response) {
  // TODO: Write your code here
  // const { movie_id } = request.query;
  // const data = await service.list(movie_id);
  // response.json({ data });
  const movieId = Number(request.params.movieId);

  if (movieId) {
    const data = await service.listWithReviews(movieId);
    response.json({ data: data });
  } else {
    const data = await service.list();
    response.json({ data });
  }
}

function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

async function update(request, response) {
  // TODO: Write your code here
  const updatedReview = {
    ...request.body.data,
    review_id: response.locals.review.review_id,
  };
  const data = await service.update(updatedReview);
  response.json({ data });
}

module.exports = {
  delete: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
