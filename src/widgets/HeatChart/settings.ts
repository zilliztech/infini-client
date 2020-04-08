import {makeSetting, defaultConfigHandler} from '../../utils/Setting';
import {orFilterGetter} from '../../utils/Filters';
import {onAddDimension, onDeleteDimension} from '../Utils/settingHelper';
import {COLUMN_TYPE, RequiredType} from '../../utils/Consts';

const heatChartConfigHandler = (config: any) => {
  let newConfig = defaultConfigHandler(config);
  newConfig.filter = orFilterGetter(config.filter);
  return newConfig;
};

const settings = makeSetting({
  type: 'HeatChart',
  icon: `<svg version="1.1" viewBox="0 0 80 80" 
  xmlns="http://www.w3.org/2000/svg">
  <g fill="currentColor" fill-rule="evenodd">
    <g id="icon/unit" transform="translate(8 8)">
      <rect id="Rectangle" width="16" height="16"/>
    </g>
    <g id="icon/unit" transform="translate(24 24)">
      <rect id="Rectangle" width="16" height="16"/>
    </g>
    <g id="icon/unit" transform="translate(8 40)">
      <rect id="Rectangle" width="16" height="16"/>
    </g>
    <g id="icon/unit" transform="translate(24 56)">
      <rect id="Rectangle" width="16" height="16"/>
    </g>
    <g id="icon/unit" transform="translate(40 40)">
      <rect id="Rectangle" width="16" height="16"/>
    </g>
    <g id="icon/unit" transform="translate(56 56)">
      <rect id="Rectangle" width="16" height="16"/>
    </g>
    <g id="b" transform="translate(56 24)">
      <rect id="a" width="16" height="16"/>
    </g>
    <g transform="translate(40 8)">
      <rect width="16" height="16"/>
    </g>
  </g>
</svg>`,
  enable: true,
  dimensions: [
    {
      type: RequiredType.REQUIRED,
      key: 'x',
      short: 'xaxis',
      columnTypes: [COLUMN_TYPE.NUMBER, COLUMN_TYPE.DATE, COLUMN_TYPE.TEXT],
      onAdd: onAddDimension,
      onDelete: onDeleteDimension,
    },
    {
      type: RequiredType.REQUIRED,
      key: 'y',
      short: 'yaxis',
      columnTypes: [COLUMN_TYPE.NUMBER, COLUMN_TYPE.DATE, COLUMN_TYPE.TEXT],
      onAdd: onAddDimension,
      onDelete: onDeleteDimension,
    },
  ],
  measures: [
    {
      type: RequiredType.REQUIRED,
      key: 'color',
      short: 'color',
      columnTypes: [COLUMN_TYPE.NUMBER, COLUMN_TYPE.TEXT],
    },
  ],
  configHandler: heatChartConfigHandler,
});

export default settings;
