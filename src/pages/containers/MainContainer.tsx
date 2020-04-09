import React, {FC, useContext} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Dashboards from '../Dashboards';
import Bi from './Bi';
import Page404 from '../Page404';
import {authContext} from '../../contexts/AuthContext';
import {PATH_LOGIN, PATH_CONFIG_DB, PATH_ROOT, PATH_BI} from '../../utils/Endpoints';
import {queryContext} from './../../contexts/QueryContext';

const MainContainer: FC<any> = () => {
  const {auth} = useContext(authContext);
  const {DB} = useContext(queryContext);

  if (auth.userId === 'guest') {
    return <Redirect to={PATH_LOGIN} />;
  }
  if (DB === false) {
    return <Redirect to={PATH_CONFIG_DB} />;
  }

  return (
    <Switch>
      <Route exact path={PATH_ROOT} component={Dashboards} />
      <Route path={`${PATH_BI}/:id`} component={Bi} />
      <Route component={Page404} />
    </Switch>
  );
};

export default MainContainer;
