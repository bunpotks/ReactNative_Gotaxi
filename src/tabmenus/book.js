import React, {useState, useEffect, useCallback} from 'react';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView as ScrollViewNative,
  FlatList,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import {
  Text,
  Card,
  Title,
  TouchableRipple,
  Avatar,
  Divider,
  ActivityIndicator,
  List,
  Chip,
  Button,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScrollView} from 'native-base';
import {url as urls} from '../center/url';
import PushNotification, {Importance} from 'react-native-push-notification';
import TextTicker from 'react-native-text-ticker';
// import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import BackgroundGeolocation from '@hariks789/react-native-background-geolocation';
import messaging from '@react-native-firebase/messaging';

import BackgroundTimer from 'react-native-background-timer';

const url = urls.url;
const STORAGE_KEY = '@login';

function Menu({route, navigation}) {
  return (
    <View style={styles.container}>
      <Card style={{padding: 20}}>
        <View style={styles.screen}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <TouchableRipple
              style={styles.roundButton1}
              onPress={() => {
                // navigation.navigate('Tabmonitor');
                navigation.navigate('Bookinglist');
              }}
              rippleColor="rgba(0, 0, 0, 0.1)">
              <Image
                style={styles.roundButton1}
                source={require('../img/bookmenu/4.png')}
              />
            </TouchableRipple>
            <Text
              style={{
                textAlign: 'center',
                overflow: 'hidden',
                marginTop: 8,
                fontSize: 12,
              }}>
              งานของฉัน
            </Text>
          </View>

          <View style={{flex: 1, alignItems: 'center'}}>
            <TouchableRipple
              style={[styles.roundButton1, {backgroundColor: '#FFC40C'}]}
              onPress={() => {
                // navigation.navigate('Tabmonitor');
                navigation.navigate('Leavelist');
              }}
              rippleColor="rgba(0, 0, 0, 0.1)">
              <Icon name="calendar-edit" size={38} style={styles} />
            </TouchableRipple>
            <Text
              style={{
                textAlign: 'center',
                overflow: 'hidden',
                marginTop: 8,
                fontSize: 12,
              }}>
              ลางาน
            </Text>
          </View>

          <View style={{flex: 1, alignItems: 'center'}}>
            <TouchableOpacity
              style={styles.roundButton1}
              onPress={() => {
                navigation.navigate('HistoryList');
              }}>
              <Image
                style={styles.roundButton1}
                source={require('../img/bookmenu/6.png')}
              />
            </TouchableOpacity>
            <Text
              style={{
                textAlign: 'center',
                overflow: 'hidden',
                marginTop: 8,
                fontSize: 12,
              }}>
              ประวัติใช้งาน
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

function Profile({route, navigation}) {
  const [userData, setUserdata] = React.useState({});
  const [isReady, setIsReady] = React.useState(false);
  const [zone, setZone] = React.useState();
  const [empVal, setEmpVal] = React.useState();

  const restoreState = async () => {
    try {
      if (Platform.OS !== 'web') {
        const login = await AsyncStorage.getItem(STORAGE_KEY);

        const loginUser = login ? JSON.parse(login) : undefined;
        if (loginUser !== undefined) {
          setUserdata(loginUser);
        }
      }
    } finally {
      setIsReady(true);
    }
  };

  const getProfile = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'profile',
        user: loginUser,
      }),
    };

    fetch(url + 'profile.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        if (response.zoneStatus) {
          setZone(response.zoneData);
        }

        if (response.valStatus) {
          setEmpVal(response.empVal);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  React.useEffect(() => {
    if (!isReady) {
      restoreState();
    }
    const willFocusSubscription = navigation.addListener('focus', () => {
      getProfile();
    });

    return willFocusSubscription;
  }, []);

  return (
    <View style={{}}>
      <View>
        <Card
          elevation={10}
          style={{
            alignSelf: 'center',
            // alignItems:'center',
            // flexDirection: 'row',
            justifyContent: 'space-between',
            zIndex: 999,
            width: '90%',
            borderRadius: 10,
            shadowOffset: {
              width: 0,
              height: 8,
            },
            shadowOpacity: 0.44,
            shadowRadius: 10.32,
            elevation: 5,
            marginTop: 10,
            paddingVertical: 10,
          }}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
            <View>
              <Avatar.Image
                size={50}
                source={{
                  uri: 'https://backoffice.go-mamma.com/image/taxiicon.png',
                }}
              />
            </View>
            <View style={{flex: 4, marginLeft: 10}}>
              <Text
                style={{fontSize: 16}}
                onPress={() => {
                  // messaging
                  //   .getToken()
                  //   .then(token => {
                  //     console.log(token);
                  //   })
                  //   .catch(error => {
                  //     /* handle error */
                  //   });
                }}>
                {userData.gmm_emp_fname + ' ' + userData.gmm_emp_lname}
              </Text>
              <Text style={{color: 'gray'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: 'gray'}}>{userData.gmm_emp_type}</Text>
                </View>
              </Text>
            </View>
          </View>
          <Divider />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
              paddingHorizontal: 5,
            }}>
            <ScrollView
              horizontal={true}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              {zone
                ? zone.map((item, key) => (
                    <Chip
                      key={key}
                      mode="outlined "
                      // disabled={true}
                      color
                      icon="map-marker-circle"
                      onPress={() => console.log('Pressed')}
                      style={{marginHorizontal: 2}}>
                      {item.gmm_zone_name}
                    </Chip>
                  ))
                : null}
            </ScrollView>
          </View>
        </Card>

        <Menu route={route} navigation={navigation} />
      </View>
    </View>
  );
}

