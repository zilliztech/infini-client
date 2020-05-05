import React, {FC, useState, useContext, useEffect} from 'react';
import {Redirect, RouteComponentProps} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Spinner from '../components/common/Spinner';
import {authContext} from '../contexts/AuthContext';
import {I18nContext} from '../contexts/I18nContext';
import {queryContext} from '../contexts/QueryContext';
import {rootContext} from '../contexts/RootContext';
import {DBSetting} from '../types';
import {PATH_ROOT} from '../utils/Endpoints';

const useStyles = makeStyles(() => ({
  dataBaseConfiger: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  customContainer: {
    flexGrow: 1,
    display: 'flex',
  },
  title: {
    paddingLeft: '20px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  customDivider: {
    marginBottom: '20px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
  paper: {
    flexGrow: 1,
    display: 'flex',
  },
  form: {
    paddingTop: '20px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'left',
  },
  buttonList: {
    margin: '16px 0 20px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submit: {},
}));

const DbSetting: FC<RouteComponentProps> = props => {
  const classes = useStyles();
  const {auth} = useContext(authContext);
  const {DB, changeDBConfig, setDB, setConnId} = useContext(queryContext);
  const {setDialog} = useContext(rootContext);
  const {nls} = useContext(I18nContext);
  const [loading, setLoading] = useState(false);
  const [localDbSetting, setLocalDbSetting] = useState<DBSetting>(DB);

  const handleSetSuccess = () => {
    props.history.push(PATH_ROOT);
  };

  const handleSetFail = () => {};

  const checkIsValid = () => {
    const {host, database, username, password, port} = localDbSetting;
    return [host, database, username, password, port].every(
      (str: any) => str && str.toString().length > 0
    );
  };

  const onSubmit = () => {
    if (!checkIsValid()) {
      setDialog({
        open: true,
        title: nls.label_db_fail_title,
        content: nls.label_db_fail_content,
        onConfirm: handleSetFail,
      });
      return;
    }
    setLoading(true);

    changeDBConfig(localDbSetting).then((res: any) => {
      setLoading(false);
      if (res.data.status === 'success') {
        setDB(localDbSetting);
        setConnId(res.data.data.id);
        setDialog({
          open: true,
          title: nls.label_db_success_title,
          content: nls.label_db_success_content,
          onConfirm: handleSetSuccess,
        });
      }
    });
  };

  useEffect(() => {
    setLocalDbSetting(DB);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(DB)]);

  if (auth.userId === 'guest') {
    return <Redirect to="/login" />;
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={classes.dataBaseConfiger}>
      <div className={classes.title}>
        <h1>{nls.label_db_title}</h1>
      </div>
      <Divider classes={{root: classes.customDivider}} />
      <Container classes={{root: classes.customContainer}} component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <form className={classes.form} noValidate method="post">
            <Select
              value={localDbSetting.type || ''}
              onChange={(e: any) => setLocalDbSetting({...localDbSetting, type: e.target.value})}
            >
              <MenuItem value="postgres">postgres</MenuItem>
            </Select>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="host"
              label={nls.label_db_ip}
              name="host"
              value={localDbSetting.host || ''}
              onChange={e => setLocalDbSetting({...localDbSetting, host: e.target.value})}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="username"
              label={nls.label_db_username}
              type="username"
              id="username"
              value={localDbSetting.username || ''}
              onChange={e => setLocalDbSetting({...localDbSetting, username: e.target.value})}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label={nls.label_db_password}
              type="password"
              id="password"
              value={localDbSetting.password || ''}
              onChange={e => setLocalDbSetting({...localDbSetting, password: e.target.value})}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="database"
              label={nls.label_db_database}
              type="database"
              id="database"
              value={localDbSetting.database || ''}
              onChange={e => setLocalDbSetting({...localDbSetting, database: e.target.value})}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="port"
              label={nls.label_db_port}
              type="port"
              id="port"
              value={localDbSetting.port || ''}
              onChange={e => setLocalDbSetting({...localDbSetting, port: Number(e.target.value)})}
            />
            <div className={classes.buttonList}>
              <Button
                size="medium"
                variant="contained"
                className={classes.submit}
                onClick={onSubmit}
              >
                {nls.label_db_connect}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default DbSetting;
