// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // service_base_url: 'https://localhost:44306',
  service_base_url: 'https://api.esebakendra.com',
  BBPS_AGENT_ID: 'CC01BA48AGTU00000001',
  BBPS_AGENT_DEVICE_INFO: {
    "ip": "192.168.2.73",
    "initChannel": "AGT",
    "mac": "01-23-45-67-89-ab"
  },
  
  DTH_BILLER_LOGO: [
    {blr_id: 'TATASKY00NAT01',logo:'tataplay.png'},
    {blr_id: 'DISH00000NAT01',logo:'dishtv.png'},
    {blr_id: 'AIRT00000NAT87',logo:'airtel-dtoh.png'},
    {blr_id: 'VIDEOCON0NAT01',logo:'dtoh.png'},
    {blr_id: 'SUND00000NATGK',logo:'sundirect.jpeg'},
  ],

  PREPAID_RECHARGE_OPERATOR : [
    {
      "op": 1,
      "provider": "AirTel"
    },
    {
      "op": 604,
      "provider": "airtel up east"
    },
    {
      "op": 2,
      "provider": "BSNL"
    },
    {
      "op": 32,
      "provider": "BSNL Special"
    },
    {
      "op": 505,
      "provider": "DOCOMO RECHARGE"
    },
    {
      "op": 506,
      "provider": "DOCOMO SPECIAL"
    },
    {
      "op": 4,
      "provider": "Idea"
    },
    {
      "op": 167,
      "provider": "Jio"
    },
    {
      "op": 5,
      "provider": "Vodafone"
    }
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
