import {cloneObj} from '../../utils/Helpers';
import {orFilterGetter} from '../../utils/Filters';
import {makeSetting} from '../../utils/Setting';
import {restoreSource} from '../../utils/Helpers';
import {CONFIG, COLUMN_TYPE, RequiredType} from '../../utils/Consts';
import {measureGetter, dimensionGetter, getExpression} from '../../utils/WidgetHelpers';
import {ChoroplethMapConfig} from './types';
import {MeasureParams} from '../Utils/settingHelper';
const onAddChoroplethMapColor = async ({measure, config, setConfig, reqContext}: MeasureParams) => {
  const buildDimension = dimensionGetter(config, 'wkt');
  if (buildDimension) {
    const {as} = measure;
    let expression = getExpression(measure);
    // cause megawise is not working for text group subQuery at the moment, change to one Query when it's ready;
    const minSql = `SELECT ${expression} FROM ${restoreSource(config.source)} GROUP BY ${
      buildDimension.value
    } ORDER BY ${as} ASC LIMIT 1`;
    const maxSql = `SELECT ${expression} FROM ${restoreSource(config.source)} GROUP BY ${
      buildDimension.value
    } ORDER BY ${as} DESC LIMIT 1`;
    const rulerBaseMin = await reqContext.generalRequest(minSql);
    const rulerBaseMax = await reqContext.generalRequest(maxSql);
    const ruler = {min: rulerBaseMin[0][as], max: rulerBaseMax[0][as]};
    const rulerBase = {min: rulerBaseMin[0][as], max: rulerBaseMax[0][as]};
    setConfig({type: CONFIG.ADD_RULER, payload: ruler});
    setConfig({type: CONFIG.ADD_RULERBASE, payload: rulerBase});
    setConfig({type: CONFIG.ADD_MEASURE, payload: measure});
  }
};
const onAddWkt = async ({dimension, setConfig}: any) => {
  setConfig({
    type: CONFIG.ADD_FILTER,
    payload: {
      fillEmpty: `${dimension.value}!=''`,
    },
  });
  setConfig({type: CONFIG.ADD_DIMENSION, payload: {dimension}});
};
const choroplethMapConfigHandler = <ChoroplethMapConfig>(config: ChoroplethMapConfig) => {
  let newConfig = cloneObj(config);
  // Start: handle map bound
  if (!newConfig.bounds) {
    newConfig.bounds = {
      _sw: {
        lng: -73.5,
        lat: 40.1,
      },
      _ne: {
        lng: -70.5,
        lat: 41.1,
      },
    };
  }
  const wkt = newConfig.dimensions[0];
  let colorM = measureGetter(newConfig, 'w');
  if (!newConfig.bounds) {
    newConfig.bounds = {
      _sw: {
        lng: -73.5,
        lat: 40.1,
      },
      _ne: {
        lng: -70.5,
        lat: 41.1,
      },
    };
    // return newConfig;
  }
  const {_sw, _ne} = newConfig.bounds;
  const px = [_sw.lng, _sw.lng, _ne.lng, _ne.lng, _sw.lng];
  const py = [_sw.lat, _ne.lat, _ne.lat, _sw.lat, _sw.lat];
  const polygon = px.map((x: number, i: number) => `${x} ${py[i]}`).join(', ');
  newConfig.selfFilter.bounds = {
    type: 'filter',
    expr: `ST_Within(${wkt.value}, 'POLYGON((${polygon}))')`,
  };

  newConfig.filter = orFilterGetter(newConfig.filter);

  // gen vega
  newConfig.measures = [colorM];
  return newConfig;
};

