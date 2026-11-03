export const environment = {
  production: false,
  // false = route guard only logs pages missing from the role menu; true = redirects them to /home.
  enforceMenuAccess: false,
  // Proxied to http://localhost:5169 via proxy.conf.json 
  // apiUrl: '/api',
  // apiUrl: 'http://103.51.8.80/emsapi/api', // live
  // apiUrl: 'https://cgmsc.gov.in/emsapi/api',
  apiUrl: 'http://localhost:5169/api',
  //  apiUrl: 'https://localhost:7036/api', <script>alert(1)</script>
  //  apiUrl: 'https://localhost:7036/api',
};

