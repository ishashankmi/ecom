import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.saras.app',
  appName: 'Saras',
  webDir: 'dist',
  server: {
    url: 'http://3.7.159.208',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;