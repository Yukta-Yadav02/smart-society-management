export const BASE_URL = "http://localhost:4000/api";

/* ================= AUTH ================= */
export const AUTH_API = {
  LOGIN: BASE_URL + "/auth/login",
  SETUP_ADMIN: BASE_URL + "/auth/setup-admin",
  REGISTER_RESIDENT: BASE_URL + "/auth/register",
  CREATE_SECURITY: BASE_URL + "/auth/create-security",
  GET_ALL_RESIDENTS: BASE_URL + "/auth/residents",
  UPDATE_RESIDENT: (id) => BASE_URL + `/auth/update-resident/${id}`,
  DELETE_USER: (id) => BASE_URL + `/auth/delete-user/${id}`,
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
  GET_ALL: BASE_URL + "/flat",
  ASSIGN: BASE_URL + "/flat/assign",
  VACATE: (flatId) => BASE_URL + `/flat/vacate/${flatId}`,
};

/* ================= FLAT REQUEST ================= */
export const FLAT_REQUEST_API = {
  CREATE: BASE_URL + "/flat-requests",             
  GET_MY_REQUESTS: BASE_URL + "/flat-requests",     
  GET_TRANSFER_REQUESTS: BASE_URL + "/flat-requests/transfer-requests",

  GET_ALL: BASE_URL + "/flat-requests/all",         

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
  GENERATE: BASE_URL + "/maintenance/generate",
  GET_ALL: BASE_URL + "/maintenance/all",
  MY: BASE_URL + "/maintenance/my",
  PAY: (id) =>
    BASE_URL + `/maintenance/pay/${id}`,
  DELETE: (id) =>
    BASE_URL + `/maintenance/${id}`,
  DELETE_ALL: BASE_URL + "/maintenance/delete-all",
};

/* ================= NOTICE ================= */
export const NOTICE_API = {
  CREATE: BASE_URL + "/notice",
  GET_ALL: BASE_URL + "/notice",
  GET_MY: BASE_URL + "/notice/my",
  RESPOND: (id) =>
    BASE_URL + `/notice/${id}/respond`,
  DELETE: (id) =>
    BASE_URL + `/notice/${id}`,
};

/* ================= DASHBOARD ================= */
export const DASHBOARD_API = {
  GET_STATS: BASE_URL + "/dashboard/admin-stats",
  GET_RESIDENT_STATS: BASE_URL + "/dashboard/resident-stats",
};

/* ================= VISITOR ================= */
export const VISITOR_API = {
  ENTRY: BASE_URL + "/visitor/entry",
  GET_ACTIVE: BASE_URL + "/visitor/active",
  EXIT: (id) =>
    BASE_URL + `/visitor/exit/${id}`,
};

/* ================= RESIDENT DASHBOARD ================= */
export const DATA_API = {
  DASHBOARD: BASE_URL + "/resident/dashboard",
  COMPLAINTS: BASE_URL + "/resident/complaints",
  MAINTENANCE: BASE_URL + "/resident/maintenance",
  NOTICES: BASE_URL + "/resident/notices",
};