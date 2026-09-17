// Firebase configuration initialized for Google Workspace & Gmail integration
import rawConfig from '../../../firebase-applet-config.json'

export const firebaseConfig = {
  projectId: rawConfig.projectId,
  appId: rawConfig.appId,
  apiKey: rawConfig.apiKey,
  authDomain: rawConfig.authDomain,
  storageBucket: rawConfig.storageBucket,
  messagingSenderId: rawConfig.messagingSenderId,
  oAuthClientId: rawConfig.oAuthClientId,
}

export default firebaseConfig
