import {makeSetting} from '../../utils/Setting';
import {solverGetter, genColorItem} from '../Utils/settingHelper';
import {cloneObj} from '../../utils/Helpers';
import {dimensionGetter} from '../../utils/WidgetHelpers';
import {CONFIG, RequiredType, COLUMN_TYPE} from '../../utils/Consts';

const onAddColorDimension = async ({config, dimension, setConfig, reqContext}: any) => {
  const colorItemsSolver = solverGetter('add', 'dimension', 'colorItems');
  await colorItemsSolver({dimension, config, setConfig, reqContext});
  setConfig({type: CONFIG.ADD_DIMENSION, payload: {dimension}});
};

const onDeleteColor = ({config, setConfig}: any) => {
  const colorItemsSolver = solverGetter('delete', 'dimension', 'colorItems');
  return colorItemsSolver({config, setConfig});
};

const onAddMeasure = ({config, setConfig, measure}: any) => {
  const colorDimension = dimensionGetter(config, 'color');
  if (!colorDimension) {
    const colorItem = genColorItem(measure);
    setConfig({type: CONFIG.ADD_COLORITEMS, payload: [colorItem]});
  }
  setConfig({type: CONFIG.ADD_MEASURE, payload: measure});
};

const onDeleteMeasure = ({measure, config, setConfig}: any) => {
  const colorItemsSolver = solverGetter('delete', 'measure', 'colorItems');
  return colorItemsSolver({config, measure, setConfig});
};

const lineChartHandler = (config: any) => {
  let newConfig = cloneObj(config);
  const xDimension = dimensionGetter(config, 'x')!;
  newConfig.sort = {name: xDimension.as};
  return newConfig;
};

const settings = makeSetting({
  type: 'LineChart',
  dimensions: [
    {
      type: RequiredType.REQUIRED,
      key: 'x',
      short: 'xaxis',
      columnTypes: [COLUMN_TYPE.NUMBER, COLUMN_TYPE.DATE],
    },
    {
      type: RequiredType.OPTION,
      key: 'color',
      short: 'color',
      columnTypes: [COLUMN_TYPE.TEXT],
      onAdd: onAddColorDimension,
      onDelete: onDeleteColor,
    },
  ],
  measures: [
    {
      type: RequiredType.REQUIRED_ONE_AT_LEAST,
      short: 'yaxis',
      columnTypes: [COLUMN_TYPE.NUMBER, COLUMN_TYPE.TEXT],
      onAdd: onAddMeasure,
      onDelete: onDeleteMeasure,
    },
  ],
  icon: `<svg version="1.1" viewBox="0 0 80 80" 
  xmlns="http://www.w3.org/2000/svg">
  <g fill="none" fill-rule="evenodd">
    <polyline points="3 60 29 34 46 51 77 20" fill-rule="nonzero" stroke="currentColor" stroke-width="8"/>
  </g>
</svg>`,
  enable: true,
  configHandler: lineChartHandler,
});

export default settings;
