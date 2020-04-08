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

export const getColorTypes = (colorMeasure: any) => {
  return [!!colorMeasure ? 'gradient' : 'solid'];
};
const onAddScatterChartDomain = ({measure, config, setConfig, reqContext}: any) => {
  const sql = `SELECT MIN(${measure.value}) AS min, MAX(${measure.value}) AS max from ${config.source}`;
  reqContext.generalRequest({id: 'choro-min-max', sql}).then((res: any) => {
    if (res && res[0]) {
      const {min, max} = res[0];
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
  // const colorMeasure = measureGetter(config, 'color');
  // const sizeMeasure = measureGetter(config, 'size');

  if (!xMeasure || !yMeasure) {
    return copiedConfig;
  }

  // Put limit
  copiedConfig.limit = copiedConfig.points || DEFAULT_MAX_POINTS_NUM;
  return copiedConfig;
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
      expressions: ['gis_discrete_trans_scale_w'],
    },
    {
      type: RequiredType.REQUIRED,
      key: 'y',
      short: 'yaxis',
      columnTypes: [COLUMN_TYPE.NUMBER],
      onAdd: onAddScatterChartDomain,
      expressions: ['gis_discrete_trans_scale_h'],
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
});

export default settings;
