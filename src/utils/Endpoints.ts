declare global {
  interface Window {
    _env_: any;
  }
}
let endpoint = `http://localhost:9000`;
if (window._env_ && window._env_.API_URL) {
  endpoint = window._env_.API_URL;
}
export const PATH_ROOT = '/';
export const PATH_LOGIN = '/login'
export const PATH_CONFIG_DB = '/config';
export const PATH_BI = '/bi';

export const Query = `${endpoint}/db/query`;
export const POST_TABLES_DETAIL = `${endpoint}/db/table/info`;
export const GET_TABLE_LIST = `${endpoint}/db/tables`;
export const GET_DBS = `${endpoint}/dbs`;
export const POST_DB_CONFIG = `${endpoint}/config/db`;
export const POST_LOG_IN = `${endpoint}/login`;
export const POST_LOG_OUT = `${endpoint}/logout`;
