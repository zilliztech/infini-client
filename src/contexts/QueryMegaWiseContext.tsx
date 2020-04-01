import React, {FC, createContext, useContext, ReactNode, useState} from 'react';
import axios, {AxiosRequestConfig} from 'axios';
import * as URL from '../utils/EndpointsMegawise';
import {authContext} from './AuthContext';
import {I18nContext} from './I18nContext';
import {rootContext} from './RootContext';
import {namespace} from '../utils/Helpers';
import {DBSetting} from '../types';
import {isDashboardReady, getDashboardById} from '../utils/Dashboard';

const axiosInstance = axios.create();
export const queryContext = createContext<any>({});

const {Provider} = queryContext;
const QueryProvider: FC<{children: ReactNode}> = ({children}) => {
  const {setUnauthStatus, setAuthStatus} = useContext(authContext);
  const {widgetSettings, setDialog, setSnackbar, globalConfig} = useContext(rootContext);
  const {nls} = useContext(I18nContext);
  const [dbSetting, setDBSetting] = useState<DBSetting | -1>();
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
          setDBSetting(-1);
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
      headers: {Authorization: `Bearer ${userAuth && userAuth.token}`, ...params},
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

  const getData = (params: any) => {
    let url = URL.GET_DATA;
    return axiosInstance
      .post(url, {id: getConnId(), query: params}, getAxiosConfig())
      .then((res: any) => {
        return res.data && res.data.data && res.data.data[0];
      })
      .catch(errorParser);
  };

  const getRowBySql = (sql: string) => {
    let url = URL.GET_DATA;
    let params = [{id: 'getRowBySql', sql: sql}];
    return axiosInstance
      .post(url, {id: getConnId(), query: params}, getAxiosConfig())
      .then((res: any) => {
        return res && res.data.data[0] && res.data.data[0].result;
      })
      .catch(errorParser);
  };

  const binRangeRequest = (params: any) => {
    let url = URL.GET_DATA;
    return axiosInstance
      .post(url, {id: getConnId(), ...params}, getAxiosConfig())
      .then((res: any) => {
        if (res && res.data.data[0] && res.data.data[0].err) {
          return {};
        }
        return res && res.data.data[0] && res.data.data[0].result && res.data.data[0].result[0];
      })
      .catch(errorParser);
  };

  const numMinMaxValRequest = (colName: string, source: string) => {
    let url = URL.GET_DATA;
    let sql = `SELECT MIN(${colName}), MAX(${colName}) FROM ${source}`;

    return axiosInstance
      .post(url, {id: getConnId(), query: [{id: 'distinct', sql}]}, getAxiosConfig())
      .then((res: any) => {
        return res && res.data.data[0] && res.data.data[0].result && res.data.data[0].result[0];
      })
      .catch(errorParser);
  };
  const getDashBoard = (id: number) => {
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
              options.columnDefs.sort((item1: any, item2: any) =>
                item1.colName > item2.colName ? 1 : -1
              );
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

  const getTxtDistinctVal = (sql: string) => {
    let url = URL.GET_DATA;
    return axiosInstance
      .post(url, {id: getConnId(), query: [{id: 'distinct', sql}]}, getAxiosConfig())
      .then((res: any) => {
        return res && res.data.data[0] && res.data.data[0].result;
      })
      .catch(errorParser);
  };

  const getAvaliableTables = () => {
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

  const getDBConfig = async (dbId: string = '') => {
    let url = URL.GET_DB_CONFIG + (dbId ? `/${dbId}` : '');
    return await axiosInstance.get(url, getAxiosConfig()).catch(errorParser);
  };

  const changeDBConfig = async (params: any) => {
    let url = URL.POST_DB_CONFIG;
    return await axiosInstance.post(url, params, getAxiosConfig()).catch(e => errorParser(e));
  };

  // reverse geocoding to find the country,
  // so that we can make the map bound to that country
  const getMapBound = (lng: string, lat: string, table: string) => {
    let url = URL.GET_DATA;
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

  const generalRequest = ({id, sql}: any) => {
    let url = URL.GET_DATA;
    return axiosInstance
      .post(url, {id: getConnId(), query: [{id, sql}]}, getAxiosConfig())
      .then((res: any) => {
        return res && res.data && res.data.data[0] && res.data.data[0].result;
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
        binRangeRequest,
        numMinMaxValRequest,
        getTxtDistinctVal,
        getDashBoard,
        getDashboardList,
        saveDashboard,
        removeDashboard,
        getAvaliableTables,
        dbSetting,
        setDBSetting,
        getDBConfig,
        getMapBound,
        changeDBConfig,
        isFirefox,
        generalRequest,
      }}
    >
      {children}
    </Provider>
  );
};
export default QueryProvider;
