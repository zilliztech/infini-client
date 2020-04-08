import {makeSetting} from '../../utils/Setting';
import {cloneObj} from '../../utils/Helpers';
import {orFilterGetter} from '../../utils/Filters';
import {KEY} from '../Utils/Map';
import {dimensionGetter, measureGetter} from '../../utils/WidgetHelpers';
import {CONFIG, COLUMN_TYPE, RequiredType} from '../../utils/Consts';
import {GeoHeatMapConfig} from './types';
import {MapDimension} from '../common/MapChart.type';
import {ConfigHandler} from '../../types';
// GeoHeatMap
const onAddColor = ({measure, config, setConfig, reqContext}: any) => {
  reqContext.numMinMaxValRequest(measure.value, config.source).then((res: any) => {
    setConfig({type: CONFIG.ADD_RULER, payload: res});
    setConfig({type: CONFIG.ADD_RULERBASE, payload: res});
    setConfig({type: CONFIG.ADD_MEASURE, payload: measure});
  });
};

const geoHeatMapConfigHandler: ConfigHandler<GeoHeatMapConfig> = config => {
  let newConfig = cloneObj(config);
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

  let lon = dimensionGetter(newConfig, KEY.LONGTITUDE) as MapDimension;
  let lat = dimensionGetter(newConfig, KEY.LATITUDE) as MapDimension;
  let color = measureGetter(newConfig, 'w');

  if (!lon || !lat) {
    return newConfig;
  }

  const {_sw, _ne} = newConfig.bounds;
  const pointMeasure = {
    expression: 'project',
    value: `ST_Point (${lon.value}, ${lat.value})`,
    as: 'point',
  };
  newConfig.measures = [pointMeasure, color];
  newConfig.dimensions = [];
  newConfig.isServerRender = true;
  newConfig.filter = newConfig.filter || {};

  newConfig.selfFilter.bounds = {
    type: 'filter',
    expr: {
      type: 'st_within',
      x: lon.value,
      y: lat.value,
      px: [_sw.lng, _sw.lng, _ne.lng, _ne.lng, _sw.lng],
      py: [_sw.lat, _ne.lat, _ne.lat, _sw.lat, _sw.lat],
    },
  };

  newConfig.filter = orFilterGetter(newConfig.filter);

  return newConfig;
};

const settings = makeSetting<GeoHeatMapConfig>({
  type: 'GeoHeatMap',
  dbTypes: ['arctern'],
  dimensions: [
    {
      type: RequiredType.REQUIRED,
      key: KEY.LONGTITUDE,
      short: 'longtitude',
      isNotUseBin: true,
      expression: 'gis_mapping_lon',
      columnTypes: [COLUMN_TYPE.NUMBER],
    },
    {
      type: RequiredType.REQUIRED,
      key: KEY.LATITUDE,
      short: 'latitude',
      isNotUseBin: true,
      expression: 'gis_mapping_lat',
      columnTypes: [COLUMN_TYPE.NUMBER],
    },
  ],
  measures: [
    {
      type: RequiredType.REQUIRED,
      key: 'w',
      short: 'color',
      onAdd: onAddColor,
      expressions: ['project'],
      columnTypes: [COLUMN_TYPE.NUMBER],
    },
  ],
  icon: `<svg viewBox="0 0 80 80" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g id="geoHeatMap" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <path d="M48,72 L48.0004888,75.1078234 C45.4274482,75.6917152 42.749726,76 40,76 L40,76 L40,72 L48,72 Z M32,72 L32.0005096,75.1080499 C29.1952423,74.4715441 26.5143975,73.507439 24.000322,72.2580814 L24,72 L32,72 Z M56,64 L56,72 L48,72 L48,64 L56,64 Z M40,64 L40,72 L32,72 L32,64 L40,64 Z M24,64 L24,72 L23.492743,72.0008018 C20.7749003,70.5959909 18.2589375,68.8551069 15.9998338,66.8331294 L16,64 L24,64 Z M66.8322321,64.0011686 C65.9415192,64.9962649 64.9962649,65.9415192 64.0011686,66.8322321 L64,64 Z M32,56 L32,64 L24,64 L24,56 L32,56 Z M64,56 L64,64 L56,64 L56,56 L64,56 Z M48,56 L48,64 L40,64 L40,56 L48,56 Z M16,56 L16,64 L13.1677679,64.0011686 C11.1459018,61.7423584 9.40506705,59.2267302 8.00022718,56.5092477 L8,56 L16,56 Z M40,48 L40,56 L32,56 L32,48 L40,48 Z M56,48 L56,56 L48,56 L48,48 L56,48 Z M72,48 L72,56 L64,56 L64,48 L72,48 Z M24,48 L24,56 L16,56 L16,48 L24,48 Z M8,48 L8,56 L7.74241378,56.0006745 C6.49296403,53.4866092 5.52876876,50.8057644 4.89217662,48.0004888 L8,48 Z M32,40 L32,48 L24,48 L24,40 L32,40 Z M64,40 L64,48 L56,48 L56,40 L64,40 Z M76,40 C76,42.749726 75.6917152,45.4274482 75.1078234,48.0004888 L72,48 L72,40 Z M16,40 L16,48 L8,48 L8,40 L16,40 Z M48,40 L48,48 L40,48 L40,40 L48,40 Z M56,32 L56,40 L48,40 L48,32 L56,32 Z M40,32 L40,40 L32,40 L32,32 L40,32 Z M24,32 L24,40 L16,40 L16,32 L24,32 Z M72,32 L72,40 L64,40 L64,32 L72,32 Z M8,32 L8,40 L4,40 C4,37.2506297 4.30820506,34.5732445 4.89195006,32.0005096 L8,32 Z M16,24 L16,32 L8,32 L8,24 L16,24 Z M64,24 L64,32 L56,32 L56,24 L64,24 Z M48,24 L48,32 L40,32 L40,24 L48,24 Z M32,24 L32,32 L24,32 L24,24 L32,24 Z M72.2580814,24.000322 C73.507439,26.5143975 74.4715441,29.1952423 75.1080499,32.0005096 L72,32 L72,24 Z M40,16 L40,24 L32,24 L32,16 L40,16 Z M24,16 L24,24 L16,24 L16,16 L24,16 Z M56,16 L56,24 L48,24 L48,16 L56,16 Z M66.8331294,15.9998338 C68.8551069,18.2589375 70.5959909,20.7749003 72.0008018,23.492743 L72,24 L64,24 L64,16 Z M48,8 L48,16 L40,16 L40,8 L48,8 Z M32,8 L32,16 L24,16 L24,8 L32,8 Z M56.5092477,8.00022718 C59.2267302,9.40506705 61.7423584,11.1459018 64.0011686,13.1677679 L64,16 L56,16 L56,8 Z M15.9998338,13.1668706 L16,16 L13.1668706,15.9998338 C14.0581451,15.0040357 15.0040357,14.0581451 15.9998338,13.1668706 Z M40,4 L40,8 L32,8 L32.0005096,4.89195006 C34.5732445,4.30820506 37.2506297,4 40,4 L40,4 Z M48.0004888,4.89217662 C50.8057644,5.52876876 53.4866092,6.49296403 56.0006745,7.74241378 L56,8 L48,8 Z" id="Combined-Shape" fill="currentColor"></path>
  </g>
</svg>`,
  enable: true,
  configHandler: geoHeatMapConfigHandler,
});

export default settings;
