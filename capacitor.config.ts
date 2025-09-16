import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.saras.app',
  appName: 'Saras',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;