import React, {useState, useEffect} from 'react';
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
import Modal from 'react-native-modal';

import {TextInput, Button} from 'react-native-paper';
import Loader from '../center/Loader';
import OTPInputView from '@twotalltotems/react-native-otp-input';

const url = urls.url;
const timmer = 180;

const codelength = 6;
const Forgot = ({navigation}) => {
  const [timerCount, setTimer] = useState(timmer);
  let interval;

  const [code, setCode] = React.useState('');
  const [resOtp, setResOtp] = React.useState({
    ref_code: '',
    token: 'a2862e6e-bc79-4afb-af2b-cbeba1113b69',
  });

  const [data, setData] = useState({
    tel: '',
    password: '',
    check_textInputChange: false,
    check_passwordChange: false,
    isValidUser: false,
    isValidPassword: false,
    type: 'ACTIVEOTP',
  });

  const [loader, setLoader] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    clearInterval(interval);
    interval = setInterval(() => {
      setTimer(lastTimerCount => {
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000);
  };

  const closeModal = () => {
    setModalVisible(!isModalVisible);
    clearInterval(interval);
  };

  const userChange = val => {
    if (val.trim().length == 10) {
      setData({
        ...data,
        tel: val.replace(/[^0-9]/g, ''),
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        tel: val.replace(/[^0-9]/g, ''),
        check_textInputChange: true,
        isValidUser: false,
      });
    }
  };

  const sendOTP = () => {
    setLoader(true);

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

  const confirmOtp = code => {
    if (code.length == codelength) {
      setLoader(true);

      let requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          key: 'checkOTP',
          otp: {
            code: code,
            token: resOtp.token,
            ref: resOtp.ref_code,
          },
        }),
      };

      fetch(url + 'register.php', requestOptions)
        .then(response => response.json())
        .then(response => {
          console.log('response', response);
          setLoader(false);

          if (response.status == true) {
            setModalVisible(false);

            navigation.navigate('Repassword', {tel: data.tel});
          } else {
            setCode('');
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

  const confirm = () => {
    if (data.isValidUser) {
      setLoader(true);
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({key: 'checkTel', data: data}),
      };
      fetch(url + 'register.php', requestOptions)
        .then(response => response.json())
        .then(response => {
          console.log('response', response);
          setLoader(false);

          if (response.status !== true) {
            sendOTP();
            setModalVisible(true);
            // setOTPTEST();
          } else {
            Alert.alert(
              'แจ้งเตือน',
              'ไม่พบหมายเลขโทรศัพท์ที่ลงทะเบียน',
              [
                {
                  text: 'OK',
                  // onPress: () => navigation.navigate('Register2', {data: data}),
                },
              ],
              {cancelable: false},
            );
          }
        })
        .catch(error => {
          console.log(error);
          setLoader(false);

          alert(error.message);
        });
    } else {
      Alert.alert(
        'แจ้งเตือน',
        'รูปแบบเบอร์โทรศัพท์หรือรหัสผ่านไม่ถูกต้องกรุณาลองใหม่อีกครั้ง',
        [
          {
            text: 'OK',
            // onPress: () => navigation.navigate('Register2', {data: data}),
          },
        ],
        {cancelable: false},
      );
    }
  };

  // console.log('forgot')

  useEffect(() => {
    // setOTPTEST();
    // sendOTP();
  }, []);

  return (
    <View style={styles.container}>
      <Loader visible={loader} />

      <View>
        <View
          style={{
            marginBottom: 20,
          }}>
          <Text>เบอร์โทรศัพท์</Text>
          <TextInput
            theme={{roundness: 10}}
            keyboardType="numeric"
            maxLength={10}
            placeholder="เบอร์โทรศัพท์ 10 หลัก"
            mode="outlined"
            style={{
              backgroundColor: 'none',
            }}
            // keyboardType={'numeric'}
            value={data.tel}
            onChangeText={text => userChange(text)}
          />

          {!data.isValidUser && data.check_textInputChange ? (
            <Text style={{color: 'red'}}>
              กรอกเบอร์โทรศัพท์ที่ลงทะเบียน 10 หลัก
            </Text>
          ) : null}
        </View>

        <Button
          mode="contained"
          style={{
            marginBottom: 20,
          }}
          onPress={confirm}>
          ยืนยัน
        </Button>

        <Modal
          isVisible={isModalVisible}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          style={styles.containerModal}
          // onBackdropPress={() => setModalVisible(false)}
        >
          <SafeAreaView>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <View style={styles.containerModal}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  alignItems: 'center',
                }}>
                ยืนยันรหัส OTP
              </Text>

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
              </View>

              <View style={{marginTop: 20}}>
                <Button
                  mode="outlined"
                  style={{borderColor: '#FFC40C'}}
                  onPress={() => setModalVisible(false)}>
                  ปิด
                </Button>
              </View>
            </View>
          </ScrollView>
          </SafeAreaView>

        </Modal>
      </View>
    </View>
  );
};

export default Forgot;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  containerModal: {
    margin: 0,
    padding: 10,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    // height:
  },

  borderStyleBase: {
    // margin:10,
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
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
