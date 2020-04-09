import React, {FC, useContext, useEffect} from 'react';
import clsx from 'clsx';
import {withRouter} from 'react-router-dom';
import {makeStyles, useTheme, Theme} from '@material-ui/core/styles';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Drawer from '@material-ui/core/Drawer';
import Logo from '../../logo.svg';
import {rootContext} from '../../contexts/RootContext';
import {I18nContext} from '../../contexts/I18nContext';
import {namespace} from '../../utils/Helpers';

import {genBasicStyle} from '../../utils/Theme';
import {PATH_ROOT, PATH_CONFIG_DB} from '../../utils/Endpoints';
const useStyles = makeStyles((theme: Theme) => ({
  ...genBasicStyle(theme.palette.primary.main),
  paper: {
    backgroundColor: '#000',
  },
  muiRoot: {
    width: theme.spacing(8),
  },
  logo: {
    background: `url(${Logo}) no-repeat center`,
    width: theme.spacing(8),
    height: '100px',
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
  },
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    color: '#fff',
    fontSize: '3px',
    paddingBottom: theme.spacing(2),
  },
  selected: {
    color: theme.palette.primary.main,
  },
  icon: {
    fontSize: '2rem',
    marginBottom: theme.spacing(1),
  },
  settingIcon: {
    fontSize: '1.5rem',
  },
}));

const Nav: FC<any> = (props: any) => {
  const {theme} = useContext(rootContext);
  const {nls} = useContext(I18nContext);
  const _theme = useTheme();
  const {onAvatarClick} = props;
  const classes = useStyles(_theme);
  let path = props.history.location.pathname;
  const auth = JSON.parse(window.localStorage.getItem(namespace(['login'], 'userAuth')) || '');

  useEffect(() => {
    document.body.setAttribute('style', `background-color: ${_theme.palette.background.default};`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return (
    <Drawer
      className={classes.muiRoot}
      classes={{paper: classes.paper}}
      variant="permanent"
      anchor="left"
    >
      <div className={classes.logo} onClick={() => props.history.push(PATH_ROOT)}></div>
      <div className={classes.container}>
        <div
          className={clsx(classes.wrapper, classes.hover, {[classes.selected]: path === PATH_ROOT})}
          title={nls.label_dashboards}
        >
          <DashboardIcon
            onClick={() => props.history.push(PATH_ROOT)}
            classes={{root: classes.icon}}
          />
        </div>
        <div>
          {auth && auth.userId !== 'demo' && (
            <div className={clsx(classes.wrapper, classes.hover)}>
              <SettingsIcon
                classes={{root: classes.settingIcon}}
                onClick={() => props.history.push(PATH_CONFIG_DB)}
              />
            </div>
          )}
          <div className={clsx(classes.wrapper, classes.hover)}>
            <ExitToAppIcon onClick={onAvatarClick} classes={{root: classes.settingIcon}} />
          </div>
        </div>
      </div>
    </Drawer>
  );
  // theme config, do not need right now
  // <NativeSelect
  //   classes={{root: classes.naveSelect}}
  //   value={theme}
  //   onChange={(e: any) => {
  //     saveTheme(e.target.value);
  //   }}
  // >
  //   {themes.map((theme: string) => {
  //     return (
  //       <option value={theme} key={theme}>
  //         {theme}
  //       </option>
  //     );
  //   })}
  // </NativeSelect>;
};

export default withRouter(Nav);
