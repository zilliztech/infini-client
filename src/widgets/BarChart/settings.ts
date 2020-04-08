import {orFilterGetter} from '../../utils/Filters';
import {makeSetting} from '../../utils/Setting';
import {onAddDimension, solverGetter, sortHandler} from '../Utils/settingHelper';
import {RequiredType, COLUMN_TYPE} from '../../utils/Consts';

export const onDeleteBarPieDimension = ({config, dimension, setConfig}: any) => {
  const sortSolver = solverGetter('delete', 'dimension', 'sort');
  return sortSolver({config, dimension, setConfig});
};

const barPieConfigHandler = (config: any) => {
  let newConfig = sortHandler(config);
  newConfig.filter = orFilterGetter(config.filter);
  return newConfig;
};

const settings = makeSetting({
  type: 'BarChart',
  icon: `<svg version="1.1" viewBox="0 0 80 80" 
  xmlns="http://www.w3.org/2000/svg">
  <g fill="currentColor" fill-rule="evenodd">
    <g transform="translate(0 8)">
      <rect id="Rectangle" width="40" height="16"/>
    </g>
    <g transform="translate(0 32)">
      <rect id="a" width="56" height="16"/>
    </g>
    <g transform="translate(0 56)">
      <rect width="80" height="16"/>
    </g>
  </g>
</svg>`,
  dimensions: [
    {
      type: RequiredType.REQUIRED_ONE_AT_LEAST,
      columnTypes: [COLUMN_TYPE.DATE, COLUMN_TYPE.NUMBER, COLUMN_TYPE.TEXT],
      onAdd: onAddDimension,
      onDelete: onDeleteBarPieDimension,
    },
  ],
  measures: [
    {
      type: RequiredType.REQUIRED,
      key: 'width',
      short: 'width',
      columnTypes: [COLUMN_TYPE.NUMBER, COLUMN_TYPE.TEXT],
    },
    {
      type: RequiredType.OPTION,
      key: 'color',
      short: 'color',
      columnTypes: [COLUMN_TYPE.NUMBER, COLUMN_TYPE.TEXT],
    },
  ],
  enable: true,
  configHandler: barPieConfigHandler,
});

export default settings;
