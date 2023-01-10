import React, {useState, useEffect} from 'react';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import {
  View,
  Text,
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
import {url as urls} from '../center/url';

import {
  TextInput,
  Button,
  Checkbox,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';
import Modal from 'react-native-modal';
import Loader from '../center/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {subscribelogin} from '../center/subscribelogin';

const url = urls.url;

const timmer = 180; // Count resend timmer :: SEC
const codelength = 6;

const Confirmotp = ({navigation, route}) => {
  const STORAGE_KEY = '@login';

  const {data} = route.params;
  const [loader, setLoader] = useState(false);

  const [checked, setChecked] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [resOtp, setResOtp] = React.useState({
    ref_code: '',
    token: 'a2862e6e-bc79-4afb-af2b-cbeba1113b69',
  });

  const [isModalVisible, setModalVisible] = useState(false);

  const [timerCount, setTimer] = useState(timmer);

  const confirmOtp = code => {
    if (code.length == codelength) {
      setLoader(true);
      let requestOptions = {};

      if (data.type == 'ACTIVEOTP') {
        requestOptions = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            key: 'activeuser',
            data: data,
            otp: {
              code: code,
              token: resOtp.token,
              ref: resOtp.ref_code,
            },
          }),
        };
      } else {
        requestOptions = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            key: 'register',
            data: data,
            otp: {
              code: code,
              token: resOtp.token,
              ref: resOtp.ref_code,
            },
          }),
        };
      }

      fetch(url + 'register.php', requestOptions)
        .then(response => response.json())
        .then(response => {
          console.log('response', response);

          if (response.status == true) {
            Alert.alert(
              'แจ้งเตือน',
              response.message,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    AsyncStorage.setItem(
                      STORAGE_KEY,
                      JSON.stringify(response.data),
                    );

                    setTimeout(() => {
                      setLoader(false);

                      subscribelogin();
                    

                      navigation.reset({
                        index: 0,
                        routes: [{name: 'PermisionScreen'}],
                      });
                      setLoader(false);
                    }, 1000);
                  },
                },
              ],
              {cancelable: false},
            );
          } else {
            setLoader(false);

            Alert.alert(
              'แจ้งเตือน',
              response.message,
              [{text: 'OK', onPress: () => console.log('OK Pressed')}],
              {cancelable: false},
            );
          }

          // alert(response.message);
        })
        .catch(error => {
          setLoader(false);
          console.log(error);
          alert(error.message);
        });
    } else {
      Alert.alert(
        'แจ้งเตือน',
        'หลายเลข OTP ผิดพลาดกรุณตรวจสอบเลข OTP อีกครั้ง',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  };

  const sendOTP = () => {
    // setLoader(true);

    setTimer(timmer);
    let interval = setInterval(() => {
      setTimer(lastTimerCount => {
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000);

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({key: 'reqOtp', data: data}),
    };
    fetch(url + 'register.php', requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log('response', data);
        if ((data.code = '000')) {
          setResOtp(data.result);
        } else if (data.code == '101') {
        }
        setLoader(false);
      })
      .catch(error => {
        setLoader(false);
      });
  };

  const setOTPTEST = () => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    function generateString(length) {
      let result = ' ';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength),
        );
      }

      return result;
    }

    setTimer(timmer);
    let interval = setInterval(() => {
      setTimer(lastTimerCount => {
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000);

    let test = {
      code: '000',
      detail: 'OK.',
      result: {
        ref_code: generateString(5),
        token: 'a2862e6e-bc79-4afb-af2b-cbeba1113b69',
      },
    };
    setCode('');
    setResOtp(test.result);
  };

  useEffect(() => {
    // setOTPTEST();
    sendOTP();
  }, []);

  return (
    <View style={styles.container}>
      <Loader visible={loader} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View style={styles.containerModal}>
          <OTPInputView
            style={{width: '100%', height: 200, color: 'red'}}
            pinCount={codelength}
            code={code}
            onCodeChanged={code => {
              setCode(code);
            }}
            autoFocusOnLoad
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={code => {
              confirmOtp(code);
            }}
          />

          <Button
            mode="contained"
            style={{
              marginBottom: 20,
            }}
            onPress={() => confirmOtp(code)}>
            ยืนยัน OTP
          </Button>

          <View>
            <Text style={{textAlign: 'center'}}>
              กรุณากรอกรหัส OTP 6 หลัก ที่ส่งไปที่เบอร์โทรศัพท์ {data.tel}
            </Text>
            {resOtp.ref_code ? (
              <Text style={{textAlign: 'center'}}>
                รหัสอ้างอิง ({resOtp.ref_code})
              </Text>
            ) : null}

            {timerCount > 0 ? (
              <Text style={{textAlign: 'center', color: '#1b7ced'}}>
                ขอรหัส OTP ใหม่อีกครั้งใน {timerCount}
              </Text>
            ) : (
              <TouchableOpacity style={{marginTop: 10}} onPress={sendOTP}>
                <Text style={{textAlign: 'center', color: '#1b7ced'}}>
                  ขอรหัส OTP ใหม่อีกครั้ง
                </Text>
              </TouchableOpacity>
            )}

            {/* {timerCount > 0 && timerCount <= timerCount - 1 ? (
              <Text style={{textAlign: 'center', color: '#1b7ced'}}>
                ขอรหัส OTP ใหม่อีกครั้งใน {timerCount}
              </Text>
            ) : (
              <TouchableOpacity style={{marginTop: 10}} onPress={sendOTP}>
                <Text style={{textAlign: 'center', color: '#1b7ced'}}>
                  ขอรหัส OTP ใหม่อีกครั้ง
                </Text>
              </TouchableOpacity>
            )} */}

            {/* <TouchableOpacity style={{marginTop: 10}} onPress={sendOTP}>
              <Text style={{textAlign: 'center', color: '#1b7ced'}}>
                ขอรหัส OTP ใหม่อีกครั้ง
              </Text>
            </TouchableOpacity> */}

            {/* <TouchableOpacity style={{marginTop: 10}} onPress={sendOTP}>
              <Text style={{textAlign: 'center', color: '#1b7ced'}}>
                ขอรหัส OTP ใหม่อีกครั้ง(Product)
              </Text>
            </TouchableOpacity>

            {timerCount > 0 ? (
              <Text style={{textAlign: 'center', color: '#1b7ced'}}>
                (TEST) ขอรหัส OTP ใหม่อีกครั้งใน {timerCount}
              </Text>
            ) : (
              <TouchableOpacity style={{marginTop: 10}} onPress={setOTPTEST}>
                <Text style={{textAlign: 'center', color: '#1b7ced'}}>
                  (TEST) ขอรหัส OTP ใหม่อีกครั้ง
                </Text>
              </TouchableOpacity>
            )} */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Confirmotp;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',

    // backgroundColor: 'red',
    // alignItems: 'center',
    // justifyContent: 'center',
    // width:'100%'
  },
  containerModal: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },

  borderStyleBase: {
    // margin:10,
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    //   color:'black',
    borderColor: '#03DAC6',
  },

  underlineStyleBase: {
    height: 45,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'black',
    color: 'black',
    fontSize: 20,
  },

  underlineStyleHighLighted: {
    borderColor: '#FFC40C',
  },
});
