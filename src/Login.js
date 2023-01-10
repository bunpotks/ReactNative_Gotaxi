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
// import AsyncStorage from '@react-native-community/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {subscribelogin} from './center/subscribelogin';

import {
  TextInput,
  Button,
  TouchableRipple,
  HelperText,
  Title,
} from 'react-native-paper';
import Loader from './center/Loader';
import {url as urls} from './center/url';

const url = urls.url;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Login = ({navigation}) => {
  const STORAGE_KEY = '@login';

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
  const [showpassword, setShowpassword] = useState(true);
  const [iconpassword, setIconpassword] = useState('eye');

  const setItem = async value => {
    try {
      await AsyncStorage.setItem('@storage_Key', '123456');
    } catch (e) {
      // saving error
    }
  };

  const getItem = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value !== null) {
        console.log(value);
        // value previously stored
      }
    } catch (e) {
      // error reading value
    }
  };

  const toggleHide = () => {
    if (showpassword) {
      setIconpassword('eye-off');
    } else {
      setIconpassword('eye');
    }
    setShowpassword(!showpassword);
  };

  const login = val => {
    if (data.isValidUser && data.isValidPassword) {
      setLoader(true);

      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({key: 'Login', data: data}),
      };
      fetch(url + 'Login.php', requestOptions)
        .then(response => response.json())
        .then(response => {
          console.log('response', response);

          if (response.status == true) {
            // console.log(response.data)
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));

            setTimeout(() => {
              subscribelogin();
              // navigation.reset({
              //   index: 0,
              //   routes: [{name: 'Menu'}],
              // });

              navigation.reset({
                index: 0,
                routes: [{name: 'PermisionScreen'}],
              });
              setLoader(false);
            }, 1000);
          } else if (response.status == 'OTP') {
            setLoader(false);

            Alert.alert(
              'แจ้งเตือน',
              response.message,
              [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('Register2', {data: data}),
                },
              ],
              {cancelable: false},
            );
          } else {
            setLoader(false);
            Alert.alert('แจ้งเตือน', response.message);
          }
        })
        .catch(error => {
          setLoader(false);
          console.log(error);
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

  // const _isUsernameValid = (name: string) => /^[0-9]*$/.test(name);

  const passwordChange = val => {
    if (val.trim().length >= 8 && val.trim().length <= 12) {
      setData({
        ...data,
        password: val,
        check_passwordChange: true,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        check_passwordChange: true,
        isValidPassword: false,
      });
    }
  };

  const forgot = () => {
    navigation.navigate('Forgot');
  };

  return (
    <SafeAreaView style={styles.container}>
        <View
        style={{
          flex: 1,
          paddingHorizontal: 10,
          flexDirection: 'row',
          maxWidth: 700,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
      <StatusBar
        animated={true}
        backgroundColor="white"
        barStyle="dark-content"
        showHideTransition="fade"
      />
      <Loader visible={loader} />

      <KeyboardAwareScrollView>

        <View style={{flex:1}}>
          <View style={{alignItems: 'center', marginBottom: 20}}>
            <Image
              resizeMode="contain"
              style={{width: '80%', height: (windowHeight * 30) / 100}}
              source={require('./img/ic_launcher_foreground.png')}
            />
          </View>

          <View style={{marginTop: -30}}>
            {/* <Text>เบอร์โทรศัพท์</Text> */}
            <TextInput
              label="เบอร์โทรศัพท์"
              theme={{roundness: 10}}
              keyboardType="numeric"
              maxLength={10}
              placeholder="เบอร์โทรศัพท์"
              mode="outlined"
              style={
                {
                  // backgroundColor: 'transparent',
                  // fontSize:18
                }
              }
              // keyboardType={'numeric'}
              value={data.tel}
              error={!data.isValidUser && data.check_textInputChange}
              onChangeText={text => userChange(text)}
            />

            <HelperText
              type="error"
              visible={!data.isValidUser && data.check_textInputChange}>
              กรอกเบอร์โทรศัพท์ที่ลงทะเบียน 10 หลัก
            </HelperText>

            {/* {!data.isValidUser && data.check_textInputChange ? (
              <Text style={{color: 'red'}}>
                กรอกเบอร์โทรศัพท์ที่ลงทะเบียน 10 หลัก
              </Text>
            ) : null} */}
          </View>

          <View
            style={
              {
                // marginBottom: 10,
              }
            }>
            {/* <Text>รหัสผ่าน</Text> */}
            <TextInput
              label="รหัสผ่าน"
              right={
                <TextInput.Icon name={iconpassword} onPress={toggleHide} />
              }
              theme={{roundness: 10}}
              secureTextEntry={showpassword}
              minLength={8}
              maxLength={12}
              placeholder="รหัสผ่าน"
              mode="outlined"
              style={
                {
                  // backgroundColor: 'transparent',
                  // backgroundColor: 'none',
                }
              }
              value={data.password}
              error={!data.isValidPassword && data.check_passwordChange}
              onChangeText={text => passwordChange(text)}
            />

            <HelperText
              type="error"
              visible={!data.isValidPassword && data.check_passwordChange}>
              กรอกเบอร์โทรศัพท์ที่ลงทะเบียน 10 หลัก
            </HelperText>
          </View>

          <TouchableOpacity style={{marginBottom: 10}} onPress={forgot}>
            <Text style={{textAlign: 'right', color: '#1b7ced', fontSize: 16}}>
              ลืมรหัสผ่าน
            </Text>
          </TouchableOpacity>

          <Button
            mode="contained"
            contentStyle={{height: 50}}
            style={{
              borderRadius: 10,
              marginBottom: 10,
              justifyContent: 'center',
            }}
            onPress={login}>
            เข้าสู่ระบบ
          </Button>

          {/* <Button
            mode="outlined"
            contentStyle={{height: 50}}
            style={{
              borderRadius: 10,
              marginBottom: 10,
              justifyContent: 'center',
              borderColor: '#FFC40C',
            }}
            // style={{borderColor: '#FFC40C'}}
            onPress={() => {
              navigation.navigate('Register1');
            }}>
            สมัครสมาชิก
          </Button> */}
        </View>
      </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Login;

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
    // resizeMode: 'stretch',
    height: 300,
    width: '100%',
  },
});
