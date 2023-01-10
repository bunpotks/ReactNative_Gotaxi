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
  Text,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {ListItem, Avatar} from 'react-native-elements';
import messaging from '@react-native-firebase/messaging';

import {unsubscribelogin} from './center/subscribelogin';

import PushNotification, {Importance} from 'react-native-push-notification';

const SettingNotificationScreen = ({navigation}) => {
  const {colors} = useTheme();

  const [userData, setUserdata] = React.useState({});
  const [notificationChanel, setNotificationChanel] = React.useState([]);

  const [isReady, setIsReady] = React.useState(false);

  const STORAGE_KEY = '@login';

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
            // setLoader(true);
            console.log('OK Pressed');
            try {
              messaging()
                .unsubscribeFromTopic('login')
                .then(() => console.log('unsubscribeFromTopic to login'));

              messaging()
                .unsubscribeFromTopic(userData.gmm_user_id)
                .then(() =>
                  console.log(
                    'unsubscribeFromTopic to ' + userData.gmm_user_id,
                  ),
                );

              await AsyncStorage.clear();

              // messaging()
              //   .unsubscribeFromTopic('USERLOGIN')
              //   .then(() => console.log('UnSubscribed to topic!'));

              navigation.reset({
                index: 0,
                routes: [{name: 'Login'}],
              });
            } catch (e) {
              // alert('Failed to clear the async storage.');
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const list = [
    // {
    //   name: 'ข้อมูลผู้ใช้',
    //   avatar_url:
    //     'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    //   subtitle: 'รายละเอียดผู้ใช้งาน',
    //   icon: 'user',
    // },
    {
      name: 'ลงชื่อออก',
      avatar_url:
        'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
      subtitle: 'ลงชื่อออกจากระบบ',
      icon: 'sign-out-alt',
    },
  ];

  // React.useEffect(() => {
  //   // if(!notificationChanel){
  //   //   return;
  //   // }

  //   // AsyncStorage.setItem('@NOTICHANEL', JSON.stringify(notificationChanel));
  // }, [notificationChanel]);

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        // const initialUrl = await Linking.getInitialURL();

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
        }
      } finally {
        console.log(userData);

        setIsReady(true);
      }
    };

    // PushNotification.abandonPermissions();
    // PushNotification.getChannels(function (channel_ids) {
    //   console.log(channel_ids); // ['channel_id_1']

    //   channel_ids.forEach(element => {
    //     console.log(element);
    //     PushNotification.channelBlocked(element, function (blocked) {
    //       console.log(element + ' block : ' + blocked); // true/false
    //     });

    //     PushNotification.channelExists(element, function (exists) {
    //       console.log(element + ' NOTI : ' + exists); // true/false
    //     });
    //   });
    // });

    if (!isReady) {
      restoreState();
      // return unsubscribe;
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <View>
      {/* <SafeAreaView style={styleDetail1.container}>
        <StatusBar
          animated={true}
          backgroundColor="#FFC40C"
          barStyle="dark-content"
          showHideTransition="fade"
        />
        <View style={{padding: 20}}>
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 30, color: 'white'}}>
                ตั้งค่าการใช้งาน
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView> */}

      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{backgroundColor: '#FFFF'}}>
          {notificationChanel.map((item, key) => (
            <View key={key}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 20,
                  justifyContent: 'space-between',
                }}>
                <Text>{item.desc}</Text>
                <Switch
                  // theme={useTheme}
                  color={colors.primary}
                  value={item.status}
                  onValueChange={() => {
                    let newnotificationChanel = [...notificationChanel];

                    newnotificationChanel[key].status =
                      !newnotificationChanel[key].status;
                    setNotificationChanel(newnotificationChanel);

                    if (newnotificationChanel[key].status) {
                      PushNotification.createChannel(
                        newnotificationChanel[key].data,
                        created =>
                          console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
                      );
                      // สร้าง
                    } else {
                      PushNotification.deleteChannel(
                        newnotificationChanel[key].data.channelId,
                      );
                      //delete
                    }

                    AsyncStorage.setItem(
                      '@NOTICHANEL',
                      JSON.stringify(newnotificationChanel),
                    );
                  }}
                />
              </View>
              <Divider />
            </View>
          ))}

          {/* <Button
            onPress={() => {
              clearStorage();
            }}>
            ลงชื่อออกจะระบบ
          </Button>
          <Divider /> */}

          {/* <View style={{padding:20}}>
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
  </View> */}

          <View></View>
        </ScrollView>
      </View>
    </View>
  );
};

const styleDetail1 = StyleSheet.create({
  container: {
    height: (Dimensions.get('window').height * 12) / 100,
    backgroundColor: '#FFC40C',
  },
  header: {
    flex: 0.6,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 10,

    // paddingBottom: 20,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
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

export default SettingNotificationScreen;
