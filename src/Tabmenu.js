import React, {useState, useEffect} from 'react';

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Feather from 'react-native-vector-icons/Feather';

import MenutabsScreen from './Menu';
import NotificationScreen from './Notification';
import HelpScreen from './Help';
import ProfileScreen from './Profile';

import MoreScreen from './More';
import {useRoute} from '@react-navigation/native';

import {url as urls} from './center/url';
const url = urls.url;

const Tab = createMaterialBottomTabNavigator();

function MenuTab({route, navigation}) {
  const STORAGE_KEY = '@login';

  const routes = useRoute();

  const [notiCount, setNoticount] = React.useState();

  const checkAndroidPermision = async () => {
    const reqgranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );


    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );


    if (Platform.OS == 'android') {
      if (granted ) {
      } else {
        Alert.alert(
          'แจ้งเตือน',
          'โปรดให้ให้สิทธิ์การเข้าถึงตำแหน่งพื้นหลังเพื่อใช้งาน',
        );
      }
    } else {
    }

    console.log(granted);
    console.log(grantedBg);
  };

  const fetchData = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'notificationList',
        user: loginUser,
      }),
    };

    fetch(url + 'notification.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        if (response.status == true) {
          if (response.count > 0) {
            console.log(response.count);
            setNoticount(response.count);
          }
        }
      })
      .catch(error => {});
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (Platform.OS == 'android') {
      checkAndroidPermision();
    }
  }, []);
  return (
    <Tab.Navigator
      mode="modal"
      initialRouteName="Menu"
      // activeColor="#4F8EF7"
      // tabBarStyle={{backgroundColor:'red'}}

      activeColor="#FFC40C"
      inactiveColor="gray"
      barStyle={{
        // borderRadius:,
        // display:'none',
        // paddingBottom: 10,
        backgroundColor: 'white',
      }}
      // shifting={true}
      // sceneAnimationEnabled={false}
    >
      <Tab.Screen
        name="Menutabs"
        component={MenutabsScreen}
        options={{
          tabBarLabelPosition: 'beside-icon',
          tabBarShowLabel: true,
          tabBarLabel: 'หน้าแรก',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={26}
            />
            // <Feather name="home" color={color} size={26}/>
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarBadge: notiCount,
          tabBarLabel: 'แจ้งเตือน',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="bell-ring-outline"
              color={color}
              size={26}
            />
          ),
          // tabBarBadge: '?',
        }}
      />


      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarLabel: 'อื่นๆ',
          tabBarIcon: ({color}) => (
            <Feather name="settings" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MenuTab;
