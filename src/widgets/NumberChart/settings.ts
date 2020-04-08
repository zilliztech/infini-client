import {makeSetting} from '../../utils/Setting';
import {RequiredType, COLUMN_TYPE} from '../../utils/Consts';

const settings = makeSetting({
  type: 'NumberChart',
  dimensions: [],
  measures: [
    {
      type: RequiredType.REQUIRED,
      key: 'value',
      short: 'value',
      columnTypes: [COLUMN_TYPE.NUMBER, COLUMN_TYPE.TEXT],
    },
  ],
  icon: `<svg version="1.1" viewBox="0 0 80 80" 
  xmlns="http://www.w3.org/2000/svg">
  <g fill="currentColor" fill-rule="evenodd">
    <polygon id="Rectangle" transform="translate(30 39) rotate(90) translate(-30 -39)" points="6 35 54 35 54 43 6 43"/>
    <polygon id="Rectangle" transform="translate(50 39) rotate(90) translate(-50 -39)" points="26 35 74 35 74 43 26 43"/>
    <rect id="a" x="16" y="25" width="48" height="8"/>
    <rect x="16" y="44" width="48" height="8"/>
  </g>
</svg>`,
  enable: true,
});

export default settings;
