export const environment = {
  production: true,
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
    {blr_id: 'TATASKY00NAT01',logo:'tataplay.png'},
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
  ],
  NOT_IMPLEMENTED_MENU : ['/DCA', '/PGDCA', '/pan', '/Print-PVC', '/New-Adhar'],
  // Dont change the User Type Order, the index is being used
  USER_TYPE: ['', 'Users', 'Retailers', 'Distributor', 'Master Distributor', 'Admin'],
  // BBPS DMT Fingerprint PID Option
  PIDOPTION_FOR_BBPS_DMT: '<!--?xml version="1.0"?-->' + '<PidOptions ver="1.0">' + '<Opts fCount="1" fType="2" iCount="0" pCount="0" format="0" pidVer="2.0" timeout="10000" wadh="18f4CEiXeXcfGXvgWA/blxD+w2pw7hfQPY45JMytkPw=" posh="UNKNOWN" env="P"> </Opts> </PidOptions>'

};
