import React, {useState, useEffect, useRef, useContext} from 'react';
import {I18nContext} from '../../contexts/I18nContext';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {
  changeRangeSliderInputBox,
  changeRangeSlider,
  getSliderStep,
} from '../../utils/EditorHelper';
import {CONFIG} from '../../utils/Consts';

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: theme.spacing(2),
  },
  root: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  inputColor: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  customInput: {
    textAlign: 'center',
    width: '85px',
  },
}));
const _mapAttrToActionType = (attr: string) => {
  switch (attr) {
    case 'pointSize':
      return CONFIG.UPDATE_POINT_SIZE;
    default:
      return CONFIG.UPDATE;
  }
};
const Range = (props: any) => {
  const {nls} = useContext(I18nContext);
  const classes = useStyles({});
  const {min, max, attr, config, setConfig, title} = props;
  const step = getSliderStep(Number.parseFloat(min), Number.parseFloat(max));
  const target = config[attr];
  const actionType = _mapAttrToActionType(attr);
  const [[minInput, maxInput], setMinMaxInput]: any = useState([
    Number.parseFloat(target.min),
    Number.parseFloat(target.max),
  ]);

  const delayCallback = ({validRange}: any) => {
    setMinMaxInput(validRange);
    setConfig({type: actionType, payload: {[attr]: {min: validRange[0], max: validRange[1]}}});
  };
  const onMinInputChange = (e: any) => {
    const val = e.target.value * 1;
    const range = [min, target.max];
    const immediateCallback = (val: number) => setMinMaxInput([val, target.max]);
    changeRangeSliderInputBox({
      val,
      range,
      step,
      target: 'min',
      immediateCallback,
      delayCallback,
    });
  };

  const onMaxInputChange = (e: any) => {
    const val = e.target.value * 1;
    const range = [target.min, max];
    const immediateCallback = (val: number) => setMinMaxInput([target.min, val]);
    changeRangeSliderInputBox({
      val,
      range,
      step,
      target: 'max',
      immediateCallback,
      delayCallback,
    });
  };

  const onSlideChange = (e: any, val: any) => {
    const immediateCallback = (val: any[]) => {
      setMinMaxInput(val);
    };
    const delayCallback = (val: any) => {
      if (val[0] === val[1]) {
        val[1] = val[0] + step;
      }
      setConfig({type: actionType, payload: {[attr]: {min: val[0], max: val[1]}}});
    };
    changeRangeSlider({val, immediateCallback, delayCallback});
  };

  const isFirstRun = useRef<boolean>(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    setMinMaxInput([Number.parseFloat(target.min), Number.parseFloat(target.max)]);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, max]);

  return (
    <>
      <p className={classes.title}>{title}</p>
      <div className={classes.root}>
        <TextField
          classes={{root: classes.customInput}}
          label={nls.label_MIN}
          value={minInput}
          onChange={onMinInputChange}
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          inputProps={{style: {textAlign: 'center'}}}
        />
        <TextField
          classes={{root: classes.customInput}}
          label={nls.label_MAX}
          value={maxInput}
          onChange={onMaxInputChange}
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          inputProps={{style: {textAlign: 'center'}}}
        />
      </div>
      <Slider
        min={Number.parseFloat(min)}
        max={Number.parseFloat(max)}
        value={[minInput, maxInput]}
        onChange={onSlideChange}
        step={step}
      />
    </>
  );
};

export default Range;
