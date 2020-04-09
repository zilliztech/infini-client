import React, {createContext, useContext} from 'react';
import {queryNodeContext} from './QueryContext/QueryNodeContext';
import {queryArcternContext} from './QueryContext/QueryArcternContext';
import {rootContext} from './RootContext';

export const queryContext: any = createContext({});

const Provider = queryContext.Provider;

const QueryProvider = ({children}: any) => {
  const {isArctern = false} = useContext(rootContext);
  const arctern = useContext(queryArcternContext);
  const megawise = useContext(queryNodeContext);
  const {
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
    getDB,
    setDB,
    getDBs,
    changeDBConfig,
    getMapBound,
    isFirefox,
    generalRequest,
  } = isArctern ? arctern : megawise;
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
        getDB,
        setDB,
        getDBs,
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
