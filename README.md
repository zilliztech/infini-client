### Infini GUI/Client
> An Interactive Dashboard built with D3, React, Typescript

> Still in early phase
## Quick Start
* change endpoint to your server address
```
vim src/utils/Endpoints.ts
```
* Install dependencies
```
npm/yarn install
```

* start the dev server
```
npm/yarn start
```

* Build
```
yarn build
```

* Dockerize
```
docker build -t infiniclient:sometag .
```

* Deployment
After build, it will generate bunch of javascripts and htmls in build folder, you can serve them using nginx or any other webserver

## Support SQL
* postgres sql
* mysql sql(partial support)

## Architecture
TBD

## Folder and Files structure
```js
- components
  |- common                   //  comon ui components, eg: nav, dialogs...
  |- settingComponents        //  common setting components, eg: Sort, Ruler, limit
  |- WidgetEditor             //  widget editor component
- contexts
  |- AuthContext.tsx          //  authentication logic and method
  |- I18nContext.tsx          //  dectect language and set i18n string
  |- QueryContext.tsx         //  defines query
  |- RootContext.tsx          //  global context, 
- i18n                        //  i18n strings
  |- en-US
  |- zh-CN
- mock                        //  fake configurations
- pages                       //  login and dashboards and other pages
  |- containers
    |- WidgetWrapper.tsx      // widget is wrapped by the wrapper, it handles query and data for widget editor
  |- Dashboard.tsx            //  dashboard querys sent here
- themes                      //  extend materials ui theme 
- types                       //  common types for Typescript
- utils
  |- reducers                 //  react useReducer hook
  |- Animate.ts               //  used for generatinganimation 
  |- Binning.ts               //  time binning units methods
  |- Colors.ts                //  color related utilities
  |- ColTypes.ts              //  defines supported column types and utilities
  |- Configs.ts               //  utilitis which transforms widgets configs to crossfilter sqls
  |- Consts.ts                //  global constants are defined here
  |- Dashboard.ts             //  dashboard related utilities
  |- EditorHelper.ts          //  widget editor helper utilities
  |- Export.ts                //  export csv utilities
  |- Filters.ts               //  common filter utilities
  |- Formatter.ts             //  formatter utilities
  |- Helpers.ts               //  common javascript utilities
  |- Layout.ts                //  layout utilities
  |- Query.ts                 //  data query class, have a cache layer
  |- Settings.ts              //  widget settings utilites, defines a widget setting builder
  |- Sort.ts                  //  sort utilities
  |- Theme.ts                 //  theme utilities
  |- Time.ts                  //  time utilities and constants
  |- WidgetHelpers.ts         //  widget utilities 
- widgets                     //  our widgets(charts) components
```

