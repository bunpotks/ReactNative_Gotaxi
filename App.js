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
} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import SplashScreen from 'react-native-splash-screen';



import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {LocaleConfig} from 'react-native-calendars';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {ToastProvider} from 'react-native-toast-notifications';
import codePush from 'react-native-code-push';

import {NativeBaseProvider, extendTheme} from 'native-base';
import LoginScreen from './src/Login';
import MenuTabScrenn from './src/Tabmenu';

import ForgotScreen from './src/register/Forgot';
import RepasswordScreen from './src/register/Repassword';

import ConfirmotpScreen from './src/register/Confirmotp';

import AgendaScreen from './src/calendar/agendar';

import TakePhotoScreen from './src/camera/camera';

import TabMonitorScreen from './src/monitor/Tabmonitor';
import TabMonitorScreenCg from './src/monitorCg/Tabmonitor';

import HistoryListScreen from './src/history/historylist';
import Historydetail from './src/history/historydetail';

import BookinglistScreen from './src/monitor/bookinglist';
import BookingdetailScreen from './src/monitor/bookingdetail';

import BookingdetailCg from './src/monitorCg/bookingdetail';

import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import ProfileScreen from './src/Profile';

import SettingNotificationScreen from './src/setting/settingNotification';

import linking from './linking';

import MytestScreen from './src/test';

import LeavelistScreen from './src/leaveform/leavelist';
import LeaveAddScreen from './src/leaveform/leaveadd';
import LeaveEditScreen from './src/leaveform/leaveEdit';

import QuestionScreen from './src/question/question';

import PermisionScreen from './src/permisionScreen/permistionScreen';

import BookingdetailByitem from './src/monitor/bookingdetailByitem';
import AboutmeScreen from './src/about/Aboutme';
import PolicyScreen from './src/about/Policy';
import TermScreen from './src/about/Term';
import ContactScreen from './src/about/Contactme';

import {url as urls} from './src/center/url';

const url = urls.url;

const Stack = createStackNavigator();

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.IMMEDIATE,
};

LocaleConfig.locales['th'] = {
  monthNames: [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน ',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ],
  monthNamesShort: [
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ษ.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.',
  ],
  dayNames: [
    'อาทิตย์',
    'จันทร์',
    'อังคาร',
    'พุธ',
    'พฤหัสบดี',
    'ศุกร์',
    'เสาร์',
  ],
  dayNamesShort: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],

  today: 'วันนี้',
};
LocaleConfig.defaultLocale = 'th';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // primary: '#FFC40C',
    // background: '#FFC40C',
    // card: '#FFC40C',
    // text: '#000000',
    // border: '#FFC40C',
    // notification: '#FFC40C',
  },
};

