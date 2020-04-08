import {makeSetting} from '../../utils/Setting';
import {orFilterGetter} from '../../utils/Filters';
import {WidgetConfig} from '../../types';
import {
  DimensionParams,
  MeasureParams,
  onAddDimension,
  onDeleteDimension,
  solverGetter,
  sortHandler,
} from '../Utils/settingHelper';
import {CONFIG, RequiredType, COLUMN_TYPE} from '../../utils/Consts';

const onDeleteXDimension = ({config, dimension, setConfig}: DimensionParams) => {
  onDeleteDimension({config, dimension, setConfig});
  const sortSolver = solverGetter('delete', 'dimension', 'sort');
  return sortSolver({config, dimension, setConfig});
};

const onAddColorDimension = async ({config, dimension, setConfig, reqContext}: DimensionParams) => {
  const colorItemsSolver = solverGetter('add', 'dimension', 'colorItems');
  await colorItemsSolver({dimension, config, setConfig, reqContext});
  setConfig({type: CONFIG.ADD_DIMENSION, payload: {dimension}});
};

const onDeleteColorDimension = ({config, dimension, setConfig}: DimensionParams) => {
  const colorItemsSolver = solverGetter('delete', 'dimension', 'colorItems');
  const sortSolver = solverGetter('delete', 'dimension', 'sort');

  onDeleteDimension({
    config,
    dimension,
    setConfig,
  });
  colorItemsSolver({
    config,
    dimension,
    setConfig,
  });
  sortSolver({
    config,
    dimension,
    setConfig,
  });
};

const onAddMeasure = ({measure, config, setConfig}: MeasureParams) => {
  const colorItemsSolver = solverGetter('add', 'measure', 'colorItems');
  colorItemsSolver({
    config,
    measure,
    setConfig,
  });
  setConfig({type: CONFIG.ADD_MEASURE, payload: measure});
};

const onDeleteMeasure = ({measure, config, setConfig}: MeasureParams) => {
  const sortSolver = solverGetter('delete', 'measure', 'sort');
  const colorItemsSolver = solverGetter('delete', 'measure', 'colorItems');
  colorItemsSolver({config, measure, setConfig});
  sortSolver({config, measure, setConfig});
};

const configHandler = (config: WidgetConfig) => {
  let copiedConfig = sortHandler(config);
  copiedConfig.filter = orFilterGetter(config.filter);
  return copiedConfig;
};

const settings = makeSetting({
  type: 'StackedBarChart',
  icon: `<svg version="1.1" viewBox="0 0 80 80" 
  xmlns="http://www.w3.org/2000/svg">
  <g fill="currentColor" fill-rule="evenodd">
    <g transform="translate(40 32)">
      <rect id="Rectangle" width="20" height="16"/>
    </g>
    <g transform="translate(40 56)">
      <rect id="Rectangle" width="40" height="16"/>
    </g>
    <g transform="translate(40 8)">
      <rect id="Rectangle" width="10" height="16"/>
    </g>
    <g id="icon/unit" transform="translate(20 8)">
      <rect id="Rectangle" width="16" height="16"/>
    </g>
    <g id="icon/unit" transform="translate(0 8)">
      <rect id="Rectangle" width="16" height="16"/>
    </g>
    <g id="icon/unit" transform="translate(20 32)">
      <rect id="Rectangle" width="16" height="16"/>
    </g>
    <g id="icon/unit" transform="translate(0 32)">
      <rect id="Rectangle" width="16" height="16"/>
    </g>
    <g id="b" transform="translate(20 56)">
      <rect id="a" width="16" height="16"/>
    </g>
    <g transform="translate(0 56)">
      <rect width="16" height="16"/>
    </g>
  </g>
</svg>`,
  dimensions: [
    {
      type: RequiredType.REQUIRED,
      key: 'x',
      short: 'xaxis',
      columnTypes: [COLUMN_TYPE.TEXT],
      onAdd: onAddDimension,
      onDelete: onDeleteXDimension,
    },
    {
      type: RequiredType.OPTION,
      key: 'color',
      short: 'color',
      columnTypes: [COLUMN_TYPE.TEXT],
      onAdd: onAddColorDimension,
      onDelete: onDeleteColorDimension,
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
  enable: true,
  configHandler: configHandler,
});

export default settings;
