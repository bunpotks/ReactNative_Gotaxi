import React, {useState, useEffect, useRef} from 'react';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Linking,
  Pressable,
} from 'react-native';

import Modal from 'react-native-modal';

import {
  TextInput,
  Checkbox,
  IconButton,
  TouchableRipple,
  Banner,
  Paragraph,
  Button,
  Portal,
  Dialog,
  Colors,
  Divider,
  Text,
  Card,
  Avatar,
  Title,
  List,
} from 'react-native-paper';
import {url as urls} from '../center/url';
import Loader from '../center/Loader';

import {RNCamera} from 'react-native-camera';

import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Feather from 'react-native-vector-icons/Feather';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import {Item} from 'react-native-paper/lib/typescript/components/List/List';
import {convertRemToAbsolute} from 'native-base/lib/typescript/theme/tools';
import BackgroundGeolocation from '@hariks789/react-native-background-geolocation';
import BackgroundTimer from 'react-native-background-timer';

// import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import {getApiLevelSync} from 'react-native-device-info';

// import {MapView, Marker} from 'react-native-maps';
const url = urls.url;
const STORAGE_KEY = '@login';

const windowWidth = Dimensions.get('window').width;

const initPosition = {
  latitude: 13.726912,
  longitude: 100.476083,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Text>Waiting</Text>
  </View>
);

