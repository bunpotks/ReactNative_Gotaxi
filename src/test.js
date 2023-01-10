import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Platform,
  Alert,
  TouchableOpacity,
  AppState,
  AppRegistry,
  PermissionsAndroid,
  Button,
} from 'react-native';
import PushNotification from 'react-native-push-notification';
import BackgroundGeolocation from '@hariks789/react-native-background-geolocation';
const MytestScreen = () => {
  const startAction = () => {
    PushNotification.localNotification({
      channelId: 'NOTI-ALL', // (required) channelId, if the channel doesn't exist, notification will not trigger.
      color: '#FF8C00', // (optional) default: system default
      autoCancel: true, // (optional) default: true
      title: 'เริ่มการแชร์ตำแหน่งโปรดอย่าปิดแอป', // (optional)
      message: 'เริ่มการแชร์ตำแหน่งโปรดอย่าปิดแอป', // (required)
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      // data: {url: response.data[i].noti_url},
    });

    BackgroundGeolocation.start();
  };

  const stopAction = () => {
    PushNotification.localNotification({
      channelId: 'NOTI-ALL', // (required) channelId, if the channel doesn't exist, notification will not trigger.
      color: '#FF8C00', // (optional) default: system default
      autoCancel: true, // (optional) default: true
      title: 'สิ้นสุดการแชร์ตำแหน่ง', // (optional)
      message: 'สิ้นสุดการแชร์ตำแหน่ง', // (required)
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      // data: {url: response.data[i].noti_url},
    });

    BackgroundGeolocation.stop();
  };
  return (
    <View style={{flex: 1}}>
      <Button
        title="Start"
        onPress={() => {
          startAction();
        }}
      />
      <Button
        title="Stop"
        onPress={() => {
          stopAction();
        }}
      />
    </View>
  );
};

export default MytestScreen;
