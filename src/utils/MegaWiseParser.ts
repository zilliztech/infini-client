export const dateTruncParser = (expression: any) =>
  `date_trunc('${expression.unit}', ${expression.field})`;
export const extractParser = (expression: any) =>
  `extract(${expression.unit} from ${expression.field})`;
