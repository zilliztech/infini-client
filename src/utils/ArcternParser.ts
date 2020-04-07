export const truncParser = (expression: any) => {
  return expression.unit === 'day'
    ? `date(${expression.field})`
    : `trunc(${expression.field}, ${expression.unit})`;
};

export const extractParser = (expression: any) => {
  return expression.unit === 'isodow'
    ? `date_format(${expression.field}), 'e')`
    : `${expression.unit}(${expression.field})`;
};
