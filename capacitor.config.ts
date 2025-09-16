import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.saras.app',
  appName: 'Saras',
  webDir: 'dist',
  server: {
    url: 'http://13.203.208.251',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;