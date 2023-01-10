import React, {useState, useEffect, useRef} from 'react';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

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
  ImageBackground,
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

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  BottomSheet,
  ListItem,
  Rating,
  RatingProps,
} from 'react-native-elements';
import {useToast} from 'react-native-toast-notifications';

import {captureRef} from 'react-native-view-shot';
import ViewShot from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';

import Modal from 'react-native-modal';
import {set} from 'react-native-reanimated';

const url = urls.url;
const STORAGE_KEY = '@login';

const BottomAction = props => {
  const {
    question,
    setQeustion,
    booking,
    setBooking,
    loader,
    setLoader,
    navigation,
    commentText,
    meeter,
  } = props;
  console.log(question);

  const sendRating = async () => {
    let check = [];
    question.forEach(questions => {
      if (questions.gmm_rating_require == 'ON') {
        if (!questions.value) {
          check.push(false);
        } else {
          check.push(true);
        }
      } else {
        check.push(true);
      }
    });
    if (meeter.length > 0) {
      meeter.forEach(questions => {
        if (questions.meeterValue) {
          check.push(true);
        } else {
          check.push(false);
        }
      });
    }

    if (check.includes(false)) {
      Alert.alert(
        'แจ้งเตือน',
        'ข้อมูลการให้คะแนนเดินทางไม่ครบถ้วน กรุณากรอกแบบประเมินให้ครบถ้วนก่อนส่ง',
      );
    } else {
      setLoader(true);

      console.log(check);
      const login = await AsyncStorage.getItem(STORAGE_KEY);
      const loginUser = login ? JSON.parse(login) : undefined;

      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          key: 'sendRating',
          question: question,
          booking: booking,
          user: loginUser,
          commentText: commentText,
          meeter: meeter,
        }),
      };

      fetch(url + 'rateing.php', requestOptions)
        .then(response => response.json())
        .then(response => {
          console.log(response);
          if (response.status == true) {
            navigation.goBack();
          }
          setLoader(false);
        })
        .catch(error => {
          console.log(error);
          setLoader(false);
        });
    }
  };
  return (
    <Card
      style={{
        padding: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Button
          mode="contained"
          contentStyle={{height: 50}}
          style={{
            flex: 1,
            margin: 5,
            borderRadius: 10,
          }}
          onPress={sendRating}>
          ยืนยัน
        </Button>
      </View>
    </Card>
  );
};

const QuestionScreen = props => {
  const [question, setQeustion] = useState([]);
  const [loader, setLoader] = useState([]);
  const {bookingnbr} = props.route.params;

  const [booking, setBooking] = useState();

  const [commentText, setCommentText] = useState([]);
  const [meeter, setMeeter] = React.useState([]);

  const [value, setValue] = React.useState('first');

  const getBooking = async () => {
    setLoader(true);
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'getbooking',
        user: loginUser,
        bookingnbr: bookingnbr,
      }),
    };

    fetch(url + 'monitor.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        if (response.status == true) {
          setBooking(prevState => {
            return response.data;
          });
          // setCommentText(response.commentText);
        }

        setLoader(false);
      })
      .catch(error => {
        console.log(error);
        setLoader(false);
      });
  };

  const getQuestion = async () => {
    setLoader(true);
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'getRating',
        booking: booking,
        user: loginUser,
      }),
    };

    fetch(url + 'rateing.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log(response);

        if (response.status == true) {
          console.log(response);
          setQeustion(prevState => {
            return response.data;
          });

          setCommentText(response.commentText);
          setMeeter(response.meeter);
        } else {
          Alert.alert('แจ้งเตือน', response.message);
          props.navigation.goBack();
        }

        setLoader(false);
      })
      .catch(error => {
        console.log(error);
        // setLoader(false);
      });
  };

  const changeRate = (e, key) => {
    let newarr = [...question];
    newarr[key].value = e;
    setQeustion(newarr);
  };

  useEffect(() => {
    // await getQuestion();

    async function getdata() {
      await getBooking();
    }
    getdata();
  }, []);

  useEffect(() => {
    async function getdata() {
      await getQuestion();
    }
    if (booking) {
      getdata();
    }
  }, [booking]);

  return (
    <SafeAreaView style={[styles.container]}>
      <Loader visible={loader} />
      {booking ? (
        <>
          <ScrollView style={{flex: 1}}>
            <KeyboardAwareScrollView>
              <View style={{padding: 20}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: 'gray'}}>เลขที่การเดินทาง : </Text>

                  <Text>{booking.gmm_booking_nbr}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: 'gray'}}>วันที่เดินทาง : </Text>

                  <Text>
                    {booking.monthdesc.monthdesc} {booking.monthdesc.time}
                  </Text>
                </View>
                <Divider style={{marginVertical: 10}} />

                {question.map((item, key) => (
                  <View key={key}>
                    <View style={{flexDirection: 'row'}}>
                      {item.gmm_rating_require == 'ON' ? (
                        <Text style={{color: 'red'}}>* </Text>
                      ) : null}
                      <Text>
                        {key + 1} . {item.gmm_rating_name}
                      </Text>
                    </View>

                    {item.gmm_rating_type == 'Question' ? (
                      <RadioButton.Group
                        onValueChange={newValue => {
                          let newarr = [...question];
                          newarr[key].value = newValue;
                          setQeustion(newarr);
                        }}
                        value={item.value}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            marginTop: 20,
                          }}>
                          {item.question.map((items, keys) => (
                            <View
                              style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                              key={keys}>
                              <Text
                                numberOfLines={2}
                                style={{textAlign: 'center'}}>
                                {items.name}
                              </Text>
                              <RadioButton.Android
                                color="#FFC40C"
                                value={items.value}
                                style={{height: 100, width: 100}}
                              />
                            </View>
                          ))}
                        </View>
                      </RadioButton.Group>
                    ) : (
                      <View
                        style={{
                          marginTop: 20,
                        }}>
                        <Rating
                          key={key}
                          // showRating
                          startingValue={item.value}
                          imageSize={40}
                          onFinishRating={e => {
                            changeRate(e, key);
                          }}
                        />
                      </View>
                    )}

                    <Divider style={{marginVertical: 10}} />
                  </View>
                ))}

                <Title>รายละเอียดอื่นๆ</Title>
                {commentText.map((item, key) => (
                  <View key={key}>
                    <TextInput
                      style={{backgroundColor: 'white'}}
                      multiline={true}
                      label={item.name}
                      value={item.value}
                      maxLength={255}
                      onChangeText={text => {
                        let newArr = [...commentText];
                        newArr[key].value = text;
                        setCommentText(newArr);
                        // console.log(newArr)
                      }}
                    />
                  </View>
                ))}

                {meeter.length > 0 ? (
                  <View>
                    <Title>
                      ค่าโดยสาร<Text style={{color: 'red'}}>*</Text>
                    </Title>

                    {meeter.map((item, key) => (
                      <View key={key}>
                        <TextInput
                          style={{backgroundColor: 'white'}}
                          multiline={true}
                          label={item.gmm_location_route_name}
                          value={item.meeterValue}
                          keyboardType="numeric"
                          placeholder={'ค่าโดยสารเดินทาง'}
                          right={<TextInput.Affix text="บาท" />}
                          maxLength={5}
                          onChangeText={text => {
                            let newArr = [...meeter];
                            newArr[key].meeterValue = text
                              .replace(/[^0-9]/g, '')
                              .replace(/^0+/, '');
                            setMeeter(newArr);
                            console.log(newArr);
                          }}
                        />
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
              <BottomAction
                question={question}
                setQeustion={setQeustion}
                booking={booking}
                setBooking={setBooking}
                navigation={props.navigation}
                loader={loader}
                setLoader={setLoader}
                commentText={commentText}
                meeter={meeter}
              />
            </KeyboardAwareScrollView>
          </ScrollView>
        </>
      ) : null}
    </SafeAreaView>
  );
};

export default QuestionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#F7DC6F',
  },
});