const settings = makeSetting<ChoroplethMapConfig>({
  type: 'ChoroplethMap',
  dbTypes: ['arctern'],
  dimensions: [
    {
      type: RequiredType.REQUIRED,
      key: 'wkt',
      short: 'building',
      isNotUseBin: true,
      columnTypes: [COLUMN_TYPE.NUMBER, COLUMN_TYPE.TEXT],
      onAdd: onAddWkt,
    },
  ],
  measures: [
    // {
    //   type: RequiredType.REQUIRED,
    //   key: MAPKEY.LONGTITUDE,
    //   short: 'longtitude',
    //   expressions: ['project'],
    //   columnTypes: [COLUMN_TYPE.NUMBER],
    // },
    // {
    //   type: RequiredType.REQUIRED,
    //   key: MAPKEY.LATITUDE,
    //   short: 'latitude',
    //   expressions: ['project'],
    //   columnTypes: [COLUMN_TYPE.NUMBER],
    // },
    {
      type: RequiredType.REQUIRED,
      key: 'w',
      short: 'color',
      onAdd: onAddChoroplethMapColor,
      columnTypes: [COLUMN_TYPE.NUMBER],
    },
  ],
  icon: `<svg viewBox="0 0 80 80" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
      <path d="M36.999,60.013 L36.9987599,75.9453153 C31.676414,75.6536946 26.6619874,74.2059784 22.2023118,71.8489983 L22.203,60.013 L36.999,60.013 Z M55.796,60.013 L55.7961779,71.8497964 C51.3363215,74.2066006 46.3217281,75.6540904 40.9992386,75.9454249 L40.999,60.013 L55.796,60.013 Z M59.796,60.013 L68.928512,60.0138743 C66.4802592,63.667713 63.380632,66.848325 59.7958111,69.3895296 L59.796,60.013 Z M18.203,60.013 L18.2022319,69.3881423 C14.6182399,66.8471674 11.5192953,63.6670481 9.07148796,60.0138743 L18.203,60.013 Z M18.203,41.216 L18.203,56.013 L6.74885395,56.0136264 C4.51915132,51.531694 3.1962189,46.5192346 3.02016247,41.2163541 L18.203,41.216 Z M59.796,41.216 L74.9798375,41.2163541 C74.8037811,46.5192346 73.4808487,51.531694 71.251146,56.0136264 L59.796,56.013 L59.796,41.216 Z M36.999,41.216 L36.999,56.013 L22.203,56.013 L22.203,41.216 L36.999,41.216 Z M55.796,41.216 L55.796,56.013 L40.999,56.013 L40.999,41.216 L55.796,41.216 Z M18.203,22.419 L18.203,37.216 L3.10604833,37.2160439 C3.51471835,31.8726227 5.08992058,26.8555706 7.577482,22.4190606 L18.203,22.419 Z M59.796,22.419 L70.422518,22.4190606 C72.9100794,26.8555706 74.4852817,31.8726227 74.8939517,37.2160439 L59.796,37.216 L59.796,22.419 Z M36.999,22.419 L36.999,37.216 L22.203,37.216 L22.203,22.419 L36.999,22.419 Z M55.796,22.419 L55.796,37.216 L40.999,37.216 L40.999,22.419 L55.796,22.419 Z M18.2022319,10.6118577 L18.203,18.419 L10.1837067,18.4181936 C12.4336898,15.4187958 15.1410298,12.7821856 18.2022319,10.6118577 Z M59.7958111,10.6104704 C62.8578164,12.7810619 65.5658308,15.4181567 67.8162933,18.4181936 L59.796,18.419 Z M36.9987599,4.05468469 L36.999,18.419 L22.203,18.419 L22.2023118,8.15100172 C26.6619874,5.79402163 31.676414,4.34630537 36.9987599,4.05468469 Z M40.9992386,4.05457508 C46.3217281,4.34590956 51.3363215,5.79339939 55.7961779,8.15020358 L55.796,18.419 L40.999,18.419 Z" id="pathaaa"></path>
  </defs>
  <g id="choroplethMap" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <mask id="mask-2" fill="white">
          <use xlink:href="#pathaaa"></use>
      </mask>
      <use id="Combined-Shape" fill="currentColor" xlink:href="#pathaaa"></use>
  </g>
</svg>`,
  enable: true,
  configHandler: choroplethMapConfigHandler,
});

export default settings;