function Booking({route, navigation}) {
  const [booklist, setBooklist] = useState([]);
  const [isLoadBooking, setIsLoadBooking] = useState(true);
  const [loader, setLoader] = useState(false);
  const getbookingList = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'bookinglistActive',
        user: loginUser,
      }),
    };

    fetch(url + 'monitor.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        setBooklist(response.data);
        setIsLoadBooking(false);

        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        setIsLoadBooking(false);
        console.error(error);
      });
  };

  const monitor = async item => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    if (loginUser.gmm_emp_type == 'Taxi') {
      if (item.gmm_booking_travel_status == 'START') {
        navigation.navigate('Tabmonitor', {bookingnbr: item.gmm_booking_nbr});
      } else {
        navigation.navigate('Bookinglist');
      }
    } else {
      if (item.gmm_booking_travel_status_cg == 'START') {
        navigation.navigate('TabmonitorCg', {bookingnbr: item.gmm_booking_nbr});
      } else {
        navigation.navigate('Bookinglist');
      }
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <View key={index} style={{}}>
        <TouchableRipple onPress={() => monitor(item)}>
          <View style={{padding: 10}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    backgroundColor:
                      item.gmm_booking_status == 'SUCCESS'
                        ? 'green'
                        : item.gmm_booking_status == 'PENDING'
                        ? 'yellow'
                        : 'red',
                    width: 4,
                  }}></View>
                <Title
                  style={{
                    marginLeft: 5,
                    color:
                      item.gmm_booking_status == 'SUCCESS'
                        ? 'green'
                        : item.gmm_booking_status == 'PENDING'
                        ? 'yellow'
                        : 'red',
                  }}>
                  {item.gmm_booking_status_desc}
                </Title>
              </View>
              <View>
                <Title> {item.monthdesc.time} น.</Title>
              </View>
            </View>

            <Text style={{color: 'gray', fontSize: 12}}>
              เลขที่การเดินทาง : {item.gmm_booking_nbr}
            </Text>

            <View style={{marginTop: 10}}>
              <Text style={{marginTop: 5}}>
                <Text style={{color: 'gray'}}>ผู้จอง</Text> :{' '}
                {item.gmm_user_fname} {item.gmm_user_lname} |{' '}
                {item.gmm_booking_product_name}
              </Text>
              <Text style={{marginTop: 5}}>
                <Text style={{color: 'gray'}}>ผู้โดยสาร</Text> :{' '}
                {item.gmm_passenger_fname} {item.gmm_passenger_lname}
              </Text>
              <Text style={{marginTop: 5}}>
                <Text style={{color: 'gray'}}>การเดินทาง</Text> :{' '}
                {item.gmm_booking_product_name}
              </Text>

           
              <Text style={{marginTop: 5}}>
                <Text style={{color: 'gray'}}>วันที่เดินทาง</Text> :{' '}
                {item.monthdesc.monthdesc} {item.monthdesc.time}
              </Text>
            </View>
          </View>
        </TouchableRipple>

        <Divider />
      </View>
    );
  };

  React.useEffect(() => {
    const willFocusSubscription = navigation.addListener('focus', () => {
      getbookingList();
    });

    return willFocusSubscription;
  }, []);
  return (
    <View style={styles.container}>
      <View style={{padding: 20}}>
        <Title>งานที่ใกล้มาถึง</Title>
        {isLoadBooking ? (
          <ActivityIndicator size="small" color="#FFC40C" />
        ) : (
          <View>
            {booklist.length > 0 ? (
              <View>
                <ScrollView>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={booklist}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => {
                      return index.toString();
                    }}
                  />
                </ScrollView>
              </View>
            ) : (
              <View style={{padding: 20, alignItems: 'center'}}>
                <Title style={{color: 'gray'}}>- ไม่มีงานที่ใกล้มาถึง -</Title>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

function Activebook({navigation}) {
  const [visible, setVisible] = useState(false);
  const [bookingActicve, setBookingActicve] = useState();
  const [bookingActicveStatus, setBookingActicveStatus] = useState(false);

  const updatePosition = async (lat, lng, nbr) => {
    let a = await AsyncStorage.getItem('@onTravel');
    const login = await AsyncStorage.getItem('@login');
    const loginUser = login ? JSON.parse(login) : undefined;
    let mode;

    if (loginUser['gmm_emp_type'] == 'Taxi') {
      mode = 'updatePosition';
    } else {
      mode = 'updatePositionCg';
    }

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: mode,
        position: {latitude: lat, longitude: lng},
        booking: {gmm_booking_nbr: nbr},
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

  const startBackground = async booking => {
    BackgroundGeolocation.removeAllListeners();

    const login = await AsyncStorage.getItem('@login');
    const loginUser = login ? JSON.parse(login) : undefined;
    let mode;

    if (loginUser['gmm_emp_type'] == 'Taxi') {
      mode = 'updatePosition';
    } else {
      mode = 'updatePositionCg';
    }

    if (Platform.OS == 'android') {
      BackgroundGeolocation.configure({
        desiredAccuracy: BackgroundGeolocation.MEDIUM_ACCURACY, //MEDIUM_ACCURACY // HIGH_ACCURACY //
        stationaryRadius: 0,
        distanceFilter: 0,
        notificationsEnabled: true,
        notificationTitle: 'กำลังรับส่งผู้โดยสาร',
        notificationText: 'กำลังรับส่งผู้โดยสารโปรดอย่าปิดแอป',
        maxLocations: 10000,
        syncThreshold: 1000,
        debug: false,
        startOnBoot: true,
        startForeground: true,
        stopOnStillActivity: false,
        stopOnTerminate: false,
        locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER, //RAW_PROVIDER DISTANCE_FILTER_PROVIDER  ACTIVITY_PROVIDER
        interval: 10000,
        fastestInterval: 10000,
        activitiesInterval: 20000,
        url: '',
        syncUrl: '',
      });

      BackgroundGeolocation.headlessTask(async event => {
        if (event.name === 'location' || event.name === 'stationary') {
          // console.log(event);
          console.log('updateposition onBackground');
          let req = JSON.stringify({
            key: mode,
            position: {
              latitude: event.params.latitude,
              longitude: event.params.longitude,
            },
            booking: booking,
          });
          var xhr = new XMLHttpRequest();
          xhr.open('POST', url + 'monitor.php');
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(req);
        }
      });
    } else {
      BackgroundGeolocation.configure({
        desiredAccuracy: BackgroundGeolocation.MEDIUM_ACCURACY, //MEDIUM_ACCURACY // HIGH_ACCURACY //
        stationaryRadius: 100,
        distanceFilter: 100,
        notificationsEnabled: true,
        notificationTitle: 'กำลังรับส่งผู้โดยสาร',
        notificationText: 'กำลังรับส่งผู้โดยสารโปรดอย่าปิดแอป',
        maxLocations: 10000,
        syncThreshold: 1000,
        debug: false,
        startOnBoot: true,
        startForeground: true,
        stopOnStillActivity: false,
        stopOnTerminate: false,
        locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER, //RAW_PROVIDER DISTANCE_FILTER_PROVIDER  ACTIVITY_PROVIDER
        interval: 10000,
        fastestInterval: 10000,
        activitiesInterval: 20000,
        url: '',
        syncUrl: '',
      });
    }

    BackgroundGeolocation.on('location', location => {
      BackgroundGeolocation.startTask(taskKey => {
        const longitudeDelta = 0.01;
        const latitudeDelta = 0.01;
        const region = Object.assign({}, location, {
          latitudeDelta,
          longitudeDelta,
        });
        BackgroundGeolocation.endTask(taskKey);
        updatePosition(
          region.latitude,
          region.longitude,
          booking.gmm_booking_nbr,
        );
      });
    });

    BackgroundGeolocation.on('stationary', location => {
      BackgroundGeolocation.startTask(taskKey => {
        if (location.radius) {
          const longitudeDelta = 0.01;
          const latitudeDelta = 0.01;
          const region = Object.assign({}, location, {
            latitudeDelta,
            longitudeDelta,
          });
        }
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation service has been started');
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[INFO] BackgroundGeolocation service has been stopped');
    });

    BackgroundGeolocation.start();
  };

  const stopBackground = () => {
    BackgroundGeolocation.stop();
  };

  const getbookingList = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'bookinglistActive',
        user: loginUser,
      }),
    };

    return fetch(url + 'monitor.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        return response;
      });
  };

  React.useEffect(() => {
    const willFocusSubscription = navigation.addListener('focus', () => {
      getbookingList().then(e => {
        console.log('222');
        if (e.status == true) {
          setVisible(true);
          setBookingActicve(e.dataActive);
        } else {
          setVisible(false);
        }

        if (e.statusActive) {
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

            if (!status.isRunning) {
              PushNotification.localNotification({
                channelId: 'NOTI-ALL', // (required) channelId, if the channel doesn't exist, notification will not trigger.
                color: '#FF8C00', // (optional) default: system default
                autoCancel: true, // (optional) default: true
                title: 'เริ่มต้นการแชร์ตำแหน่ง', // (optional)
                // subText: 'แจ้งเตือน', // (optional) default: none
                group: 1,
                message: 'กำลังแชร์ตำแหน่งการเดินทาง โปรดอย่าปิดแอป', // (required)
                vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
                // data: {url: response.data[i].noti_url},
              });
            }

            stopBackground();
            BackgroundTimer.setTimeout(() => {
              startBackground(e.dataActive);
            }, 2000);
          });
        } else {
          stopBackground();
        }
      });
    });

    return willFocusSubscription;
  }, []);

  return (
    <>
     
      {visible && bookingActicve ? (
        <Card
          // mode="outlined"
          elevation={10}
          style={{
            position: 'absolute',
            alignSelf: 'center',
            justifyContent: 'center',
            zIndex: 999,
            width: '90%',
            maxWidth: 500,
            bottom: 10,
            height: 80,
            borderRadius: 10,

            shadowOffset: {
              width: 0,
              height: 8,
            },
            shadowOpacity: 0.44,
            shadowRadius: 10.32,
            elevation: 10,
          }}>
          <TouchableOpacity
            onPress={async () => {
              const login = await AsyncStorage.getItem(STORAGE_KEY);
              const loginUser = login ? JSON.parse(login) : undefined;
              if (loginUser.gmm_emp_type == 'Taxi') {
                navigation.navigate('Tabmonitor', {
                  bookingnbr: bookingActicve.gmm_booking_nbr,
                });
              } else {
                navigation.navigate('TabmonitorCg', {
                  bookingnbr: bookingActicve.gmm_booking_nbr,
                });
              }
            }}>
            <View
              style={{
                // padding: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 20,
                height: '100%',
              }}>
              <View
                style={{
                  flex: 2,
                  width: 200,
                  height: 200,
                }}>
                <LottieView
                  source={require('../60355-taxi-animation.json')}
                  autoPlay
                  loop
                />
              </View>
              <View style={{flex: 5}}>
                <TextTicker
                  style={{fontSize: 14, color: '#008000'}}
                  animationType="scroll"
                  duration={12000}
                  loop
                  scrollSpeed={1000}
                  useNativeDriver={true}
                  marqueeDelay={1000}
                  repeatSpacer={50}>
                  <Text
                    numberOfLines={1}
                    style={{fontSize: 14, color: '#008000'}}>
                    กำลังรับส่งผู้โดยสาร |
                    {' ' + bookingActicve.gmm_booking_status_desc}
                  </Text>
                </TextTicker>

                <Text numberOfLines={1} style={{fontSize: 12, color: 'gray'}}>
                  เลขที่การเดินทาง : #{bookingActicve.gmm_booking_nbr}
                </Text>
              </View>

              <View style={{flex: 1, alignItems: 'center'}}>
                <Icon
                  color="gray"
                  size={22}
                  name="close"
                  onPress={() => setVisible(false)}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Card>
      ) : null}
    </>
  );
}

