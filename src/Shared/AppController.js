import axios from 'axios';
let global_AppVersion = null;
let global_APIVersion = null;

const AppController = {

  setupInitialState: (appVersion) => {
    global_AppVersion = appVersion;
    console.log('App version: ' + global_AppVersion);

    axios.get('/version')
    .then(res => {
      if (res.data.success) {
        global_APIVersion = res.data.gitBranch + ':' + res.data.gitCommit.slice(0, 7);
        console.log('API version: ' + global_APIVersion);
      }
    })
    .catch(error => {
      console.log(error);
    })
  },

  getAppVersion: () => {
    return global_AppVersion;
  },

  getAPIVersion: () => {
    return global_APIVersion;
  }
}
export default AppController;
