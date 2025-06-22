export const genreEnum = {
  FICTION: "FICTION",
  NON_FICTION: "NON_FICTION",
  SCIENCE_FICTION: "SCIENCE_FICTION",
  FANTASY: "FANTASY",
  MYSTERY: "MYSTERY",
  THRILLER: "THRILLER",
  HORROR: "HORROR",
  ROMANCE: "ROMANCE",
  BIOGRAPHY: "BIOGRAPHY",
  History: "history",
  SELF_HELP: "SELF_HELP",
  CHILDRENS: "CHILDRENS",
  YOUNG_ADULT: "YOUNG_ADULT",
  PROGRAMMING: "PROGRAMMING",
  OTHER: "otherOTHER",
};

export const AvailableBooksGenre = Object.values(genreEnum);

export const userRoleEnum = {
  USER: "USER",
  ADMIN: "ADMIN",
};

export const AvailableUserRoles = Object.values(userRoleEnum);

export const orderStatusEnum = {
  PENDING: "PENDING",
  PAID: "PAID",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

export const AvailableOrderStatus = Object.values(orderStatusEnum);

export const paginationOptions = ({
  page,
  limit,
  sort = { createdAt: -1 },
  customLabels = {},
} = {}) => {
  return {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort,
    customLabels: {
      docs: "docs",
      totalDocs: "totalDocs",
      ...customLabels,
    },
  };
};

export const paymentStatusEnum = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
};

export const AvailablePaymentStatus = Object.values(paymentStatusEnum);
