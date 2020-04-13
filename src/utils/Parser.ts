import {SqlParser as S} from 'infinivis-core';
import {dateTruncParser, extractParser, parseBin} from '../utils/MegaWiseParser';
import {
  truncParser,
  extractParser as arcternExtractParser,
  stWithinParser,
  stDistanceParser,
  wktParser,
} from '../utils/ArcternParser';
const Parser = S.SQLParser;
export const parseExpression = (expression: any) => {
  const {isArctern = false} = window._env_;
  if (isArctern) {
    Parser.registerExpression('trunc', truncParser);
    Parser.registerExpression('extract', arcternExtractParser);
    Parser.registerExpression('st_within', stWithinParser);
    Parser.registerExpression('st_distance', stDistanceParser);
    Parser.registerExpression('wkt', wktParser);
  } else {
    Parser.registerExpression('date_trunc', dateTruncParser);
    Parser.registerExpression('extract', extractParser);
    Parser.registerTransform('bin', parseBin);
  }
  return Parser.parseExpression(expression);
};
