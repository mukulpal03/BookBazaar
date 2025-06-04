export const genreEnum = {
  Fiction: "fiction",
  NON_FICTION: "non_fiction",
  SCIENCE_FICTION: "science_fiction",
  Fantasy: "fantasy",
  Mystery: "mystery",
  Thriller: "thriller",
  Horror: "horror",
  Romance: "romance",
  Biography: "biography",
  History: "history",
  SELF_HELP: "self_help",
  Childrens: "childrens",
  YOUNG_ADULT: "young_adult",
  Programming: "programming",
  Other: "other",
};

export const AvailableBooksGenre = Object.values(genreEnum);

export const userRoleEnum = {
  USER: "user",
  ADMIN: "admin",
};

export const AvailableUserRoles = Object.values(userRoleEnum);
