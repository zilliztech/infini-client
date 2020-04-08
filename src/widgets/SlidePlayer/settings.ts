import {makeSetting} from '../../utils/Setting';
import {queryDistinctValues, DimensionParams} from '../Utils/settingHelper';
import {RequiredType, CONFIG, COLUMN_TYPE} from '../../utils/Consts';
import {getColType} from '../../utils/ColTypes';

const _onAddTextType = async ({dimension, config, setConfig, reqContext}: DimensionParams) => {
  const res = await queryDistinctValues({dimension, config, reqContext});
  dimension.options = res.map((r: any) => r[dimension.value]);
  setConfig({type: CONFIG.ADD_DIMENSION, payload: {dimension}});
};

const onAdd = async ({dimension, config, setConfig, reqContext}: any) => {
  const alreadyExist = !!config.dimensions.find((d: any) => d.value === dimension.value);
  if (alreadyExist) {
    return false;
  }
  if (config.filter && config.filter.range) {
    setConfig({type: CONFIG.DEL_FILTER, payload: {id: config.id, filterKeys: ['range']}});
  }
  switch (getColType(dimension.type)) {
    case 'date':
    case 'number':
      setConfig({type: CONFIG.ADD_DIMENSION, payload: {dimension}});
      break;
    case 'text':
      _onAddTextType({dimension, config, setConfig, reqContext});
      break;
    default:
      break;
  }
};

const settings = makeSetting({
  type: 'SlidePlayer',
  icon: `<svg version="1.1" viewBox="0 0 80 80" 
  xmlns="http://www.w3.org/2000/svg">
  <g fill="none" fill-rule="evenodd">
    <polygon transform="translate(40 40) rotate(90) translate(-40 -40)" points="40 18 62 62 18 62" fill="currentColor" fill-rule="nonzero"/>
  </g>
</svg>`,
  enable: true,
  dimensions: [
    {
      type: RequiredType.REQUIRED,
      key: 'x',
      short: 'slide',
      columnTypes: [COLUMN_TYPE.DATE, COLUMN_TYPE.NUMBER, COLUMN_TYPE.TEXT],
      onAdd,
    },
  ],
  measures: [],
});

export default settings;
