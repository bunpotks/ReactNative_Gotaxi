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
  FlatList,
} from 'react-native';

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
import Dialogconfirm from '../center/Dialogconfirm';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {BottomSheet, ListItem} from 'react-native-elements';
import {useToast} from 'react-native-toast-notifications';

import PushNotification, {Importance} from 'react-native-push-notification';

import Modal from 'react-native-modal';
import {set} from 'react-native-reanimated';

const url = urls.url;
const STORAGE_KEY = '@login';

const Booking6 = ({navigation, route}) => {



  const [trip, setTrip] = React.useState(route.params.trip);
  // const [loader, setLoader] = useState(false);
  const [ready, setReady] = useState(false);



  const [coupon, setMycoupon] = useState([]);
  const [loading, setLoading] = useState(false);

  const [loader, setLoader] = useState(false);

  const [selectItem, setSelectItem] = useState({});

  const setPay = async () => {
    setTrip({
      ...trip,
      payment: {paymentType: 'PAY'},
      discountCode: {
        status: false,
        desc: null,
        disc: null,
      },
      totalprice:
        Number(trip.gmm_product_price) +
        Number(trip.hrleft) * Number(trip.gmm_product_tx_price_hour) +
        Number(trip.cghrleft) * Number(trip.gmm_product_cg_price_hour),
      netprice:
        Number(trip.gmm_product_price) +
        Number(trip.hrleft) * Number(trip.gmm_product_tx_price_hour) +
        Number(trip.cghrleft) * Number(trip.gmm_product_cg_price_hour),
    });
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          if (trip.gmm_product_id == item.tr_package_addr) {
            setTrip({...trip, package: item});
            setPackageModal(false);
          } else {
            alert('ไม่สามารถใช้คูปองนี้ได้');
          }
        }}
        style={{paddingHorizontal: 10}}>
        {trip.gmm_product_id == item.tr_package_addr ? (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              borderRadius: 5,
              padding: 10,
              justifyContent: 'space-around',
              marginVertical: 5,
              maxHeight: 120,
              height: 120,
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              //   shadowOpacity: 0.25,
              //   shadowRadius: 5,
              elevation: 3,
            }}>
            <View
              style={{
                flex: 5,
                backgroundColor: '#A7C7E7',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View>
                <Text style={{color: 'white'}}>{item.count} ใบ</Text>
              </View>
            </View>

            <View
              style={{flex: 10, padding: 10, justifyContent: 'space-between'}}>
              <View
                style={{
                  backgroundColor: 'rgba(247, 220, 111,0.5)',
                  borderRadius: 5,
                  padding: 5,
                }}>
                <Text numberOfLines={1}>{item.gmm_package_name} </Text>
              </View>

              <View>
                <Text numberOfLines={1}>ส่วนลด : {item.tr_package_name} </Text>
              </View>
              <View>
                <Text style={{color: 'gray', textAlign: 'right', fontSize: 12}}>
                  {/* หมดอายุวันที่ 28 มีนาคม{' '} */}
                  หมดอายุ{item.monthdesc.monthdesc} {item.monthdesc.time}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              borderRadius: 5,
              padding: 10,
              justifyContent: 'space-around',
              marginVertical: 5,
              maxHeight: 120,
              height: 120,
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              //   shadowOpacity: 0.25,
              //   shadowRadius: 5,
              elevation: 3,
            }}>
            <View
              style={{
                flex: 5,
                backgroundColor: '#D3D3D3',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  {item.count} ใบ
                </Text>
                <Text style={{color: 'white', textAlign: 'center'}}>
                  ไม่สามารถใช้งานได้
                </Text>
              </View>
            </View>

            <View
              style={{flex: 10, padding: 10, justifyContent: 'space-between'}}>
              <View
                style={{
                  backgroundColor: 'rgba(247, 220, 111,0.5)',
                  borderRadius: 5,
                  padding: 5,
                }}>
                <Text numberOfLines={1}>{item.gmm_package_name} </Text>
              </View>

              <View>
                <Text numberOfLines={1}>ส่วนลด : {item.tr_package_name} </Text>
              </View>
              <View>
                <Text style={{color: 'gray', textAlign: 'right', fontSize: 12}}>
                  {/* หมดอายุวันที่ 28 มีนาคม{' '} */}
                  หมดอายุ{item.monthdesc.monthdesc} {item.monthdesc.time}
                </Text>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  useEffect( () => {
     setPay();
  }, []);

  // console.log(trip);
  const toast = useToast();

  const [checked, setChecked] = React.useState(false);
  
  const [data, setData] = React.useState([
    {
      value: '1',
    },
    {
      value: '2',
    },
    {
      value: '3',
    },
    {
      value: '4',
    },
  ]);

  const [visible, setVisible] = useState(false);
  const [discountDialog, setDiscountDialog] = useState(false);

  const [couponCode, setCouponCode] = useState('');
  const [couponLoader, setCouponLoader] = useState(false);
  const [packageModal, setPackageModal] = useState(false);

  const [packageSelect, setPackageSelect] = useState({});

  const [packageList, setPackageList] = useState([
    {id: 'สุขสันต์วันแม่ฟรีการเดินทาง Go 1 เดินทางเที่ยวเดีว'},
    {id: 'สุขสันต์วันแม่ฟรีการเดินทาง Go 2 เดินทางไปกลับ'},
    {id: 'สุขสันต์วันแม่ฟรีการเดินทาง Go2+CG เดินทางไปกลับ+ผู้ดูแล'},
  ]);
  const [taxi, setTaxi] = useState([
    {title: 'บรรพต คล้ายศร', desc: 'สถานะ : ไม่ว่าง'},
    {title: 'สมชาย ใจดี', desc: 'สถานะ : ว่าง'},
  ]);

  const [value2, setValue2] = React.useState('first');

  const LeftContent = props => <Avatar.Icon {...props} icon="account" />;

  const expDatetrip = new Date(Date.now() + 60000 * 2 * 1);

  const expDatetripAlert = new Date(Date.now() + 60000 * 1 * 1);

  const setNoti = async myid => {
    // PushNotification.cancelAllLocalNotifications();

    PushNotification.localNotificationSchedule({
      /* Android Only Properties */
      channelId: 'NOTI-BOOKING', // (required) channelId, if the channel doesn't exist, notification will not trigger.
      largeIcon: 'ic_launcher', // (optional) default: "ic_launcher". Use "" for no large icon.
      smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
      // subText: "This is a subText", // (optional) default: none
      data: {route: 'Cart'},
      bigLargeIcon: 'ic_launcher', // (optional) default: undefined
      color: 'red', // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      tag: 'some_tag', // (optional) add tag to message
      ongoing: false, // (optional) set whether this is an "ongoing" notification
      priority: 'high', // (optional) set notification priority, default: high
      visibility: 'public', // (optional) set notification visibility, default: private
      ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
      shortcutId: 'shortcut-id', // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
      onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
      when: null, // (optional) Add a timestamp (Unix timestamp value in milliseconds) pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
      usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
      timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
      invokeApp: false, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
      /* iOS only properties */
      category: '', // (optional) default: empty string
      // subtitle: "My Notification Subtitle", // (optional) smaller title below notification title

      /* iOS and Android properties */
      id: myid,
      title: trip.gmm_product_name, // (optional)
      message:
        'ใกล้หมดเวลาชำระเงินแล้ว booking นี้จะหมดเวลาชำระเงินในอีก 1 ชั่วโมง', // (required)
      date: expDatetripAlert, // in 60 secs
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
      repeatTime: 1,
      playSound: false, // (optional) default: true
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      // number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    });

    PushNotification.getScheduledLocalNotifications(res => {
      console.log(res);
    });
  };

  const addTriptoCart = async () => {
    let key = '@trip';

    const cartdata = await AsyncStorage.getItem(key);
    const cartitem = cartdata ? JSON.parse(cartdata) : undefined;

    let carttrip = cartitem ? cartitem : [];
    let d1 = String(new Date().getTime());
    let d2 = d1.substring(0, d1.length - 3);
    // console.log(d1); // 1604898452084

    let trips = {...trip};

    trips.expdate = expDatetrip;
    trips.expid = d1;
    console.log(trips);
    carttrip.push(trips);

    AsyncStorage.setItem(key, JSON.stringify(carttrip));

    setNoti(d2);

    const updatecartdata = await AsyncStorage.getItem(key);
    const updateCart = updatecartdata ? JSON.parse(updatecartdata) : undefined;

    navigation.reset({
      index: 0,
      routes: [{name: 'Menu'}],
    });

    toast.show('สามารถชำระเงินได้จากตะกร้าของคุณ', {
      type: 'custom_toast',
      animationDuration: 500,
      duration: 4000,
      offset: 30,
      data: {
        title: 'เพิ่มรายการจองไปยังตระกร้าแล้ว',
      },
    });
  };

  const payment = async () => {
    let key = '@trip';

    const cartdata = await AsyncStorage.getItem(key);
    const cartitem = cartdata ? JSON.parse(cartdata) : undefined;
    let carttrip = cartitem ? cartitem : [];
    let trips = {...trip};
    let d1 = String(new Date().getTime());
    let d2 = d1.substring(0, d1.length - 3);
    trips.expdate = expDatetrip;
    trips.expid = d2;

    console.log(trips);
    carttrip.push(trips);

    AsyncStorage.setItem(key, JSON.stringify(carttrip));
    const updatecartdata = await AsyncStorage.getItem(key);
    const updateCart = updatecartdata ? JSON.parse(updatecartdata) : undefined;

    setNoti(d2);

    navigation.reset({
      index: 0,
      routes: [{name: 'Menu'}],
    });

    navigation.navigate('Cart');
  };

  function steper() {
    return (
      <Card style={{backgroundColor: '#FFC40C'}}>
        <Card.Content>
          <View
            style={{
              alignContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}>
            <View style={{flexDirection: 'row'}}>
              <View style={{alignItems: 'center', marginLeft: 40}}>
                <TouchableRipple
                  style={styles.roundButton1}
                  rippleColor="rgba(0, 0, 0, 0.1)">
                  <Text style={{fontSize: 14}}>1</Text>
                </TouchableRipple>
              </View>

              <View style={{justifyContent: 'center'}}>
                <FontAwesome
                  name="long-arrow-right"
                  size={26}
                  color="#F7DC6F"
                />
              </View>

              <View style={{alignItems: 'center', left: -8}}>
                <TouchableRipple
                  style={[styles.roundButton1]}
                  rippleColor="rgba(0, 0, 0, 0.1)">
                  <Text style={{fontSize: 14}}>2</Text>
                </TouchableRipple>
              </View>

              <View style={{justifyContent: 'center', left: -8}}>
                <FontAwesome
                  name="long-arrow-right"
                  size={26}
                  color="#F7DC6F"
                />
              </View>

              <View style={{alignItems: 'center', left: -16}}>
                <TouchableRipple
                  style={[styles.roundButton1]}
                  rippleColor="rgba(0, 0, 0, 0.1)">
                  <Text style={{fontSize: 14}}>3</Text>
                </TouchableRipple>
              </View>

              <View style={{justifyContent: 'center', left: -16}}>
                <FontAwesome
                  name="long-arrow-right"
                  size={26}
                  color="#F7DC6F"
                />
              </View>

              <View style={{alignItems: 'center', left: -24}}>
                <TouchableRipple
                  style={[styles.roundButton1]}
                  rippleColor="rgba(0, 0, 0, 0.1)">
                  <Text style={{fontSize: 14}}>4</Text>
                </TouchableRipple>
              </View>

              <View style={{justifyContent: 'center', left: -24}}>
                <FontAwesome
                  name="long-arrow-right"
                  size={26}
                  color="#F7DC6F"
                />
              </View>

              <View style={{alignItems: 'center', left: -32}}>
                <TouchableRipple
                  style={[styles.roundButton1Here]}
                  rippleColor="rgba(0, 0, 0, 0.1)">
                  <Text style={{fontSize: 14}}>5</Text>
                </TouchableRipple>
              </View>

              <View style={{justifyContent: 'center', left: -32}}>
                <FontAwesome
                  name="long-arrow-right"
                  size={26}
                  color="rgb(232, 232, 232)"
                />
              </View>

              <View style={{alignItems: 'center', left: -40}}>
                <TouchableRipple
                  style={[styles.roundButton1NoActive]}
                  rippleColor="rgba(0, 0, 0, 0.1)">
                  <Text style={{fontSize: 14}}>6</Text>
                </TouchableRipple>
              </View>
            </View>
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableRipple
              onPress={() => navigation.goBack()}
              style={{width: '10%'}}>
              <Icon
                name="chevron-left"
                size={30}
                color="black"
                rippleColor="rgba(0, 0, 0, 0.1)"
              />
            </TouchableRipple>
            <Title style={{textAlign: 'center'}}>สรุปการจอง</Title>

            <Title style={{textAlign: 'center', width: '10%'}}> </Title>
          </View>
        </Card.Content>
      </Card>
    );
  }

  function confirm() {
    return (
      <Portal>
        <Dialog
          style={{borderRadius: 10}}
          onDismiss={() => {
            setVisible(false);
          }}
          visible={visible}
          // dismissable={false}
        >
          <Dialog.Title>ยืนยันการชำระเงิน</Dialog.Title>
          <Dialog.Content>
            <Paragraph>คุณต้องการชำระเงินตอนนี้ใช่หรือไม่ ?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              color={Colors.grey500}
              onPress={() => {
                setVisible(false);
              }}>
              ยกเลิก
            </Button>
            <Button
              onPress={() => {
                setVisible(false);

                navigation.navigate('Payment');
              }}>
              ยืนยัน
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }

  function etcCard() {
    return (
      <Card
        style={{marginHorizontal: 10, marginVertical: 10, borderRadius: 10}}>
        <Card.Content>
          <Text style={{marginVertical: 10, color: 'gray'}}>
            รายละเอียดการเดินทาง
          </Text>

          <Title>{trip.gmm_product_name}</Title>
          <Paragraph style={{}}>{trip.gmm_product_message1}</Paragraph>

          <Divider style={{marginVertical: 10}} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <Text style={{textAlign: 'center', color: 'gray'}}>
              เดินทางวันที่
            </Text>
            <Text style={{textAlign: 'center', color: 'gray'}}>เวลา</Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{textAlign: 'center', fontSize: 18}}>
              {' '}
              {trip.date.datestr}
            </Text>
            <Text style={{textAlign: 'center', fontSize: 18}}>
              {trip.date.time}
            </Text>
          </View>
          {/* <Text style={{marginVertical: 10, color: 'gray'}}>
            วัน-เวลาเดินทาง
          </Text>
          <Text style={{fontSize: 18}}>
            {trip.date.datestr} {trip.date.time}
          </Text> */}
        </Card.Content>
      </Card>
    );
  }

  function taxicgCard() {
    return (
      <Card style={{marginHorizontal: 10, marginVertical: 5, borderRadius: 10}}>
        <Card.Content>
          <Text style={{color: 'gray'}}>ผู้โดยสาร</Text>
          <View>
            <List.Item
              onPress={() => setIsVisible(true)}
              title={
                trip.passengerSelect.gmm_passenger_fname +
                ' ' +
                trip.passengerSelect.gmm_passenger_lname
              }
              description={trip.passengerSelect.gmm_passenger_message}
              left={props => (
                <Avatar.Image
                  marginVertical={15}
                  size={30}
                  source={{
                    uri: 'https://image.flaticon.com/icons/png/512/2534/2534884.png',
                  }}
                />
              )}
            />
          </View>
          <Divider />

          <Text style={{marginTop: 10, color: 'gray'}}>คนขับรถ</Text>
          <View>
            <List.Item
              onPress={() => console.log('123')}
              title={
                trip.taxiSelect.gmm_emp_fname +
                ' ' +
                trip.taxiSelect.gmm_emp_lname
              }
              description={trip.taxiSelect.gmm_emp_licenseplate}
              // description="096-587-5547"
              left={props => (
                <Avatar.Image
                  marginVertical={15}
                  size={30}
                  source={{
                    uri: 'https://www.pngrepo.com/download/46892/taxi-driver.png',
                  }}
                />
              )}
            />
          </View>

          {trip.gmm_product_cg_radio == 'ON' ? (
            <View>
              <Text style={{color: 'gray'}}>ผู้ดูแล</Text>
              <View>
                <List.Item
                  onPress={() => console.log('123')}
                  title={
                    trip.cgSelect.gmm_emp_fname +
                    ' ' +
                    trip.cgSelect.gmm_emp_lname
                  }
                  // description={trip.taxiSelect.gmm_emp_licenseplate}
                  left={props => (
                    <Avatar.Image
                      marginVertical={15}
                      size={30}
                      source={{
                        uri: 'https://image.flaticon.com/icons/png/512/119/119044.png',
                      }}
                    />
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
            <View style={{flex: 2}}>
              <View>
                {trip.point.map((item, key) => (
                  <View key={key}>
                    <Icon
                      name="map-marker"
                      size={26}
                      color="#FE7569"
                      style={{marginLeft: 5}}
                    />

                    <MaterialIcons
                      name="more-vert"
                      size={26}
                      color="rgb(232, 232, 232)"
                      style={{marginLeft: 5}}
                    />
                  </View>
                ))}
              </View>
            </View>

            <View style={{flex: 12}}>
              {trip.point.map((item, key) => (
                <Text
                  key={key}
                  style={{height: 54, color: 'gray'}}
                  numberOfLines={2}>
                  <Text style={{color: '#FE7569'}}>{item.name}</Text> :{' '}
                  {item.location.location_name}
                </Text>
              ))}

              {/* <Text style={{height: 54, color: 'gray'}} numberOfLines={2}>
                <Text style={{color: '#FE7569'}}>จุดรับ</Text> : 378/270 ถนน
                รัชดาภิเษก ซอย รัชดาภิเษก 16
              </Text>
              <Text style={{height: 54, color: 'gray'}} numberOfLines={2}>
                <Text style={{color: '#FE7569'}}>จุดส่ง</Text> :
                โรงพยาบาลเลิดสิน
              </Text>
              <Text style={{height: 54, color: 'gray'}} numberOfLines={2}>
                <Text style={{color: '#FE7569'}}>จุดรับกลับ</Text> : 378/270 ถนน
                รัชดาภิเษก ซอย รัชดาภิเษก 16 กรุงเทพ 378/270 ถนน รัชดาภิเษก ซอย
                รัชดาภิเษก 16 กรุงเทพ
              </Text> */}
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
            คนขับรถ : {trip.hrleft > 0 ? trip.hrleft + ' ชั่วโมง' : '-'}{' '}
          </Text>

          {trip.gmm_product_cg_radio == 'ON' ? (
            <Text style={{color: 'gray'}}>
              ผู้ดูแล : {trip.cghrleft > 0 ? trip.cghrleft + ' ชั่วโมง' : '-'}{' '}
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
              {trip.etcData.Follower > 0
                ? trip.etcData.Follower + ' คน'
                : '-'}{' '}
            </Paragraph>
          </Text>
          <Text style={{color: 'gray'}}>
            อุปกรณ์ที่นำไปด้วย : <Paragraph>{trip.etcData.equipment}</Paragraph>
          </Text>
          <Text style={{color: 'gray'}}>
            รายละเอีดเพิ่มเติม :{' '}
            <Paragraph>
              {trip.etcData.remark ? trip.etcData.remark : '-'}
            </Paragraph>
          </Text>
        </Card.Content>
      </Card>
    );
  }

  function bookingDetail() {
    return (
      <Card style={{marginTop: 5}}>
        <Card.Content style={{paddingVertical: 10}}>
          <Text style={{marginTop: 10}}>รายละเอียดการบริการ</Text>
        </Card.Content>
        <Divider />
        <Card.Content style={{paddingVertical: 10}}>
          <View style={{padding: 5}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{width: '60%', color: 'gray'}}>
                {trip.gmm_product_name} {trip.gmm_product_desc}
              </Text>

              <Text style={{width: '10%', textAlign: 'right'}}>x1</Text>

              <Text style={{width: '30%', textAlign: 'right'}}>
                {trip.gmm_product_price}
              </Text>
            </View>
          </View>

          {trip.gmm_product_cg_radio == 'ON' ? (
            <View>
              {trip.cghrleft > 0 ? (
                <View style={{padding: 5}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{width: '60%', color: 'gray'}}>
                      เพิ่มชั่วโมงการรอ (CG) (1 ชั่วโมง)
                    </Text>

                    <Text style={{width: '10%', textAlign: 'right'}}>
                      x{trip.cghrleft}
                    </Text>

                    <Text style={{width: '30%', textAlign: 'right'}}>
                      {trip.gmm_product_cg_price_hour}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          ) : null}

          {trip.hrleft > 0 ? (
            <View style={{padding: 5}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{width: '60%', color: 'gray'}}>
                  เพิ่มชั่วโมงการรอ (Taxi) (1 ชั่วโมง)
                </Text>

                <Text style={{width: '10%', textAlign: 'right'}}>
                  x{trip.hrleft}
                </Text>

                <Text style={{width: '30%', textAlign: 'right'}}>
                  {trip.gmm_product_tx_price_hour}
                </Text>
              </View>
            </View>
          ) : null}

          <Divider />
        </Card.Content>

        <Card.Content style={{paddingVertical: 10}}>
          <View style={{padding: 5}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{width: '70%', textAlign: 'right'}}>
                รวมก่อนหักส่วนลด
              </Text>

              <Text style={{width: '30%', textAlign: 'right'}}>
                {' '}
                {trip.totalprice}
              </Text>
            </View>
            {trip.discountCode ? (
              <View>
                {trip.discountCode.status == true ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{width: '70%', color: 'gray', textAlign: 'right'}}>
                      ส่วนลดคูปอง
                    </Text>

                    <Text style={{width: '30%', textAlign: 'right'}}>
                      {trip.discountCode.disc}
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : null}

            {trip.package ? (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{width: '70%', color: 'gray', textAlign: 'right'}}>
                    ส่วนลดคูปองการเดินทาง
                  </Text>

                  <Text style={{width: '30%', textAlign: 'right'}}>
                    {trip.package.discamt}
                  </Text>
                </View>
              </View>
            ) : null}

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{width: '70%', color: 'gray', textAlign: 'right'}}>
                ส่วนลดโปรโมชั่น
              </Text>

              <Text style={{width: '30%', textAlign: 'right'}}>0</Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{width: '70%', color: 'gray', textAlign: 'right'}}>
                ส่วนลดสมาชิก
              </Text>

              <Text style={{width: '30%', textAlign: 'right'}}>0</Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{width: '70%', textAlign: 'right'}}>
                รวมหลังหักส่วนลด
              </Text>

              <Text style={{width: '30%', textAlign: 'right'}}>
                {' '}
                {trip.netprice}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  }

  const getCoupon = async value => {
    setLoader(true);
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({key: 'getCoupon', user: loginUser}),
    };

    fetch(url + 'coupon.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setLoader(false);
        if (response.status == true) {
          setMycoupon(response.data);
          let useIndex;

          for (let i = 0; i < response.data.length; i++) {
            console.log('loop');

            if (response.data[i].tr_package_addr == trip.gmm_product_id) {
              useIndex = i;
              break;
            } else {
              // alert('ขออภัยคุณไม่มีคูปองที่สามารถใช้ได้');
            }
          }

          console.log(useIndex);

          if (useIndex != undefined) {
            setTrip({
              ...trip,
              payment: {...trip.payment, paymentType: value},
              package: response.data[useIndex],
            });
          } else {
            alert('ขออภัยคุณไม่มีคูปองที่สามารถใช้ได้555');
          }
        } else {
          alert('ขออภัยคุณไม่มีคูปองที่สามารถใช้ได้');
          setMycoupon([]);
        }
      })
      .catch(error => {
        setLoading(false);

        // console.log(error);
      });
  };

  const selectCouopn = e => {
    // alert(trip)
  };

  const payTypeChange = value => {
    // console.log(trip);

    let newArr = {...trip};

    newArr.discountCode = {
      status: false,
      desc: null,
      disc: null,
    };
    newArr.package = {};
    newArr.netprice = trip.totalprice;

    if (value == 'COUPON') {
      getCoupon(value);
    } else if (value == 'PAY') {
      newArr.payment.paymentType = value;
    }

    setTrip(newArr);
  };

  const checkDiscount = () => {
    setLoader(true);

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'checkCouponCode',
        code: couponCode,
        product: trip.gmm_product_id,
      }),
    };

    fetch(url + 'booking.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        setLoader(false);

        console.log('coupon', response);
        if (response.status == true) {
          let netprice = 0;
          let disccount = 0;
          if (response.data.gmm_coupon_discount_bath > 0) {
            netprice =
              trip.totalprice - Number(response.data.gmm_coupon_discount_bath);
            disccount = Number(response.data.gmm_coupon_discount_bath);
          } else {
            netprice =
              trip.totalprice -
              (Number(trip.totalprice) *
                Number(response.data.gmm_coupon_discount_percent)) /
                100;

            disccount =
              (Number(trip.totalprice) *
                Number(response.data.gmm_coupon_discount_percent)) /
              100;
          }

          setTrip({
            ...trip,
            discountCode: {
              status: true,
              coupon_id: response.data.gmm_coupon_id,
              coupon_code: response.data.gmm_coupon_code,
              desc: response.data.gmm_coupon_name,
              disc: disccount,
              bath: response.data.gmm_coupon_discount_bath,
              percent: response.data.gmm_coupon_discount_percent,
            },
            netprice: netprice,
          });
        } else {
          setTrip({
            ...trip,
            discountCode: {
              status: 'NOTFOUND',
              desc: response.data.gmm_coupon_name,
            },
          });
        }
      })
      .catch(error => {
        setLoader(false);
        console.log(error);
      });
  };

  function paymentCard() {
    return (
      <Card style={{marginTop: 5}}>
        <Card.Content style={{paddingVertical: 10}}>
          <Text style={{marginTop: 10}}>วิธีการชำระเงิน</Text>
        </Card.Content>
        <Divider />
        <Card.Content style={{paddingVertical: 10}}>
          <View>
            {/* <List.Section title="With RadioButton.Item"> */}
            <RadioButton.Group
              value={trip.payment.paymentType}
              onValueChange={value => payTypeChange(value)}>
              <RadioButton.Item color="#FFC40C" label="ชำระเอง" value="PAY" />
              {trip.payment.paymentType == 'PAY' ? (
                <View style={{paddingHorizontal: 15, paddingBottom: 10}}>
                  {/* <Icon  color="gray" size={14} name="ticket-confirmation-outline" /> */}

                  <View style={{flexDirection: 'row'}}>
                    <TextInput
                      label="รหัสคูปองส่วนลด"
                      theme={{roundness: 10}}
                      maxLength={10}
                      placeholder="รหัสคูปองส่วนลด"
                      mode="outlined"
                      left={
                        <TextInput.Icon
                          color="gray"
                          size={14}
                          name="ticket-confirmation-outline"
                        />
                      }
                      style={{
                        // height: 100,
                        // height:50,
                        flex: 12,
                        color: 'gray',
                        paddingVertical: 0,
                      }}
                      dense={true}
                      value={couponCode}
                      onChangeText={text => setCouponCode(text.toUpperCase())}
                    />
                    <Button
                      style={{alignSelf: 'center', marginLeft: 5}}
                      labelStyle={{fontSize: 12}}
                      onPress={checkDiscount}>
                      ใช้คูปอง
                    </Button>
                  </View>

                  {trip.discountCode ? (
                    <View>
                      {trip.discountCode.status == true ? (
                        <Text style={{color: 'green', padding: 5}}>
                          <Icon
                            color="green"
                            size={14}
                            name="ticket-confirmation-outline"
                          />{' '}
                          {trip.discountCode.desc}
                        </Text>
                      ) : trip.discountCode.status == 'NOTFOUND' ? (
                        <Text style={{color: 'red', padding: 5}}>
                          {trip.discountCode.desc}
                        </Text>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              ) : null}
              <Divider />
              <RadioButton.Item color="#FFC40C" label="คูปอง" value="COUPON" />
              <Divider />
            </RadioButton.Group>
            {/* </List.Section> */}
          </View>
          {trip.payment.paymentType == 'COUPON' ? (
            <TouchableOpacity onPress={() => setPackageModal(true)}>
              <View
                style={{
                  paddingLeft: 20,
                  paddingVertical: 5,
                  // backgroundColor: '#ADD8E6',
                  borderRadius: 5,
                }}>
                {/* <Text>{JSON.stringify(trip.package)}</Text> */}
                {trip.package ? (
                  <View
                    style={{
                      paddingVertical: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <View style={{flexDirection: 'row', flex: 1}}>
                      <Icon
                        name="ticket-confirmation-outline"
                        size={24}
                        color="green"
                      />
                      <View>
                        <Text
                          style={{marginLeft: 5, color: 'gray', fontSize: 12}}>
                          {trip.package.gmm_package_name}
                          <View>
                            <Text
                              style={{
                                backgroundColor: '#F7DC6F',
                                padding: 10,
                                borderRadius: 10,
                                fontSize: 12,
                                color: 'white',
                              }}>
                              ฟรี {trip.package.tr_package_name}{' '}
                            </Text>
                          </View>
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                      }}>
                      <Text style={{color: '#2980B9'}}>เลือกคูปอง</Text>
                    </View>
                  </View>
                ) : null}

                {/* <List.Item
                  title={
                    Object.keys(trip.package).length !== 0 ? '' : 'เลือกคูปอง'
                  }
                  description={trip.package.gmm_package_name}
                  right={props => (
                    <List.Icon {...props} icon="ticket-confirmation-outline" />
                  )}
                /> */}
              </View>
            </TouchableOpacity>
          ) : null}
        </Card.Content>
      </Card>
    );
  }

  function packageModalScreen() {
    return (
      <Modal
        isVisible={packageModal}
        animationInTiming={700}
        animationOutTiming={700}
        style={[styles.containerModal, {padding: 20}]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 30}}>คูปอง</Text>
          <TouchableOpacity
            onPress={() => {
              setPackageModal(false);
            }}>
            <Avatar.Icon
              size={50}
              style={{backgroundColor: 'white'}}
              icon="close"
            />
          </TouchableOpacity>
        </View>
        {/* <Divider /> */}
        {/* <Text>{JSON.stringify(coupon)}</Text> */}

        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={coupon}
          renderItem={renderItem}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
        />
      </Modal>
    );
  }

  function bottomAction() {
    return (
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
          padding: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',

            justifyContent: 'space-between',
            paddingHorizontal: 5,
          }}>
          <View>
            <Title style={{color: 'gray'}}>รวมทั้งสิ้น</Title>
          </View>

          <View>
            <Title> ฿{trip.netprice}</Title>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',

            justifyContent: 'space-between',
          }}>
          <Button
            mode="outlined"
            style={{
              borderColor: '#FFC40C',
              flex: 1,
              margin: 5,
              borderRadius: 10,
            }}
            onPress={() => {
              addTriptoCart();
            }}>
            เพิ่มลงตะกร้า
          </Button>

          <Button
            mode="contained"
            style={{
              flex: 1,
              margin: 5,
              borderRadius: 10,
              // marginBottom: 20,
            }}
            onPress={() => {
              payment();

              // setVisible(true);
            }}>
            ชำระเงิน
          </Button>
        </View>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <Loader visible={loader} />

      {confirm()}
      {steper()}

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {etcCard()}
        {taxicgCard()}
        {locationCard()}
        {hourseCard()}

        {packageModalScreen()}

        {trip.payment ? <View>{paymentCard()}</View> : null}

        {bookingDetail()}
      </ScrollView>
      {bottomAction()}
    </View>
  );
};

export default Booking6;

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 0,
    flex: 1,
    backgroundColor: 'rgb(232, 232, 232)',
    // alignItems: 'center',
    justifyContent: 'center',
    // width:'100%'
    // height:'200%'
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
