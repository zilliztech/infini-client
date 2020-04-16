export const truncParser = (expression: any) => {
  switch (expression.unit) {
    case 'day':
      return `date(${expression.field})`;
    case 'hour':
      return `from_unixtime(unix_timestamp(${expression.field})-(mod(unix_timestamp(${expression.field}),3600)))`;
    default:
      return `trunc(${expression.field}, '${expression.unit}')`;
  }
};

export const extractParser = (expression: any) => {
  return expression.unit === 'isodow'
    ? `date_format(${expression.field}, 'e')`
    : `${expression.unit}(${expression.field})`;
};

export const stWithinParser = (expression: any) => {
  const {x, y, polygon} = expression;
  return `ST_Within (ST_Point (${x}, ${y}), ST_GeomFromText('POLYGON ((${polygon}))'))`;
};

export const stDistanceParser = (expression: any) => {
  const {fromlon, fromlat, tolon, tolat, distance} = expression;
  return `ST_DistanceSphere(ST_Point (${tolon}, ${tolat}), st_geomFromText('point(${fromlon} ${fromlat})')) < ${distance}`;
};

export const wktParser = (expression: any) => {
  return `ST_GeomFromText(${expression.value})`;
};