function MyStack() {
  const [rootState, setRootState] = React.useState('');
  const [userLogin, setUserLogin] = React.useState();

  const STORAGE_KEY = '@login';

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  async function registerAppWithFCM() {
    await messaging().registerDeviceForRemoteMessages();
  }

  const [initialState, setInitialState] = React.useState();
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // PushNotification.cancelAllLocalNotifications();

    registerAppWithFCM();
    requestUserPermission();

    const restoreState = async () => {
      try {
        // const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== 'web') {
          const login = await AsyncStorage.getItem(STORAGE_KEY);

          const loginUser = login ? JSON.parse(login) : undefined;
          // console.log(loginUser);
          if (loginUser !== undefined) {
            setRootState('Menu');
            setUserLogin(loginUser);
          }
        }
      } finally {
        // console.log(rootState);

        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }

    // return unsubscribe;
  }, [isReady]);

  if (!isReady) {
    SplashScreen.hide();
    return null;
  }
  const TransitionScreenOptions = {
    ...TransitionPresets.SlideFromRightIOS, // This is where the transition happens
    headerBackImage: () => (
      <MaterialCommunityIcons name="arrow-left" color="black" size={24} />
    ),
    headerBackTitleVisible: false,
  };
  return (
    <Stack.Navigator
      mode="modal"
      initialRouteName={rootState}
      screenOptions={TransitionScreenOptions}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Forgot"
        component={ForgotScreen}
        options={{
          title: 'ลืมรหัสผ่าน',

          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="Repassword"
        component={RepasswordScreen}
        options={{
          title: 'ยืนยันรหัสผ่านใหม่',

          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFC40C',
          },
          title: 'ข้อมูลผู้ใช้งาน',
          gestureEnabled: false,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Mytest"
        component={MytestScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFC40C',
          },
          title: 'MytestScreen',
          gestureEnabled: false,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="SettingNoti"
        component={SettingNotificationScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFC40C',
          },
          title: 'ตั้งค่าการแจ้งเตือน',
          gestureEnabled: false,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Confirmotp"
        component={ConfirmotpScreen}
        options={{title: 'ยืนยัน OTP', gestureEnabled: false}}
      />

      <Stack.Screen
        name="Menu"
        component={MenuTabScrenn}
        options={{
          headerShown: false,
          // headerStyle: {height: 500},
          title: 'Gomamma',
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="Takephoto"
        component={TakePhotoScreen}
        options={{
          headerShown: false,
          title: 'Gomamma',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="HistoryList"
        component={HistoryListScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFC40C',
          },
          title: 'ประวัติ',
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="HistoryDetail"
        component={Historydetail}
        options={{
          headerStyle: {
            backgroundColor: '#FFC40C',
          },
          title: 'ประวัติ',
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="QuestionScreen"
        component={QuestionScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFC40C',
          },
          title: 'ให้คะแนนการเดินทางครั้งนี้',
          gestureEnabled: false,
          // headerShown: false,
        }}
      />

      <Stack.Screen
        name="Bookinglist"
        component={BookinglistScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFC40C',
          },
          title: 'งานของฉัน',
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="Bookingdetail"
        component={BookingdetailScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFC40C',
          },
          title: 'รายละเอียดงาน',
          gestureEnabled: false,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="BookingdetailByitem"
        component={BookingdetailByitem}
        options={{
          headerStyle: {
            backgroundColor: '#FFC40C',
          },
          title: 'รายละเอียดงาน',
          gestureEnabled: false,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="BookingdetailCg"
        component={BookingdetailCg}
        options={{
          headerStyle: {
            backgroundColor: '#FFC40C',
          },
          title: 'รายละเอียดงาน',
          gestureEnabled: false,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Tabmonitor"
        component={TabMonitorScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFC40C',
          },
          title: 'ติดตามการเดินทาง',
          gestureEnabled: false,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="TabmonitorCg"
        component={TabMonitorScreenCg}
        options={{
          headerStyle: {
            backgroundColor: '#FFC40C',
          },
          title: 'ติดตามการเดินทาง',
          gestureEnabled: false,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="PermisionScreen"
        component={PermisionScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFC40C',
          },
          title: 'อนุญาติเข้าถึงการใช้งาน',
          gestureEnabled: false,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Leavelist"
        component={LeavelistScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFC40C',
          },
          title: 'ลางาน',
          gestureEnabled: false,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="LeaveAddScreen"
        component={LeaveAddScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFC40C',
          },
          title: 'เพิ่มการลา',
          gestureEnabled: false,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="LeaveEditScreen"
        component={LeaveEditScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFC40C',
          },
          title: 'รายละเอียดการลา',
          gestureEnabled: false,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="AgendaScreen"
        component={AgendaScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFC40C',
          },
          title: 'ตารางงาน',
          gestureEnabled: false,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="About"
        component={AboutmeScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFC40C',
          },
          title: 'รายละเอียด',
          gestureEnabled: false,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Term"
        component={TermScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFC40C',
          },
          title: 'รายละเอียด',
          gestureEnabled: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Policy"
        component={PolicyScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFC40C',
          },
          title: 'รายละเอียด',
          gestureEnabled: false,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          headerStyle: {
            backgroundColor: '#FFC40C',
          },
          title: 'รายละเอียด',
          gestureEnabled: false,
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function App(props) {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  const theme = extendTheme({
    fontConfig: {
      Roboto: {
        100: {
          normal: 'Prompt-Regular',
        },
        200: {
          normal: 'Prompt-Regular',
        },
        300: {
          normal: 'Prompt-Regular',
        },
        400: {
          normal: 'Prompt-Regular',
        },
        500: {
          normal: 'Prompt-Regular',
        },
        600: {
          normal: 'Prompt-Regular',
        },
      },
    },

    // Make sure values below matches any of the keys in `fontConfig`
    fonts: {
      heading: 'Prompt-Regular',
      body: 'Prompt-Regular',
      mono: 'Prompt-Regular',
    },
  });

  const updatePosition = async (lat, lng) => {
    let a = await AsyncStorage.getItem('@onTravel');
    const login = await AsyncStorage.getItem('@login');
    const loginUser = login ? JSON.parse(login) : undefined;

    if (loginUser['gmm_emp_type'] == 'Taxi') {
      $mode = 'updatePosition';
    } else {
      $mode = 'updatePositionCg';
    }

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: $mode,
        position: {latitude: lat, longitude: lng},
        booking: {gmm_booking_nbr: a},
      }),
    };

    fetch(url + 'monitor.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log('updateposition', response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
      let notichanel;
      let color = null;
      if (Platform.OS == 'android') {
        notichanel = remoteMessage.notification.android.channelId;
        color = remoteMessage.notification.android.color;
        PushNotification.localNotification({
          channelId: notichanel, // (required) channelId, if the channel doesn't exist, notification will not trigger.
          // ticker: 'My Notification Ticker', // (optional)
          // showWhen: false, // (optional) default: true
          autoCancel: true, // (optional) default: true
          title: remoteMessage.notification.title, // (optional)
          color: color, // (optional) default: system default
          // subText: 'แจ้งเตือน', // (optional) default: none
          message: remoteMessage.notification.body, // (required)
          // bigText: remoteMessage.notification.body, // (optional) default: "message" prop
          vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          data: {url: remoteMessage.data.url},
        });
      } else {
        console.log(remoteMessage.data.url);
        // alert(JSON.stringify(remoteMessage));
        notichanel = 'NOTI-BOOKING';
        PushNotification.localNotification({
          channelId: notichanel, // (required) channelId, if the channel doesn't exist, notification will not trigger.
          // ticker: 'My Notification Ticker', // (optional)
          // showWhen: false, // (optional) default: true
          autoCancel: true, // (optional) default: true
          title: remoteMessage.notification.title, // (optional)
          color: color, // (optional) default: system default
          // subText: 'แจ้งเตือน', // (optional) default: none
          message: remoteMessage.notification.body, // (required)
          // bigText: remoteMessage.notification.body, // (optional) default: "message" prop
          vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          data: {url: remoteMessage.data.url},
          userInfo: {url: remoteMessage.data.url},
        });
      }
    });

    return unsubscribe;
  }, []);

  return (
    <ToastProvider
      placement="bottom"
      dangerIcon={<MaterialCommunityIcons name="close" color="#fff" />}
      successIcon={
        <MaterialCommunityIcons name="check" color="#fff" size={18} />
      }
      offset={10}
      // Custom type example
      renderType={{
        custom_toast: toast => (
          <View
            style={{
              maxWidth: '85%',
              paddingHorizontal: 15,
              paddingVertical: 10,
              backgroundColor: '#fff',
              marginVertical: 4,
              borderRadius: 8,
              borderLeftColor: '#00C851',
              borderLeftWidth: 6,
              justifyContent: 'center',
              paddingLeft: 16,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}>
            <Text
              style={{
                fontSize: 14,
                color: '#333',
                fontWeight: 'bold',
              }}>
              {toast.data.title}
            </Text>
            <Text style={{color: '#a3a3a3', marginTop: 2}}>
              {toast.message}
            </Text>
          </View>
        ),
      }}>
      <NativeBaseProvider theme={theme}>
        <NavigationContainer linking={linking}>
          <MyStack />
        </NavigationContainer>
      </NativeBaseProvider>
    </ToastProvider>
  );
}

// export default codePush(codePushOptions)(App);
export default App;

