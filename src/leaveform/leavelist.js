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
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import Geocoder from 'react-native-geocoding';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

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
  Searchbar,
  Divider,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import {url as urls} from '../center/url';
import Loader from '../center/Loader';
import {Dropdown} from 'react-native-material-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconMat from 'react-native-vector-icons/MaterialIcons';
import Dialogconfirm from '../center/Dialogconfirm';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import LottieView from 'lottie-react-native';

const url = urls.url;
const STORAGE_KEY = '@login';

const LeavelistScreen = ({navigation, route}) => {
  const {colors} = useTheme();

  const [data, setData] = useState({
    type: '',
    start: {date: '', datestr: ''},
    end: '',
    desc: '',
    period: '',
  });

  const [loader, setLoader] = useState(false);

  const [dataEdit, setDataEdit] = useState({
    status: '',
    leavenbr: '',
    type: '',
    start: {date: '', datestr: ''},
    end: '',
    desc: '',
  });

  const [typelist, setType] = useState([{name: '1'}, {name: '2'}]);
  const [leavePeriod, setLeavePeriod] = useState([]);

  const [list, setList] = useState([]);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisibleEnd, setDatePickerVisibilityEnd] = useState(false);

  const [EditisDatePickerVisible, setEditDatePickerVisibility] =
    useState(false);
  const [EditisDatePickerVisibleEnd, setEditDatePickerVisibilityEnd] =
    useState(false);

  const [modalAdd, setModaladd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);

  const calstrdate = date => {
    var date = new Date(date);

    console.log(date);
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);
    const monthNames = [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤศจิกายน',
      'ธันวาคม',
    ];

    return (
      date.getDate() +
      ' ' +
      monthNames[date.getMonth()] +
      ' ' +
      (Number(date.getFullYear()) + Number(543))
    );
  };

  const hideDatePickerEnd = () => {
    setDatePickerVisibilityEnd(false);
  };

  const dateConfirmEdit = date => {
    console.log('dd');
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);
    const monthNames = [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤศจิกายน',
      'ธันวาคม',
    ];

    // console.log(date.toISOString().split('T')[0])

    setDataEdit({
      ...dataEdit,
      start: {
        ...dataEdit.start,
        date: date.toISOString().split('T')[0],
        datestr:
          date.getDate() +
          ' ' +
          monthNames[date.getMonth()] +
          ' ' +
          (Number(date.getFullYear()) + Number(543)),
      },
      end: {
        date: '',
        str: '',
      },
    });

    // hideDatePicker();
  };

  const dateConfirmEndEdit = date => {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);
    const monthNames = [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤศจิกายน',
      'ธันวาคม',
    ];

    // console.log(date.toISOString().split('T')[0])

    setDataEdit({
      ...dataEdit,
      end: {
        ...dataEdit.end,
        date: date.toISOString().split('T')[0],
        datestr:
          date.getDate() +
          ' ' +
          monthNames[date.getMonth()] +
          ' ' +
          (Number(date.getFullYear()) + Number(543)),
      },
    });

    setEditDatePickerVisibility(false);
    // hideDatePicker();
  };

  /////////////////////

  const getLeavetype = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({key: 'leaveType'}),
    };

    fetch(url + 'leave.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log('response', response);

        if (response.status == true) {
          setType(response.data);
          setLeavePeriod(response.leavePeriod);
        } else {
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const insertLeave = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    if (data.type && data.start.date && data.end.date) {
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({key: 'insertLeave', user: loginUser, data: data}),
      };

      fetch(url + 'leave.php', requestOptions)
        .then(response => response.json())
        .then(response => {
          console.log('response', response);
          if (response.status == true) {
            setModaladd(false);
          } else {
          }
          getLeavemstr();
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      alert('ข้อมูลไม่ครบถ้วน');
    }
  };

  const editLeave = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    if (dataEdit.status == 'Pendding') {
      if (dataEdit.type && dataEdit.start.date && dataEdit.end.date) {
        const requestOptions = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            key: 'editLeave',
            user: loginUser,
            data: dataEdit,
          }),
        };

        console.log(requestOptions);

        fetch(url + 'leave.php', requestOptions)
          .then(response => response.json())
          .then(response => {
            console.log('response', response);
            if (response.status == true) {
              getLeavemstr();
              setModalEdit(false);
            } else {
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        alert('ข้อมูลไม่ครบถ้วน');
      }
    } else {
      alert('ไม่สามารถแก้ไขได้');
    }
  };

  const CancelLeave = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    if (dataEdit.status == 'Pendding') {
      if (dataEdit.type && dataEdit.start.date && dataEdit.end.date) {
        const requestOptions = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            key: 'CancelLeave',
            user: loginUser,
            data: dataEdit,
          }),
        };

        console.log(requestOptions);

        fetch(url + 'leave.php', requestOptions)
          .then(response => response.json())
          .then(response => {
            console.log('response', response);
            if (response.status == true) {
              getLeavemstr();
              setModalEdit(false);
            } else {
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        alert('ข้อมูลไม่ครบถ้วน');
      }
    } else {
      alert('ไม่สามารถแก้ไขได้');
    }
  };

  const getLeavemstr = async () => {
    // setLoader(true);
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({key: 'getLeavemstr', user: loginUser}),
    };

    fetch(url + 'leave.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log('response', response);
        setList(response.data);
        if (response.status == true) {
        } else {
        }

        setLoader(false);
      })
      .catch(error => {
        setLoader(false);

        console.log(error);
      });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getLeavetype();
      getLeavemstr();
      //Put your Data loading function here instead of my loadData()
    });

    return unsubscribe;
  }, [navigation]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          <TouchableRipple
            style={{marginRight: 20}}
            onPress={
              () => navigation.navigate('LeaveAddScreen')
              // setModaladd(true)
            }>
            <Icon name="plus" color="black" size={24} />
          </TouchableRipple>
        </View>
      ),
    });
  }, []);

  return (
    <View style={styles.container}>
      <Loader visible={loader} />

      <ScrollView>
        {list.map((item, key) => (
          <TouchableRipple
            key={key}
            onPress={() => {
              console.log(item);
              navigation.navigate('LeaveEditScreen', {leavenbr: item});
              // setDataEdit({
              //   status: item.gmm_leave_status,
              //   leavenbr: item.gmm_leave_id,
              //   type: item.gmm_leave_type,
              //   start: {
              //     date: item.gmm_leave_date,
              //     datestr: calstrdate(item.gmm_leave_date),
              //   },
              //   end: {
              //     date: item.gmm_leave_date_to,
              //     datestr: calstrdate(item.gmm_leave_date_to),
              //   },
              //   desc: item.gmm_leave_desc,
              // });

              // setModalEdit(true);
            }}>
            <View>
              <View style={{padding: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems:'center'
                  }}>
                  <View>
                    <Title>{item.gmm_leave_type}</Title>
                  </View>
                  <View>
                    <Text style={{color: item.color}}>
                      {item.gmm_leave_status_desc}
                    </Text>
                  </View>
                </View>
                <View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{color: 'gray'}}>วันที่ยื่นลา : </Text>
                    <Text>{item.gmm_leave_date_create_desc}</Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{color: 'gray'}}>วันที่ลา : </Text>
                    <Text>
                      {item.gmm_leave_date_desc} {item.gmm_leave_time} -{' '}
                      {item.gmm_leave_time_to}{' '}
                    </Text>
                  </View>
                </View>

                <View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{color: 'gray'}}>รายละเอียดการลา : </Text>
                    <Text>
                      {item.gmm_leave_desc ? item.gmm_leave_desc : '-'}
                    </Text>
                  </View>
                </View>

                <View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{color: 'gray'}}>รายละเอียดสถานะ : </Text>
                    <Text>
                      {item.gmm_leave_note ? item.gmm_leave_note : '-'}
                    </Text>
                  </View>
                </View>
              </View>
              <Divider />
            </View>
          </TouchableRipple>
        ))}
      </ScrollView>
    </View>
  );
};

export default LeavelistScreen;

const styles = StyleSheet.create({
  roundButton2: {
    // width: 40,
    // height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'white',
    textAlign: 'center',
  },
  containerModal: {
    margin: 0,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',

    // alignItems: 'center',
    // justifyContent: 'center',
    // width:'100%'
    // height:'100%'
  },
  mapContainer: {
    flex: 1,
    // height: '100%',
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
    // borderWidth: 1,
    // borderColor: 'white',
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
