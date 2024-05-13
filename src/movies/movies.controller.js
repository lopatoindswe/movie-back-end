const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(request, response, next) {
  const { movieId } = request.params;
  const movie = await service.read(movieId);
  if (movie) {
    response.locals.movie = movie;
    next();
  } else {
    next({
      status: 404,
      message: `Movie cannot be found.`,
    });
  }
}

async function read(request, response) {
  response.status(200).json({ data: response.locals.movie });
}

async function list(request, response) {
  // TODO: Add your code here.
  const { is_showing } = request.query;
  const data = await service.list(is_showing);
  // console.log(
  //   "await service.list(is_showing);",
  //   await service.list(is_showing)
  // );
  response.json({ data });
}

// moving this to use theatersRouter after original implementation
async function getMovieTheaterNames(request, response) {
  const { movieId } = request.params;
  const moviesWithTheaters = await service.getMoviesTheaters(movieId);
  //console.log(moviesWithTheaters);
  response.status(200).json({ data: moviesWithTheaters });

  // alternatively we can get all theathers and filetr them with 
  // const moviesWithTheaters = await service.getMoviesTheaters();
  // response.status(200).json({ data: moviesWithTheaters.filter(({movie_id}) => movie_id === Number(movieId)) });

  // return db("movies_theaters as mt")
    // .join("movies as m", "mt.movie_id", "m.movie_id")
    // .join("theaters as t", "mt.theater_id", "t.theater_id")
    // .select("*")
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  getMovieTheaterNames: [asyncErrorBoundary(getMovieTheaterNames), getMovieTheaterNames],
};
