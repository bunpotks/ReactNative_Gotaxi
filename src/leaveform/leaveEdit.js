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

const LeaveEditScreen = ({navigation, route}) => {
  const {colors} = useTheme();

  const [typelist, setType] = useState([{name: '1'}, {name: '2'}]);
  const [loader, setLoader] = useState(false);
  const {leavenbr} = route.params;

  const [eanableTime, setEanableTime] = useState({start: false, end: false});

  const [leavePeriod, setLeavePeriod] = useState([]);
  const [timeRange, setTimeRange] = useState({start: null, end: null});

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [data, setData] = useState({
    type: '',
    start: {date: '', datestr: ''},
    time: {start: '', end: ''},
    end: '',
    desc: '',
    period: '',
  });

  const [timeVisible, setTimevisible] = useState({
    fromtime: {
      visible: false,
    },
    totime: {
      visible: false,
    },
  });

  //   useEffect(() => {
  //     console.log(leavenbr);
  //   }, [leavenbr]);

  const formtimeconfirm = date => {
    console.log(date);

    let time =
      (date.getHours() < 10 ? '0' : '') +
      date.getHours() +
      ':' +
      (date.getMinutes() < 10 ? '0' : '') +
      date.getMinutes();

    if (time >= timeRange.start && time <= timeRange.end) {
      setData(prevState => {
        return {
          ...prevState,
          time: {...prevState.time, start: time},
        };
      });
    } else {
      Alert.alert(
        'แจ้งเตือน',
        'ไม่สามารถเลือกเวลาได้ เนื่องจากไม่อยู่ในช่วงเวลาที่กำหนด',
      );
    }

    setTimevisible({
      ...timeVisible,
      fromtime: {...timeVisible.fromtime, visible: false},
    });
  };

  const totimeconfirm = date => {
    console.log(date);

    let time =
      (date.getHours() < 10 ? '0' : '') +
      date.getHours() +
      ':' +
      (date.getMinutes() < 10 ? '0' : '') +
      date.getMinutes();

    console.log(timeRange);
    console.log(time);

    if (time >= timeRange.start && time <= timeRange.end) {
      setData(prevState => {
        return {
          ...prevState,
          time: {...prevState.time, end: time},
        };
      });
    } else {
      Alert.alert(
        'แจ้งเตือน',
        'ไม่สามารถเลือกเวลาได้ เนื่องจากไม่อยู่ในช่วงเวลาที่กำหนด',
      );
    }

    setTimevisible({
      ...timeVisible,
      totime: {...timeVisible.totime, visible: false},
    });
  };

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

  const checkSend = () => {
    if (data.type && data.time.start && data.time.end && data.start.date) {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    setData(prevState => {
      return {
        ...prevState,
        type: leavenbr.gmm_leave_type,
        start: {
          date: leavenbr.gmm_leave_date,
          datestr: leavenbr.gmm_leave_date_desc,
        },
        time: {start: leavenbr.gmm_leave_time, end: leavenbr.gmm_leave_time_to},
        desc: leavenbr.gmm_leave_desc,
        period: leavenbr.gmm_leave_event,
      };
    });
  }, [setData]);

  useEffect( () => {

    async function getdata (){
      await getLeavetype();

    }
    getdata();
  }, []);

  const dateConfirm = date => {
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
    setData(prevState => {
      return {
        ...prevState,
        start: {
          ...data.start,
          date: date.toISOString().split('T')[0],
          datestr:
            date.getDate() +
            ' ' +
            monthNames[date.getMonth()] +
            ' ' +
            (Number(date.getFullYear()) + Number(543)),
        },
      };
    });
    setDatePickerVisibility(false);
    dateChange(date.toISOString().split('T')[0]);

    // hideDatePicker();
  };

  const dateChange = async dte => {
    setLoader(true);
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'changeDate',
        user: loginUser,
        date: dte,
      }),
    };

    fetch(url + 'leave.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        setLoader(false);

        console.log('response', response);
        if (response.status == true) {
          setTimeRange(prevState => {
            return {
              ...prevState,
              start: response.data.gmm_emp_start_time,
              end: response.data.gmm_emp_end_time,
            };
          });

          setData(prevState => {
            return {
              ...prevState,
              time: {
                start: response.data.gmm_emp_start_time,
                end: response.data.gmm_emp_end_time,
              },
            };
          });
        } else {
          Alert.alert('แจ้งเตือน', response.message);
          setData(prevState => {
            return {
              ...prevState,
              start: {date: '', datestr: ''},
            };
          });
        }
      })
      .catch(error => {
        setLoader(false);
        console.log(error);
      });
  };

  const CancelLeave = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;
    Alert.alert('แจ้งเตือน', 'ต้องการยกเลิกการลานี้หรือไม่ ?', [
      {
        text: 'Cancel',
        onPress: () => {},
      },
      {
        text: 'OK',
        onPress: () => {
          if (leavenbr.gmm_leave_status == 'PENDING') {
            const requestOptions = {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                key: 'CancelLeave',
                user: loginUser,
                data: leavenbr,
              }),
            };

            fetch(url + 'leave.php', requestOptions)
              .then(response => response.json())
              .then(response => {
                console.log('response', response);
                if (response.status == true) {
                  Alert.alert('แจ้งเตือน', 'บันทึกข้อมูลแล้ว', [
                    {
                      text: 'OK',
                      onPress: () => {
                        navigation.goBack();
                      },
                    },
                  ]);
                } else {
                }
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            Alert.alert('แจ้งเตือน', 'ไม่สามารถแก้ไขรายการนี้ได้');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, {padding: 0}]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Loader visible={loader} setVisible={setLoader} />
        <Card>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            minimumDate={new Date()}
            // maximumDate={new Date('2022-02-26')}
            onConfirm={dateConfirm}
            onCancel={() => setDatePickerVisibility(false)}
          />

          <DateTimePickerModal
            isVisible={timeVisible.fromtime.visible}
            mode="time"
            minuteInterval={30}
            locale="th_TH"
            display="spinner"
            onConfirm={formtimeconfirm}
            onCancel={() =>
              setTimevisible({
                ...timeVisible,
                fromtime: {...timeVisible.fromtime, visible: false},
              })
            }
          />

          <DateTimePickerModal
            isVisible={timeVisible.totime.visible}
            mode="time"
            minuteInterval={30}
            locale="th_TH"
            display="spinner"
            onConfirm={totimeconfirm}
            onCancel={() =>
              setTimevisible({
                ...timeVisible,
                totime: {...timeVisible.totime, visible: false},
              })
            }
          />

          <Card.Content>
            <VStack alignItems="center" space={1}></VStack>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Title>สถานะ : </Title>
              <Title style={{color: leavenbr.color}}>
                {leavenbr.gmm_leave_status_desc}
              </Title>
            </View>
            <View>
              <Text>รายละเอียดสถานะ : {leavenbr.gmm_leave_note}</Text>
            </View>

            <Text style={{marginTop: 10}}>ประเภทการลา</Text>
            <Select
              isDisabled={true}
              selectedValue={data.type}
              minWidth="100%"
              fontSize="14"
              padding="3"
              accessibilityLabel="เลือกประเภทการลา "
              placeholder="เลือกประเภทการลา *"
              _selectedItem={{
                // bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={itemValue => {
                setData({...data, type: itemValue});
              }}>
              {typelist.map((item, key) => (
                <Select.Item
                  key={key}
                  label={item.gmm_leave_name_th}
                  value={item.gmm_leave_name_th}
                />
              ))}
            </Select>
            <Divider style={{marginVertical: 5}} />
            <Text style={{marginTop: 10}}>ช่วงเวลาการลา</Text>
            <Select
              isDisabled={true}
              selectedValue={data.period}
              minWidth="100%"
              fontSize="14"
              padding="3"
              accessibilityLabel="เลือกประเภทการลา "
              placeholder="เลือกประเภทการลา *"
              _selectedItem={{
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={itemValue => {
                console.log(itemValue);
                if (itemValue == 'A') {
                  console.log(timeRange);
                  setEanableTime({start: false, end: false});
                  setData(prevState => {
                    return {
                      ...prevState,
                      time: {
                        start: timeRange.start,
                        end: timeRange.end,
                      },
                    };
                  });
                } else if (itemValue == 'B') {
                  setEanableTime({start: false, end: true});
                  setData(prevState => {
                    return {
                      ...prevState,
                      time: {
                        ...prevState.time,
                        start: timeRange.start,
                      },
                    };
                  });
                } else {
                  setEanableTime({start: true, end: false});
                  setData(prevState => {
                    return {
                      ...prevState,
                      time: {
                        ...prevState.time,
                        end: timeRange.end,
                      },
                    };
                  });
                }
                setData(prevState => {
                  return {
                    ...prevState,
                    period: itemValue,
                  };
                });
              }}>
              {leavePeriod.map((item, key) => (
                <Select.Item key={key} label={item.name} value={item.id} />
              ))}
            </Select>
            <Divider style={{marginVertical: 5}} />
            <TouchableRipple disabled={false}>
              <View>
                <List.Item
                  titleStyle={{color: data.start.date ? 'gray' : 'gray'}}
                  title="วันที่ลา *"
                  description={
                    data.start.date ? data.start.datestr : 'เลือกวันที่'
                  }
                  left={props => (
                    <List.Icon {...props} icon="calendar" color="gray" />
                  )}
                />
                <Divider />
              </View>
            </TouchableRipple>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 10,
              }}>
              <View style={{flex: 1, marginHorizontal: 5}}>
                <Text>ตั้งแต่</Text>
                <Card style={{marginTop: 10}}>
                  <TouchableRipple
                    disabled={!eanableTime.start}
                    onPress={() =>
                      setTimevisible({
                        ...timeVisible,
                        fromtime: {...timeVisible.fromtime, visible: true},
                      })
                    }
                    style={{
                      padding: 20,
                      width: '100%',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                      }}>
                      <Icon
                        name="clock"
                        color={eanableTime.start ? colors.primary : 'gray'}
                        size={28}
                        style={{marginRight: 4}}
                      />
                      <Text>{data.time.start ? data.time.start : '- -'}</Text>
                    </View>
                  </TouchableRipple>
                </Card>
              </View>

              <View style={{flex: 1, marginHorizontal: 5}}>
                <Text>ถึง</Text>
                <Card style={{marginTop: 10}}>
                  <TouchableRipple
                    disabled={!eanableTime.end}
                    onPress={() =>
                      setTimevisible({
                        ...timeVisible,
                        totime: {...timeVisible.totime, visible: true},
                      })
                    }
                    style={{
                      padding: 20,
                      width: '100%',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                      }}>
                      <Icon
                        name="clock"
                        color={eanableTime.end ? colors.primary : 'gray'}
                        size={28}
                        style={{marginRight: 4}}
                      />
                      <Text style={{textAlign: 'center'}}>
                        {data.time.end ? data.time.end : '- -'}
                      </Text>
                    </View>
                  </TouchableRipple>
                </Card>
              </View>
            </View>
            <Text style={{marginVertical: 10}}>รายละเอียดการลา</Text>
            <TextInput
              disabled={true}
              label="รายละเอียดการลา"
              theme={{roundness: 10}}
              maxLength={255}
              multiline={true}
              placeholder="รายละเอียดการลา"
              mode="outlined"
              value={data.desc}
              onChangeText={text => {
                setData({...data, desc: text});
              }}
              numberOfLines={5}
            />
            <Divider />
            <Button
              mode="outlined"
              disabled={leavenbr.gmm_leave_status != 'PENDING'}
              contentStyle={{height: 60}}
              style={{
                borderRadius: 10,
                margin: 20,
                justifyContent: 'center',
                borderColor: '#FFC40C',
              }}
              onPress={() => CancelLeave()}>
              ยกเลิกการลา
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LeaveEditScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
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
});
