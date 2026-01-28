export const BASE_URL = "http://localhost:4000/api";

/* ================= AUTH ================= */
export const AUTH_API = {
  LOGIN: BASE_URL + "/auth/login",
  SETUP_ADMIN: BASE_URL + "/auth/setup-admin",
  REGISTER_RESIDENT: BASE_URL + "/auth/register",
  CREATE_SECURITY: BASE_URL + "/auth/create-security",
};

/* ================= WING ================= */
export const WING_API = {
  CREATE: BASE_URL + "/wing",
  GET_ALL: BASE_URL + "/wing",
};

/* ================= FLAT ================= */
export const FLAT_API = {
  CREATE: BASE_URL + "/flat",
  GET_BY_WING: (wingId) => BASE_URL + `/flat/wing/${wingId}`,
};

/* ================= FLAT REQUEST ================= */
export const FLAT_REQUEST_API = {
  CREATE: BASE_URL + "/flat-requests",
  GET_ALL: BASE_URL + "/flat-requests",
  RESIDENT_RESPONSE: (id) =>
    BASE_URL + `/flat-requests/${id}/resident-response`,
  ADMIN_DECISION: (id) =>
    BASE_URL + `/flat-requests/${id}/admin-decision`,
};

/* ================= COMPLAINT ================= */
export const COMPLAINT_API = {
  CREATE: BASE_URL + "/complaints",
  MY_COMPLAINTS: BASE_URL + "/complaints/my",
  GET_ALL: BASE_URL + "/complaints",
  UPDATE_STATUS: (id) =>
    BASE_URL + `/complaints/${id}/status`,
  DELETE: (id) =>
    BASE_URL + `/complaints/${id}`,
};

/* ================= MAINTENANCE ================= */
export const MAINTENANCE_API = {
  CREATE: BASE_URL + "/maintenance",
  MY: BASE_URL + "/maintenance/my",
  PAY: (id) =>
    BASE_URL + `/maintenance/pay/${id}`,
};

/* ================= NOTICE ================= */
export const NOTICE_API = {
  CREATE: BASE_URL + "/notice",
  GET_ALL: BASE_URL + "/notice",
  MY: BASE_URL + "/notice/my",
  RESPOND: (id) =>
    BASE_URL + `/notice/${id}/respond`,
};

/* ================= VISITOR ================= */
export const VISITOR_API = {
  ENTRY: BASE_URL + "/visitor/entry",
  EXIT: (id) =>
    BASE_URL + `/visitor/exit/${id}`,
};