// src/services/apis.js

export const BASE_URL = "http://localhost:4000/api";

/* ================= AUTH ================= */
export const AUTH_API = {
  LOGIN: BASE_URL + "/auth/login",
  SETUP_ADMIN: BASE_URL + "/auth/signup",
//   CREATE_USER: BASE_URL + "/auth/create-user",
};

/* ================= FLAT ================= */
export const FLAT_API = {
  CREATE_FLAT: BASE_URL + "/flat",
  ASSIGN_FLAT: BASE_URL + "/flat/assign",
  GET_ALL_FLATS: BASE_URL + "/flat",
  GET_VACANT_FLATS: BASE_URL + "/flat/vacant",
};

/* ================= FLAT APPLICATION ================= */
export const FLAT_APPLICATION_API = {
  APPLY: BASE_URL + "/flat-application",
  GET_ALL: BASE_URL + "/flat-application",
  APPROVE: (id) => BASE_URL + `/flat-application/${id}/approve`,
};

/* ================= COMPLAINT ================= */
export const COMPLAINT_API = {
  CREATE: BASE_URL + "/complaint",
  MY_COMPLAINTS: BASE_URL + "/complaint/my",
  GET_ALL: BASE_URL + "/complaint",
  UPDATE_STATUS: (id) => BASE_URL + `/complaint/${id}/status`,
};

/* ================= MAINTENANCE ================= */
export const MAINTENANCE_API = {
  CREATE: BASE_URL + "/maintenance",
  GET_ALL: BASE_URL + "/maintenance",
  BY_FLAT: (flatId) => BASE_URL + `/maintenance/flat/${flatId}`,
  PAY: (id) => BASE_URL + `/maintenance/${id}/pay`,
};

/* ================= NOTICE ================= */
export const NOTICE_API = {
  CREATE: BASE_URL + "/notice",
  GET_ALL: BASE_URL + "/notice",
};

/* ================= VISITOR ================= */
export const VISITOR_API = {
  ADD: BASE_URL + "/visitor",
  EXIT: (id) => BASE_URL + `/visitor/${id}/exit`,
  GET_ALL: BASE_URL + "/visitor",
  TODAY: BASE_URL + "/visitor/today",
};
