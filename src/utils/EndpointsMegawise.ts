declare global {
  interface Window {
    _env_: any;
  }
}
let endpoint = `http://192.168.1.169:9000`;
if (window._env_ && window._env_.API_URL) {
  endpoint = window._env_.API_URL;
}

export const Query = `${endpoint}/query`;
export const POST_TABLES_DETAIL = `${endpoint}/db/tables/detail`;
export const GET_TABLE_LIST = `${endpoint}/db/tables`;
export const POST_DB_CONFIG = `${endpoint}/config/db`;
export const POST_LOG_IN = `${endpoint}/login`;
export const GET_DBS = '';
export const POST_LOG_OUT = `${endpoint}/logout`;
