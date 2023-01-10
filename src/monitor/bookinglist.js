import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
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
  Divider,
  ActivityIndicator,
  Colors,
  TouchableRipple,
  Avatar,
  Badge,
} from 'react-native-paper';
import {url as urls} from '../center/url';
import Loader from '../center/Loader';
import {Dropdown} from 'react-native-material-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconMat from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Dialogconfirm from '../center/Dialogconfirm';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SplashScreen from 'react-native-splash-screen';
import Modal from 'react-native-modal';

import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';


import {NativeBaseProvider, extendTheme, ScrollView} from 'native-base';

const url = urls.url;

const STORAGE_KEY = '@login';
const TRIP_KEY = '@trip';

const Bookinglist = ({navigation}) => {
  const [isloading, setIsloading] = useState(true);
  const [booklist, setBooklist] = useState([]);
  const [loader, setLoader] = useState(false);

  const [bookingPending, setBookingPending] = useState();
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentSelect, setPaymentSelect] = useState({});
  const [paymentList, setPaymentList] = useState([]);
  const [paymentDetail, setPaymentDetail] = useState({total: 0});

  const [batterPermision, setbatterPermision] = useState(null);

  const monitor = async item => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    if (loginUser.gmm_emp_type == 'Taxi') {
      if (item.gmm_booking_status_onway) {
        navigation.navigate('Tabmonitor', {bookingnbr: item.gmm_booking_nbr});
      } else {
        setLoader(true);
        const login = await AsyncStorage.getItem(STORAGE_KEY);
        const loginUser = login ? JSON.parse(login) : undefined;
        const requestOptions = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            key: 'checkBookingOnway',
            user: loginUser,
          }),
        };

        fetch(url + 'monitor.php', requestOptions)
          .then(response => response.json())
          .then(response => {
            console.log(response);

            if (response.status == true) {
              Alert.alert(
                'แจ้งเตือน',
                'ไม่สามารถเริ่มงานได้ เนื่องจากมีรายการเดินทางที่ ' +
                  response.data.gmm_booking_nbr +
                  ' ดำเนินการอยู่...',
                [
                  {
                    text: 'ยกเลิก',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'ดำเนินการต่อ',
                    onPress: () =>
                      navigation.navigate('Tabmonitor', {
                        bookingnbr: response.data.gmm_booking_nbr,
                      }),
                  },
                ],
              );
            } else {
              navigation.navigate('Tabmonitor', {
                bookingnbr: item.gmm_booking_nbr,
              });
            }

            setLoader(false);
          })
          .catch(error => {
            console.log(error);
            setLoader(false);
          });
      }
    } else {
      if (item.gmm_booking_status_onway) {
        navigation.navigate('Tabmonitor', {bookingnbr: item.gmm_booking_nbr});
      } else {
        setLoader(true);
        const login = await AsyncStorage.getItem(STORAGE_KEY);
        const loginUser = login ? JSON.parse(login) : undefined;
        const requestOptions = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            key: 'checkBookingOnway',
            user: loginUser,
          }),
        };

        fetch(url + 'monitor.php', requestOptions)
          .then(response => response.json())
          .then(response => {
            console.log(response);

            if (response.status == true) {
              Alert.alert(
                'แจ้งเตือน',
                'ไม่สามารถเริ่มงานได้ เนื่องจากมีรายการเดินทางที่ ' +
                  response.data.gmm_booking_nbr +
                  ' ดำเนินการอยู่...',
                [
                  {
                    text: 'ยกเลิก',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'ดำเนินการต่อ',
                    onPress: () =>
                      navigation.navigate('TabmonitorCg', {
                        bookingnbr: response.data.gmm_booking_nbr,
                      }),
                  },
                ],
              );
            } else {
              navigation.navigate('TabmonitorCg', {
                bookingnbr: item.gmm_booking_nbr,
              });
            }

            setLoader(false);
          })
          .catch(error => {
            console.log(error);
            setLoader(false);
          });
      }
    }
    console.log(loginUser);
  };

  const detail = async item => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;
    // navigation.navigate('Bookingdetail', {trip: item});

    console.log(loginUser);
    console.log(item);
    if (loginUser.gmm_emp_type == 'Taxi') {
      navigation.navigate('Bookingdetail', {trip: item});
    } else {
      navigation.navigate('BookingdetailCg', {trip: item});
    }
  };

  const getbookingList = async () => {
    setLoader(true);
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    console.log(loginUser);

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'bookinglist',
        user: loginUser,
      }),
    };

    fetch(url + 'monitor.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setBooklist(response.data);

        setBookingPending(response.pending);

        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };
  const [user, setUser] = useState({});

  const myuser = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    setUser(loginUser);
  };





  useEffect( () => {
    myuser();
    getbookingList();

  }, []);

  const renderItem = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          marginVertical: 5,
          backgroundColor: '#FFFF',
          borderRadius: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 3,
        }}>
        <Divider />

        <View style={{padding: 20}}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                backgroundColor: item.status_color,
                width: 4,
              }}></View>
            <Title style={{marginLeft: 5, color: item.status_color}}>
              {''} {item.gmm_booking_status_desc}
            </Title>
          </View>

          <Text style={{color: 'gray', fontSize: 12}}>
            เลขที่การเดินทาง : {item.gmm_booking_nbr}
          </Text>

          <View style={{marginTop: 10}}>
            <Text style={{marginTop: 5}}>
              <Text style={{color: 'gray'}}>ผู้จอง :</Text>{' '}
              {item.gmm_user_fname} {item.gmm_user_lname} |{' '}
              {item.gmm_booking_product_name}
            </Text>
            <Text style={{marginTop: 5}}>
              <Text style={{color: 'gray'}}>ผู้โดยสาร :</Text>{' '}
              {item.gmm_passenger_fname} {item.gmm_passenger_lname}
            </Text>

            <TouchableOpacity
              onPress={() => {
                let newArr = [...booklist];
                newArr[index].showDetail = !newArr[index].showDetail;
                setBooklist(newArr);
              }}>
              <Text style={{marginTop: 5}}>
                <Text style={{color: 'gray'}}>นัดรับ :</Text>{' '}
                {user.gmm_emp_type == 'Taxi'
                  ? item.monthdesc.monthdesc + ' ' + item.monthdesc.time
                  : item.monthdescCg.monthdesc + ' ' + item.monthdescCg.time}
              </Text>
            </TouchableOpacity>

            {item.showDetail ? (
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <View style={{marginRight: 10}}>
                  <View>
                    {item.point.slice(0, 2).map((item, keys) => (
                      <View key={keys}>
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
                  {item.point.slice(0, 2).map((item, keyss) => (
                    <Text
                      key={keyss}
                      style={{height: 54, color: 'gray'}}
                      numberOfLines={2}>
                      <Text style={{color: '#FE7569'}}>
                        {item.gmm_location_route_name}
                      </Text>{' '}
                      : {item.gmm_location_address}
                    </Text>
                  ))}
                </View>
              </View>
            ) : null}

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#6699cc',
                  padding: 10,
                  borderRadius: 20,
                  position: 'absolute',
                  right: -40,
                  paddingRight: 40,
                }}
                onPress={
                  () => detail(item)
                  // navigation.navigate('Bookingdetail', {trip: item})
                }>
                <Text
                  style={{
                    marginTop: 5,
                    color: 'white',
                    textAlign: 'center',
                    marginLeft: 10,
                  }}>
                  ดูรายละเอียด
                </Text>
              </TouchableOpacity>
            </View>

            {item.gmm_booking_status == 'SUCCESS' ? (
              <View style={{marginTop: 50}}>
                <Button
                  mode="contained"
                  contentStyle={{height: 60}}
                  style={{
                    borderRadius: 10,
                    marginVertical: 10,
                    justifyContent: 'center',
                  }}
                  onPress={() => monitor(item)}>
                  {item.gmm_booking_status == 'SUCCESS' &&
                  item.gmm_booking_travel_status == null
                    ? 'เริ่มงาน'
                    : 'อัปเดทการเดินทาง'}
                </Button>
              </View>
            ) : (
              <View style={{marginTop: 50}}></View>
            )}
          </View>
        </View>

        <Divider />
      </View>
    );
  };

  return (
    <View style={[styles.container]}>
      <Loader visible={loader} />

      {/* {batterPermision ? (
        <TouchableOpacity onPress={() => runpower()}>
          <View
            style={{
              height: 80,
              backgroundColor: 'white',
              borderRadius: 15,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 20,
            }}>
            <View style={{flex: 8}}>
              <Text style={{fontSize: 18}}>การอนุญาติ</Text>
              <Text style={{color: 'green', fontSize: 12}}>
                อนุญาติให้เข้าถึงการใช้งานแบตเตอรี่แล้ว
              </Text>
            </View>

            <View style={{flex: 2, alignItems: 'center'}}>
              <Avatar.Icon
                size={40}
                icon="shield-check-outline"
                style={{backgroundColor: 'green'}}
              />
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => runpower()}>
          <View
            style={{
              height: 80,
              backgroundColor: 'white',
              borderRadius: 15,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 20,
            }}>
            <View style={{flex: 8}}>
              <Text style={{fontSize: 18}}>การอนุญาติ</Text>
              <Text style={{color: 'red', fontSize: 12}}>
                ยังไม่อนุญาติให้เข้าถึงการใช้งานแบตเตอรี่
              </Text>
            </View>

            <View style={{flex: 2, alignItems: 'center'}}>
              <Avatar.Icon
                size={40}
                icon="shield-alert-outline"
                style={{backgroundColor: 'red'}}
              />
            </View>
          </View>
        </TouchableOpacity>
      )} */}

      {booklist.length > 0 ? (
        <View style={{flex: 1}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={booklist}
            renderItem={renderItem}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
          />
        </View>
      ) : (
        <View style={{padding: 20, alignItems: 'center'}}>
          <Title>ยังไม่มีงาน</Title>
        </View>
      )}
    </View>
  );
};

export default Bookinglist;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    flex: 1,
    paddingTop: 10,
    backgroundColor: 'rgb(232, 232, 232)',
    // width:'100%'
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
  containerModal: {
    margin: 0,
    justifyContent: 'flex-start',
    backgroundColor: '#ffff',
  },
});
