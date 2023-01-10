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
  Animated,
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
  ActivityIndicator,
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

import LottieView from 'lottie-react-native';

const GoogleAPI = 'AIzaSyBo3lCqmuC-pjXjafl1DkBlLZsu-nVO5TU';

import * as Animatable from 'react-native-animatable';
// Booking3 = Animatable.createAnimatableComponent(Booking3);

const GooglePlacesInput = () => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search"
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: GoogleAPI,
        language: 'en',
        components: 'country:us',
      }}
    />
  );
};

const Booking4 = ({navigation, route}) => {
  const [data, setData] = React.useState([
    {
      value: 'note',
    },
    {
      value: 'aum',
    },
  ]);

  const [trip, setTrip] = React.useState(route.params.trip);

  const [taxi, setTaxi] = React.useState({status: false});
  const [barcolor, setBarcolor] = React.useState('#FFFF');

  const [favour, setFavour] = React.useState({status: false, list: []});

  console.log(trip);

  const [loading, setLoading] = useState(true);

  const LeftContent = props => <Avatar.Icon {...props} icon="account" />;

  const animatedOpacity = useRef(new Animated.Value(0)).current;

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const getTaxi = async () => {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'findCg',
        aumphur: trip.point[0].location.country.aumphur,
        tumbol: trip.point[0].location.country.district,
        date: trip.date.date,
        time: trip.date.time,
      }),
    };

    fetch(url + 'autoassign.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        setTimeout(() => {
          console.log(response);

          console.log(trip);
          if (response.status == true) {
            setTaxi({...taxi, status: true});
            setFavour({
              ...favour,
              status: response.favour,
              list: response.favourList,
            });

            if (response.favour == false) {
              console.log(response.data);

              setTrip({
                ...trip,
                cgSelect: response.data,
                // passengerSelect: route.params.passenger,
              });
            }
          } else {
            setTaxi({...taxi, message: response.message, status: false});
          }

          setLoading(false);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
          }).start();
          setBarcolor('#FFC40C');
        }, 2000);
      })
      .catch(error => {
        console.log(error);
        setLoader(false);

        // alert(error.message);
      });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getTaxi();
      //Put your Data loading function here instead of my loadData()
    });

    return unsubscribe;
  }, [navigation]);

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
                  style={[styles.roundButton1Here]}
                  rippleColor="rgba(0, 0, 0, 0.1)">
                  <Text style={{fontSize: 14}}>3</Text>
                </TouchableRipple>
              </View>

              <View style={{justifyContent: 'center', left: -16}}>
                <FontAwesome
                  name="long-arrow-right"
                  size={26}
                  color="rgb(232, 232, 232)"
                />
              </View>

              <View style={{alignItems: 'center', left: -24}}>
                <TouchableRipple
                  style={[styles.roundButton1NoActive]}
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
            <Title style={{textAlign: 'center'}}>เลือกผู้ดูแล</Title>
            <Title style={{textAlign: 'center', width: '10%'}}> </Title>
          </View>
        </Card.Content>
      </Card>
    );
  }
  function taxiInfo() {
    return (
      <View>
        {taxi.map((l, i) => (
          <View key={i}>
            <List.Item
              onPress={
                () => navigation.navigate('Booking4')

                // navigation.navigate('Booking3Detail', {
                //   title: l.title,
                //   img: 'https://www.pngrepo.com/download/46892/taxi-driver.png',
                // })
              }
              title={l.title}
              description={l.desc}
              left={props => (
                <Avatar.Image
                  marginLeft={15}
                  marginVertical={15}
                  size={40}
                  source={{
                    uri: 'https://www.pngrepo.com/download/46892/taxi-driver.png',
                  }}
                />
              )}
              right={props => (
                <List.Icon {...props} icon="heart" color="#FE7569" />
              )}
            />
            <Divider />
          </View>
        ))}
        <View>
          <List.Item
            onPress={() => navigation.navigate('Booking4')}
            title="คนขับอื่นๆ"
            description="สถานะ : ว่าง"
            left={props => (
              <Avatar.Image
                marginLeft={15}
                marginVertical={15}
                size={40}
                source={{
                  uri: 'https://www.pngrepo.com/download/46892/taxi-driver.png',
                }}
              />
            )}
          />
          <Divider />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        // translucent
        animated={true}
        backgroundColor={barcolor}
        barStyle="dark-content"
        showHideTransition="fade"
      />
      {!loading ? <View>{steper()}</View> : <View></View>}

      {!loading ? (
        <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
          {taxi.status ? (
            <View style={[styles.container]}>
              {favour.status ? (
                <View>
                  <Title style={{paddingHorizontal: 20, paddingTop: 20}}>
                    คนขับคนโปรด
                  </Title>
                  {favour.list.map((l, i) => (
                    <View key={i}>
                      <List.Item
                        onPress={() => navigation.navigate('Booking5')}
                        title={l.gmm_emp_fname + ' ' + l.gmm_emp_lname}
                        description={'สถานะ : ว่าง'}
                        left={props => (
                          <Avatar.Image
                            marginLeft={15}
                            marginVertical={15}
                            size={40}
                            source={{
                              uri: 'https://www.pngrepo.com/download/46892/taxi-driver.png',
                            }}
                          />
                        )}
                        right={props => (
                          <List.Icon
                            {...props}
                            icon="heart"
                            color="#FE7569"
                            style={{alignItems: 'center'}}
                          />
                        )}
                      />
                      <Divider />
                    </View>
                  ))}

                  <Title style={{paddingHorizontal: 20, paddingTop: 20}}>
                    คนขับคนอื่น ๆ
                  </Title>

                  {favour.list.map((l, i) => (
                    <View key={i}>
                      <List.Item
                        onPress={() => navigation.navigate('Booking5')}
                        title={l.gmm_emp_fname + ' ' + l.gmm_emp_lname}
                        description={'สถานะ : ว่าง'}
                        left={props => (
                          <Avatar.Image
                            marginLeft={15}
                            marginVertical={15}
                            size={40}
                            source={{
                              uri: 'https://www.pngrepo.com/download/46892/taxi-driver.png',
                            }}
                          />
                        )}
                      />
                      <Divider />
                    </View>
                  ))}
                </View>
              ) : (
                <View style={[styles.container]}>
                  <View></View>
                  <View style={{alignItems: 'center', padding: 10}}>
                    <LottieView
                      style={{width: '50%'}}
                      source={require('../51926-happy.json')}
                      autoPlay
                      loop
                    />
                    <Title style={{textAlign: 'center', color: 'gray'}}>
                      เราเลือกผู้ดูแลให้คุณได้แล้วกดถัดไปเพื่อทำรายการต่อ
                    </Title>
                  </View>
                  <Card
                    style={{
                      padding: 10,
                    }}>
                    <Button
                      mode="contained"
                      contentStyle={{height: 60}}
                      style={{
                        borderRadius: 10,
                        // margin:20,
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        console.log(trip);
                        navigation.navigate('Booking5', {trip: trip});
                      }}>
                      ถัดไป
                    </Button>
                  </Card>
                </View>
              )}
            </View>
          ) : (
            <View style={[styles.container]}>
              <View></View>
              <View style={{alignItems: 'center', padding: 20}}>
                <LottieView
                  style={{width: '50%'}}
                  source={require('../10110-sad.json')}
                  autoPlay
                  loop
                />

                <Text
                  style={{textAlign: 'center', marginTop: 10, color: 'gray'}}>
                  {taxi.message}{' '}
                </Text>
              </View>
              <Card
                style={{
                  padding: 10,
                }}></Card>
            </View>
          )}
        </Animated.View>
      ) : (
        <View style={styles.container}>
          <View></View>
          <View>
            <View
              style={{
                padding: 20,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Title style={{top: '20%'}}>กำลังค้นหาผู้ดูแล. . . </Title>

              <LottieView
                style={{height: '100%', width: '100%'}}
                source={require('../20497-dlivery-map.json')}
                autoPlay
                loop
              />
            </View>
            {/* <ActivityIndicator animating={true} color="#F7DC6F" size="large" /> */}
          </View>
          <View></View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Booking4;

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 0,
    flex: 1,
    backgroundColor: '#FFF',
    // alignItems: 'center',
    justifyContent: 'space-between',
    // width:'100%'
    // height:'100%',
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
