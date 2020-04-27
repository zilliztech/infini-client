import React, {FC} from 'react';
import {measureGetter, dimensionGetter} from '../../utils/WidgetHelpers';
import {getColType} from '../../utils/ColTypes';
import {WidgetConfig} from '../../types';
import {DEFAULT_MAP_POINT_SIZE, DEFAULT_MAX_MAP_POINT_SIZE} from '../Utils/Map';

const _getColorType = (config: WidgetConfig) => {
  const colorItem = dimensionGetter(config, 'color') || measureGetter(config, 'color');
  const {colorPalette = {}} = config;
  if (colorPalette.isGradient) {
    return 'byGradientColor';
  }
  if (colorItem) {
    return 'byDistinctColor';
  }
  return 'byMeasures';
};
const CustomEditor: FC = ({
  classes,
  MeasuresFormat,
  config,
  ColorPalette,
  setConfig,
  MapTheme,
  Limit,
  // PopUp,
  VisualDataMapping,
  Range,
  nls,
}: // options,
any) => {
  const colorType = _getColorType(config);
  const colorMeasure = measureGetter(config, 'color');
  const colType = colorMeasure && getColType(colorMeasure.type);
  const useColorPalette = !colorMeasure || (colorMeasure && colType === 'number');
  const useVisualDataMapping = colorMeasure && colType === 'text';
  // weighted map use weighted pointSize like {min:0, max:30}; point map use pointSize like 3;
  const isWeightedPointSize = typeof config.pointSize === 'object';
  // console.info(isWeightedPointSize)
  // const popUpOpts: any = options.map((opt: any) => opt.colName);

  return (
    <div className={classes.root}>
      <div className={classes.source}>
        <MapTheme config={config} setConfig={setConfig} />
      </div>
      <div className={classes.source}>
        <Limit
          attr={'points'}
          min={1000}
          max={1000000000}
          config={config}
          setConfig={setConfig}
          title={nls.label_of_points_size}
        />
        {isWeightedPointSize ? (
          <Range
            min={config.pointSizeBase.min}
            max={config.pointSizeBase.max}
            attr={'pointSize'}
            config={config}
            setConfig={setConfig}
            title={nls.label_point_size}
          />
        ) : (
          <Limit
            min={DEFAULT_MAP_POINT_SIZE}
            max={DEFAULT_MAX_MAP_POINT_SIZE}
            attr={'pointSize'}
            title={nls.label_point_size}
            config={config}
            setConfig={setConfig}
          />
        )}
      </div>
      {/* <div className={classes.source}>
        <PopUp config={config} setConfig={setConfig} options={popUpOpts} />
      </div> */}

      {useColorPalette && (
        <div className={classes.source}>
          <ColorPalette
            config={config}
            setConfig={setConfig}
            colorTypes={[colorMeasure ? 'gradient' : 'solid']}
          />
        </div>
      )}
      {useVisualDataMapping && (
        <div className={classes.source}>
          {colorType === 'byDistinctColor' && (
            <VisualDataMapping config={config} setConfig={setConfig} />
          )}
        </div>
      )}
      <Limit
        min={0}
        max={1}
        initValue={1}
        step={0.01}
        attr={'opacity'}
        title={nls.label_opacity}
        config={config}
        setConfig={setConfig}
      />
      <div className={classes.source}>
        <MeasuresFormat config={config} setConfig={setConfig} />
      </div>
    </div>
  );
};

export default CustomEditor;
