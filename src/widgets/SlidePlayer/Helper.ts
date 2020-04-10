import {TIME_GAPS} from '../../utils/Time';

export const nextTextOrNumberWrapper = function (isEnd = false) {
  let gap = 0;
  return function calculateNextBrush(width: number, x: any, brush: any, step: number) {
    // default brush width
    if (!brush.length) {
      return [x.invert(0), x.invert(50)];
    }

    gap = isEnd ? gap : x(brush[1]) - x(brush[0]);
    // to xAxis head with the origin brush with
    if (isEnd || x(brush[1]) >= width) {
      isEnd = false;
      return [x.invert(0), x.invert(gap)];
    }
    return brush.map((v: any, index: number) => {
      let newPosition = x(v) + step;
      if (index === 1) {
        // if next text postion will touch end to the top
        isEnd = newPosition + step >= width;
        newPosition = isEnd ? width : newPosition;
      }
      return x.invert(newPosition);
    });
  };
};

export const nextTimeWrapper = function (isEnd = false) {
  let brushGap = 0;
  return function calculateNextBrush(brush: any[], timeUnit: string, domain: any) {
    const timeGap = TIME_GAPS[timeUnit];
    const timeMax = Date.parse(domain[1]);
    const timeMin = Date.parse(domain[0]);
    brushGap = isEnd ? brushGap : Date.parse(brush[1]) - Date.parse(brush[0]);
    if (!brush.length) {
      return [timeMin, timeMin + timeGap];
    }
    if (isEnd || Date.parse(brush[1]) >= timeMax) {
      isEnd = false;
      return [timeMin, timeMin + brushGap];
    }
    return brush.map((b: any, index: number) => {
      let next = Date.parse(b) + timeGap;
      if (index === 1) {
        // if next text postion will touch end to the top
        isEnd = next + timeGap >= timeMax;
        next = isEnd ? timeMax : next;
      }

      return next;
    });
  };
};
