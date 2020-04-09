import {WIDGET} from '../../utils/Consts';
const base = {
  label_x_axis: 'x axis',
  label_y_axis: 'y axis',
  label_color: 'color',
  label_AVG: 'AVG',
  label_MIN: 'MIN',
  label_MAX: 'MAX',
  label_SUM: 'SUM',
  label_UNIQUE: '# UNIQUE',
  label_STDDEV: 'STDDEV',
  label_value: 'value',
  label_or: 'or',
  label_info: 'info',
  label_error: 'error',
};

const nls = {
  language: 'en-US',
  test: 'Hello',
  label_dashboards: 'Dashboards',
  label_server_not_found: 'Server Not Found',
  label_ID: 'ID',
  label_clear: 'Clear',
  label_add_new_widget: 'Add Widget',
  label_database_setting: 'Database Setting',
  label_apply: 'Apply',
  label_404: '404, Page not Found',
  label_remember_me: 'remember Me',
  label_sign_in: 'sign in',
  label_confirm: 'Confirm',
  label_cancel: 'Cancel',
  label_export: 'Export',
  label_remove: 'Remove',
  label_close: 'Close',
  label_view_all: 'View All',
  label_info: base.label_info,
  label_import_dashboard: 'Import Dashboard',
  // Login Page
  label_title: 'Sign in Infini',
  label_username: 'EMAIL ADDRESS',
  label_username_placeholder: 'name@company.com',
  label_password: 'PASSWORD',
  label_password_placeholder: 'password',
  label_email: 'email',
  label_wrong_happened: 'Error Found',
  label_forget_password: 'Forgot Password',
  label_name: 'Name',
  label_bi_reqfail_title: 'db connect faild',
  label_bi_reqfail_content: 'database config seems not valid ,please set an useful config',
  // DB Setting
  label_db_dbname: 'Database Name',
  label_db_dbtype: 'Database Type',
  label_db_title: 'Database Config',
  label_db_ip: 'Database IP',
  label_dabasese_type: 'Database type',
  label_db_username: 'Username',
  label_db_password: 'Password',
  label_db_database: 'Database',
  label_db_port: 'Port',
  label_db_connect: 'Connect',
  label_db_save: 'Save Config',
  label_db_success_title: 'Setting Succeed ~',
  label_db_success_content: 'please visit dashBoard',
  label_db_success_confirm: 'Confirm',
  label_db_fail_title: 'Save Failed!',
  label_db_fail_content: 'invalid params, please try again',
  label_db_useDefault: 'default params',

  label_created: 'Created Date',
  label_modified: 'Modified Date',
  label_shared: 'Shared',
  label_rows_per_page: 'Rows per Page',
  label_dashboard: 'Dashboard',
  label_header_theme: 'Theme',
  label_saved_dashboard: 'Saved Dashboard',
  label_legend: 'Legend',
  label_source: 'source',
  label_sources: 'SOURCES',
  label_dimensions: 'dimensions',
  label_measures: 'measures',
  label_show_range: 'SHOW RANGE',
  label_auto: 'auto',
  label_custom_color: 'Custom Color',
  label_visual_data_mapping: 'Visual Data Mapping',
  label_measure_number_format: 'MEASURE NUMBER FORMATTING',
  label_dimension_date_format: 'DIMENSION DATE FORMATTING',
  label_add_dimension: 'ADD DIMENSION',
  label_add_measure: 'ADD MEASURE',
  label_sort_by: 'SORT',
  label_point_size: 'POINT SIZE',
  label_of_points_size: 'NUM OF POINTS SIZE',
  label_desc: 'DESC',
  label_asc: 'ASC',
  label_records: '# Records',
  label_color_palette: 'COLOR PALETTE',
  label_size: 'SIZE',
  label_lon: 'LON',
  label_lat: 'LAT',
  label_popup_box: 'POPUP BOX',
  label_add_column: 'ADD COLUMN',
  label_min_color: 'Min Color',
  label_max_color: 'Max Color',
  label_groups: 'GROUPS',
  label_auto_layout: 'Layout',
  label_play: 'Play',
  label_pause: 'PAUSE',
  label_dialog_title: 'Information',
  label_dialog_content: 'No More Content',
  label_chart_style: 'Chart Style',
  label_chart_style_line: 'Line',
  label_chart_style_area: 'Area',
  label_column_type: 'Data Type',
  label_colName: 'Colname',
  label_dataList_abstract_tableName: 'Table Name',
  label_dataList_abstract_numRows: 'Rows',
  label_dataList_abstract_columns: 'Columns',
  label_restore: 'Restore',
  label_noother_opt: 'No More',
  label_showMore: 'show more ...',

  label_widgetEditor_noneRequired: 'None Required',
  label_widgetEditor_bin: 'BIN',
  label_widgetEditor_binning: 'Binning',
  label_widgetEditor_Extract: 'Extract',
  label_widgetEditor_extract: 'EXT',
  label_widgetEditor_expression_avg: base.label_AVG,
  label_widgetEditor_expression_sum: base.label_SUM,
  label_widgetEditor_expression_min: base.label_MIN,
  label_widgetEditor_expression_max: base.label_MAX,
  label_widgetEditor_expression_unique: base.label_UNIQUE,
  label_widgetEditor_expression_count: 'COUNT',

  label_widgetEditor_expression_stddev: base.label_STDDEV,
  label_widgetEditor_requireLabel_xaxis: base.label_x_axis,
  label_widgetEditor_requireLabel_yaxis: base.label_y_axis,
  label_widgetEditor_requireLabel_value: base.label_value,
  label_widgetEditor_requireLabel_color: base.label_color,
  label_widgetEditor_requireLabel_building: 'Build',
  label_widgetEditor_requireLabel_size: 'size',
  label_widgetEditor_requireLabel_colname: 'col',
  label_widgetEditor_requireLabel_width: 'width',
  label_widgetEditor_requireLabel_longtitude: 'lon',
  label_widgetEditor_requireLabel_latitude: 'lat',
  [`label_Header_${WIDGET.NUMBERCHART}`]: 'Number',
  [`label_Header_${WIDGET.TABLECHART}`]: 'Table',
  [`label_Header_${WIDGET.STACKEDBARCHART}`]: 'StackedBar',
  [`label_Header_${WIDGET.BARCHART}`]: 'Bar',
  [`label_Header_${WIDGET.PIECHART}`]: 'Pie',
  [`label_Header_${WIDGET.TEXTCHART}`]: 'Text',
  [`label_Header_${WIDGET.BUBBLECHART}`]: 'Bubble',
  [`label_Header_${WIDGET.HEATCHART}`]: 'Heat',
  [`label_Header_${WIDGET.SCATTERCHART}`]: 'Scatter',
  [`label_Header_${WIDGET.SCATTERCHART3D}`]: 'Scatter3D',
  [`label_Header_${WIDGET.HISTOGRAMCHART}`]: 'Histogram',
  [`label_Header_${WIDGET.LINECHART}`]: 'Line',
  [`label_Header_${WIDGET.COMBOCHART}`]: 'Combo',
  [`label_Header_${WIDGET.POINTMAP}`]: 'PointMap',
  [`label_Header_${WIDGET.LINEMAP}`]: 'LineMap',
  [`label_Header_${WIDGET.GEOHEATMAP}`]: 'GeoHeatMap',
  [`label_Header_${WIDGET.CHOROPLETHMAP}`]: 'ChoroplethMap',
  [`label_Header_${WIDGET.MAPCHART}`]: 'Map',
  [`label_Header_${WIDGET.RANGECHART}`]: 'Range',
  [`label_Header_${WIDGET.MAPBOX}`]: 'MapBox',
  [`label_Header_${WIDGET.FILTERWIDGET}`]: 'Filter',

  label_widgetEditor_requirements: 'Requirements',
  label_widgetEditor_unit: 'unit',
  label_widgetEditor_binSize: ' # OF BINS SIZE:',
  label_widgetEditor_minMax: 'Min | Max',
  label_widgetEditor_countval: 'Countval',
  label_widgetEditor_customOpt_label: 'Label',
  label_widgetEditor_customOpt_expression: 'Expression',
  label_widgetEditor_customOpt_back: 'BACK',
  label_widgetEditor_customOpt_save: 'SAVE',
  label_widgetEditor_customOpt_placeholder_measure: 'Custom SQL Measure',
  label_widgetEditor_customOpt_placeholder_dimension: 'Custom SQL Dimension',
  label_widgetEditor_recordOpt_placeholder_measure: 'Records',
  label_widgetEditor_recordOpt_label_measure: 'Records',
  label_widgetEditor_invalid_binRange_title: 'Invalid Bin Range',
  label_widgetEditor_invalid_binRange_content:
    'Receive invalid bin range. Custome dimension only support columns of number type currently, please make sure you input the right dimension.',

  label_widgetEditor_binOpt_ext_century: 'century',
  label_widgetEditor_binOpt_ext_decade: 'decade',
  label_widgetEditor_binOpt_ext_year: 'year',
  label_widgetEditor_binOpt_ext_quarter: 'quarter',
  label_widgetEditor_binOpt_ext_month: 'month',
  label_widgetEditor_binOpt_ext_day_of_month: 'day of month',
  label_widgetEditor_binOpt_ext_day_of_week: 'day of week',
  label_widgetEditor_binOpt_ext_hour: 'hour',
  label_widgetEditor_binOpt_ext_minute: 'minute',
  label_widgetEditor_binOpt_ext_second: 'second',
  label_widgetEditor_binOpt_ext_millisecond: 'millisecond',

  label_widgetEditor_binOpt_bin_century: 'century',
  label_widgetEditor_binOpt_bin_decade: 'decade',
  label_widgetEditor_binOpt_bin_year: 'year',
  label_widgetEditor_binOpt_bin_quarter: 'quarter',
  label_widgetEditor_binOpt_bin_month: 'month',
  label_widgetEditor_binOpt_bin_week: 'week',
  label_widgetEditor_binOpt_bin_day: 'day',
  label_widgetEditor_binOpt_bin_hour: 'hour',
  label_widgetEditor_binOpt_bin_minute: 'minute',
  label_widgetEditor_binOpt_bin_second: 'second',
  label_widgetEditor_binOpt_bin_millisecond: 'millisecond',

  label_widgetEditorDisplay_stackedDisplayType_displayType: 'DisplayType',
  label_widgetEditorDisplay_stackedDisplayType_vertical: 'vertical',
  label_widgetEditorDisplay_stackedDisplayType_horizontal: 'horizontal',
  label_widgetEditorDisplay_mapTheme: 'Map Theme',
  label_widgetEditorDisplay_VisualDataMapping_placeholder: 'Add Column',

  label_StackedBarChart_nodata: 'No Data',
  label_BubbleChart_count: 'count',
  label_ScatterChart_rest: 'Reset',

  label_dashboard_add: 'Add Dashboard',
  label_TableChart_from: 'from',
  label_TableChart_to: 'to',
  label_TableChart_rows_perpage: 'Rows per page:',

  label_or: base.label_or,

  tip_wrong_password: 'Email or Password incorrect, please try again',
  tip_login_failed: 'Login Failed',
  tip_nothing_should_choose: 'Nothing should choose',
  tip_refresh_page: 'Please refresh the page.',
  tip_max_dashboard_reach:
    'Max dashboards reach, Please contact zilliz support: support@zilliz.com',
  tip_import_existed: 'The imported dashboard config already exists, override it ?',
  tip_remove_dashboard: 'Remove Dashboard ?',
  tip_dashboard_config_wrong:
    'The imported dashboard configuration is incorrect, please check it again',
  tip_remove_dashboard_success: 'Remove successfully',
  tip_import_dashboard_success: 'Import successfully',
  totolRecordsNlsGetter: (n: number) => `${n} records total`,
  time_locale: {
    dateTime: '%x, %X',
    date: '%-m/%-d/%Y',
    time: '%-I:%M:%S %p',
    periods: ['AM', 'PM'],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    shortMonths: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
  },
};

export default nls;
