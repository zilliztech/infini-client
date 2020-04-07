import {
  isReadyToRender,
  isRecordExist,
  getValidColumns,
  calStatus,
  measureUsePopUp,
  filterColumns,
  getDefaultTitle,
  Column,
} from './EditorHelper';
import {WidgetConfig} from '../types';
import {COLUMN_TYPE} from '../utils/Consts';
import {PointConfigLackLonMeasure, BarConfig, PieConfigLackDimension} from './SpecHelper';
import PointSetting from '../widgets/PointMap/settings';
import BarSetting from '../widgets/BarChart/settings';
import PieSetting from '../widgets/PieChart/settings';
const columns = [
  {
    col_name: 'buildingid_dropoff',
    data_type: 'int4',
    type: 'int4',
  },
  {
    col_name: 'buildingid_pickup',
    data_type: 'int4',
    type: 'int4',
  },
  {
    col_name: 'buildingtext_dropoff',
    data_type: 'text',
    type: 'text',
  },
  {
    col_name: 'buildingtext_pickup',
    data_type: 'text',
    type: 'text',
  },
  {
    col_name: 'dropoff_latitute',
    data_type: 'float8',
    type: 'float8',
  },
  {
    col_name: 'dropoff_longitute',
    data_type: 'float8',
    type: 'float8',
  },
  {
    col_name: 'fare_amount',
    data_type: 'float8',
    type: 'float8',
  },
  {
    col_name: 'passenger_count',
    data_type: 'int4',
    type: 'int4',
  },
  {
    col_name: 'pickup_latitude',
    data_type: 'float8',
    type: 'float8',
  },
  {
    col_name: 'pickup_longitude',
    data_type: 'float8',
    type: 'float8',
  },
  {
    col_name: 'tip_amount',
    data_type: 'float8',
    type: 'float8',
  },
  {
    col_name: 'total_amount',
    data_type: 'float8',
    type: 'float8',
  },
  {
    col_name: 'tpep_dropoff_datetime',
    data_type: 'timestamp',
    type: 'timestamp',
  },
  {
    colName: 'tpep_pickup_datetime',
    data_type: 'timestamp',
    type: 'timestamp',
  },
  {
    colName: 'trip_distance',
    data_type: 'float8',
    type: 'float8',
  },
  {
    colName: 'vendor_id',
    data_type: 'text',
    type: 'text',
  },
];
test('isReadyToRender', () => {
  const PointReady = isReadyToRender(PointConfigLackLonMeasure, PointSetting);
  const BarReady = isReadyToRender(BarConfig as WidgetConfig, BarSetting);
  const PieReady = isReadyToRender(PieConfigLackDimension as WidgetConfig, PieSetting);

  expect(PointReady).toStrictEqual({
    sourceReady: {isReady: true},
    dimensionsReady: {isReady: true, lacks: []},
    measuresReady: {
      isReady: false,
      lacks: [
        {
          columnTypes: ['number'],
          expressions: ['gis_point_lon'],
          key: 'lon',
          short: 'longtitude',
          type: 'required',
        },
      ],
    },
  });
  expect(BarReady).toStrictEqual({
    sourceReady: {isReady: true},
    dimensionsReady: {isReady: true, lacks: []},
    measuresReady: {isReady: true, lacks: []},
  });
  expect(PieReady).toStrictEqual({
    sourceReady: {isReady: true},
    dimensionsReady: {isReady: false, lacks: [{key: '', short: '', type: 'requiedOneAtLeast'}]},
    measuresReady: {isReady: true, lacks: []},
  });
});
test('isRecordExist', () => {
  expect(isRecordExist(PointConfigLackLonMeasure)).toBe(false);
  expect(isRecordExist(BarConfig as WidgetConfig)).toBe(false);
  expect(isRecordExist(PieConfigLackDimension as WidgetConfig)).toBe(false);
});
test('getValidColumns', () => {
  const numRes = getValidColumns(columns as Column[], [COLUMN_TYPE.NUMBER]);
  const dateRes = getValidColumns(columns as Column[], [COLUMN_TYPE.DATE]);
  const textRes = getValidColumns(columns as Column[], [COLUMN_TYPE.TEXT]);
  const numDateRes = getValidColumns(columns as Column[], [COLUMN_TYPE.NUMBER, COLUMN_TYPE.DATE]);
  const invalidRes = getValidColumns(columns as Column[], ['lalallallala' as COLUMN_TYPE]);
  const allRes = getValidColumns(columns as Column[], [
    COLUMN_TYPE.NUMBER,
    COLUMN_TYPE.DATE,
    COLUMN_TYPE.TEXT,
  ]);

  expect(numRes.length).toBe(11);
  expect(dateRes.length).toBe(2);
  expect(textRes.length).toBe(3);
  expect(numDateRes.length).toBe(13);
  expect(invalidRes.length).toBe(0);
  expect(allRes.length).toBe(16);
});
test('calStatus', () => {
  const textDimension = {type: 'text'};
  const numBinDimension = {isNotUseBin: true, value: 'ahhhh'};
  const dateBinDimension = {type: 'timestamp', value: 'ahhhh'};
  const textMeasure = {value: 'ahhhh', expression: 'unique', type: 'text'};
  const numMeasure = {expression: 'avg', value: 'ahhhh'};
  const staticMeasure = {expression: 'lalallalal', value: 'ahhhh'};

  const dRes0 = calStatus(textDimension, {}, 'dimension');
  const dRes1 = calStatus(numBinDimension, {isNotUseBin: true}, 'dimension');
  const dRes2 = calStatus({value: 'ahhhh'}, {}, 'dimension');
  const dRes3 = calStatus(dateBinDimension, {isNotUseBin: true}, 'dimension');
  const dRes4 = calStatus(dateBinDimension, {}, 'dimension');

  const mRes0 = calStatus(textMeasure, {expressions: ['avg', 'min', 'unique']}, 'measure');
  const mRes1 = calStatus(textMeasure, {expressions: ['min']}, 'measure');
  const mRes2 = calStatus(numMeasure, {expressions: ['avg']}, 'measure');
  const mRes3 = calStatus(numMeasure, {expressions: ['avg', 'min']}, 'measure');
  const mRes4 = calStatus(staticMeasure, {expressions: ['lalallalal']}, 'measure');
  const mRes5 = calStatus(staticMeasure, {expressions: ['lalallalal', 'avg', 'min']}, 'measure');

  expect(dRes0).toBe('add');
  expect(dRes1).toBe('selected');
  expect(dRes2).toBe('selectBin');
  expect(dRes3).toBe('selected');
  expect(dRes4).toBe('selectBin');

  expect(mRes0).toBe('selected');
  expect(mRes1).toBe('selected');
  expect(mRes2).toBe('selected');
  expect(mRes3).toBe('selectExpression');
  expect(mRes4).toBe('selected');
  expect(mRes5).toBe('selectExpression');
});
test('measureUsePopUp', () => {
  const textMeasure = {value: 'ahhhh', expression: 'unique', type: 'text'};
  const numMeasure = {expression: 'avg', value: 'ahhhh'};
  const recordMeasure = {expression: 'count', value: '*', isRecords: true};

  const textRes = measureUsePopUp(textMeasure);
  const numRes = measureUsePopUp(numMeasure);
  const recordRes = measureUsePopUp(recordMeasure);

  expect(textRes).toBe(false);
  expect(numRes).toBe(true);
  expect(recordRes).toBe(false);
});
test('filterColumns', () => {
  const res = filterColumns('', columns);
  const res1 = filterColumns('asdasdasdasdasdas', columns);
  const res2 = filterColumns('build', columns);
  const res3 = filterColumns('fare', columns);
  const res4 = filterColumns('amount', columns);

  expect(res.length).toBe(16);
  expect(res1.length).toBe(0);
  expect(res2.length).toBe(4);
  expect(res3.length).toBe(1);
  expect(res4.length).toBe(3);
});
test('getDefaultTitle', () => {
  const res = getDefaultTitle({label: 'a', isRecords: false, expression: 'b'});
  const res1 = getDefaultTitle({label: 'b', isRecords: true, expression: 'c'});

  expect(res).toStrictEqual({
    expression: 'b',
    label: 'a',
  });
  expect(res1).toStrictEqual({
    expression: 'count',
    label: 'b',
  });
});
