/* global gapi */

import {fetchGoogleLibrary, loadGoogleApi, loadClientApi} from './GoogleLoader.js';


async function initGoogleAPI() {
  //Fetch Google Library from their servers
  await fetchGoogleLibrary();

  //Load required APIs
  await loadGoogleApi('auth2');
  await loadGoogleApi('picker');	  
  await loadGoogleApi('client');
  
  await loadClientApi('drive', 'v3');
}
  
async function GoogleAuth() {
  await initGoogleAPI();

  return new Promise(function(resolve) {
    gapi.auth2.authorize({
	  'apiKey': process.env.VUE_APP_API_KEY,
	  'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
	  'clientId': process.env.VUE_APP_CLIENT_ID,
	  'scope': 'https://www.googleapis.com/auth/drive.file'
    }, resolve);
  });	 
}

async function installDriveApp() {
  await initGoogleAPI();  

  return new Promise(function(resolve) {
    gapi.auth2.authorize({
    'apiKey': process.env.VUE_APP_API_KEY,
    'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    'clientId': process.env.VUE_APP_CLIENT_ID,
    'scope': 'https://www.googleapis.com/auth/drive.install'
    }, resolve);
  });  
}


export {GoogleAuth, installDriveApp};