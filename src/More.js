import React, {useState, useEffect} from 'react';

import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
  Image,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Card,
  IconButton,
  Button,
  Dialog,
  Portal,
  Paragraph,
  List,
  Colors,
  useTheme,
  Divider,
  Switch,
  Title,
  Text,
} from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';

import {unsubscribelogin} from './center/subscribelogin';

import codePush from 'react-native-code-push';
import BackgroundGeolocation from '@hariks789/react-native-background-geolocation';
// import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

var appVersion = DeviceInfo.getVersion();
console.log(appVersion);

const MoreScreen = ({navigation}) => {
  const {colors} = useTheme();

  const [userData, setUserdata] = React.useState({});

  const [pathVersion, setPathversion] = React.useState('');

  const [notificationChanel, setNotificationChanel] = React.useState([]);

  const [isReady, setIsReady] = React.useState(false);

  const STORAGE_KEY = '@login';
  const TRIP_KEY = '@trip';

  const menu = [
    {
      id: 1,
      name: 'บัญชีและการรักษาความปลอดภัย',
      submenu: [{name: 'ข้อมูลบัญชี', route: 'Profile', disabled: false}],
    },
    {
      id: 2,
      name: 'ตั้งค่าภูมิภาคและภาษา',
      submenu: [
        {name: 'ประเทศ', route: '', disabled: true, subndesc: 'ไทย'},
        {name: 'ภาษา', route: '', disabled: true, subndesc: 'ไทย'},
        {name: 'การแจ้งเตือน', route: 'SettingNoti', disabled: false},
        {
          key: 'version',
          name: 'เวอร์ชัน',
          route: '',
          disabled: true,
          subndesc:  appVersion,
        },
        {name: 'ข้อกำหนดและเงื่อนไข', route: 'Term', disabled: false},
        {
          name: 'นโยบายคุ้มครองข้อมูลส่วนบุคคล',
          route: 'Policy',
          disabled: false,
        },
        {name: 'เกี่ยวกับเรา', route: 'About', disabled: false},
        {name: 'ติดต่อเรา', route: 'Contact', disabled: false},
      ],
    },
  ];

  const clearStorage = async () => {
    Alert.alert(
      'แจ้งเตือน',
      'ต้องการออกจากระบบใช่หรือไม่',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await AsyncStorage.clear();

            BackgroundGeolocation.checkStatus(status => {
              console.log(
                '[INFO] BackgroundGeolocation service is running',
                status.isRunning,
              );
              console.log(
                '[INFO] BackgroundGeolocation services enabled',
                status.locationServicesEnabled,
              );
              console.log(
                '[INFO] BackgroundGeolocation auth status: ' +
                  status.authorization,
              );

              // you don't need to check status before start (this is just the example)
              if (status.isRunning) {
                BackgroundGeolocation.stop(); //triggers start on start event
              }
            });
            messaging()
              .getToken()
              .then(fcmToken => {
                console.log(fcmToken);

                let token =
                  'AAAANA0I7uw:APA91bFeCIm6XkjCoAhUxrBOyebRHxbuWoUyg-D-xhjNGKQNn77oo3upgSrIRB3MjX3JZvg-ZmZqE89J7DGZvGu1C00oNMAmJ-cuaVU2niz19oZRLcytufcWjZHTqLxSea6e1ojCAzUn';
                const requestOptions = {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                  },
                };

                fetch(
                  'https://iid.googleapis.com/iid/info/' +
                    fcmToken +
                    '?details=true',
                  requestOptions,
                )
                  .then(response => response.json())
                  .then(response => {
                    console.log(response);

                    if (response.rel) {
                      for (const [key, value] of Object.entries(
                        response.rel.topics,
                      )) {
                        console.log(key);
                        messaging()
                          .unsubscribeFromTopic(key)
                          .then(() =>
                            console.log('UnSubscribed to topic! ' + key),
                          );
                      }
                    }

                    navigation.reset({
                      index: 0,
                      routes: [{name: 'Login'}],
                    });
                  })

                  .catch(error => {
                    console.log(error);
                  });
              })
              .catch(error => {
                // console.log("[FCMService] getToken rejected ", error)
              });
          },
        },
      ],
      {cancelable: false},
    );
  };

  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  React.useEffect(() => {
    const willFocusSubscription = navigation.addListener('focus', () => {
      codePush.getCurrentPackage().then(update => {
        console.log(update);
        setPathversion(' / '+update.label);

        // this update has run, and it had a description provided
        // with it upon release, let's show it to the end user
        if (update.isFirstRun && update.description) {
          // Display a "what's new?" modal
        }
      });
    });

    return willFocusSubscription;
  }, []);

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        if (Platform.OS !== 'web') {
          const login = await AsyncStorage.getItem(STORAGE_KEY);

          const loginUser = login ? JSON.parse(login) : undefined;
          console.log(loginUser);
          if (loginUser !== undefined) {
            setUserdata(loginUser);
          }

          const notichanel = await AsyncStorage.getItem('@NOTICHANEL');

          const notichanels = login ? JSON.parse(notichanel) : undefined;
          console.log(notichanels);
          if (notichanels !== undefined) {
            setNotificationChanel(notichanels);
          }

          const cartdata = await AsyncStorage.getItem(TRIP_KEY);
          const cartitem = cartdata ? JSON.parse(cartdata) : undefined;
          console.log(cartitem);
          if (cartitem !== undefined) {
            console.log(cartitem);
            setTripcount(cartitem.length);
          }
        }
      } finally {
        console.log(userData);

        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
      // return unsubscribe;
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaView style={styleDetail1.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        animated={false}
        barStyle="dark-content"
        showHideTransition
      />
      <View style={{paddingHorizontal: 10, width: '100%'}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
          }}>
          <View style={{flex: 2, justifyContent: 'flex-end'}}>
            {/* <Image
                style={{width: 50, height: 50}}
                source={require('./img/bookmenu/2.png')}
              /> */}
          </View>
          <View style={{flex: 4, justifyContent: 'flex-end'}}>
            <Text
              style={{fontSize: 24, color: 'black', alignSelf: 'center'}}
              numberOfLines={1}>
              ตั้งค่าการใช้งาน
            </Text>
          </View>

          <View
            style={{
              flex: 2,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}></View>
        </View>
      </View>

      <View style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{backgroundColor: '#FFFF'}}>
          <View style={{paddingVertical: 10}}>
            {menu.map((items, key) => (
              <View key={key} style={{paddingHorizontal: 20}}>
                <Title style={{fontFamily: 'Prompt-Bold'}}>{items.name}</Title>
                {items.submenu.map((item, keys) => (
                  <View key={keys}>
                    <List.Item
                      disabled={item.disabled}
                      onPress={() => {
                        if (item.route == 'Term') {
                          Linking.openURL(
                            'https://go-mamma.com/public/list/data/index/menu/1636',
                          );
                        } else if (item.route == 'Policy') {
                          Linking.openURL(
                            'https://go-mamma.com/public/list/data/index/menu/1634',
                          );
                        } else {
                          navigation.navigate(item.route);
                        }
                      }}
                      title={item.name}
                      right={props => (
                        <View>
                          {!item.disabled ? (
                            <List.Icon {...props} icon="chevron-right" />
                          ) : (
                            <Text
                              style={{
                                alignItems: 'center',
                                marginTop: 10,
                                color: 'gray',
                              }}>
                              {item.subndesc}{' '}
                              {item.key == 'version' ?  pathVersion : ''}
                            </Text>
                          )}
                        </View>
                      )}
                    />
                    <Divider />
                  </View>
                ))}
              </View>
            ))}

            <View style={{paddingHorizontal: 20, marginTop: 10}}>
              <Button
                mode="contained"
                contentStyle={{height: 50}}
                style={{
                  borderRadius: 10,
                  marginBottom: 10,
                  justifyContent: 'center',
                }}
                onPress={clearStorage}>
                ลงชื่อออกจากระบบ
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styleDetail1 = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#FFC40C',
  },
  header: {
    flex: 0.6,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  footer: {
    flex: 3,
    backgroundColor: '#ffff',
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    position: 'relative',
    // paddingHorizontal: 20,
    // paddingVertical: 30,
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
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logo: {
    width: '80%',
    resizeMode: 'contain',
  },
});

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#ffff',
  },
  cardRad: {
    borderRadius: 10,
    height: '50%',
  },

  cardcontent: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffff',
  },

  textcontent: {
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'Prompt',
  },
  viewlist: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 5,
  },
  signIn: {
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default MoreScreen;
