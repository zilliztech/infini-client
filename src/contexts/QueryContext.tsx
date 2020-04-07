import React, {FC, createContext, useContext, ReactNode, useState} from 'react';
import axios, {AxiosRequestConfig} from 'axios';
import * as URL_A from '../utils/Endpoints';
import * as URL_M from '../utils/EndpointsMegawise';
import {authContext} from './AuthContext';
import {I18nContext} from './I18nContext';
import {rootContext} from './RootContext';
import {namespace, formatSource, restoreSource} from '../utils/Helpers';
import {DB_TYPE, Params, QueryType} from '../types';
import {isDashboardReady, getDashboardById} from '../utils/Dashboard';

const axiosInstance = axios.create();
export const queryContext = createContext<any>({});
const Provider = queryContext.Provider;

const _getDB = () => {
  const db = window.localStorage.getItem(namespace(['query'], 'db'));
  return db ? JSON.parse(db) : false;
};
const QueryProvider: FC<{children: ReactNode}> = ({children}) => {
  const {isArctern} = useContext(rootContext);
  const URL = isArctern ? URL_A : URL_M;
  const {setUnauthStatus, setAuthStatus} = useContext(authContext);
  const {widgetSettings, setDialog, setSnackbar, globalConfig} = useContext(rootContext);
  const {nls} = useContext(I18nContext);
  const [DB, _setDB] = useState<any>(_getDB());
  const setDB = (db: DB_TYPE) => {
    window.localStorage.setItem(namespace(['query'], 'db'), JSON.stringify(db));
    _setDB(db);
  };
  // ref: https://stackoverflow.com/questions/41515732/hide-401-console-error-in-chrome-dev-tools-getting-401-on-fetch-call/42986081#42986081
  // in chrome, 401 can not be catched
  // so it will be shown on the console
  const errorParser = (e: any) => {
    const statusCode = e.response && e.response.data.statusCode;
    const API_SERVER_ERROR = !statusCode;
    let errContent = statusCode && e.response.data.message + ',' + nls.tip_refresh_page;

    // update errContent based on error type
    errContent = API_SERVER_ERROR ? nls.label_server_not_found : errContent;

    // reject content
    let err = {
      isError: true,
      timestamp: Date.now(),
      statusCode,
      errContent,
    };

    // 401, just reset auth status
    if (statusCode === 401) {
      setUnauthStatus();
    } else {
      // show dialog and return to config db page
      // since most error are db errors
      setDialog({
        open: true,
        content: errContent,
        onConfirm: () => {
          window.localStorage.clear();
          _setDB(false);
        },
      });
    }

    return Promise.reject(err);
  };

  const getAxiosConfig = (params: any = {}): AxiosRequestConfig => {
    let userAuth = JSON.parse(
      window.localStorage.getItem(namespace(['login'], 'userAuth')) || '{}'
    );
    return {
      headers: {
        Authorization: `${isArctern ? 'Token' : 'Bearer'} ${userAuth && userAuth.token}`,
        ...params,
      },
    };
  };

  const getConnId = () => {
    let userAuth = JSON.parse(
      window.localStorage.getItem(namespace(['login'], 'userAuth')) || '{}'
    );
    return userAuth && userAuth.connId;
  };

  const setConnId = (connId: string) => {
    let userAuth = JSON.parse(
      window.localStorage.getItem(namespace(['login'], 'userAuth')) || '{}'
    );
    userAuth.connId = connId;
    setAuthStatus(userAuth);
  };

  const login = async (params: any) => {
    let url = URL.POST_LOG_IN;
    return await axiosInstance
      .post(url, params, getAxiosConfig())
      .then((res: any) => res.data)
      .catch(errorParser);
  };

  const getData = isArctern
    ? async (params: any) => {
        let url = URL.Query;
        const body = {id: DB && DB.id.toString(), query: params};
        console.info(params, body);
        return axiosInstance
          .post(url, {...body}, getAxiosConfig())
          .then((res: any) => {
            return res.data && res.data.data && res.data.data.result;
          })
          .catch(errorParser);
      }
    : async (params: any) => {
        let url = URL.Query;
        return axiosInstance
          .post(url, {id: getConnId(), query: params}, getAxiosConfig())
          .then((res: any) => {
            // console.info(res.data && res.data.data && res.data.data[0]);
            return res.data && res.data.data && res.data.data[0];
          })
          .catch(errorParser);
      };

  const getRowBySql = isArctern
    ? async (sql: string) => {
        let url = URL.Query;
        let params = {type: 'sql', sql};
        return axiosInstance
          .post(url, {id: DB && DB.id.toString(), query: params}, getAxiosConfig())
          .then((res: any) => {
            return res && res.data;
          })
          .catch(errorParser);
      }
    : async (sql: string) => {
        let url = URL.Query;
        let params = [{id: 'getRowBySql', sql: sql}];
        return axiosInstance
          .post(url, {id: getConnId(), query: params}, getAxiosConfig())
          .then((res: any) => {
            return res && res.data.data[0] && res.data.data[0].result;
          })
          .catch(errorParser);
      };

  const numMinMaxValRequest = isArctern
    ? async (colName: string, source: string) => {
        let sql = `SELECT MIN(${colName}) as min , MAX(${colName}) as max FROM ${restoreSource(
          source
        )}`;
        return getData({type: QueryType.sql, sql})
          .then((res: any) => {
            return res[0];
          })
          .catch(errorParser);
      }
    : async (colName: string, source: string) => {
        let url = URL.Query;
        let sql = `SELECT MIN(${colName}), MAX(${colName}) FROM ${source}`;

        return axiosInstance
          .post(url, {id: getConnId(), query: [{id: 'distinct', sql}]}, getAxiosConfig())
          .then((res: any) => {
            return res && res.data.data[0] && res.data.data[0].result && res.data.data[0].result[0];
          })
          .catch(errorParser);
      };
  const getDashBoard = isArctern
    ? async (id: number) => {
        let dashboard: any = getDashboardById(id);
        const url = URL.POST_TABLES_DETAIL;
        let sources = await getAvaliableTables();
        const options: any[] = await Promise.all(
          sources.map(async (source: string) => {
            const [id, table] = [DB && DB.id.toString(), source];
            let res = await axiosInstance.post(url, {id, table}, getAxiosConfig());
            return res && res.data.data;
          })
        );
        const totals = await Promise.all(
          sources.map(async (source: string) => {
            const params = {type: QueryType.sql, sql: `select count(*) from ${source}`};
            const res = await getData(params);
            const key = Object.keys(res[0])[0];
            return res[0][key];
          })
        );
        let sourceOptions: any = {};
        sources.forEach((source: string, i: number) => {
          sourceOptions[formatSource(source)] = options[i].sort((item1: any, item2: any) =>
            item1.col_name > item2.col_name ? 1 : -1
          );
          sourceOptions[`${formatSource(source)}rowCount`] = totals[i];
        });

        // final
        dashboard.sources = sources.map((s: string) => formatSource(s));
        dashboard.sourceOptions = sourceOptions;
        return dashboard;
      }
    : async (id: number) => {
        let dashboard: any = getDashboardById(id);
        const url = URL.POST_TABLES_DETAIL;

        return getAvaliableTables().then(sources => {
          return axiosInstance
            .post(url, {id: getConnId(), tables: sources}, getAxiosConfig())
            .then((res: any) => {
              const sourceOptions = res.data && res.data.data;
              let _sourceOptions: any = {};
              sources.forEach((source: any) => {
                let options = sourceOptions.filter((s: any) => s.name === source)[0];
                _sourceOptions[source] =
                  options &&
                  options.columnDefs
                    .sort((item1: any, item2: any) => (item1.colName > item2.colName ? 1 : -1))
                    .map((item: any) => ({col_name: item.colName, data_type: item.type}));
                if (options) {
                  _sourceOptions[`${source}rowCount`] = options.rowCount;
                }
              });
              // final
              dashboard.sources = sources;
              dashboard.sourceOptions = _sourceOptions;
              return dashboard;
            })
            .catch(errorParser);
        });
      };

  const getTxtDistinctVal = isArctern
    ? async (sql: string) => {
        return getData({sql, type: QueryType.sql});
      }
    : async (sql: string) => {
        let url = URL.Query;
        return axiosInstance
          .post(url, {id: getConnId(), query: [{id: 'distinct', sql}]}, getAxiosConfig())
          .then((res: any) => {
            return res && res.data.data[0] && res.data.data[0].result;
          })
          .catch(errorParser);
      };

  const getAvaliableTables = isArctern
    ? async () => {
        let url = URL.GET_TABLE_LIST;
        return axiosInstance
          .post(url, {id: DB && DB.id.toString()}, getAxiosConfig())
          .then((res: any) => {
            return res && res.data.data;
          })
          .catch(errorParser);
      }
    : async () => {
        let url = URL.GET_TABLE_LIST;
        return axiosInstance
          .post(url, {id: getConnId()}, getAxiosConfig())
          .then((res: any) => {
            return res && res.data.data;
          })
          .catch(errorParser);
      };

  const getDashboardList = () => {
    // console.log("get dashboard list, userId:", auth.userId);
    let dashboards: any = [];
    Object.entries(localStorage).forEach(([key, value]) => {
      if (key.indexOf('infini.dashboard') !== -1) {
        let dashboardObj = JSON.parse(value);
        // check if the config is ready, if not delete it from localStorage
        if (isDashboardReady(dashboardObj, widgetSettings)) {
          dashboards.push(dashboardObj);
        } else {
          window.localStorage.removeItem(key);
        }
      }
    });
    return Promise.resolve([...dashboards]);
  };

  const saveDashboard = (dashboardConfigs: string, id: number) => {
    window.localStorage.setItem(namespace(['dashboard'], String(id)), dashboardConfigs);
  };

  const removeDashboard = (id: string) => {
    window.localStorage.removeItem(namespace(['dashboard'], id));
    setSnackbar({open: true, message: nls.tip_remove_dashboard_success});
  };

  const getDBs = async () => {
    let url = URL.GET_DBS as string;
    return await axiosInstance.get(url, getAxiosConfig()).catch(errorParser);
  };

  const getDBConfig = async (dbId: string = '') => {
    let url = URL.POST_DB_CONFIG + (dbId ? `/${dbId}` : '');
    return await axiosInstance.get(url, getAxiosConfig()).catch(errorParser);
  };
  const changeDBConfig = async (params: any) => {
    let url = URL.POST_DB_CONFIG;
    return await axiosInstance.post(url, params, getAxiosConfig()).catch(e => errorParser(e));
  };

  // reverse geocoding to find the country,
  // so that we can make the map bound to that country
  const getMapBound = isArctern
    ? async (lng: string, lat: string, table: string) => {
        let url = URL.Query;
        const sql = `SELECT ${lng}, ${lat} FROM ${restoreSource(
          table
        )} WHERE ${lng} IS NOT NULL AND ${lat} IS NOT NULL LIMIT 1`;
        let params: Params = {type: QueryType.sql, sql};
        return axiosInstance
          .post(url, {id: DB && DB.id.toString(), query: params}, getAxiosConfig())
          .then((res: any) => {
            const lngLat = res && res.data && res.data.data.result;
            if (lngLat.length > 0) {
              const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat[0][lng]},${lngLat[0][lat]}.json?access_token=${globalConfig.MAPBOX_ACCESS_TOKEN}`;

              return axiosInstance.get(geocodingUrl).then((res: any) => {
                const features = res && res.data && res.data.features;
                const country = features[features.length - 1];
                return country && country.bbox;
              });
            }
            return Promise.resolve(true);
          });
      }
    : async (lng: string, lat: string, table: string) => {
        let url = URL.Query;
        const sql = `SELECT ${lng}, ${lat} FROM ${table} WHERE ${lng} IS NOT NULL AND ${lat} IS NOT NULL LIMIT 1`;
        let params = [{id: 'lonLatReq', sql: sql}];
        return axiosInstance
          .post(url, {id: getConnId(), query: params}, getAxiosConfig())
          .then((res: any) => {
            const lngLat = res && res.data.data[0] && res.data.data[0].result;
            if (lngLat.length > 0) {
              const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat[0][lng]},${lngLat[0][lat]}.json?access_token=${globalConfig.MAPBOX_ACCESS_TOKEN}`;

              return axiosInstance.get(geocodingUrl).then((res: any) => {
                const features = res && res.data && res.data.features;
                const country = features[features.length - 1];
                return country && country.bbox;
              });
            }
            return Promise.resolve(true);
          })
          .catch(errorParser);
      };

  const generalRequest = isArctern
    ? async (sql: string) => {
        return getData({sql, type: QueryType.sql});
      }
    : async ({id, sql}: any) => {
        let url = URL.Query;
        return axiosInstance
          .post(url, {id: getConnId(), query: [{id, sql}]}, getAxiosConfig())
          .then((res: any) => {
            return res && res.data && res.data.data[0] && res.data.data[0].result;
          })
          .catch(errorParser);
      };
  const binRangeRequest = isArctern
    ? async (sql: string) => {
        const arr = sql.split('FROM ');
        const [head, rest] = [arr[0], restoreSource(arr[1])];
        sql = `${head} FROM ${rest}`;
        const params = {sql, type: QueryType.sql};
        const res = await getData(params);
        return res[0];
      }
    : async (sql: string) => {
        let url = URL.Query;
        return axiosInstance
          .post(
            url,
            {
              id: getConnId(),
              query: [
                {
                  sql,
                  id: 'ahhhh',
                },
              ],
            },
            getAxiosConfig()
          )
          .then((res: any) => {
            if (res && res.data.data[0] && res.data.data[0].err) {
              return {};
            }
            return res && res.data.data[0] && res.data.data[0].result && res.data.data[0].result[0];
          })
          .catch(errorParser);
      };

  // check if the browser is firefox
  const isFirefox = /firefox/i.test(navigator.userAgent);
  return (
    <Provider
      value={{
        getConnId,
        setConnId,
        login,
        getData,
        getRowBySql,
        numMinMaxValRequest,
        getTxtDistinctVal,
        getDashBoard,
        getDashboardList,
        saveDashboard,
        removeDashboard,
        getAvaliableTables,
        binRangeRequest,
        DB,
        getDB: _getDB,
        setDB,
        getDBs,
        getDBConfig,
        changeDBConfig,
        getMapBound,
        isFirefox,
        generalRequest,
      }}
    >
      {children}
    </Provider>
  );
};

export default QueryProvider;
