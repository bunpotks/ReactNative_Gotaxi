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
} from 'react-native';

import {Select, VStack, CheckIcon} from 'native-base';

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
} from 'react-native-paper';
import {url as urls} from '../center/url';
import Loader from '../center/Loader';
import {Dropdown} from 'react-native-material-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconMat from 'react-native-vector-icons/MaterialIcons';
import Dialogconfirm from '../center/Dialogconfirm';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const url = urls.url;
const STORAGE_KEY = '@login';

const Booking5 = ({navigation, route}) => {
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

  const [equipment, setEquipment] = React.useState([
    {
      value: 'ไม้เท้า',
    },
    {
      value: 'เครื่องช่วยพยุง',
    },
    {
      value: 'อื่นๆ',
    },
  ]);

  const [loader, setLoader] = useState(false);

  const [trip, setTrip] = React.useState(route.params.trip);
  console.log(trip);

  const [passenger, setPassenger] = useState({});
  const [loading, setLoading] = useState(true);

  const [etcData, setEtcData] = useState({
    Follower: '0',
    equipment: 'ไม่มีอุปกรณ์',
    remark: '',
  });

  const getpassengerByid = async () => {
    setLoading(true);
    setLoader(true);
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'getpassengerByid',
        passengerid: trip.passengerSelect,
        user: loginUser,
      }),
    };

    fetch(url + 'booking.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        setLoading(false);
        setLoader(false);

        console.log('passenger', response);

        console.log(trip);
        if (response.status == true) {
          setPassenger(response.data);
          setEquipment(response.equipment);
          setData(response.follower);
        } else {
        }
      })
      .catch(error => {
        setLoader(false);

        setLoading(false);

        console.log(error);
        // setLoader(false);

        // alert(error.message);
      });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getpassengerByid();
      //Put your Data loading function here instead of my loadData()
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (trip.etcData) {
      setEtcData(trip.etcData);
    }
  }, [trip.etcData]);

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
                  style={[styles.roundButton1Here]}
                  rippleColor="rgba(0, 0, 0, 0.1)">
                  <Text style={{fontSize: 14}}>4</Text>
                </TouchableRipple>
              </View>

              <View style={{justifyContent: 'center', left: -24}}>
                <FontAwesome
                  name="long-arrow-right"
                  size={26}
                  color="rgb(232, 232, 232)"
                />
              </View>

              <View style={{alignItems: 'center', left: -32}}>
                <TouchableRipple
                  style={[styles.roundButton1NoActive]}
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
            <Title style={{textAlign: 'center'}}>รายละเอียดเพิ่มเติม</Title>

            <Title style={{textAlign: 'center', width: '10%'}}> </Title>
          </View>
        </Card.Content>
      </Card>
    );
  }

  function etcCard() {
    return (
      <Card style={{marginTop: 10}}>
        <Card.Content>
          <View>
            <View style={{alignItems: 'flex-end'}}>
              <Text>อัพเดทข้อมูลผู้โดยสาร</Text>
            </View>
            <Divider />

            <List.Item
              onPress={() =>
                navigation.navigate('Editpassenger', {
                  pid: passenger.gmm_passenger_id,
                })
              }
              title={
                passenger.gmm_passenger_fname +
                ' ' +
                passenger.gmm_passenger_lname
              }
              description={passenger.gmm_passenger_message}
              left={props => (
                <Avatar.Image
                  marginVertical={15}
                  size={40}
                  source={{
                    uri: 'https://image.flaticon.com/icons/png/512/2534/2534884.png',
                  }}
                />
              )}
            />
          </View>
          <Divider />

          {/* <Dropdown
            label="ผู้ติดตามไปด้วย *"
            value={etcData.Follower}
            data={data}
            // valueExtractor={({value}) => value}
            // labelExtractor={({label}) => label}
            dropdownMargins={{min: 16, max: 16}}
            itemPadding={10}
            onChangeText={(value, index, e) => {
              setEtcData({
                ...etcData,
                Follower: value,
              });
            }}
          /> */}
          <Text style={{marginTop: 10, color: 'gray'}}>ผู้ติดตามไปด้วย *</Text>

          <VStack alignItems="center" space={1}>
            <Select
              selectedValue={etcData.Follower}
              minWidth="100%"
              fontSize="14"
              padding="3"
              accessibilityLabel="ผู้ติดตามไปด้วย "
              placeholder="ผู้ติดตามไปด้วย *"
              _selectedItem={{
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={itemValue => {
                console.log(itemValue);
                setEtcData({
                  ...etcData,
                  Follower: itemValue,
                });
              }}>
              {data.map((item, key) => (
                <Select.Item key={key} label={item.label} value={item.value} />
              ))}
            </Select>
          </VStack>

          <Text style={{marginTop: 10, color: 'gray'}}>
            อุปกรณ์ที่นำไปด้วย *
          </Text>

          <VStack alignItems="center" space={1}>
            <Select
              selectedValue={etcData.equipment}
              minWidth="100%"
              fontSize="14"
              padding="3"
              accessibilityLabel="อุปกรณ์ที่นำไปด้วย "
              placeholder="อุปกรณ์ที่นำไปด้วย *"
              _selectedItem={{
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={itemValue =>
                setEtcData({
                  ...etcData,
                  equipment: itemValue,
                })
              }>
              {equipment.map((item, key) => (
                <Select.Item key={key} label={item.label} value={item.label} />
              ))}
            </Select>
          </VStack>

          {/* <Dropdown
            label="อุปกรณ์นำไปด้วย"
            value={etcData.equipment}
            data={equipment}
            labelExtractor={({label}) => label}
            dropdownMargins={{min: 16, max: 16}}
            itemPadding={10}
            onChangeText={(value, index, e) => {
              console.log(e);
              setEtcData({
                ...etcData,
                equipment: e[index].label,
              });
            }}
          /> */}

          <TextInput
            label="ข้อมูลอื่นๆที่ต้องการแจ้งผู้บริการในการเดินทางครั้งนี้)"
            theme={{roundness: 10}}
            maxLength={255}
            multiline={true}
            placeholder="ข้อมูลอื่นๆที่ต้องการแจ้งผู้บริการในการเดินทางครั้งนี้"
            mode="outlined"
            value={etcData.remark}
            onChangeText={text => {
              setEtcData({...etcData, remark: text});
            }}
            numberOfLines={5}
            style={
              {
                // height: 200,
                // backgroundColor: 'transparent',
                // backgroundColor: 'none',
              }
            }
          />
        </Card.Content>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <Loader visible={loader} />

      {steper()}
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {!loading ? (
          <View>
            {etcCard()}

            <Card
              style={{
                padding: 10,
              }}>
              <Button
                mode="contained"
                contentStyle={{height: 60}}
                style={{
                  borderRadius: 10,
                  justifyContent: 'center',
                }}
                onPress={() => {
                  let latesttrip = {...trip};
                  latesttrip['etcData'] = etcData;
                  latesttrip['passengerSelect'] = passenger;
                  navigation.navigate('Booking6', {trip: latesttrip});
                }}>
                สรุปการจอง
              </Button>
            </Card>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default Booking5;

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 0,
    flex: 1,
    backgroundColor: '#FFFF',
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
});
