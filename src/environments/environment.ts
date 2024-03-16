// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // service_base_url: 'https://api.gesiltech.com',
  // service_base_url: 'http://142.44.180.114:8000',
  service_base_url: 'https://api.esebakendra.com',
  BBPS_AGENT_ID: 'CC01BA48AGTU00000001',
  BBPS_AGENT_DEVICE_INFO: {
    "ip": "192.168.2.73",
    "initChannel": "AGT",
    "mac": "01-23-45-67-89-ab"
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
