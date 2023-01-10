import React, {useState, useEffect} from 'react';

import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Card,
  IconButton,
  Button,
  Dialog,
  Portal,
  Paragraph,
  List,
  Colors,
  useTheme,
  Divider,
  Title,
  Text,
  TextInput,
} from 'react-native-paper';
import Modal from 'react-native-modal';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {ListItem, Avatar} from 'react-native-elements';
import messaging from '@react-native-firebase/messaging';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import {unsubscribelogin} from './center/subscribelogin';
import {url as urls} from './center/url';

const url = urls.url;
const timmer = 180;
const codelength = 6;

const Profile = ({navigation}) => {
  const {colors} = useTheme();
  const [timerCount, setTimer] = useState(timmer);
  let interval;
  const [code, setCode] = React.useState('');

  const [loader, setLoader] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const [userData, setUserdata] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const [modalEmail, setModalEmail] = React.useState(false);

  const [cardData, setCarddata] = React.useState({coupon: null, point: null});

  const [isReady, setIsReady] = React.useState(false);

  const [resOtp, setResOtp] = React.useState({
    ref_code: '',
    token: 'a2862e6e-bc79-4afb-af2b-cbeba1113b69',
  });

  const STORAGE_KEY = '@login';
  const TRIP_KEY = '@trip';

  const [data, setData] = useState({
    tel: '',
    password: '',
    check_textInputChange: false,
    check_passwordChange: false,
    isValidUser: false,
    isValidPassword: false,
    type: 'ACTIVEOTP',
  });



  const getservice = async () => {
    setLoading(true);
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({key: 'getcouponCount', user: loginUser}),
    };
    fetch(url + 'coupon.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setLoading(false);

        if (response.status == true) {
          setCarddata({...cardData, coupon: response.data.count});
        } else {
          setCarddata({...cardData, coupon: 0});

          // setFavour([]);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    const willFocusSubscription = navigation.addListener('focus', () => {
      // fetchData();
      // getservice();
    });

    return willFocusSubscription;
  }, []);

  const restoreState = async () => {
    try {
      // const initialUrl = await Linking.getInitialURL();

      if (Platform.OS !== 'web') {
        const login = await AsyncStorage.getItem(STORAGE_KEY);

        const loginUser = login ? JSON.parse(login) : undefined;
        console.log(loginUser);
        if (loginUser !== undefined) {
          setUserdata(loginUser);
          setData({...data, tel: loginUser.gmm_emp_tel});
        }

        // const cartdata = await AsyncStorage.getItem(TRIP_KEY);
        // const cartitem = cartdata ? JSON.parse(cartdata) : undefined;
        // console.log(cartitem);
        // if (cartitem !== undefined) {
        //   console.log(cartitem);
        //   setTripcount(cartitem.length);
        // }
      }
    } finally {
      console.log(userData);

      setIsReady(true);
    }
  };

  const sendOTP = () => {
    console.log(data)
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

  const confirmEmail = () => {
    setLoader(true);

    let requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'editEmail',
        user: userData,
      }),
    };

    fetch(url + 'register.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log('response', response);
        setLoader(false);

        if (response == true) {
          setModalEmail(false);
        }
      })
      .catch(error => {
        setLoader(false);
        console.log(error);
        alert(error.message);
      });
  };

  const modalOtp = () => {
    return (
      <Modal
        isVisible={isModalVisible}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        style={styles.containerModal}
        // onBackdropPress={() => setModalVisible(false)}
      >
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
      </Modal>
    );
  };

  const emailModals = () => {
    return (
      <Modal
        isVisible={modalEmail}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        style={styles.containerModal}
        // onBackdropPress={() => setModalVisible(false)}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={styles.containerModal}>
            <Title>E-mail </Title>
            <TextInput
              label="Email"
              theme={{roundness: 10}}
              placeholder="รหัสผ่าน"
              mode="outlined"
              style={
                {
                  // backgroundColor: 'transparent',
                  // backgroundColor: 'none',
                }
              }
              value={userData.gmm_user_email}
              onChangeText={text =>
                setUserdata({...userData, gmm_user_email: text})
              }
            />

            <Button
              mode="contained"
              style={{
                marginVertical: 20,
                marginBottom: 20,
              }}
              onPress={() => confirmEmail()}>
              ยืนยัน
            </Button>

            <View style={{marginTop: 20}}>
              <Button
                mode="outlined"
                style={{borderColor: '#FFC40C'}}
                onPress={() => setModalEmail(false)}>
                ปิด
              </Button>
            </View>
          </View>
        </ScrollView>
      </Modal>
    );
  };

  React.useEffect(() => {
    const willFocusSubscription = navigation.addListener('focus', () => {
      // fetchData();
      restoreState();
    });

    return willFocusSubscription;
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <View>
      {modalOtp()}
      {emailModals()}

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{backgroundColor: '#ffff'}}>
        <View>
          <View style={{padding: 10}}>
            {/* <View>
              <View style={{padding: 10}}>
                <Title>สวัสดี</Title>
                <Text>คุณ {userData.gmm_user_fname}</Text>
              </View>

              <Card
                onPress={() => navigation.navigate('Mycoupon')}
                style={{
                  marginVertical: 5,
                  marginHorizontal: 20,
                  borderRadius: 10,
                  height: 120,
                  paddingLeft: 20,
                  paddingVertical: 10,

                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 1,

                  elevation: 5,
                }}>
                <Title>คูปองของฉัน</Title>

                <SkeletonContent
                  containerStyle={{flex: 1}}
                  isLoading={loading}
                  layout={[
                    // {
                    //   key: 'header',
                    //   maxWidth: 250,
                    //   width: 150,
                    //   maxHeight: 150,
                    //   height: 20,
                    // },

                    {
                      key: 'body1',
                      maxWidth: 250,
                      width: 250,
                      maxHeight: 150,
                      height: 20,
                    },

                    {
                      marginTop: 10,
                      flexDirection: 'column',
                      alignItems: 'flex-end',

                      marginRight: 10,
                      children: [
                        {
                          borderRadius: 50,
                          height: 40,
                          width: 80,
                          marginBottom: 10,
                        },
                      ],
                    },
                  ]}>
                  <View>
                    <Text style={{color: 'gray'}}>
                      คุณมีคูปองทั้งหมด {cardData.coupon} ใบ
                    </Text>
                  </View>

                  <View
                    style={{
                      zIndex: 9,
                      backgroundColor: 'rgba(255, 196, 12,0.6)',
                      borderRadius: 50,
                      right: 10,
                      position: 'absolute',
                      bottom: 0,
                      height: 40,
                      width: 80,
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        color: 'white',
                      }}>
                      ดูคูปอง
                    </Text>
                  </View>
                </SkeletonContent>
              </Card>
            </View>

            <Card
              style={{
                marginVertical: 5,
                marginHorizontal: 20,
                borderRadius: 10,
                height: 120,
                paddingLeft: 20,
                paddingVertical: 10,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
              }}>
              <View>
                <Title>คะแนนของฉัน</Title>
                <Text style={{color: 'gray'}}>xxx คะแนน</Text>
              </View>
              <View
                style={{
                  zIndex: 9,
                  backgroundColor: 'rgba(255, 196, 12,0.6)',
                  borderRadius: 50,
                  right: 10,
                  position: 'absolute',
                  bottom: 0,
                  height: 40,
                  width: 80,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    color: 'white',
                  }}>
                  แลกรางวัล
                </Text>
              </View>
            </Card>

            <Divider style={{marginTop: 10}} /> */}

            {/* <List.Item
              title="ฃื่อ-นามสกุล"
              description={
                userData.gmm_user_fname + ' ' + userData.gmm_user_lname
              }
            />
            <Divider /> */}

            <List.Item
              title="ประเภทผู้ใช้งาน"
              description={userData.gmm_emp_type}
            />
            <Divider />

            <List.Item
              title="ชื่อ-นามสกุล"
              description={
                userData.gmm_emp_fname + ' ' + userData.gmm_emp_lname
              }
            />
            <Divider />

            <List.Item
              title="LINE ID"
              description={
                userData.gmm_emp_lineid ? userData.gmm_emp_lineid : '-'
              }
            />

            <Divider />
            <List.Item
              title="เบอร์โทรศัพท์"
              description={userData.gmm_emp_tel}
            />
            <Divider />

            <List.Item
              onPress={() => {
                sendOTP();
                setModalVisible(true);
              }}
              title="เปลี่ยนรหัสผ่าน"
              description="xxxxxxxxxx"
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
            <Divider />
          </View>

          {/* <View style={{height: 70}}></View> */}
        </View>
      </ScrollView>
    </View>
  );
};

const styleDetail1 = StyleSheet.create({
  container: {
    height: (Dimensions.get('window').height * 10) / 100,
    backgroundColor: '#FFC40C',
    justifyContent: 'center',
  },
  header: {
    flex: 0.6,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 10,

    // paddingBottom: 20,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    position: 'relative',
    // paddingHorizontal: 20,
    // paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
    fontFamily: 'Prompt',
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
    fontFamily: 'Prompt',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logo: {
    width: '80%',
    resizeMode: 'contain',
  },
});

const styles = StyleSheet.create({
  cardRad: {
    borderRadius: 10,
    height: '50%',
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
  cardcontent: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffff',
  },

  textcontent: {
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'Prompt',
  },
  viewlist: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 5,
  },
  signIn: {
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default Profile;
