import React, {FC} from 'react';

const CustomEditor: FC = ({
  classes,
  MeasuresFormat,
  config,
  ColorPalette,
  Limit,
  setConfig,
  MapTheme,
  data,
  dataMeta,
  nls,
}: any) => {
  return (
    <div className={classes.root}>
      <div className={classes.source}>
        <MapTheme config={config} setConfig={setConfig} />
      </div>
      <div className={classes.source}>
        <ColorPalette
          dataMeta={dataMeta}
          data={data}
          config={config}
          setConfig={setConfig}
          colorTypes={['gradient']}
        />
      </div>
      <div className={classes.source}>
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
      </div>
      <div className={classes.source}>
        <MeasuresFormat config={config} setConfig={setConfig} />
      </div>
    </div>
  );
};

export default CustomEditor;
