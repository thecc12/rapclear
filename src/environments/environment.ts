// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    /////// dev database access

    apiKey: 'AIzaSyBLtDVukFiJKIqiRJm1BddR8XEvUYnhjA8',
    authDomain: 'tcc-invest.firebaseapp.com',
    databaseURL: 'https://tcc-invest-default-rtdb.firebaseio.com',
    projectId: 'tcc-invest',
    storageBucket: 'tcc-invest.appspot.com',
    messagingSenderId: '652829444071',
    appId: '1:652829444071:web:3aef21819d4ff5bd921f42',
    measurementId: 'G-WNC9YPMBZ1'
  },
};