const Map = ({
  navigation,
  route,
  region,
  setRegion,
  point,
  setPoint,
  taxiPoint,
  setTaxipoint,
}) => {
  const [loader, setLoader] = useState(false);
  const [bannerVisivle, setBannerVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [myposition, setmyPosition] = useState(initPosition);

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const fitMarker = async () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        const {longitude, latitude} = position.coords;
        let condinate = [];

        for (let i = 0; i < point.length; i++) {
          condinate.push(point[i].position);
        }

        condinate.push(position.coords);

        if (mapRef.current) {
          mapRef.current.fitToCoordinates(condinate, {
            edgePadding: {top: 200, right: 100, bottom: 200, left: 100},
            animated: true,
          });
        } else {
        }
      },
      error => {},
      {timeout: 20000, maximumAge: 1000},
    );
  };

  useEffect(() => {
    fitMarker();
    return () => {
      console.log('2');
      // fitMarker()
      // clearInterval(interval);
    };
    // mapRef.current.animateToRegion(region, 2000);
  }, [setRegion]);

  function renderMapview() {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          showsUserLocation
          showsMyLocationButton={false}
          style={styles.map}
          initialRegion={myposition}
          onMapReady={fitMarker}
          ref={mapRef}>
          {taxiPoint.map((marker, index) => (
            <View key={index}>
              <Marker
                ref={markerRef}
                coordinate={marker.position}
                description={'This is a marker in React Natve'}>
                <View>
                  <View>
                    <View>
                      <View style={{marginVertical: 5}}>
                        <Card style={{borderRadius: 10, padding: 10}}>
                          <Text>{marker.name}</Text>
                        </Card>
                      </View>
                      <Image
                        resizeMode="contain"
                        source={{
                          uri: marker.img,
                        }}
                        style={{
                          height: 40,
                          width: 40,
                          alignSelf: 'center',
                          paddingVertical: 5,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </Marker>
            </View>
          ))}

          {point.map((marker, index) => (
            <View key={index}>
              <Marker
                ref={markerRef}
                coordinate={marker.position}
                description={'This is a marker in React Natve'}>
                <View>
                  <View>
                    <View>
                      <View style={{marginVertical: 5}}>
                        <Card style={{borderRadius: 10, padding: 10}}>
                          <Text>{marker.name}</Text>
                        </Card>
                      </View>
                      <Image
                        resizeMode="contain"
                        source={marker.img}
                        style={{
                          height: 40,
                          width: 40,
                          alignSelf: 'center',
                          paddingVertical: 5,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </Marker>
            </View>
          ))}
        </MapView>

        {/* {myMarker.map((marker, index) => (
            <Marker coordinate={marker} />
          ))} */}
      </View>
    );
  }

  return <View>{renderMapview()}</View>;
};

var interval;

const Monitor = props => {
  const [loader, setLoader] = React.useState(false);
  const [isReady, setReady] = React.useState(false);
  const [countPhoto, setCountPhoto] = React.useState(1);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [naviVisible, setNaviVisible] = React.useState(false);
  const [cameraMode, setCameraMode] = React.useState('back');

  const [region, setRegion] = useState({});
  const [trip, setTrip] = React.useState();
  const [point, setPoint] = React.useState([]);
  const [taxiPoint, setTaxipoint] = React.useState([]);
  const [actionButton, setActionButton] = useState();
  const [nowStatus, setNowStatus] = useState();
  const [passengerProfile, setPassengerProfile] = React.useState();

  const [bookingNbr, setBookingnbr] = useState(props.route.params.bookingnbr);
  const [imageuri, setimguri] = useState([]);

  const onsetPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        const {longitude, latitude} = position.coords;

        let toRegion = {
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        console.log(toRegion);

        setRegion(toRegion);
      },
      error => {},
      {timeout: 20000, distanceFilter: 0},
    );
  };

  const getbooking = async () => {
    setLoader(true);
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'getbooking',
        user: loginUser,
        bookingnbr: bookingNbr,
      }),
    };

    fetch(url + 'monitor.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log(response);

        setTrip(prevState => {
          return response.data;
        });
        setReady(true);
        // setTrip(response.data);

        let points = [];
        for (let i = 0; i < response.data.point.length; i++) {
          points.push({
            img: require('../img/google-map-pin-icon-png-0.jpg'),
            // img:{uri:'https://icon-library.com/images/google-map-pin-icon-png/google-map-pin-icon-png-0.jpg'},
            // img: 'https://icon-library.com/images/google-map-pin-icon-png/google-map-pin-icon-png-0.jpg',
            name: response.data.point[i].gmm_location_route_name,
            position: {
              latitude: Number(response.data.point[i].gmm_location_lat),
              longitude: Number(response.data.point[i].gmm_location_lng),
            },
          });
        }

        setPoint(points);
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
      });
  };

  const getPassengerProfile = async () => {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'getPassengerProfile',
        passengerid: trip.gmm_booking_passenger_id,
      }),
    };

    console.log(requestOptions);

    fetch(url + 'monitor.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        setPassengerProfile(response.data);
        if (response.data.camera.gmm_question_id == 1) {
          setCountPhoto(2);
        } else {
          setCountPhoto(1);
        }
        setLoader(false);
      })
      .catch(error => {
        console.log(error);
        setLoader(false);
      });
  };

  const getAction = async () => {
    if (trip) {
      const login = await AsyncStorage.getItem(STORAGE_KEY);
      const loginUser = login ? JSON.parse(login) : undefined;

      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          key: 'getAction',
          user: loginUser,
          bookingnbr: trip,
        }),
      };

      fetch(url + 'monitor.php', requestOptions)
        .then(response => response.json())
        .then(response => {
          console.log(response);
          setActionButton(response.data);
          setNowStatus(response.nowstatus);

          // console.log('resss', response);
          if (response.nowstatus != false) {
            // console.log('99999');
            // updatePosition();
            // if (response.nowstatus.gmm_booking_ac_action == 'END') {
            //   props.navigation.reset({
            //     index: 0,
            //     routes: [{name: 'Menu'}],
            //   });
            //   props.navigation.navigate('QuestionScreen', {booking: trip});
            // }
          }

          // console.log(actionButton);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
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
            key: 'updatePosition',
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

  const sendAction = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;
    getPosition().then(res => {
      console.log(res);
      setLoader(true);

      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          key: 'sendAction',
          user: loginUser,
          booking: trip,
          action: actionButton,
          position: res,
          img: imageuri,
        }),
      };

      fetch(url + 'monitor.php', requestOptions)
        .then(response => response.json())
        .then(response => {
          console.log(response);
          console.log(actionButton);
          getAction();

          stopBackground();

          BackgroundTimer.setTimeout(() => {
            setLoader(false);
            if (actionButton.gmm_product_action == 'END') {
              // props.navigation.goBack();
              // props.navigation.navigate('Bookinglist');
              AsyncStorage.removeItem('@onTravel');
              stopBackground();

              setTimeout(() => {
                props.navigation.reset({
                  index: 0,
                  routes: [{name: 'Menu'}],
                });

                props.navigation.navigate('QuestionScreen', {
                  bookingnbr: trip.gmm_booking_nbr,
                });
              }, 1000);
            } else if (actionButton.gmm_product_action == 'START') {
              AsyncStorage.setItem('@onTravel', trip.gmm_booking_nbr);
              startBackground(trip);
            } else if (actionButton.gmm_product_action == 'ACTION') {
              AsyncStorage.setItem('@onTravel', trip.gmm_booking_nbr);

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
                if (!status.isRunning) {
                  startBackground(trip);
                }
              });
            }
          }, 2000);
        })
        .catch(error => {
          console.log(error);
          setLoader(false);
        });
    });
  };

  const navigatemap = e => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${e.gmm_location_lat},${e.gmm_location_lng}`;
    const label = e.gmm_location_route_name + ' - ' + e.gmm_location_address;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    const urls =
      'https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=' +
      latLng;

    Linking.openURL(urls);
  };

  const getPosition = async () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const {longitude, latitude} = position.coords;

          resolve(position.coords);
        },
        error => {
          console.log(error);
        },
        {timeout: 20000, distanceFilter: 0},
      );
    });
  };

  const flipTypeCamera = async () => {
    setCameraMode(cameraMode == 'back' ? 'front' : 'back');
  };

  const sendAcionConfirm = async () => {
    console.log(trip);
    console.log(actionButton);

    onsetPosition();
    // console.log(actionButton.gmm_product_action == 'START');

    Alert.alert('แจ้งเตือน', actionButton.gmm_product_button_message + '?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          if (actionButton.gmm_product_promise_camera == 'ต้องการ') {
            setimguri([]);
            setModalVisible(true);
          } else {
            // if (actionButton.gmm_product_action == 'START') {
            //   await AsyncStorage.setItem('@onTravel', trip.gmm_booking_nbr);
            //   let onTravel = await AsyncStorage.getItem('@onTravel');
            //   console.log(onTravel);

            //   startBackground();
            // }else if(actionButton.gmm_product_action == 'ACTION') {

            //   BackgroundGeolocation.checkStatus(status => {
            //     console.log(
            //       '[INFO] BackgroundGeolocation service is running',
            //       status.isRunning,
            //     );
            //     console.log(
            //       '[INFO] BackgroundGeolocation services enabled',
            //       status.locationServicesEnabled,
            //     );
            //     console.log(
            //       '[INFO] BackgroundGeolocation auth status: ' + status.authorization,
            //     );

            //     // you don't need to check status before start (this is just the example)
            //     if (!status.isRunning) {
            //       BackgroundGeolocation.start(); //triggers start on start event
            //     }
            //   });

            // }

            sendAction();
          }
        },
      },
    ]);
  };

  const modalPhoto = () => {
    return (
      <Modal
        isVisible={modalVisible}
        statusBarTranslucent={true}
        onBackButtonPress={() => setModalVisible(false)}
        // animationIn='fadeIn'
        animationInTiming={700}
        animationOutTiming={700}
        style={[styles.containerModal]}>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: 'white',
            marginTop: StatusBar.currentHeight,
            // paddingHorizontal: 20,
          }}>
          <View style={{flex: 1}}>
            <View style={{ marginVertical: 10}}>
              <View style={{paddingHorizontal: 20}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: 30}}>ถ่ายรูป</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                    }}>
                    <Avatar.Icon
                      size={50}
                      style={{backgroundColor: 'white'}}
                      icon="close"
                    />
                  </TouchableOpacity>
                </View>

                <View>
                  {passengerProfile ? (
                    <Text>
                      ต้องการให้ถ่ายรูปผู้โดยสาร ? :{' '}
                      <Text
                        style={{
                          color:
                            passengerProfile.camera.gmm_question_id == 1
                              ? 'green'
                              : 'red',
                        }}>
                        {passengerProfile.camera.gmm_question_name}
                      </Text>
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={{
                position: 'absolute',
                zIndex: 999,
                right: 20,
                top: 100,
                backgroundColor: 'white',
                width: 50,
                height: 50,
                marginVertical: 2,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={flipTypeCamera}>
              <MaterialIcons name="flip-camera-ios" size={28} color="gray" />
            </TouchableOpacity>
            <RNCamera
              style={{
                flex: 7,
                overflow: 'hidden',
                justifyContent: 'flex-end',
              }}
              type={cameraMode}
              playSoundOnCapture={true}
              flashMode={RNCamera.Constants.FlashMode.off}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              androidRecordAudioPermissionOptions={{
                title: 'Permission to use audio recording',
                message: 'We need your permission to use your audio',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}>
              {({camera, status, recordAudioPermissionStatus}) => {
                if (status !== 'READY') return <PendingView />;
                return (
                  <View
                    style={{
                      flex: 0,
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => takePicture(camera)}
                      style={styles.capture}>
                      <Title style={{fontSize: 14}}> ถ่าย </Title>
                    </TouchableOpacity>
                  </View>
                );
              }}
            </RNCamera>

          

            <View
              style={{backgroundColor: 'white', flex: 2, flexDirection: 'row'}}>
              {imageuri.map((item, key) => (
                <View key={key}>
                  <Image
                    key={key}
                    source={{uri: item}}
                    style={{height: '100%', width: 100}}
                  />
                  <TouchableOpacity
                    style={{position: 'absolute', right: 0, padding: 5}}
                    onPress={() => {
                      let newarr = [...imageuri];
                      newarr.splice(key, 1);
                      // alert(key);
                      setimguri(newarr);
                    }}>
                    <Icon name="trash-can" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={{flex: 1}}>
              <Card
                style={{
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 9,
                  },
                  shadowOpacity: 0.5,
                  shadowRadius: 12.35,
                  elevation: 19,
                  // padding: 10,
                }}>
                <Button
                  disabled={imageuri.length == countPhoto ? false : true}
                  // icon="bookmark"
                  mode="contained"
                  contentStyle={{height: 50}}
                  style={{
                    // flex: 2,
                    // padding:10,
                    // marginHorizontal:10,
                    borderRadius: 10,
                    marginVertical: 10,
                    marginHorizontal: 10,
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    setModalVisible(false);
                    sendAction();
                  }}>
                  ยืนยัน {imageuri.length} / {countPhoto}
                </Button>
              </Card>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const takePicture = async function (camera) {
    if (imageuri.length < countPhoto) {
      const options = {quality: 0.5, base64: true};
      const data = await camera.takePictureAsync(options);
      let baes64 = 'data:image/png;base64, ' + data.base64;
      // setimguri(baes64);

      setimguri(oldArray => [...oldArray, baes64]);
    } else {
      alert('ไม่สามารถเพิ่มรูปภาพได้เนื่องจากเกินจำนวนที่กำหนด');
    }
  };

  useEffect(() => {
    async function getasync() {
      await getbooking();
      await getAction();
      await getPassengerProfile();
    }
    getasync();
  }, [isReady]);

  useEffect(() => {
    // getCgTaxiLocation();
    getAction();

    interval = setInterval(() => {
      // getCgTaxiLocation();
      getAction();
    }, 10000);
    return () => {
      console.log(10);
      clearInterval(interval);
    };
  }, [props.navigation, trip]);

  const renderInner = () => {
    return (
      <View
        style={{
          paddingHorizontal: 20,
          backgroundColor: 'rgba(255,255,255,0.0)',
          alignItems: 'center',
          height: '100%',
        }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          {actionButton ? (
            <Button
              mode="contained"
              contentStyle={{height: 50}}
              style={{
                borderRadius: 10,
                // marginVertical: 10,
                justifyContent: 'center',
                width: '50%',
              }}
              onPress={() => {
                if (actionButton.allowButton) {
                  sendAcionConfirm();
                } else {
                  alert('ท่านสามารถเริ่มงานได้ก่อนเวลาเริ่มงาน 1 ชั่วโมง');
                }
              }}>
              {actionButton.gmm_product_button_message}
            </Button>
          ) : null}
        </View>

        <View
          style={{
            width: '100%',
            borderRadius: 10,
            backgroundColor: 'white',
            paddingHorizontal: 10,
            paddingVertical: 8,
            margin: 5,
          }}>
          <View
            contentStyle={{color: 'red'}}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontWeight: 'bold', fontSize: 12, color: 'gray'}}>
              เลขที่การเดินทาง #{trip.gmm_booking_nbr}
            </Text>

            <Button
              onPress={() => Linking.openURL(`tel:$191`)}
              mode="outlined"
              compact={true}
              contentStyle={{padding: 0, margin: 0}}
              labelStyle={{color: 'red', fontSize: 10, fontWeight: 'bold'}}
              style={{
                borderRadius: 10,
                justifyContent: 'center',
                borderColor: 'red',
                fontSize: 16,
                borderWidth: 1,
              }}>
              {' '}
              โทร 191
            </Button>
          </View>

          <View>
            <View
              style={{
                // backgroundColor:'red',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <View style={{marginLeft: 10}}>
                  <Text style={{fontWeight: 'bold', fontSize: 12}}>
                    {trip.gmm_booking_product_name}
                  </Text>
                  <Text style={{color: 'gray', fontSize: 12}}>
                    {trip.monthdesc.time} - {trip.monthdescend.time}{' '}
                  </Text>
                </View>
              </View>

              <View>
                <TouchableRipple
                  onPress={() => {
                    setNaviVisible(true);
                  }}
                  style={styles.roundButton2}
                  rippleColor="rgba(0, 0, 0, 0.1)">
                  <View style={{alignItems: 'center'}}>
                    <Feather name="navigation" color="#FFC40C" size={18} />
                    <Text style={{fontSize: 12}}>นำทาง</Text>
                  </View>
                </TouchableRipple>
              </View>

              {/* <View style={{width: 50}}></View> */}
            </View>
          </View>
          <Divider style={{margin: 5}} />
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Avatar.Image
                  size={40}
                  source={{
                    uri: 'https://backoffice.go-mamma.com/image/picon.png',
                  }}
                />
                <View style={{marginLeft: 10}}>
                  <Text style={{fontWeight: 'bold', fontSize: 12}}>
                    {trip.gmm_user_fname} {trip.gmm_user_lname}
                  </Text>
                  <Text style={{color: 'gray', fontSize: 12}}>ผู้จอง</Text>
                </View>
              </View>

              <View style={{width: 50}}></View>

              <View>
                <TouchableRipple
                  style={styles.roundButton2}
                  onPress={() => {
                    Linking.openURL(`tel:${trip.gmm_user_tel}`);
                  }}
                  rippleColor="rgba(0, 0, 0, 0.1)">
                  <Feather name="phone" color="#FFC40C" size={22} />
                </TouchableRipple>
              </View>
            </View>
            <Divider style={{marginTop: 5}} />

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Avatar.Image
                  size={40}
                  source={{
                    uri: 'https://backoffice.go-mamma.com/image/passengericon.png',
                  }}
                />
                <View style={{marginLeft: 10}}>
                  <Text style={{fontWeight: 'bold', fontSize: 12}}>
                    {trip.gmm_passenger_fname} {trip.gmm_passenger_lname}
                  </Text>
                  <Text style={{color: 'gray', fontSize: 12}}>ผู้โดยสาร</Text>
                </View>
              </View>

              <View style={{width: 50}}></View>

              <View>
                <TouchableRipple
                  style={styles.roundButton2}
                  onPress={() => {
                    Linking.openURL(`tel:${trip.gmm_passenger_tel}`);
                  }}
                  rippleColor="rgba(0, 0, 0, 0.1)">
                  <Feather name="phone" color="#FFC40C" size={22} />
                </TouchableRipple>
              </View>
            </View>
          </View>
        </View>

        {/* <Button
          mode="contained"
          contentStyle={{height: 60}}
          style={{
            borderRadius: 10,
            marginVertical: 10,
            justifyContent: 'center',
          }}
          onPress={() => setmarkernew()}>
          ติดตามการเดินทาง
        </Button> */}
      </View>
    );
  };

  function potal() {
    return (
      <Portal>
        <Dialog
          style={{borderRadius: 10}}
          onDismiss={() => {
            setNaviVisible(false);
          }}
          visible={naviVisible}>
          <Dialog.Title>เลือกจุดที่ต้องการนำทาง</Dialog.Title>
          <Divider />

          <View style={{paddingVertical: 20, paddingHorizontal: 10}}>
            {/* <Paragraph>ต้องการยกเลิกรายการจองนี้ใช่หรือไม่ ?</Paragraph> */}
            {trip.point.map((item, key) => (
              <View key={key}>
                <List.Item
                  right={() => (
                    <Icon
                      name="map-marker"
                      size={26}
                      color="#FE7569"
                      style={{alignSelf: 'center'}}
                    />
                  )}
                  onPress={() => {
                    setNaviVisible(false);
                    navigatemap(item);
                  }}
                  title={item.gmm_location_route_name}
                  description={item.gmm_location_address}
                />
                <Divider />
              </View>
            ))}
          </View>
          <Dialog.Actions>
            <Button
              color={Colors.grey500}
              onPress={() => {
                setNaviVisible(false);
              }}>
              ยกเลิก
            </Button>
            {/* <Button
              onPress={() => {
                setNaviVisible(false);
              }}>
              ยืนยัน
            </Button> */}
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }

  return (
    <View style={{display: 'flex'}}>
      {modalPhoto()}
      {trip ? (
        <View>
          <Loader visible={loader} />
          <View
            style={{
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
              position: 'absolute',
              width: '100%',
              zIndex: 999,
            }}>
            <View style={{position: 'relative'}}>
              {nowStatus ? (
                <View
                  style={{
                    padding: 10,
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderRadius: 20,
                    borderWidth: 0.1,
                    // width:'100%'
                  }}>
                  <Text numberOfLines={1}>
                    {nowStatus.gmm_booking_ac_message1}
                  </Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={[styles.roundButton2, {alignSelf: 'flex-end', top: 10}]}
                onPress={() => {
                  onsetPosition();
                }}
                rippleColor="rgba(0, 0, 0, .32)">
                <MaterialIcons name="my-location" color="gray" size={22} />
              </TouchableOpacity>
            </View>
          </View>

          <Map
            navigation={props.navigation}
            route={props.route}
            region={region}
            setRegion={region}
            point={point}
            setPoint={setPoint}
            taxiPoint={taxiPoint}
            setTaxipoint={setTaxipoint}
          />

          {potal()}
          <View
            style={{
              width: '100%',
              position: 'absolute',
              zIndex: 999,
              bottom: 0,
            }}>
            {renderInner()}
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default Monitor;

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  roundButton1: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 10,

    borderRadius: 100,
    backgroundColor: 'white',
    textAlign: 'center',
  },
  roundButton2: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'white',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    height: '20%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  lineBreak: {
    marginVertical: 10,
    backgroundColor: 'rgba(232, 232, 232,0.5)',
    height: 1,
  },

  containerbs: {
    display: 'flex',
  },

  panelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  panel: {
    height: 600,
    padding: 20,
    backgroundColor: '#ffff',
  },
  header: {
    // backgroundColor: '#ffff',
    backgroundColor: 'rgba(255,255,255,0.0)',
    shadowColor: '#000000',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#318bfb',
    alignItems: 'center',
    marginVertical: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  containerModal: {
    // flex: 1,
    margin: 0,
    // justifyContent: 'flex-start',
    backgroundColor: '#ffff',
  },
  preview: {
    // flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    width: 60,
    height: 60,
  },
});
