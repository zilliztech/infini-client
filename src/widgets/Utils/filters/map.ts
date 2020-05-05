import {measureGetter, dimensionGetter} from '../../../utils/WidgetHelpers';
import {MapChartConfig} from '../../common/MapChart.type';
import {cloneObj} from '../../../utils/Helpers';
import {KEY} from '../Map';

export const mapUpdateConfigHandler = (
  config: MapChartConfig,
  {boundingClientRect, zoom, center, bounds}: any
) => {
  let copiedConfig = cloneObj(config);
  // console.log(bounds, zoom);
  const {width, height} = boundingClientRect;
  // console.log("add draw", bounds);
  copiedConfig.zoom = zoom;
  copiedConfig.center = center;
  copiedConfig.bounds = bounds;
  copiedConfig.width = width;
  copiedConfig.height = height;
  return copiedConfig;
};

export const drawUpdateConfigHandler = (config: MapChartConfig, draws: any) => {
  const copiedConfig = cloneObj(config);
  let {filter = {}} = copiedConfig;
  // get required lon, lat
  const lon = dimensionGetter(config, KEY.LONGTITUDE) || measureGetter(config, KEY.LONGTITUDE);
  const lat = dimensionGetter(config, KEY.LATITUDE) || measureGetter(config, KEY.LATITUDE);

  filter = {};
  draws.forEach((draw: any) => {
    if (draw.data.properties.isCircle) {
      // console.log("add draw", draw.id, draw);
      filter[draw.id] = {
        type: 'filter',
        isGeoJson: true,
        expr: {
          type: 'circle',
          geoJson: draw.data,
          fromlon: draw.data.properties.center[0],
          fromlat: draw.data.properties.center[1],
          tolon: lon!.value,
          tolat: lat!.value,
          distance: draw.data.properties.radiusInKm * 1000,
        },
      };
      return;
    }

    if (draw.type === 'Polygon') {
      if (draw.data.geometry.coordinates[0][0] === null) {
        return;
      }
      filter[draw.id] = {
        type: 'filter',
        isGeoJson: true,
        expr: {
          type: 'polygon',
          geoJson: draw.data,
          x: lon!.value,
          y: lat!.value,
          px: draw.data.geometry.coordinates[0].map((point: any) => point[0]),
          py: draw.data.geometry.coordinates[0].map((point: any) => point[1]),
        },
      };
    }
  });
  copiedConfig.filter = filter;

  return copiedConfig;
};
