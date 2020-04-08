import {makeSetting} from '../../utils/Setting';
import {onAddDimension, onDeleteDimension} from '../Utils/settingHelper';
import {cloneObj} from '../../utils/Helpers';
import {orFilterGetter} from '../../utils/Filters';
import {RequiredType, COLUMN_TYPE} from '../../utils/Consts';

const bubbleConfigHandler = (config: any) => {
  let newConfig = cloneObj(config);
  newConfig.filter = orFilterGetter(config.filter);
  return newConfig;
};

const settings = makeSetting({
  type: 'BubbleChart',
  icon: `<svg version="1.1" viewBox="0 0 80 80" 
  xmlns="http://www.w3.org/2000/svg">
  <g fill="currentColor" fill-rule="evenodd">
    <circle id="Oval" cx="28" cy="32" r="24"/>
    <circle id="a" cx="64" cy="64" r="16"/>
    <circle cx="64" cy="16" r="8"/>
  </g>
</svg>`,
  dimensions: [
    {
      type: RequiredType.REQUIRED_ONE_AT_LEAST,
      columnTypes: [COLUMN_TYPE.NUMBER, COLUMN_TYPE.DATE, COLUMN_TYPE.TEXT],
      onAdd: onAddDimension,
      onDelete: onDeleteDimension,
    },
  ],
  measures: [
    {
      type: RequiredType.REQUIRED,
      key: 'x',
      short: 'xaxis',
      columnTypes: [COLUMN_TYPE.TEXT, COLUMN_TYPE.NUMBER],
    },
    {
      type: RequiredType.REQUIRED,
      key: 'y',
      short: 'yaxis',
      columnTypes: [COLUMN_TYPE.TEXT, COLUMN_TYPE.NUMBER],
    },
    {
      type: RequiredType.OPTION,
      key: 'color',
      short: 'color',
      columnTypes: [COLUMN_TYPE.TEXT, COLUMN_TYPE.NUMBER],
    },
    {
      type: RequiredType.OPTION,
      key: 'size',
      short: 'size',
      columnTypes: [COLUMN_TYPE.TEXT, COLUMN_TYPE.NUMBER],
    },
  ],
  enable: true,
  configHandler: bubbleConfigHandler,
});

export default settings;
