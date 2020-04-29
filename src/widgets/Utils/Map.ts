import {measureGetter, dimensionGetter} from '../../utils/WidgetHelpers';
import {MapChartConfig} from '../common/MapChart.type';
import {SqlParser} from 'infinivis-core';
import {cloneObj} from '../../utils/Helpers';
import {orFilterGetter} from '../../utils/Filters';
const parseExpression = SqlParser.parseExpression;

// Map related consts
export const DEFAULT_MAP_POINT_SIZE = 3;
export const DEFAULT_MAX_MAP_POINT_SIZE = 30;
export const DEFAULT_MAX_POINTS_NUM = 100000000;
export const DEFAULT_ZOOM = 4;
export const TRANSPARENT_PNG = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=
`;
export const NYC_CENTER: any = {
  lng: -73.94196940893625,
  lat: 40.70056427006182,
};
export const CHINA_CENTER: any = {
  lat: 34.5715158066769,
  lng: 106.9622862233764,
};

// A LngLatBounds object, an array of LngLatLike objects in [sw, ne] order, or an array of numbers in [west, south, east, north] order.
export const US_BOUNDS: any = [
  [-66.94, 49.38],
  [-124.39, 25.82],
];
export const CHINA_BOUNDS: any = [
  [73.499857, 18.060852],
  [134.77281, 53.560711],
];

export const NYC_ZOOM: number = 3.5867090422218464;
export const defaultMapCenterGetter = (language: string) => {
  return language === 'zh-CN' ? CHINA_CENTER : NYC_CENTER;
};

export const DEFAULT_RULER = {min: 0, max: 1000};

// Mapbox styles
export const MapThemes: any = [
  {
    label: 'Dark',
    value: 'mapbox://styles/mapbox/dark-v9',
  },
  {
    label: 'Light',
    value: 'mapbox://styles/mapbox/light-v9',
  },

  {
    label: 'Satellite',
    value: 'mapbox://styles/mapbox/satellite-v9',
  },
  {
    label: 'Streets',
    value: 'mapbox://styles/mapbox/streets-v10',
  },
  {
    label: 'Outdoors',
    value: 'mapbox://styles/mapbox/outdoors-v11',
  },

  {
    label: 'Guidance-Night',
    value: 'mapbox://styles/mapbox/navigation-guidance-night-v4',
  },
  {
    label: 'Guidance-Day',
    value: 'mapbox://styles/mapbox/navigation-guidance-day-v4',
  },
];

export const DefaultMapTheme = MapThemes[0];

export enum KEY {
  LONGTITUDE = 'lon',
  LATITUDE = 'lat',
  COLOR = 'color',
}

export const checkIsDraw = (filter: any) => {
  return ['st_distance', 'st_within'].some((t: string) => t === filter.expr.type);
};

// Map related helpers
export const mapboxCoordinatesGetter = (bounds: any) => {
  let northEast = [bounds._ne.lng, bounds._ne.lat];
  let southWest = [bounds._sw.lng, bounds._sw.lat];
  return [
    [southWest[0], northEast[1]],
    [northEast[0], northEast[1]],
    [northEast[0], southWest[1]],
    [southWest[0], southWest[1]],
  ];
};

// used to create a center point
// and its position data is from incoming data
export const markerPosGetter = (config: MapChartConfig, data: any, center: any = {}) => {
  center.lat = data[measureGetter(config, KEY.LATITUDE)!.value];
  center.lng = data[measureGetter(config, KEY.LONGTITUDE)!.value];

  return center;
};

// MapChart Single Point SQL Getter
export const shapeFileGetter = (config: any) => {
  const {zoom} = config;
  if (zoom < 8) {
    return 'district';
  }
  if (zoom >= 8 && zoom <= 13) {
    return 'block';
  }
  if (zoom > 13) {
    return 'building';
  }
  return '';
};

export const onMapLoaded = (config: MapChartConfig, getMapBound: Function) => {
  if (!config.bounds && config.type !== 'ChoroplethMap') {
    const lon = (measureGetter(config, 'lon') || dimensionGetter(config, 'lon'))!;
    const lat = (measureGetter(config, 'lat') || dimensionGetter(config, 'lat'))!;
    return getMapBound(lon.value, lat.value, config.source);
  }

  return Promise.resolve(-1);
};

export const polygonFilterGetter = (filters: any = {}) => {
  let newFilters: any = {},
    mapDraws: any = [],
    colorItems: any = [];

  Object.keys(filters).forEach((f: any) => {
    checkIsDraw(filters[f])
      ? mapDraws.push(parseExpression(filters[f].expr))
      : colorItems.push(parseExpression(filters[f].expr));
  });
  if (mapDraws.length > 0 && colorItems.length === 0) {
    newFilters.polygon = {
      type: 'filter',
      expr: mapDraws.join(` OR `),
    };
  }
  if (mapDraws.length === 0 && colorItems.length > 0) {
    newFilters.polygon = {
      type: 'filter',
      expr: colorItems.join(` OR `),
    };
  }
  if (mapDraws.length > 0 && colorItems.length > 0) {
    newFilters.polygon = {
      type: 'filter',
      expr: `(${colorItems.join(` OR `)}) AND (${mapDraws.join(` OR `)})`,
    };
  }
  return newFilters;
};

export const drawsGlGetter = (config: any) => {
  const filterKeys = Object.keys(config.filter || {});
  const draws: any = [];
  filterKeys.forEach((f: any) => {
    draws.push({data: config.filter[f]});
  });
  return draws;
};

export const parseBoundsToPolygon = (bounds: any) => {
  const {_sw: sw, _ne: ne} = bounds;
  return `${sw.lng} ${sw.lat}, ${sw.lng} ${ne.lat}, ${ne.lng} ${ne.lat}, ${ne.lng} ${sw.lat}, ${sw.lng} ${sw.lat}`;
};

export const arcternMapConfigHandler = (config: any) => {
  let newConfig = cloneObj(config);

  const hasFilter = Object.keys(newConfig.filter).length > 0;
  if (!hasFilter) {
    let lon =
      measureGetter(newConfig, KEY.LONGTITUDE) || dimensionGetter(newConfig, KEY.LONGTITUDE);
    let lat = measureGetter(newConfig, KEY.LATITUDE) || dimensionGetter(newConfig, KEY.LATITUDE);
    newConfig.selfFilter.bounds = {
      type: 'filter',
      expr: {
        type: 'st_within',
        x: lon!.value,
        y: lat!.value,
        polygon: parseBoundsToPolygon(newConfig.bounds),
      },
    };
  }
  newConfig.filter = orFilterGetter(newConfig.filter);
  return newConfig;
};

const _getValidLat = (lng: number) => {
  if (lng > 180) {
    return lng - 360;
  }
  if (lng < -180) {
    return lng + 360;
  }
  return lng;
};
// https://epsg.io/3857,for the usage area of EPSG 3857 is between 85.06°S and 85.06°N.
// If the longitude is greater than 180, subtract 360 from this value.
// the one of the longitude in this issue is 213.44455123091348, so replace this value with 213.44455123091348 - 360 = -146.55544876908652
export const getValidBoundingBox = (bounds: any) => {
  const {_sw = {}, _ne = {}} = bounds;
  return [_getValidLat(_sw.lng), _sw.lat, _getValidLat(_ne.lng), _ne.lat];
};
