const db = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const tableName = "reviews";

//MIDDLEWARE FUNCTIONS
//Uses premade function in util to add nested critic object
const addCritics = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
});

async function destroy(reviewId) {
  // TODO: Write your code here
  return db('reviews')
  .where('review_id', reviewId)
  .del();
}

async function listWithReviews(movie_id) {
  return db("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ "r.movie_id": movie_id })
    .then((data) => {
      return data.map((item) => {
        return addCritics(item);
      });
    });
}

async function read(reviewId) {
  // TODO: Write your code here
  return db("reviews as r")
  .select("*")
  .where({ "r.review_id": reviewId })
  .first();
}

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function update(review) {
  return db(tableName)
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

module.exports = {
  destroy,
  listWithReviews,
  read,
  update,
};
