import {makeSetting} from '../../utils/Setting';
import {orFilterGetter} from '../../utils/Filters';
import {onAddDimension, solverGetter, sortHandler} from '../Utils/settingHelper';
import {COLUMN_TYPE, RequiredType} from '../../utils/Consts';

const onDeleteBarPieDimension = ({config, dimension, setConfig}: any) => {
  const sortSolver = solverGetter('delete', 'dimension', 'sort');
  return sortSolver({config, dimension, setConfig});
};

const barPieConfigHandler = (config: any) => {
  let newConfig = sortHandler(config);
  newConfig.filter = orFilterGetter(config.filter);
  return newConfig;
};

const settings = makeSetting({
  type: 'PieChart',
  dimensions: [
    {
      type: RequiredType.REQUIRED_ONE_AT_LEAST,
      columnTypes: [COLUMN_TYPE.NUMBER, COLUMN_TYPE.DATE, COLUMN_TYPE.TEXT],
      onAdd: onAddDimension,
      onDelete: onDeleteBarPieDimension,
    },
  ],
  measures: [
    {
      type: RequiredType.REQUIRED,
      key: 'size',
      short: 'size',
      columnTypes: [COLUMN_TYPE.NUMBER, COLUMN_TYPE.TEXT],
    },
  ],
  icon: `<svg version="1.1" viewBox="0 0 80 80" 
  xmlns="http://www.w3.org/2000/svg">
  <g fill="currentColor" fill-rule="evenodd">
    <g transform="translate(8 8)" fill="currentColor" fill-rule="nonzero">
      <path id="a" d="m29.44 5.12v29.44l29.44-1e-3c0 16.098-12.918 29.177-28.953 29.437l-0.48684 0.0039441c-16.259 0-29.44-13.181-29.44-29.44s13.181-29.44 29.44-29.44z"/>
      <path d="m34.56 0c16.259 0 29.44 13.181 29.44 29.44h-29.44z"/>
    </g>
  </g>
</svg>`,
  enable: true,
  configHandler: barPieConfigHandler,
});

export default settings;
