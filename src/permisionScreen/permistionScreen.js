import React, {useState, useEffect, useCallback, useRef} from 'react';

import {
  View,
  SafeAreaView,
  Animated,
  Image,
  ScrollView as ScrollViewNative,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  Platform,
  AppState,
} from 'react-native';

import {Text, Title, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

import {
  check,
  PERMISSIONS,
  RESULTS,
  requestMultiple,
  checkLocationAccuracy,
  requestLocationAccuracy,
  request,
  openSettings,
} from 'react-native-permissions';

var interval;

const PermisionScreen = ({navigation}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const fadeAnim2 = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const fadeAnim3 = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const fadeAnim4 = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  const [timerCount, setTimer] = useState(5);
  const [loginUser, setLoginUser] = useState(null);

  const getUser = async () => {
    const login = await AsyncStorage.getItem('@login');
    const loginUsers = login ? JSON.parse(login) : undefined;
    setLoginUser(loginUsers);
  };

  const checkAndroidPermision = async () => {
    if (Platform.OS == 'android') {
      requestMultiple([
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]).then(statuses => {
        const camera = statuses[PERMISSIONS.ANDROID.CAMERA];
        const location = statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
        console.log(camera);
        console.log(location);

        if (camera && location) {
          navigation.reset({
            index: 0,
            routes: [{name: 'Menu'}],
          });
        }
      });
    } else {
      requestMultiple([
        PERMISSIONS.IOS.CAMERA,
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      ]).then(statuses => {
        const camera = statuses[PERMISSIONS.IOS.CAMERA];
        const location = statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE];
        console.log(camera);
        console.log(location);

        if (camera && location) {
          navigation.reset({
            index: 0,
            routes: [{name: 'Menu'}],
          });
        }
      });
    }

    // request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
    //   .then(result => {
    //     console.log(result);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
    // const reqgranted = await PermissionsAndroid.request(
    //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    // );
    // const reqgranedBG = await PermissionsAndroid.request(
    //   PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    // );

    // const granted = await PermissionsAndroid.check(
    //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    // );
    // const grantedBg = await PermissionsAndroid.check(
    //   PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    // );

    // if(Platform.OS == 'android'){
    //   if (granted && grantedBg) {
    //     navigation.reset({
    //       index: 0,
    //       routes: [{name: 'Menu'}],
    //     });
    //   } else {
    //     Alert.alert(
    //       'แจ้งเตือน',
    //       'โปรดให้ให้สิทธิ์การเข้าถึงตำแหน่งพื้นหลังเพื่อใช้งาน',
    //     );
    //   }
    // }else{

    //   // navigation.reset({
    //   //   index: 0,
    //   //   routes: [{name: 'Menu'}],
    //   // });
    // }

    // console.log(granted);
    // console.log(grantedBg);
  };

  useEffect(() => {
    const listener = AppState.addEventListener('change', status => {
      console.log(status);
      if (Platform.OS === 'ios' && status === 'active') {
        request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
          .then(result => console.log(result))
          .catch(error => console.log(error));
      }
    });

    return listener.remove;
  }, []);

  useEffect(() => {
    getUser();
    // interval = setInterval(() => {
    //   setTimer(lastTimerCount => {
    //     if (lastTimerCount <= 3) {
    //       Animated.timing(fadeAnim3, {
    //         toValue: 1,
    //         duration: 2000,
    //         useNativeDriver: true, // Add This line
    //       }).start();
    //       clearInterval(interval);
    //     }
    //     return lastTimerCount - 1;
    //   });
    // }, 1000);

    // Animated.timing(fadeAnim, {
    //   toValue: 1,
    //   duration: 3000,
    //   useNativeDriver: true, // Add This line
    // }).start();

    // setTimeout(() => {
    //   Animated.timing(fadeAnim2, {
    //     toValue: 1,
    //     duration: 3000,
    //     useNativeDriver: true, // Add This line
    //   }).start();
    // }, 1000);

    // setTimeout(() => {
    //   Animated.timing(fadeAnim4, {
    //     toValue: 1,
    //     duration: 3000,
    //     useNativeDriver: true, // Add This line
    //   }).start();
    // }, 1000);
  }, [fadeAnim]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor="white"
        barStyle="dark-content"
        showHideTransition="fade"
      />
      <View
        style={{flex: 1, backgroundColor: 'white', justifyContent: 'center'}}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <LottieView
            style={{width: '100%', height: 250}}
            source={require('../89437-location-loading')}
            autoPlay
            // loop
          />
          {/* <Image
            resizeMode="contain"
            source={require('./img/bookmenu/2.png')}
            style={{height: 205, width: '80%',alignSelf:'center'}}
          /> */}
        </View>

        <View
          style={{
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              padding: 20,
              color: 'gray',
            }}>
            แอปต้องการเข้าถึงตำแหน่ง
            คลิกเริ่มต้นใช้งานเพื่ออนุญาติเข้าถึงการใช้งาน
          </Text>
          {/* <Text style={{fontSize: 24, color: 'gray'}}>ยินดีต้อนรับคุณ. . .</Text> */}
        </View>
      </View>
      <View style={{}}>
        <TouchableOpacity
          mode="contained"
          style={{
            height: 60,
            marginTop: 20,
            justifyContent: 'center',
            backgroundColor: '#FFC40C',
            borderRadius: 10,
            alignItems: 'center',
          }}
          onPress={() => {
            checkAndroidPermision();
          }}>
          <Text>เริ่มต้นใช้งาน</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          disabled={timerCount > 0}
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{name: 'Menu'}],
            });
          }}>
          <Title style={{color: timerCount > 0 ? 'gray' : 'black'}}>
            {' '}
            เริ่มต้นใช้งาน
            {timerCount > 0 ? (
              <Text style={{color: 'gray'}}> ({timerCount})</Text>
            ) : null}
          </Title>
        </TouchableOpacity> */}
        {/* <Icon name="arrow-right" color="gray" size={24}/> */}
      </View>
    </SafeAreaView>
  );
};
export default PermisionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
});
