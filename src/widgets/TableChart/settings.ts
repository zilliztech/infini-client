import {makeSetting} from '../../utils/Setting';
import {cloneObj} from '../../utils/Helpers';
import {orFilterGetter} from '../../utils/Filters';
import {sortHandler, moveMeasureToDimension, solverGetter} from '../Utils/settingHelper';
import {RequiredType, COLUMN_TYPE} from '../../utils/Consts';

// TableChart
const onDeleteTableChartDimension = ({config, dimension, setConfig}: any) => {
  const sortSolver = solverGetter('delete', 'dimension', 'sort');
  sortSolver({config, dimension, setConfig});
};
const onDeleteTableChartMeasure = ({config, measure, setConfig}: any) => {
  const sortSolver = solverGetter('delete', 'measure', 'sort');
  sortSolver({config, measure, setConfig});
};

const tableConfigHandler = (config: any) => {
  let newConfig = cloneObj(config);
  newConfig.filter = orFilterGetter(newConfig.filter);

  if (newConfig.dimensions.length === 0) {
    newConfig = moveMeasureToDimension(newConfig);
  }

  newConfig = sortHandler(newConfig);
  return newConfig;
};

const settings = makeSetting({
  type: 'TableChart',
  icon: `<svg version="1.1" viewBox="0 0 80 80" 
  xmlns="http://www.w3.org/2000/svg">
  <g fill="currentColor" fill-rule="evenodd">
    <g id="icon/bar-3" transform="translate(7 7)">
      <rect id="Rectangle" width="64" height="13.474"/>
    </g>
    <g id="icon/bar-3" transform="translate(7 24.474)">
      <rect id="Rectangle" width="16.842" height="13.474"/>
    </g>
    <g id="icon/bar-3" transform="translate(27.842 24.474)">
      <rect id="Rectangle" width="43.789" height="13.474"/>
    </g>
    <g id="icon/bar-3" transform="translate(7 41.947)">
      <rect id="Rectangle" width="16.842" height="13.474"/>
    </g>
    <g id="icon/bar-3" transform="translate(27.842 41.947)">
      <rect id="Rectangle" width="43.789" height="13.474"/>
    </g>
    <g id="b" transform="translate(7 59.421)">
      <rect id="a" width="16.842" height="13.474"/>
    </g>
    <g transform="translate(27.842 59.421)">
      <rect width="43.789" height="13.474"/>
    </g>
  </g>
</svg>`,
  dimensions: [
    {
      type: RequiredType.REQUIRED_ONE_DIMENSION_OR_MEASURE_AT_LEAST,
      short: 'colname',
      columnTypes: [COLUMN_TYPE.DATE, COLUMN_TYPE.NUMBER, COLUMN_TYPE.TEXT],
      isNotUseBin: false,
      onDelete: onDeleteTableChartDimension,
    },
  ],
  measures: [
    {
      type: RequiredType.REQUIRED_ONE_DIMENSION_OR_MEASURE_AT_LEAST,
      short: 'colname',
      columnTypes: [COLUMN_TYPE.DATE, COLUMN_TYPE.NUMBER, COLUMN_TYPE.TEXT],
      onDelete: onDeleteTableChartMeasure,
    },
  ],
  enable: true,
  configHandler: tableConfigHandler,
});

export default settings;
