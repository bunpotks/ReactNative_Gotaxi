import React, {useState, useEffect, useRef} from 'react';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {
  // Animated,
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
  PermissionsAndroid,
  ImageBackground,
  Linking,
} from 'react-native';

import ReactNativeBlobUtil from 'react-native-blob-util';

import {
  TextInput,
  Button,
  Checkbox,
  RadioButton,
  Title,
  Card,
  Text,
  Paragraph,
  List,
  Avatar,
  TouchableRipple,
  Divider,
  Portal,
  Dialog,
  Colors,
} from 'react-native-paper';
import {url as urls} from '../center/url';
import Loader from '../center/Loader';
import {Dropdown} from 'react-native-material-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconMat from 'react-native-vector-icons/MaterialIcons';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {BottomSheet, ListItem} from 'react-native-elements';
import {useToast} from 'react-native-toast-notifications';

import {captureRef} from 'react-native-view-shot';
import ViewShot from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';

import Modal from 'react-native-modal';
import {set} from 'react-native-reanimated';

import conv_formatTel from '../center/convertTel';
import login_user from '../center/loginuser';

import ListCgComment from './listCgComment';
import Historystatus from './historystatus';
import AddCgComment from '../monitorCg/addCgComment';

const url = urls.url;
const STORAGE_KEY = '@login';

