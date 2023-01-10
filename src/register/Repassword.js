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
import AsyncStorage from '@react-native-async-storage/async-storage';

import {subscribelogin} from '../center/subscribelogin';

const url = urls.url;

const Repassword = ({navigation, route}) => {
  const STORAGE_KEY = '@login';

  const {tel} = route.params;
  console.log(tel);
  const [data, setData] = useState({
    tel: tel,
    password: '',
    repassword: '',
    isValidpassword: false,
    isValidrepassword: false,
    isValidrConfirmpassword: false,
  });

  const passwordChange = val => {
    if (val.trim().length >= 8 && val.trim().length <= 12) {
      if (val == data.repassword) {
        setData({
          ...data,
          password: val,
          isValidpassword: true,
          isValidrConfirmpassword: true,
        });
      } else {
        setData({
          ...data,
          password: val,
          isValidpassword: true,
          isValidrConfirmpassword: false,
        });
      }
    } else {
      setData({
        ...data,
        password: val,
        isValidpassword: false,
        isValidrConfirmpassword: false,
      });
    }
  };

  const repasswordChange = val => {
    if (val.trim().length >= 8 && val.trim().length <= 12) {
      if (val == data.password) {
        setData({
          ...data,
          repassword: val,
          isValidrepassword: true,
          isValidrConfirmpassword: true,
        });
      } else {
        setData({
          ...data,
          repassword: val,
          isValidrepassword: true,
          isValidrConfirmpassword: false,
        });
      }
    } else {
      setData({
        ...data,
        repassword: val,
        isValidrepassword: false,
        isValidrConfirmpassword: false,
      });
    }
  };

  const [loader, setLoader] = useState(false);

  const confirm = () => {
    console.log(data);
    if (data.isValidpassword && data.isValidrepassword) {
      setLoader(true);
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({key: 'repassword', data: data}),
      };
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

  const [showpassword, setShowpassword] = useState(true);
  const [iconpassword, setIconpassword] = useState('eye');

  const toggleHide = () => {
    if (showpassword) {
      setIconpassword('eye-off');
    } else {
      setIconpassword('eye');
    }
    setShowpassword(!showpassword);
  };

  return (
    <View style={styles.container}>
      <Loader visible={loader} />

      <View>
        <View style={{marginBottom: 10}}>
          <Text style={styles.fontInput}>รหัสผ่าน</Text>

          <TextInput
            right={<TextInput.Icon name={iconpassword} onPress={toggleHide} />}
            secureTextEntry={showpassword}
            placeholder="รหัสผ่าน 8-12 ตัวอักษร"
            maxLength={12}
            mode="flat"
            style={[styles.textInputs]}
            value={data.password}
            onChangeText={text => {
              passwordChange(text);
            }}
          />

          {data.password.length < 8 ? (
            <Text style={{color: 'red'}}>
              กรอกรหัสผ่านความยาว 8-12 ตัวอักษร
            </Text>
          ) : null}
        </View>
        <View style={{marginBottom: 10}}>
          <Text style={styles.fontInput}>ยืนยันรหัสผ่าน</Text>

          <TextInput
            right={<TextInput.Icon name={iconpassword} onPress={toggleHide} />}
            secureTextEntry={showpassword}
            maxLength={12}
            placeholder="ยืนยันรหัสผ่าน 8-12 ตัวอักษร"
            mode="flat"
            style={[styles.textInputs]}
            value={data.repassword}
            onChangeText={text => {
              repasswordChange(text);
            }}
          />

          {!data.isValidrConfirmpassword &&
          data.isValidpassword &&
          data.isValidrepassword ? (
            <Text style={{color: 'red'}}>รหัสผ่านไม่ตรงกัน</Text>
          ) : null}

          {data.repassword.length < 8 ? (
            <Text style={{color: 'red'}}>
              กรอกรหัสผ่านความยาว 8-12 ตัวอักษร
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
      </View>
    </View>
  );
};

export default Repassword;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  containerModal: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    // height:
  },
  textInputs: {
    backgroundColor: 'transparent',
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
