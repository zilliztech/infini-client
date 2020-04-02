import React, {FC, useContext} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Dashboards from '../Dashboards';
import Bi from './Bi';
import Page404 from '../Page404';
import {rootContext} from '../../contexts/RootContext';
import {authContext} from '../../contexts/AuthContext';
import {queryContext} from './../../contexts/QueryContext';
import {queryMegaWiseContext} from './../../contexts/QueryMegaWiseContext';

const MainContainer: FC<any> = () => {
  const {isArctern} = useContext(rootContext);
  const {auth} = useContext(authContext);
  const {DB} = useContext(queryContext);
  const {DB: DB_MegaWise} = useContext(queryMegaWiseContext);

  if (auth.userId === 'guest') {
    return <Redirect to="/login" />;
  }
  if (isArctern && DB === false) {
    return <Redirect to="/config" />;
  }
  if (!isArctern && DB_MegaWise === false) {
    return <Redirect to="/config" />;
  }
  return (
    <Switch>
      <Route exact path="/" component={Dashboards} />
      <Route path="/bi/:id" component={Bi} />
      <Route component={Page404} />
    </Switch>
  );
};

export default MainContainer;
