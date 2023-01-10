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
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentSelect, setPaymentSelect] = useState({});
  const [paymentList, setPaymentList] = useState([]);
  const [paymentDetail, setPaymentDetail] = useState({total: 0});

  const monitor = async item => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;
    console.log(loginUser);

    // navigation.navigate('Tabmonitor', {bookingnbr: item.gmm_booking_nbr});
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
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        console.error(error);

        // console.log(error.toString());
      });
  };

  useEffect( () => {
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
          <Title>{item.gmm_booking_status_desc}</Title>
          <Text style={{color: 'gray', fontSize: 12}}>
          เลขที่การเดินทาง :{item.gmm_booking_nbr}
          </Text>
          <Text style={{color: 'gray', fontSize: 12}}>
            เลขที่การชำระเงิน : {item.gmm_booking_inv}
          </Text>

          <View style={{marginTop: 10}}>
            <Text style={{marginTop: 5}}>
              <Text style={{color: 'gray'}}>ผู้เดินทาง :</Text> :{' '}
              {item.gmm_passenger_fname} {item.gmm_passenger_lname}
            </Text>
            <Text style={{marginTop: 5}}>
              <Text style={{color: 'gray'}}>การเดินทาง :</Text> :{' '}
              {item.gmm_booking_product_name}
            </Text>

            <TouchableOpacity
              onPress={() => {
                let newArr = [...booklist];
                newArr[index].showDetail = !newArr[index].showDetail;
                setBooklist(newArr);
              }}>
              <Text style={{marginTop: 5}}>
                <Text style={{color: 'gray'}}>วันที่เดินทาง :</Text> :{' '}
                {item.monthdesc.monthdesc} {item.monthdesc.time}
              </Text>
            </TouchableOpacity>

            {item.showDetail ? (
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <View style={{flex: 2}}>
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
                      : {item.gmm_location_name}
                    </Text>
                  ))}
                </View>
              </View>
            ) : null}

            {/* <Text style={{marginTop: 5}}>
              การชำระเงิน : {item.payment.paymentType}
            </Text> */}
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
                onPress={() =>
                  navigation.navigate('Bookingdetail', {trip: item})
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
    <SafeAreaView style={[styles.container]}>
      <Loader visible={loader} />

      {booklist.length > 0 ? (
        <View>
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
    </SafeAreaView>
  );
};

export default Bookinglist;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    flex: 1,
    backgroundColor: 'rgb(232, 232, 232)',
    // alignItems: 'center',
    justifyContent: 'center',
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
