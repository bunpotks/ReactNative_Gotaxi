import React, {useState, useEffect} from 'react';

import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from 'react-native';
import {useTheme, Text} from 'react-native-paper';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification, {Importance} from 'react-native-push-notification';

import BookScreen from './tabmenus/book';
import CarlendarScreen from './tabmenus/carlendar';

import {useToast} from 'react-native-toast-notifications';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {url as urls} from './center/url';

const url = urls.url;
const Tab = createMaterialTopTabNavigator();
const STORAGE_KEY = '@login';

function MyTabs() {
  const [swipeEnabled, setSwipeEnabled] = useState(false);
  return (
    <Tab.Navigator
      mode="modal"
      swipeEnabled={false}
      initialRouteName="BookScreen"
      screenOptions={{
        tabBarLabelStyle: {fontFamily: 'Prompt-Regular'},
        tabBarIndicatorStyle: {backgroundColor: '#FFC40C'},
      }}>
      <Tab.Screen
        name="BookScreen"
        component={BookScreen}
        options={{tabBarLabel: 'เมนู/งานวันนี้'}}
      />
      <Tab.Screen
        name="Calendar"
        component={CarlendarScreen}
        options={{tabBarLabel: 'ตารางงาน'}}
      />
    </Tab.Navigator>
  );
}

function Headdetail({navigation}) {
  const {colors} = useTheme();
  const toast = useToast();

  const [userData, setUserdata] = React.useState({});

  const [tripcount, setTripcount] = React.useState();

  const [isReady, setIsReady] = React.useState(false);

  const STORAGE_KEY = '@login';
  const TRIP_KEY = '@trip';



  return (
    <SafeAreaView style={styleDetail1.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        animated={false}
        barStyle="dark-content"
        showHideTransition
      />
      <View>
        <View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 10,
            }}>
            <Text style={{fontSize: 26, color: 'white', alignSelf: 'center'}}>
              Go Taxi
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function MenutabsScreen({navigation}) {
  const getNoti = async () => {
    // PushNotification.localNotification({
    //   channelId: 'NOTI-ALL', // (required) channelId, if the channel doesn't exist, notification will not trigger.
    //   color: '#FF8C00', // (optional) default: system default

    //   // ticker: 'My Notification Ticker', // (optional)
    //   // showWhen: false, // (optional) default: true
    //   autoCancel: true, // (optional) default: true
    //   title: 'eee', // (optional)
    //   // subText: 'แจ้งเตือน', // (optional) default: none
    //   message: 'eee', // (required)
    //   bigText: 'eee', // (optional) default: "message" prop
    //   vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    //   // data: {url: response.data[i].noti_url},
    // });

    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'notificationNotdisplay',
        user: loginUser,
      }),
    };

    fetch(url + 'notification.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        // console.log(response);
        if (response.status == true) {
          for (let i = 0; i < response.data.length; i++) {
            PushNotification.localNotification({
              channelId: 'NOTI-ALL', // (required) channelId, if the channel doesn't exist, notification will not trigger.
              color: '#FF8C00', // (optional) default: system default
              // ticker: 'My Notification Ticker', // (optional)
              // showWhen: false, // (optional) default: true
              autoCancel: true, // (optional) default: true
              title: response.data[i].noti_title, // (optional)
              // subText: 'แจ้งเตือน', // (optional) default: none
              message: response.data[i].noti_body, // (required)
              bigText: response.data[i].noti_body, // (optional) default: "message" prop
              vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
              data: {url: response.data[i].noti_url},
            });
          }
        }
        // console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };
  React.useEffect(() => {
    getNoti();

    // BackgroundTimer.runBackgroundTimer(() => {
    //   getNoti();
    // }, 20000);
  }, [navigation]);
  return (
    <View style={{height: '100%'}}>
      <Headdetail navigation={navigation} />
      <MyTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
});

const styleDetail1 = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#FFC40C',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    // paddingBottom: ,
  },

  text_header: {
    color: '#fff',
    // fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
    fontFamily: 'Prompt',
  },
});

export default MenutabsScreen;
