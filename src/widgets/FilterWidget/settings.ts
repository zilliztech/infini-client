import {makeSetting} from '../../utils/Setting';
import {Dimension, ConfigHandler} from '../../types';
import {RequiredType, CONFIG, COLUMN_TYPE} from '../../utils/Consts';
import {getColType} from '../../utils/ColTypes';
import {cloneObj} from '../../utils/Helpers';
import {queryDistinctValues, DimensionParams} from '../Utils/settingHelper';
import {parseExpression} from '../../utils/WidgetHelpers';
const _onAddTextType = async ({dimension, config, setConfig, reqContext}: DimensionParams) => {
  const res = await queryDistinctValues({dimension, config, reqContext});
  dimension.options = res.map((r: any) => r[dimension.value]);
  setConfig({type: CONFIG.ADD_DIMENSION, payload: {dimension}});
};

const onAdd = async ({dimension, config, setConfig, reqContext}: any) => {
  const alreadyExist = config.dimensions.some((d: any) => d.value === dimension.value);
  if (alreadyExist) {
    return false;
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

const onDelete = ({dimension, config, setConfig}: any) => {
  const filterKeys = Object.keys(config.filter).filter((key: string) => {
    const regex = new RegExp(dimension.as);
    return regex.test(key);
  });
  setConfig({type: CONFIG.DEL_FILTER, payload: {filterKeys: filterKeys}});
};

const configHandler: ConfigHandler = config => {
  let newConfig = cloneObj(config);
  const {filter} = newConfig;
  const filterKeys = Object.keys(filter);
  let groupedFilter: any = {};
  config.dimensions.forEach((d: Dimension) => {
    const {type, as} = d;
    switch (getColType(type)) {
      case 'text':
        if (filter[as]) {
          groupedFilter[as] = filter[as];
        }
        break;
      case 'number':
      case 'date':
        let orGrp: any[] = [];
        const relatedKeys = filterKeys.filter((key: string) => {
          const regex = new RegExp(as);
          return regex.test(key);
        });
        relatedKeys.forEach((key: string) => {
          orGrp.push(parseExpression(filter[key].expr));
        });
        if (orGrp.length) {
          groupedFilter[as] = {
            type: 'filter',
            expr: `(${orGrp.join(`) OR (`)})`,
          };
        }
        break;
      default:
        break;
    }
  });
  newConfig.filter = groupedFilter;
  return newConfig;
};
const settings = makeSetting({
  type: 'FilterWidget',
  icon: `<svg version="1.1" viewBox="0 0 80 80" 
  xmlns="http://www.w3.org/2000/svg">
  <g fill="currentColor" fill-rule="evenodd">
    <g transform="translate(12 32)">
      <rect id="Rectangle" width="56" height="16"/>
    </g>
    <g transform="translate(20 56)">
      <rect id="a" width="40" height="16"/>
    </g>
    <g transform="translate(0 8)">
      <rect width="80" height="16"/>
    </g>
  </g>
</svg>
`,
  enable: true,
  dimensions: [
    {
      type: RequiredType.REQUIRED_ONE_AT_LEAST,
      columnTypes: [COLUMN_TYPE.DATE, COLUMN_TYPE.NUMBER, COLUMN_TYPE.TEXT],
      onAdd,
      onDelete,
    },
  ],
  measures: [],
  configHandler,
});

export default settings;
