export const environment = {
  production: true,
  // false = route guard only logs pages missing from the role menu; true = redirects them to /home.
  enforceMenuAccess: false,
  // apiUrl: 'https://cgmsc.gov.in/emsapi/api', // testing 

   apiUrl: 'http://103.51.8.80/emsapi/api', // live
  // apiUrl: 'https://localhost:7036/api',
  //  apiUrl:' http://localhost:5169/api'

};
