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

import BookingDetail from '../monitor/bookingdetail';

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
import Monitor from './Monitor';
import {style} from 'dom-helpers';

const url = urls.url;
const STORAGE_KEY = '@login';





const MonitorDetail = ({navigation, route}) => {
  const [trip, setTrip] = React.useState();
  const [loader, setLoader] = React.useState(false);

  const getbooking = async () => {
    setLoader(true);
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    console.log(loginUser);

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'getbooking',
        user: loginUser,
        bookingnbr: route.params.bookingnbr,
      }),
    };

    fetch(url + 'monitor.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log('resss' + response.data);
        setTrip(response.data);
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
        console.error(error);

      });
  };

  useEffect(() => {
    getbooking();
  }, []);


  function etcCard() {
    return (
      <Card
        style={{marginHorizontal: 10, marginVertical: 10, borderRadius: 10}}>
        <Card.Content>
          <Text style={{marginVertical: 10, color: 'gray'}}>
            รายละเอียดการเดินทาง
          </Text>

          <Title>{trip.gmm_booking_product_name}</Title>
          <Paragraph style={{}}>{trip.gmm_booking_product_name}</Paragraph>

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
              {trip.monthdesc.monthdesc}
            </Text>
            <Text style={{textAlign: 'center', fontSize: 18}}>
              {trip.monthdesc.time}
            </Text>
          </View>
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
              onPress={() => console.log(123)}
              title={trip.gmm_passenger_fname + ' ' + trip.gmm_passenger_lname}
              description={
                trip.gmm_passenger_fname + ' ' + trip.gmm_passenger_lname
              }
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
              title={trip.taxi_fname + ' ' + trip.taxi_lname}
              description={trip.taxi_licenseplate}
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
                  title={trip.taxi_fname + ' ' + trip.taxi_lname}
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

  function profilePassenger() {
    return (
      <Card style={{marginHorizontal: 10, marginVertical: 5, borderRadius: 10}}>
        <Card.Content>
          <Text style={{color: 'gray'}}>ผู้โดยสาร</Text>
          <View>
            <List.Item
              onPress={() => console.log(123)}
              title={trip.gmm_passenger_fname + ' ' + trip.gmm_passenger_lname}
              description={
                trip.gmm_passenger_fname + ' ' + trip.gmm_passenger_lname
              }
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
              title={trip.taxi_fname + ' ' + trip.taxi_lname}
              description={trip.taxi_licenseplate}
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
                  title={trip.taxi_fname + ' ' + trip.taxi_lname}
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
                  <Text style={{color: '#FE7569'}}>
                    {item.gmm_location_route_name}
                  </Text>{' '}
                  : {item.gmm_location_name}
                </Text>
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
            รายละเอีดเพิ่มเติม :{' '}
            <Paragraph>
              {trip.gmm_booking_rmks_desc ? trip.gmm_booking_rmks_desc : '-'}
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
                {trip.gmm_booking_product_name}
              </Text>

              <Text style={{width: '10%', textAlign: 'right'}}>x1</Text>

              <Text style={{width: '30%', textAlign: 'right'}}>
                {trip.gmm_booking_product_price}
              </Text>
            </View>
          </View>

          {trip.gmm_booking_taxi_hradd > 0 ? (
            <View style={{padding: 5}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{width: '60%', color: 'gray'}}>
                  เพิ่มชั่วโมงการรอ
                </Text>

                <Text style={{width: '10%', textAlign: 'right'}}>
                  x{trip.gmm_booking_taxi_hradd}
                </Text>

                <Text style={{width: '30%', textAlign: 'right'}}>200</Text>
              </View>
            </View>
          ) : null}

          <Divider />
        </Card.Content>

        <Card.Content style={{paddingVertical: 10}}>
          <View style={{padding: 5}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{width: '70%', color: 'gray', textAlign: 'right'}}>
                ส่วนลดคูปอง
              </Text>

              <Text style={{width: '30%', textAlign: 'right'}}>0</Text>
            </View>

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
                รวมทั้งสิ้น
              </Text>

              <Text style={{width: '30%', textAlign: 'right'}}>
                {' '}
                {trip.gmm_product_price}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  }

  function paymentCard() {
    return (
      <Card style={{marginTop: 5}}>
        <Card.Content style={{paddingVertical: 10}}>
          <Text style={{marginTop: 10}}>วิธีการชำระเงิน</Text>
        </Card.Content>
        <Divider />
        <Card.Content style={{paddingVertical: 10}}>
          <View>
            <RadioButton.Group
              value={trip.payment.paymentType}
              onValueChange={value =>
                setTrip({
                  ...trip,
                  payment: {...trip.payment, paymentType: value},
                })
              }>
              {trip.payment.paymentType == 'PAY' ? (
                <View style={{paddingHorizontal: 15, paddingBottom: 10}}>
                  <Text>ชำระเอง</Text>

                  <View style={{flexDirection: 'row', marginVertical: 10}}>
                    <Text style={{paddingHorizontal: 10}}>
                      <Icon
                        color="#FFC40C"
                        size={16}
                        name="ticket-confirmation-outline"
                      />{' '}
                      คูปองส่วนลด 20% สุขสันต์วันเกิด
                    </Text>
                  </View>
                </View>
              ) : null}
            </RadioButton.Group>
          </View>
          {trip.payment.paymentType == 'COUPON' ? (
            <View style={{paddingHorizontal: 15, paddingBottom: 10}}>
              <Text>คูปอง</Text>
              <View style={{flexDirection: 'row', marginVertical: 10}}>
                <Text style={{paddingHorizontal: 10}}>
                  <Icon
                    color="#FFC40C"
                    size={16}
                    name="ticket-confirmation-outline"
                  />{' '}
                  คูปองวันแม่ฟรีการเดินทาง Go1
                </Text>
              </View>
            </View>
          ) : null}
        </Card.Content>
      </Card>
    );
  }

  function bottomAction() {
    return (
      <View>
        <Divider />

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
              <Title style={{color: 'gray'}}>รวม</Title>
            </View>

            <View>
              <Title> ฿{trip.gmm_booking_product_price}.00</Title>
            </View>
          </View>
        </Card>
      </View>
    );
  }

  function sosCard() {
    return (
      <Card>
        <Divider />
        <Card.Content style={{paddingVertical: 10}}>
          <Text style={{marginTop: 10}}>เหตุฉุกเฉิน</Text>
        </Card.Content>
        <Divider />
        <Card.Content>
          <Button
            color="red"
            mode="contained"
            contentStyle={{height: 60}}
            labelStyle={{fontSize: 30}}
            style={{
              borderRadius: 10,
              marginVertical: 10,
              justifyContent: 'center',
            }}
            onPress={() => alert('SOS')}>
            SOS
          </Button>
        </Card.Content>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      {trip ? (
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
              {trip? (
                <BookingDetail route={{params:{trip:trip}}}/>
              ):null}
              
           
          </ScrollView>
          {/* {sosCard()} */}

        </View>
      ) : null}
    </View>
  );
};

export default MonitorDetail;

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
