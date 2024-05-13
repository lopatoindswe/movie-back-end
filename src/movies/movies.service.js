const db = require("../db/connection");

async function list(is_showing) {
  return db("movies")
    .select("movies.*")
    .modify((queryBuilder) => {
      if (is_showing) {
        queryBuilder
          .join(
            "movies_theaters",
            "movies.movie_id",
            "movies_theaters.movie_id"
          )
          .where({ "movies_theaters.is_showing": true })
          .groupBy("movies.movie_id");
      }
    });
}

async function read(movieId) {
  // TODO: Add your code here
  return db("movies")
    .select("*")
    .where("movie_id", movieId)
    .first();
}

// async function getMoviesTheaters() {
//   return db("movies_theaters as mt")
//     .join("movies as m", "mt.movie_id", "m.movie_id")
//     .join("theaters as t", "mt.theater_id", "t.theater_id")
//     .select("*")
// }

// moving this to use theatersRouter and theathers service after original implementation
async function getMoviesTheaters(movieId) {
  return db("movies_theaters as mt")
    .join("movies as m", "mt.movie_id", "m.movie_id")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("t.*", "mt.*")
    .where("m.movie_id", movieId);
}

module.exports = {
  list,
  read,
  getMoviesTheaters,
};
