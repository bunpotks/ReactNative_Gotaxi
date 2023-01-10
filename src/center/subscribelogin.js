import React, {useState, useEffect, useCallback} from 'react';

import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification, {Importance} from 'react-native-push-notification';

export const subscribelogin = async () => {
  const login = await AsyncStorage.getItem('@login');
  const loginUser = login ? JSON.parse(login) : undefined;
  console.log(loginUser);
  if (loginUser !== undefined) {
    messaging()
      .subscribeToTopic(loginUser.gmm_emp_type)
      .then(() => console.log('Subscribed to'+loginUser.gmm_emp_type));

    messaging()
      .subscribeToTopic(loginUser.gmm_emp_id)
      .then(() => console.log('Subscribed to ' + loginUser.gmm_emp_id));
  }

  let notiChanel = [
    {
      status: true,
      desc: 'แจ้งเตือนข่าวสารทั่วไป',
      data: {
        channelId: 'NOTI-ALL', // (required)
        channelName: 'General', // (required)
        channelDescription: 'แจ้งเตือนข่าวสารหรือทั่วไป', // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.MAX, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
    },
    {
      status: true,
      desc: 'แจ้งเตือนการจองและชำระเงิน',
      data: {
        channelId: 'NOTI-BOOKING', // (required)
        channelName: 'Booking', // (required)
        channelDescription: 'แจ้งเตือนการจองและชำระเงิน', // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.MAX, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
    },
  ];

  AsyncStorage.setItem('@NOTICHANEL', JSON.stringify(notiChanel));

  PushNotification.createChannel(
    notiChanel[0].data,
    created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );

  PushNotification.createChannel(
    notiChanel[1].data,
    created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );
};

export const unsubscribelogin = async () => {
  const login = await AsyncStorage.getItem('@login');

  const loginUser = login ? JSON.parse(login) : undefined;
  console.log(loginUser);
  if (loginUser !== undefined) {
    messaging()
      .subscribeToTopic(loginUser.gmm_emp_type)
      .then(() => console.log('Subscribed to '+loginUser.gmm_emp_type));

    messaging()
      .subscribeToTopic(loginUser.gmm_emp_id)
      .then(() => console.log('Subscribed to ' + loginUser.gmm_emp_id));
  }
};
