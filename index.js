import 'react-native-gesture-handler';
import * as React from 'react';

import {AppRegistry} from 'react-native';
import {
  configureFonts,
  DefaultTheme,
  Portal,
  Provider as PaperProvider,
} from 'react-native-paper';
import {name as appName} from './app.json';
import App from './App';
import {Linking, Platform} from 'react-native';

import PushNotification, {Importance} from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import messaging from '@react-native-firebase/messaging';

const fontConfig = {
  web: {
    regular: {
      fontFamily: 'Prompt-Medium',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Prompt-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Prompt-Medium',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Prompt-Medium',
      fontWeight: 'normal',
    },
  },
  ios: {
    regular: {
      fontFamily: 'Prompt-Medium',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Prompt-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Prompt-Medium',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Prompt-Medium',
      fontWeight: 'normal',
    },
  },
  android: {
    regular: {
      fontFamily: 'Prompt-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Prompt-Regular',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Prompt-Medium',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Prompt-Medium',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'Prompt-Bold',
      fontWeight: 'normal',
    },
  },
};

const theme = {
  ...DefaultTheme,
  roundness: 1,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FFC40C',
    // accent: '#4F8EF7',
    // text:'#4F8EF7'
    // backgroundColor:'transparent',
    background: 'white',
    // placeholder :'red'
  },
  fonts: configureFonts(fontConfig),
};

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log('userinfo', notification.data);

    if (notification.userInteraction == true) {
      if (notification.data.url) {
        setTimeout(() => {
          Linking.openURL(notification.data.url);
        }, 1000);
      }
    }

      notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    // console.log('ACTION:', notification.action);
    // console.log('NOTIFICATION:', notification);
    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  senderID: '223556988652',
  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  // popInitialNotification: true,
  popInitialNotification: true,
  requestPermissions: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
});

PushNotification.popInitialNotification(notification => {
  if (notification.data.url) {
    Linking.openURL(notification.data.url);
  }
  con;
  console.log('Initial Notification', notification);
});

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
