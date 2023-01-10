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
} from 'react-native';
import {
  Card,
  Button,
  Avatar,
  Title,
  Paragraph,
  useTheme,
} from 'react-native-paper';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MonitorScreen from './Monitor';
import MonitorDetailScreen from './MonitorDetail';
import MonitorStatusScreen from './MonitorStatus';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Tab = createMaterialTopTabNavigator();

function MyTabs(props) {
  const [swipeEnabled, setSwipeEnabled] = useState(false);
  console.log(props);

  return (
    <Tab.Navigator
      swipeEnabled={swipeEnabled}
      initialRouteName="Monitor"
      screenOptions={{
        tabBarLabelStyle: {fontFamily: 'Prompt-Regular'},
        tabBarIndicatorStyle: {backgroundColor: '#FFC40C'},
      }}>
      <Tab.Screen
        name="Monitor"
        component={MonitorScreen}
        options={{tabBarLabel: 'แผนที่'}}
        initialParams={{bookingnbr: props.bookingnbr}}
      />
      <Tab.Screen
        name="MonitorStatus"
        component={MonitorStatusScreen}
        options={{tabBarLabel: 'สถานะ'}}
        initialParams={{bookingnbr: props.bookingnbr}}
      />
      <Tab.Screen
        name="MonitorDetail"
        component={MonitorDetailScreen}
        options={{tabBarLabel: 'รายละอียด'}}
        initialParams={{bookingnbr: props.bookingnbr}}
      />
    </Tab.Navigator>
  );
}

function tabMonitorScreen({navigation, route}) {
  const [bookingnbr, setBookingng] = useState(route.params.bookingnbr);

  return (
    <View style={{height: '100%'}}>
      <MyTabs bookingnbr={bookingnbr} setBookingng={setBookingng} />
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
    height: '12%',
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
    fontWeight: 'bold',
    fontSize: 30,
    fontFamily: 'Prompt',
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
    fontFamily: 'Prompt',
  },
});

export default tabMonitorScreen;
