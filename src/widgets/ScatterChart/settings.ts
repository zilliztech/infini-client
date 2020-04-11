import {makeSetting} from '../../utils/Setting';
import {cloneObj} from '../../utils/Helpers';
import {measureGetter} from '../../utils/WidgetHelpers';
import {DEFAULT_MAX_POINTS_NUM} from '../Utils/Map';
import {CONFIG, RequiredType, COLUMN_TYPE} from '../../utils/Consts';
import {
  cleanLastSelfFilter,
  addSelfFilter,
  parseTocolorItems,
} from '../../widgets/Utils/settingHelper';
import {getColType} from '../../utils/ColTypes';
import {queryDistinctValues} from '../Utils/settingHelper';
import {getColorGradient, gradientOpts} from '../../utils/Colors';

export const getColorTypes = (colorMeasure: any) => {
  return [!!colorMeasure ? 'gradient' : 'solid'];
};
const onAddScatterChartDomain = ({measure, config, setConfig, reqContext}: any) => {
  const sql = `SELECT MIN(${measure.value}) AS min, MAX(${measure.value}) AS max from ${config.source}`;
  reqContext.getRowBySql(sql).then((res: any) => {
    if (res && res.data) {
      const {min, max} = res.data.result[0];
      measure = {...cloneObj(measure), domain: [min, max], staticDomain: [min, max]};
      setConfig({payload: measure, type: CONFIG.ADD_MEASURE});
    }
  });
};
const _onAddNumColor = async ({measure, config, setConfig, reqContext}: any) => {
  const {filter = {}} = config;
  Object.keys(filter).forEach((filterKey: string) => {
    if (!filter[filterKey].expr.geoJson) {
      setConfig({type: CONFIG.DEL_FILTER, payload: [filterKey]});
    }
  });
  reqContext.numMinMaxValRequest(measure.value, config.source).then((res: any) => {
    const ruler = res;
    setConfig({type: CONFIG.ADD_RULER, payload: ruler});
    setConfig({type: CONFIG.ADD_RULERBASE, payload: ruler});
  });
};
const _onAddTextColor = async ({measure, config, setConfig, reqContext}: any) => {
  const res = await queryDistinctValues({
    dimension: measure,
    config,
    reqContext,
  });
  const colorItems = parseTocolorItems(res);
  setConfig({type: CONFIG.ADD_COLORITEMS, payload: colorItems});
  addSelfFilter({dimension: measure, setConfig, res});
};
const onAddColor = async ({measure, config, setConfig, reqContext}: any) => {
  cleanLastSelfFilter({dimension: measure, setConfig, config});
  setConfig({type: CONFIG.DEL_ATTR, payload: ['colorItems']});

  const dataType = getColType(measure.type);
  switch (dataType) {
    case 'text':
      setConfig({type: CONFIG.DEL_ATTR, payload: ['colorKey']});
      await _onAddTextColor({measure, config, setConfig, reqContext});
      break;
    case 'number':
      await _onAddNumColor({measure, config, setConfig, reqContext});
      break;
    default:
      break;
  }
  setConfig({type: CONFIG.ADD_MEASURE, payload: measure});
};

const scatterConfigHandler = (config: any) => {
  const copiedConfig = cloneObj(config);
  const xMeasure = measureGetter(config, 'x');
  const yMeasure = measureGetter(config, 'y');
  const color = measureGetter(config, 'color');
  const isWeighted = !!color;

  if (!xMeasure || !yMeasure) {
    return copiedConfig;
  }
  const xDomain = xMeasure.domain!;
  const yDomain = yMeasure.domain!;
  const pointMeasure = {
    expression: 'project',
    value: `ST_Point (${xMeasure.value}, ${yMeasure.value})`,
    as: 'point',
  };
  copiedConfig.measures = [pointMeasure];
  if (isWeighted) {
    copiedConfig.measures.push(color);
  }
  // Put limit
  copiedConfig.limit = copiedConfig.points || DEFAULT_MAX_POINTS_NUM;
  // add selfFilter
  copiedConfig.selfFilter.bounds = {
    type: 'filter',
    expr: {
      type: 'st_within',
      x: xMeasure.value,
      y: yMeasure.value,
      sw: {lng: xDomain[0], lat: yDomain[0]},
      ne: {lng: xDomain[1], lat: yDomain[1]},
    },
  };
  copiedConfig.xDomain = xDomain;
  copiedConfig.yDomain = yDomain;
  return copiedConfig;
};

const genQueryParams = (config: any) => {
  const {width, height, pointSize, colorKey = '', ruler = [], xDomain, yDomain} = config;
  const bounding_box = [xDomain[0], yDomain[0], xDomain[1], yDomain[1]];
  const c = measureGetter(config, 'color');
  const isWeighted = !!c;
  let res: any = {
    width: Number.parseInt(width),
    height: Number.parseInt(height),
  };
  let key = isWeighted ? 'weighted' : 'point';
  res[key] = {
    opacity: 0.5,
    bounding_box,
    coordinate_system: 'EPSG:3857',
  };
  if (isWeighted) {
    res[key] = {
      ...res[key],
      size_bound: [pointSize],
      color_bound: [ruler.min, ruler.max],
      color_gradient: getColorGradient(colorKey),
    };
  } else {
    res[key] = {
      ...res[key],
      point_size: pointSize,
      point_color: colorKey,
    };
  }
  return res;
};

const settings = makeSetting({
  type: 'ScatterChart',
  dbTypes: ['arctern'],
  icon: `<svg version="1.1" viewBox="0 0 80 80" 
  xmlns="http://www.w3.org/2000/svg">
  <g fill="currentColor">
    <circle id="Oval" cx="4" cy="56" r="4"/>
    <circle id="Oval" cx="12" cy="40" r="4"/>
    <circle id="Oval" cx="12" cy="72" r="4"/>
    <circle id="Oval" cx="28" cy="40" r="4"/>
    <circle id="Oval" cx="36" cy="24" r="4"/>
    <circle id="Oval" cx="36" cy="56" r="4"/>
    <circle id="Oval" cx="44" cy="40" r="4"/>
    <circle id="Oval" cx="52" cy="24" r="4"/>
    <circle id="Oval" cx="52" cy="56" r="4"/>
    <circle id="Oval" cx="68" cy="24" r="4"/>
    <circle id="a" cx="76" cy="40" r="4"/>
    <circle cx="60" cy="8" r="4"/>
  </g>
</svg>
`,
  dimensions: [],
  measures: [
    {
      type: RequiredType.REQUIRED,
      key: 'x',
      short: 'xaxis',
      columnTypes: [COLUMN_TYPE.NUMBER],
      onAdd: onAddScatterChartDomain,
      expressions: ['scatter_x'],
    },
    {
      type: RequiredType.REQUIRED,
      key: 'y',
      short: 'yaxis',
      columnTypes: [COLUMN_TYPE.NUMBER],
      onAdd: onAddScatterChartDomain,
      expressions: ['scatter_y'],
    },
    {
      type: RequiredType.OPTION,
      key: 'color',
      short: 'color',
      expressions: ['project'],
      columnTypes: [COLUMN_TYPE.NUMBER, COLUMN_TYPE.TEXT],
      onAdd: onAddColor,
    },
  ],
  enable: true,
  configHandler: scatterConfigHandler,
  genQueryParams,
});

export default settings;