const BookScreen = props => {
  const [bookvisible, setBookVisible] = React.useState(true);
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [detail, setDetail] = React.useState({});
  const [loadService, setLoadservice] = React.useState(true);

  // PushNotification.cancel  AllLocalNotifications()

  const puhsnoti = () => {
    // messaging()
    // .subscribeToTopic('login')
    // .then(() => console.log('Subscribed to topic!'));

    // setDialogVisible(true);

    // PushNotification.subscribeToTopic('login')
    PushNotification.localNotification({
      channelId: 'NOTI-ALL', // (required) channelId, if the channel doesn't exist, notification will not trigger.
      // ticker: 'My Notification Ticker', // (optional)
      // showWhen: false, // (optional) default: true
      autoCancel: true, // (optional) default: true
      title: 'คนขับกำลังขับรถไปหาคุณ', // (optional)
      // subText: 'แจ้งเตือน', // (optional) default: none
      message: 'คนขับรถกำลังไปหาคุณ บรรพต คล้ายศร', // (required)
      bigText: 'คนขับรถกำลังไปหาคุณ บรรพต คล้ายศร', // (optional) default: "message" prop
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    });
    // }, 5000);
  };

  const scedul = () => {
    // console.log(454);
    PushNotification.localNotificationSchedule({
      channelId: 'NOTI-ALL', // (required) channelId, if the channel doesn't exist, notification will not trigger.
      autoCancel: true, // (optional) default: true
      title: 'คุณมีรายการจองที่ยังไม่ได้ชำระ', // (optional)
      bigPictureUrl: 'https://www.example.tld/picture.jpg', // (optional) default: undefined
      bigLargeIcon: 'ic_launcher', // (optional) default: undefined
      bigLargeIconUrl: 'https://www.example.tld/bigicon.jpg', // (optional) default: undefined
      // color: 'red', // (optional) default: system default
      vibrate: false, // (optional) default: true
      vibration: false, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      onlyAlertOnce: true,
      message:
        'คุณมีรายการจองที่ยังไม่ได้ชำระโปรดชำระเงินก่อนวันที่ 14/10/2564 17.00 เพื้อไม่ให้รายการจองถูกยกเลิก',
      invokeApp: false,
      date: new Date(Date.now() + 2 * 1000), // in 60 secs
    });
  };

  const deletChanel = () => {
    PushNotification.popInitialNotification(notification => {
      console.log('Initial Notification', notification);
    });
  };

  const [loader, setLoader] = useState(false);

  const getservice = async () => {
    setLoadservice(true);
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({key: 'getservice'}),
    };
    fetch(url + 'booking.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        setData(response.service);
        setDetail(response.data);
        setLoadservice(false);
      })
      .catch(error => {
        console.log(error);
        alert(error.message);
      });
  };

  useEffect(() => {
    getservice();
  }, []);

  return (
    <View style={{height: '100%', backgroundColor: 'white'}}>
      {/* <Activebook visible={bookvisible} setVisible={setBookVisible} navigation={props.navigation} /> */}
      <Activebook navigation={props.navigation} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Profile navigation={props.navigation} />
        <Booking navigation={props.navigation} />

        {/* <Promotion navigation={props.navigation} /> */}
      </ScrollView>
    </View>
  );
};

const swipess = StyleSheet.create({
  wrapper: {maxHeight: 200},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
const styleDetail1 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC40C',
  },
  header: {
    flex: 0.6,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',

    position: 'relative',
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
    // paddingVertical: 5,
    flex: 1,
  },
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    // alignItems: 'center',
    flexDirection: 'row',
  },
  roundButton1: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#F7DC6F',
    // textAlign: 'center',
  },
  containerModal: {
    margin: 0,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
});

export default BookScreen;
