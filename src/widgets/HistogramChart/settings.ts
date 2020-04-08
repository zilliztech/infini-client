import {makeSetting} from '../../utils/Setting';
import {cloneObj} from '../../utils/Helpers';
import {dimensionGetter} from '../../utils/WidgetHelpers';
import {solverGetter, genColorItem} from '../Utils/settingHelper';
import {CONFIG, COLUMN_TYPE, RequiredType} from '../../utils/Consts';

const onAddMeasure = ({measure, config, setConfig}: any) => {
  const colorDimension = dimensionGetter(config, 'color');
  if (!colorDimension) {
    setConfig({type: CONFIG.CLERAR_COLORITEMS});
    const colorItem = genColorItem(measure);
    setConfig({type: CONFIG.ADD_COLORITEMS, payload: [colorItem]});
  }
  setConfig({payload: measure, type: CONFIG.ADD_MEASURE});
};

const onDeleteMeasure = ({measure, config, setConfig}: any) => {
  const colorItemsSolver = solverGetter('delete', 'measure', 'colorItems');
  return colorItemsSolver({config, measure, setConfig});
};
// HistogramChart
const onAddColor = async ({config, dimension, setConfig, reqContext}: any) => {
  const colorItemsSolver = solverGetter('add', 'dimension', 'colorItems');
  await colorItemsSolver({dimension, config, setConfig, reqContext});
  setConfig({payload: {dimension}, type: CONFIG.ADD_DIMENSION});
};
const onDeleteColor = ({config, setConfig}: any) => {
  const colorItemsSolver = solverGetter('delete', 'dimension', 'colorItems');
  return colorItemsSolver({config, setConfig});
};

const lineChartHandler = (config: any) => {
  let newConfig = cloneObj(config);
  const xDimension = dimensionGetter(config, 'x')!;
  newConfig.sort = {name: xDimension.as};
  return newConfig;
};

const settings = makeSetting({
  type: 'HistogramChart',
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
      onAdd: onAddColor,
      onDelete: onDeleteColor,
    },
  ],
  measures: [
    {
      type: RequiredType.REQUIRED,
      key: 'y',
      short: 'yaxis',
      columnTypes: [COLUMN_TYPE.NUMBER, COLUMN_TYPE.TEXT],
      onAdd: onAddMeasure,
      onDelete: onDeleteMeasure,
    },
  ],
  icon: `<svg version="1.1" viewBox="0 0 80 80" 
  xmlns="http://www.w3.org/2000/svg">
  <g fill="currentColor" fill-rule="evenodd">
    <rect id="Rectangle" transform="translate(64 48) rotate(90) translate(-64 -48)" x="32" y="40" width="64" height="16"/>
    <rect id="a" transform="translate(16 56) rotate(90) translate(-16 -56)" x="-8" y="48" width="48" height="16"/>
    <rect transform="translate(40 40) rotate(90) translate(-40 -40)" y="32" width="80" height="16"/>
  </g>
</svg>`,
  enable: true,
  configHandler: lineChartHandler,
});

export default settings;
