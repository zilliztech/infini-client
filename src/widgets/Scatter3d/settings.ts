import {makeSetting} from '../../utils/Setting';
import {RequiredType, COLUMN_TYPE} from '../../utils/Consts';

const settings = makeSetting({
  type: 'Scatter3d',
  icon: `<svg version="1.1" viewBox="0 0 80 80" 
  xmlns="http://www.w3.org/2000/svg">
  <g fill="currentColor">
    <circle id="Oval" cx="5" cy="55" r="6"/>
    <circle id="Oval" cx="13" cy="39" r="2"/>
    <circle id="Oval" cx="13" cy="71" r="4"/>
    <circle id="Oval" cx="29" cy="39" r="2"/>
    <circle id="Oval" cx="37" cy="23" r="4"/>
    <circle id="Oval" cx="37" cy="55" r="4"/>
    <circle id="Oval" cx="45" cy="39" r="4"/>
    <circle id="Oval" cx="53" cy="23" r="8"/>
    <circle id="Oval" cx="53" cy="55" r="2"/>
    <circle id="Oval" cx="69" cy="23" r="4"/>
    <circle id="a" cx="77" cy="39" r="4"/>
    <circle cx="61" cy="7" r="2"/>
  </g>
</svg>`,
  dimensions: [],
  measures: [
    {
      type: RequiredType.REQUIRED,
      key: 'x',
      short: 'x',
      columnTypes: [COLUMN_TYPE.NUMBER],
      expressions: [],
    },
    {
      type: RequiredType.REQUIRED,
      key: 'y',
      short: 'y',
      columnTypes: [COLUMN_TYPE.NUMBER],
      expressions: [],
    },
    {
      type: RequiredType.REQUIRED,
      key: 'z',
      short: 'z',
      columnTypes: [COLUMN_TYPE.NUMBER],
      expressions: [],
    },
    {
      type: RequiredType.OPTION,
      key: 'size',
      short: 'size',
      columnTypes: [COLUMN_TYPE.NUMBER],
      expressions: [],
    },
    {
      type: RequiredType.OPTION,
      key: 'color',
      short: 'color',
      columnTypes: [COLUMN_TYPE.NUMBER],
      expressions: [],
    },
  ],
  enable: true,
  isServerRender: true,
});

export default settings;
