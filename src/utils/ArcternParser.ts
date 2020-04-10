export const truncParser = (expression: any) => {
  return expression.unit === 'day'
    ? `date(${expression.field})`
    : `trunc(${expression.field}, '${expression.unit}')`;
};

export const extractParser = (expression: any) => {
  return expression.unit === 'isodow'
    ? `date_format(${expression.field}, 'e')`
    : `${expression.unit}(${expression.field})`;
};

export const stWithinParser = (expression: any) => {
  const {x, y, sw, ne} = expression;
  const polygon = `${sw.lng} ${sw.lat}, ${sw.lng} ${ne.lat}, ${ne.lng} ${ne.lat}, ${ne.lng} ${sw.lat}, ${sw.lng} ${sw.lat}`;
  return `ST_Within (ST_Point (${x}, ${y}), ST_GeomFromText('POLYGON ((${polygon}))'))`;
};

export const stDistanceParser = (expression: any) => {
  const {fromlon, fromlat, tolon, tolat, distance} = expression;
  return `st_distance(st_transform(st_geomFromText('point(${tolon} ${tolat})'),'epsg:4326', 'epsg:3857'),st_transform(st_geomFromText ('point(${fromlon} ${fromlat})'),'epsg:4326', 'epsg:3857')) < ${distance}`;
};

export const wktParser = (expression: any) => {
  return `ST_GeomFromText(${expression.value})`;
};