const HistoryDetail = ({navigation, route}) => {
  const toast = useToast();

  const [trip, setTrip] = React.useState(route.params.trip);
  const [name, setNmae] = React.useState('');
  const [loader, setLoader] = useState(false);
  const [ratingStatus, setRatingStatus] = useState(false);

  const [modalstatus, setModalstatus] = useState(false);
  const [modalCgcommentList, setModalCgcommentList] = useState(false);
  const [modalCgComment, setModalCgComment] = React.useState(false);

  const [usertype, setusertype] = useState();
  const [usernew, setusernew] = useState();

  const [IMAGE_PATH, setIMAGE_PATH] = React.useState('');
  const [isModalTxCgCard, setIsModalTxCgCard] = React.useState(false);

  const [passengerProfile, setPassengerProfile] = React.useState();

  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const [visible, setVisible] = React.useState(false);

  const checkPermision = async () => {
    if (Platform.OS === 'ios') {
      downloadImage();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to down load Photos',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage Permission Granted.');
          downloadImage();
        } else {
          alert('Storage Permission Not Granted');
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };

  const downloadImage = () => {
    let date = new Date();
    let image_URL = IMAGE_PATH;
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    const {config, fs} = ReactNativeBlobUtil;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };

    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        console.log(JSON.stringify(res));
        Alert.alert('แจ้งเตืน', 'ดาวน์โหลดสำเร็จ');
      });
  };

  const getExtention = filename => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  const hideDialog = () => setVisible(false);

  const getPassengerProfile = () => {
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
        console.log(response);
        setPassengerProfile(response.data);
        setLoader(false);
      })
      .catch(error => {
        console.log(error);
        setLoader(false);
      });
  };

  const checkSendRating = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;
    setLoader(true);
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'checkSendRating',
        booking: trip,
        user: loginUser,
      }),
    };

    fetch(url + 'rateing.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setRatingStatus(response.status);
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
      });
  };

  useEffect(() => {
    getPassengerProfile();
  }, []);

  React.useEffect(() => {
    const willFocusSubscription = navigation.addListener('focus', () => {
      login_user.firstValidationMethod().then(e => {
        setusernew(e);
      });
      // fetchData();
      checkSendRating();
    });

    async function getusertype() {
      const login = await AsyncStorage.getItem(STORAGE_KEY);
      const loginUser = login ? JSON.parse(login) : undefined;
      setusertype(loginUser);
    }

    getusertype();

    return willFocusSubscription;
  }, []);

  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const savePicture = async tag => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }

    CameraRoll.save(tag);
  };

  const capture = () => {
    captureRef(viewRefImg, {
      format: 'jpg',
      quality: 1,
    }).then(
      uri => {
        savePicture(uri);
        console.log('Image saved to', uri);
        toast.show('บันทึกรูปภาพแล้ว');
        setIsModalVisible(false);
      },
      error => console.error('Oops, snapshot failed', error),
    );
  };

  const onCapture = e => {
    console.log(e);
  };

  const addtoFavorite = async () => {
    setVisible(false);
    console.log(name);
    console.log(trip);

    setLoader(true);
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    console.log(loginUser);

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'addFavouriteTrip',
        user: loginUser,
        trip: trip,
        name: name,
      }),
    };

    fetch(url + 'favoritetrip.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setLoader(false);
        navigation.navigate('FavoriteTripList');
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };

  const viewRef = useRef();
  const viewRefImg = useRef();

  function etcCard() {
    return (
      <Card style={{marginHorizontal: 10, marginVertical: 10, borderRadius: 10}}>
        <Card.Content>
          <View>
            <Text style={{marginTop: 10, color: 'gray'}}>
              รายละเอียดการเดินทาง
            </Text>
            <Text style={{color: 'gray', fontSize: 12}}>
              เลขที่การจอง : {trip.gmm_booking_nbr}
            </Text>
          </View>
          <View>
            <Title style={{color: 'green'}}>เดินทางแล้ว</Title>
            <Button
              disabled={ratingStatus}
              mode="contained"
              style={{
                flex: 1,
                margin: 5,
                borderRadius: 10,
              }}
              onPress={() =>
                navigation.navigate('QuestionScreen', {
                  bookingnbr: trip.gmm_booking_nbr,
                })
              }>
              ให้คะแนนการบริการครั้งนี้
            </Button>
            <View style={{flexDirection: 'row'}}>
              <Button
                mode="contained"
                style={{
                  flex: 1,
                  margin: 5,
                  borderRadius: 10,
                }}
                onPress={() => {
                  setModalstatus(true);
                }}>
                ดูสถานะการเดินทาง
              </Button>
            </View>

            {usernew ? (
              <>
                {usernew.gmm_emp_type == 'Caregiver' ? (
                  <View style={{flexDirection: 'row'}}>
                    <Button
                      mode="contained"
                      style={{
                        flex: 1,
                        margin: 5,
                        borderRadius: 10,
                      }}
                      onPress={() => setModalCgcommentList(true)}>
                      ประวัติการบันทึก
                    </Button>
                    <Button
                      mode="contained"
                      style={{
                        flex: 1,
                        margin: 5,
                        borderRadius: 10,
                      }}
                      onPress={() => setModalCgComment(true)}>
                      เพิ่มบันทึกผู้ดูแล
                    </Button>
                  </View>
                ) : null}
              </>
            ) : null}
          </View>

          {/* <Paragraph style={{}}>{trip.gmm_booking_product_name}</Paragraph> */}

          <Divider style={{marginVertical: 10}} />

          <Title>{trip.gmm_booking_product_name}</Title>
          <Paragraph style={{color: 'gray'}}>
            {trip.gmm_booking_product_desc
              ? trip.gmm_booking_product_desc
              : 'ไม่มีรายละเอียด'}
          </Paragraph>

          <Divider style={{marginVertical: 10}} />

          {usertype ? (
            <>
              {usertype.gmm_emp_type == 'Taxi' ? (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      // marginVertical: 10,
                    }}>
                    <Text style={{textAlign: 'center', color: 'gray'}}>
                      เดินทางวันที่
                    </Text>
                    <Text style={{textAlign: 'center', color: 'gray'}}>
                      เวลา
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{textAlign: 'center', fontSize: 18}}>
                      {' '}
                      {trip.monthdesc.monthdesc}
                    </Text>
                    <Text style={{textAlign: 'center', fontSize: 18}}>
                      {trip.monthdesc.time} - {trip.enddesc.time}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row'}}>
                    {trip.gmm_booking_product_drop > 2 ? (
                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 10,
                          }}>
                          <Text style={{textAlign: 'center', color: 'gray'}}>
                            ชั่วโมงรอรวม
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={{textAlign: 'center', fontSize: 18}}>
                            {trip.gmm_taxi_total_hr} ชั่วโมง
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </View>

                  <Divider style={{marginTop: 10}} />

                  {trip.gmm_booking_cg_id ? (
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 10,
                          }}>
                          <Text style={{textAlign: 'center', color: 'gray'}}>
                            จุดนัดผู้ดูแล
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={{textAlign: 'center', fontSize: 16}}>
                            {/* {trip.gmm_booking_cg_startpoint} */}
                            {
                              trip.point[trip.gmm_booking_cg_startpoint - 1]
                                .gmm_location_route_name
                            }
                          </Text>
                        </View>
                      </View>

                      <View style={{flex: 1, alignItems: 'flex-end'}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 10,
                          }}>
                          <Text style={{textAlign: 'center', color: 'gray'}}>
                            เวลา
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={{textAlign: 'center', fontSize: 18}}>
                            {trip.monthdescCg.time} - {trip.enddescCg.time}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : null}
                </View>
              ) : (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      // marginVertical: 10,
                    }}>
                    <Text style={{textAlign: 'center', color: 'gray'}}>
                      เดินทางวันที่
                    </Text>
                    <Text style={{textAlign: 'center', color: 'gray'}}>
                      เวลา
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{textAlign: 'center', fontSize: 18}}>
                      {' '}
                      {trip.monthdescCg.monthdesc}
                    </Text>
                    <Text style={{textAlign: 'center', fontSize: 18}}>
                      {trip.monthdescCg.time} - {trip.enddescCg.time}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginVertical: 10,
                        }}>
                        <Text style={{textAlign: 'center', color: 'gray'}}>
                          ชั่วโมงบริการ
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={{textAlign: 'center', fontSize: 18}}>
                          {trip.gmm_cg_total_hr} ชั่วโมง
                        </Text>
                      </View>
                    </View>

                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginVertical: 10,
                        }}>
                        <Text style={{textAlign: 'center', color: 'gray'}}>
                          จุดนัดพบผู้โดยสาร
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={{textAlign: 'center', fontSize: 16}}>
                          {/* {trip.gmm_booking_cg_startpoint} */}
                          {
                            trip.point[trip.gmm_booking_cg_startpoint - 1]
                              .gmm_location_route_name
                          }
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Divider style={{marginTop: 10}} />
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginVertical: 10,
                        }}>
                        <Text style={{textAlign: 'center', color: 'gray'}}>
                          พนักงานขับรถ
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={{textAlign: 'center', fontSize: 18}}>
                          {trip.monthdesc.time} - {trip.enddesc.time}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </>
          ) : null}
        </Card.Content>
      </Card>
    );
  }

  function modalTaxiCgCard() {
    return (
      <Modal
        isVisible={isModalTxCgCard}
        onBackButtonPress={() => setIsModalTxCgCard(false)}
        statusBarTranslucent={true}
        animationInTiming={700}
        animationOutTiming={700}
        style={{
          margin: 0,
          justifyContent: 'flex-start',
          backgroundColor: '#ffff',
        }}>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: 'white',
            marginTop: StatusBar.currentHeight,
            paddingHorizontal: 20,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 30}}>การ์ด</Text>
            <TouchableOpacity
              onPress={() => {
                setIsModalTxCgCard(false);
              }}>
              <Avatar.Icon
                size={50}
                style={{backgroundColor: 'white'}}
                icon="close"
              />
            </TouchableOpacity>
          </View>
          <Divider style={{marginVertical: 10}} />

          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              justifyContent: 'center',
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              <Image
                resizeMode="contain"
                style={{
                  borderRadius: 10,
                  maxWidth: 400,
                  maxHeight: 400,
                  minHeight: 300,
                  minWidth: 200,
                }}
                source={{
                  uri: IMAGE_PATH,
                }}
              />

              <Button
                icon="content-save"
                mode="contained"
                contentStyle={{height: 50}}
                style={{
                  borderRadius: 10,
                  marginVertical: 10,
                  marginHorizontal: 5,
                  justifyContent: 'center',
                }}
                onPress={() => {
                  checkPermision();
                }}>
                บันทึกรูปภาพ
              </Button>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  function taxicgCard() {
    return (
      <Card style={{marginHorizontal: 10, marginVertical: 5, borderRadius: 10}}>
        <Card.Content>
          <Text style={{color: 'gray'}}>ผู้จอง</Text>
          <View>
            <List.Item
              title={trip.gmm_user_fname + ' ' + trip.gmm_user_lname}
              description={conv_formatTel(trip.gmm_user_tel)}
              left={props => (
                <Avatar.Image
                  marginVertical={15}
                  size={30}
                  source={{
                    uri: 'https://backoffice.go-mamma.com/image/picon.png',
                  }}
                />
              )}
              right={props => (
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                  <TouchableRipple
                    onPress={() => {
                      Linking.openURL(`tel:${trip.gmm_user_tel}`);
                    }}
                    style={{padding: 10}}>
                    <Icon name="phone" size={24} color="#FFC40C" />
                  </TouchableRipple>
                </View>
              )}
            />
          </View>
          <Divider />
          <Text style={{color: 'gray'}}>ผู้โดยสาร</Text>
          <View>
            <List.Item
              title={trip.gmm_passenger_fname + ' ' + trip.gmm_passenger_lname}
              description={
                trip.gmm_passenger_tel
                  ? conv_formatTel(trip.gmm_passenger_tel)
                  : null
              }
              left={props => (
                <Avatar.Image
                  marginVertical={15}
                  size={30}
                  source={{
                    uri: 'https://backoffice.go-mamma.com/image/passengericon.png',
                  }}
                />
              )}
              right={props => (
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                  <TouchableRipple
                    onPress={() => setIsModalVisible(true)}
                    style={{padding: 10}}>
                    <Icon
                      name="clipboard-account-outline"
                      size={24}
                      color="#FFC40C"
                    />
                  </TouchableRipple>
                  {trip.gmm_passenger_tel ? (
                    <TouchableRipple
                      onPress={() => {
                        Linking.openURL(`tel:${trip.gmm_passenger_tel}`);
                      }}
                      style={{padding: 10}}>
                      <Icon name="phone" size={24} color="#FFC40C" />
                    </TouchableRipple>
                  ) : null}
                </View>
              )}
            />
          </View>
          <Divider />

          <Text style={{marginTop: 10, color: 'gray'}}>คนขับรถ</Text>
          <View>
            <List.Item
              title={trip.taxi_fname + ' ' + trip.taxi_lname}
              description={conv_formatTel(trip.taxi_tel)}
              left={props => (
                <Avatar.Image
                  marginVertical={15}
                  size={30}
                  source={{
                    uri: 'https://backoffice.go-mamma.com/image/taxiicon.png',
                  }}
                />
              )}
              right={props => (
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                  <TouchableRipple
                    onPress={() => {
                      console.log(trip.txCard);
                      if (trip.txCard) {
                        setIMAGE_PATH(trip.txCard);
                        setIsModalTxCgCard(true);
                      } else {
                        Alert.alert('แจ้งเตือน', 'ไม่พบรายละเอียด');
                      }
                    }}
                    style={{padding: 10}}>
                    <Icon
                      name="clipboard-account-outline"
                      size={24}
                      color="#FFC40C"
                    />
                  </TouchableRipple>
                  <TouchableRipple
                    onPress={() => {
                      Linking.openURL(`tel:${trip.taxi_tel}`);
                    }}
                    style={{padding: 10}}>
                    <Icon name="phone" size={24} color="#FFC40C" />
                  </TouchableRipple>
                </View>
              )}
            />
          </View>

          {trip.gmm_booking_cg_radio == 'ON' ? (
            <View>
              <Text style={{color: 'gray'}}>ผู้ดูแล</Text>
              <View>
                <List.Item
                  title={trip.cg_fname + ' ' + trip.cg_lname}
                  description={conv_formatTel(trip.cg_tel)}
                  left={props => (
                    <Avatar.Image
                      marginVertical={15}
                      size={30}
                      source={{
                        uri: 'https://backoffice.go-mamma.com/image/cgicon.png',
                      }}
                    />
                  )}
                  right={props => (
                    <View style={{alignItems: 'center', flexDirection: 'row'}}>
                      <TouchableRipple
                        onPress={() => {
                          if (trip.cgCard) {
                            setIMAGE_PATH(trip.cgCard);
                            setIsModalTxCgCard(true);
                          } else {
                            Alert.alert('แจ้งเตือน', 'ไม่พบรายละเอียด');
                          }
                        }}
                        style={{padding: 10}}>
                        <Icon
                          name="clipboard-account-outline"
                          size={24}
                          color="#FFC40C"
                        />
                      </TouchableRipple>
                      <TouchableRipple
                        onPress={() => {
                          Linking.openURL(`tel:${trip.cg_tel}`);
                        }}
                        style={{padding: 10}}>
                        <Icon name="phone" size={24} color="#FFC40C" />
                      </TouchableRipple>
                    </View>
                  )}
                />
              </View>
            </View>
          ) : null}
        </Card.Content>
      </Card>
    );
  }

  function locationCard() {
    return (
      <Card style={{marginHorizontal: 10, marginVertical: 5, borderRadius: 10}}>
        <Card.Content>
          <Text style={{marginTop: 10}}>ลำดับการเดินทาง</Text>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={{flex: 2, justifyContent: 'center'}}>
              {trip.point.map((item, key) => (
                <View key={key}>
                  <Icon
                    name="map-marker"
                    size={26}
                    color="#FE7569"
                    style={{
                      marginLeft: 5,
                      paddingVertical: 5,
                      flex: 2,
                    }}
                  />

                  {key == trip.point.length - 1 ? null : (
                    <MaterialIcons
                      name="more-vert"
                      size={26}
                      color="rgb(232, 232, 232)"
                      style={{
                        marginLeft: 5,
                        paddingVertical: 5,
                        flex: 1,
                      }}
                    />
                  )}
                </View>
              ))}
            </View>

            <View style={{flex: 12, justifyContent: 'space-between'}}>
              {trip.point.map((item, key) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => {
                    const scheme = Platform.select({
                      ios: 'maps:0,0?q=',
                      android: 'geo:0,0?q=',
                    });
                    const latLng = `${item.gmm_location_lat},${item.gmm_location_lng}`;
                    const label =
                      item.gmm_location_route_name +
                      ' - ' +
                      item.gmm_location_address;
                    const map_mark_url = Platform.select({
                      ios: `${scheme}${label}@${latLng}`,
                      android: `${scheme}${latLng}(${label})`,
                    });

                    Linking.openURL(map_mark_url);
                  }}>
                  <View style={{marginVertical: 5}}>
                    <Text numberOfLines={2}>
                      <Text style={{color: '#FE7569'}}>
                        {item.gmm_location_route_name}
                      </Text>{' '}
                      : {item.gmm_location_address}
                    </Text>
                    {item.gmm_location_rmks1 ? (
                      <Text style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 12, color: 'gray'}}>
                          {item.gmm_location_rmks1
                            ? item.gmm_location_rmks1
                            : null}
                        </Text>
                      </Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  }

  function hourseCard() {
    return (
      <Card style={{marginHorizontal: 10, marginVertical: 5, borderRadius: 10}}>
        <Card.Content style={{paddingVertical: 10}}>
          <Text style={{marginVertical: 10, color: 'gray'}}>
            เพิ่มชั่วโมงการรอ
          </Text>
          <Text>
            คนขับรถ :{' '}
            {trip.gmm_booking_taxi_hradd > 0
              ? trip.gmm_booking_taxi_hradd + ' ชั่วโมง'
              : '-'}{' '}
          </Text>

          {trip.gmm_product_cg_radio == 'ON' ? (
            <Text style={{color: 'gray'}}>
              ผู้ดูแล :{' '}
              {trip.gmm_booking_cg_hradd > 0
                ? trip.gmm_booking_cg_hradd + ' ชั่วโมง'
                : '-'}{' '}
            </Text>
          ) : null}
        </Card.Content>

        <Divider />
        <Card.Content>
          <Text style={{marginTop: 10, color: 'gray', marginVertical: 10}}>
            รายละเอียดเพิ่มเติม
          </Text>
          <Text style={{color: 'gray'}}>
            จำนวนผู้ติดตาม :{' '}
            <Paragraph>
              {' '}
              {trip.gmm_booking_rmks_follower > 0
                ? trip.gmm_booking_rmks_follower + ' คน'
                : '-'}{' '}
            </Paragraph>
          </Text>
          <Text style={{color: 'gray'}}>
            อุปกรณ์ที่นำไปด้วย :{' '}
            <Paragraph>{trip.gmm_booking_rmks_equipment}</Paragraph>
          </Text>
          <Text style={{color: 'gray'}}>
            รายละเอียดเพิ่มเติม :{' '}
            <Paragraph>
              {trip.gmm_booking_rmks_desc ? trip.gmm_booking_rmks_desc : '-'}
            </Paragraph>
          </Text>
        </Card.Content>
      </Card>
    );
  }

  function modalShare() {
    return (
      <Modal
        statusBarTranslucent={true}
        isVisible={isModalVisible}
        onBackButtonPress={() => setIsModalVisible(false)}
        animationInTiming={700}
        animationOutTiming={700}
        style={{
          margin: 0,
          justifyContent: 'flex-start',
          backgroundColor: '#ffff',
        }}>
        <SafeAreaView
          style={{
            flex: 1,
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <View
              style={{
                paddingTop: StatusBar.currentHeight,
                backgroundColor: '#febe29',
              }}>
              <View style={{padding: 20}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: 30, color: 'white'}}>
                    ประวัติผู้โดยสาร
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setIsModalVisible(false);
                    }}>
                    <Avatar.Icon
                      size={40}
                      icon="close"
                      style={{backgroundColor: 'transparent'}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
              }}>
              {passengerProfile ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}>
                  <Card
                    style={{
                      flex: 1,
                      margin: 10,
                      borderRadius: 10,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 5,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 3,
                      // marginHorizontal: 10,
                    }}>
                    <Card.Content style={{flex: 1}}>
                      <View style={{marginVertical: 10}}>
                        <Text style={{color: 'gray'}}>ประวัติผู้โดยสาร</Text>

                        <View style={{justifyContent: 'space-between'}}>
                          <View>
                            <Text style={{fontSize: 18, marginVertical: 10}}>
                              ชื่อ-นามสกุล
                            </Text>
                          </View>
                        </View>

                        <View>
                          <Text>
                            {passengerProfile.gmm_passenger_fname}{' '}
                            {passengerProfile.gmm_passenger_lname}
                          </Text>
                        </View>
                        <Divider style={{marginTop: 10}} />

                        <View style={{justifyContent: 'space-between'}}>
                          <View>
                            <Text style={{fontSize: 18, marginVertical: 10}}>
                              น้ำหนัก
                            </Text>
                          </View>
                        </View>

                        <View>
                          <Text>
                            {passengerProfile.gmm_passenger_weight} กิโลกรัม
                          </Text>
                        </View>
                        <Divider style={{marginTop: 10}} />

                        <View style={{justifyContent: 'space-between'}}>
                          <View>
                            <Text style={{fontSize: 18, marginVertical: 10}}>
                              ส่วนสูง
                            </Text>
                          </View>
                        </View>

                        <View>
                          <Text>
                            {passengerProfile.gmm_passenger_height}{' '}
                            {'เซนติเมตร'}
                          </Text>
                        </View>
                        <Divider style={{marginTop: 10}} />

                        <View style={{justifyContent: 'space-between'}}>
                          <View>
                            <Text style={{fontSize: 18, marginVertical: 10}}>
                              อายุ
                            </Text>
                          </View>
                        </View>

                        <View>
                          <Text>{passengerProfile.age} ปี</Text>
                        </View>
                        <Divider style={{marginTop: 10}} />

                        <View style={{justifyContent: 'space-between'}}>
                          <View>
                            <Text style={{fontSize: 18, marginVertical: 10}}>
                              วันเกิด
                            </Text>
                          </View>
                        </View>

                        <View>
                          <Text>
                            {passengerProfile.birdthdate
                              ? passengerProfile.birdthdate.monthdesc
                              : null}{' '}
                          </Text>
                        </View>
                        <Divider style={{marginTop: 10}} />

                        <View style={{justifyContent: 'space-between'}}>
                          <View>
                            <Text style={{fontSize: 18, marginVertical: 10}}>
                              <Icon
                                name="cards-heart"
                                size={26}
                                color="rgba(0, 0, 0, 0.54)"
                                style={{marginLeft: 5}}
                              />{' '}
                              โรคประจำตัว
                            </Text>
                          </View>
                        </View>

                        <View>
                          {passengerProfile.gmm_passenger_disease_radio_id ==
                          1 ? (
                            <View style={{paddingLeft: 10}}>
                              {passengerProfile.disease.map((item, key) => (
                                <Text key={key}>
                                  {'- '}
                                  {item.gmm_passenger_disease_name}
                                </Text>
                              ))}
                            </View>
                          ) : (
                            <View>
                              <Text>ไม่มีโรคประจำตัว</Text>
                            </View>
                          )}
                        </View>
                        <Divider style={{marginTop: 10}} />
                      </View>

                      <View style={{marginVertical: 10}}>
                        <Text
                          style={{
                            fontSize: 18,
                            marginVertical: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <IconMat
                            name="directions-walk"
                            size={24}
                            color="rgba(0, 0, 0, 0.54)"
                            style={{marginLeft: 5}}
                          />{' '}
                          ความสามารถในการเดิน
                        </Text>
                        <View style={{paddingLeft: 10}}>
                          <Text>- {passengerProfile.walk.gmm_walk_name}</Text>
                        </View>
                      </View>
                      <Divider />

                      <View style={{marginVertical: 10}}>
                        <Text style={{fontSize: 18, marginVertical: 10}}>
                          <IconMat
                            name="camera-alt"
                            size={24}
                            color="rgba(0, 0, 0, 0.54)"
                            style={{marginLeft: 5}}
                          />{' '}
                          ต้องการภาพถ่ายผู้โดยสารเส่งให้ผู้จองเมื่อถึงจุดปลายทางหรือมไม่
                        </Text>
                        <View style={{paddingLeft: 10}}>
                          <Text>
                            - {passengerProfile.camera.gmm_question_name}
                          </Text>
                        </View>
                      </View>
                      <Divider />

                      <View style={{marginVertical: 10}}>
                        <Text style={{fontSize: 18, marginVertical: 10}}>
                          <Icon
                            name="cards-heart"
                            size={24}
                            color="rgba(0, 0, 0, 0.54)"
                            style={{marginLeft: 5}}
                          />{' '}
                          ความต้องการให้ผู้บริการช่วยพยุง/ประคอง
                        </Text>
                        <View style={{paddingLeft: 20}}>
                          <Text>
                            - {passengerProfile.help.gmm_question_name}
                          </Text>
                        </View>
                      </View>
                      <Divider />

                      <View style={{marginVertical: 10}}>
                        <Text style={{fontSize: 18, marginVertical: 10}}>
                          <Icon
                            name="comment-text"
                            size={24}
                            color="rgba(0, 0, 0, 0.54)"
                            style={{marginLeft: 5}}
                          />{' '}
                          คำที่ต้องการให้ใช้เรียกแทนชื่อ
                        </Text>
                        <View style={{paddingLeft: 10}}>
                          <Text>
                            {passengerProfile.gmm_passenger_message
                              ? '- ' + passengerProfile.gmm_passenger_message
                              : 'ไม่มี'}
                          </Text>
                        </View>
                      </View>
                      <Divider />

                      <View style={{marginVertical: 10}}>
                        <Text style={{fontSize: 18, marginVertical: 10}}>
                          <Icon
                            name="clipboard-text"
                            size={26}
                            color="rgba(0, 0, 0, 0.54)"
                            style={{marginLeft: 5}}
                          />{' '}
                          ความสนใจ
                        </Text>
                        {passengerProfile.gmm_passenger_hobby_radio_id == 2 ? (
                          <View style={{paddingLeft: 20}}>
                            {passengerProfile.hobby.map((item, key) => (
                              <Text key={key}>
                                - {item.gmm_passenger_hobby_name}
                              </Text>
                            ))}
                            {passengerProfile.hobby.length == 0 ? (
                              <Text>ไม่มี</Text>
                            ) : null}
                          </View>
                        ) : (
                          <View>
                            <Text>ไม่มี</Text>
                          </View>
                        )}
                      </View>
                      <Divider />

                      <View style={{marginVertical: 10}}>
                        <Text style={{fontSize: 18}}>
                          <Icon
                            name="music-box-multiple-outline"
                            size={24}
                            color="rgba(0, 0, 0, 0.54)"
                            style={{marginLeft: 5}}
                          />{' '}
                          ประเภทเพลงที่ชื่นชอบ
                        </Text>

                        <View style={{paddingLeft: 10}}>
                          <Text>
                            {passengerProfile.music.gmm_music_name
                              ? '- ' + passengerProfile.music.gmm_music_name
                              : 'ไม่มี'}
                          </Text>

                          <Text>
                            รายละเอียด :{' '}
                            {passengerProfile.gmm_passenger_music_desc
                              ? passengerProfile.gmm_passenger_music_desc
                              : 'ไม่มี'}
                          </Text>
                        </View>
                      </View>

                      <Divider />

                      <Divider />
                    </Card.Content>
                  </Card>
                </ScrollView>
              ) : null}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  function dialogAddfavour() {
    return (
      <Portal>
        <Dialog visible={visible} style={{borderRadius: 10}}>
          <Dialog.Content>
            <Paragraph>
              ระบุชื่อรายการโปรดของคุณ เช่น พาคุณพ่อไปหาหมอ,พาคุณแม่โรงพยาบาล,
            </Paragraph>
            <TextInput
              label="ชื่อรายการโปรด"
              theme={{roundness: 5}}
              // keyboardType="numeric"
              maxLength={30}
              placeholder="ชื่อรายการโปรด"
              mode="outlined"
              style={
                {
                  // backgroundColor: 'transparent',
                  // fontSize:18
                }
              }
              // keyboardType={'numeric'}
              value={name}
              // error={!data.isValidUser && data.check_textInputChange}
              onChangeText={text => setNmae(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => hideDialog()}>ยกเลิก</Button>
            <Button onPress={() => addtoFavorite()}>ยืนยัน</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }

  function bottomAction() {
    return (
      <View>
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
            paddingHorizontal: 10,
          }}>
          <View>
            <Text>เพิ่มบันทึก</Text>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Loader visible={loader} />
      {modalTaxiCgCard()}
      {modalShare()}

      <Historystatus
        modalVisible={modalstatus}
        setModalVisible={setModalstatus}
        bookingnbr={trip.gmm_booking_nbr}
      />

      <ListCgComment
        modalVisible={modalCgcommentList}
        setModalVisible={setModalCgcommentList}
        booking={trip}
      />

      <AddCgComment
        modalVisible={modalCgComment}
        setModalVisible={setModalCgComment}
        booking={trip}
        loader={loader}
        setLoader={setLoader}
      />

      {/* {passengerProfile ? <View> {modalShare()}</View> : null} */}

      {dialogAddfavour()}

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <ViewShot
          ref={viewRef}
          style={{backgroundColor: 'rgb(232, 232, 232)'}}
          options={{format: 'jpg', quality: 0.5}}
          onCapture={onCapture}
          captureMode="mount">
          {etcCard()}
          {taxicgCard()}
          {/* {passengerProfile ? <View>{pasengerProfileCard()}</View> : null} */}
          {locationCard()}
          {hourseCard()}
        </ViewShot>

        {/* {trip.payment ? <View>{paymentCard()}</View> : null} */}

        {/* {bookingDetail()} */}
      </ScrollView>
      {/* {bottomAction()} */}
    </View>
  );
};

export default HistoryDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(232, 232, 232)',
    justifyContent: 'center',
  },
  logo: {
    resizeMode: 'stretch',
    height: 300,
    width: '100%',
  },
  borderGroup: {
    borderWidth: 1,
    padding: 10,
    borderColor: 'rgb(232, 232, 232)',
    marginBottom: 20,
    borderRadius: 5,
  },
  lineBreak: {
    marginVertical: 10,
    backgroundColor: 'rgb(232, 232, 232)',
    height: 1,
  },
  roundButton1: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#F7DC6F',
    textAlign: 'center',
  },
  roundButton1NoActive: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'rgb(232, 232, 232)',
    textAlign: 'center',
  },
  roundButton1Here: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#FFFF',
    borderColor: '#F7DC6F',
    borderWidth: 1,
    textAlign: 'center',
  },
  containerModal: {
    margin: 0,
    justifyContent: 'flex-start',
    backgroundColor: '#ffff',
  },
});
