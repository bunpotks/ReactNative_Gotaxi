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

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import Geolocation from '@react-native-community/geolocation';
import LottieView from 'lottie-react-native';

import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
  Animated,
  LocalTile,
} from 'react-native-maps';

const url = urls.url;
const STORAGE_KEY = '@login';

const initPosition = {
  latitude: 13.726912,
  longitude: 100.476083,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

const query = {
  key: 'AIzaSyANcHgMKpxM2-2wipNHgT7vumZrM7f1Nlo',
  language: 'th',
  components: 'country:th',
};

var timoutGeo;

const Booking2 = ({navigation, route}) => {
  const scrollRef = useRef();
  const [myposition, setmyPosition] = useState(initPosition);
  const [taxiResponse, setTaxiResponse] = useState({});

  const [point, setPoint] = useState(route.params.product.point);

  const [trip, setTrip] = useState(route.params.product);

  console.log(trip);
  const [mapinputdata, setMapinputdata] = useState({});
  const [favourData, setFavourData] = useState([]);
  const [favourDataAuto, setFavourDataAuto] = useState([]);

  const [testData, setTestData] = useState({
    bookmark: [{status: true}, {status: false}],
  });

  const [rmksData, setRmksdata] = useState({
    mode: '',
    name: '',
    rmks: '',
    location_name: '',
  });

  const [rmksDataFavour, setRmksdataFavour] = useState({
    mode: '',
    name: '',
    rmks: '',
    location_name: '',
  });

  // console.log(trip);
  const [nowAction, setNowAction] = useState(null);
  const [buttonAllow, setButtonAllow] = useState(true);
  const [passengerlist, setPassengerlist] = useState([]);
  const [loader, setLoader] = useState(false);

  const ref = useRef();

  const getpassenger = async () => {
    // setLoader(true);

    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({key: 'getpassenger', data: loginUser}),
    };

    fetch(url + 'booking.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log('response', response);

        if (response.status == true) {
          setPassengerlist([...response.result]);
        } else {
        }
      })
      .catch(error => {
        console.log(error);
        setLoader(false);

        // alert(error.message);
      });
  };

  // useEffect(() => {
  //   console.log(123)
  // }, [setMapMode]);

  useEffect(() => {
    setTrip({...trip, date: {date: '', datestr: '', time: ''}});

    const unsubsrcribe = navigation.addListener('focus', () => {
      getpassenger();
    });

    if (route.params.mode == 'favorite') {
    } else {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
          const {longitude, latitude} = position.coords;
          let toRegion = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.004,
            longitudeDelta: 0.004,
          };

          Geocoder.init(query.key, {language: 'th'}); // set the language

          Geocoder.from(latitude, longitude)
            .then(json => {
              let position = json.results[1].geometry.location;
              console.log(json.results[0]);
              let array = json.results[1].address_components;
              console.log(json.results[1]);
              const found = array.find((detail, index) => {
                if (detail.types[0] === 'administrative_area_level_1') {
                  return detail;
                }
              });

              let countryname;

              if (found.long_name === 'กรุงเทพมหานคร') {
                const aumphur = array.find((detail, index) => {
                  return detail.types.find(detail => {
                    if (detail == 'sublocality_level_1') {
                      return detail;
                    }
                  });
                });

                const district = array.find((detail, index) => {
                  return detail.types.find(detail => {
                    if (detail == 'sublocality_level_2') {
                      return detail;
                    }
                  });
                });

                countryname = {
                  country: found.long_name.replace(/\s/g, ''),
                  aumphur: aumphur.long_name.replace(/\s/g, ''),
                  district: district.long_name
                    .replace(/\s/g, '')
                    .replace('แขวง', ''),
                };

                console.log(countryname);
              } else {
                const aumphur = array.find((detail, index) => {
                  return detail.types.find(detail => {
                    if (detail == 'administrative_area_level_2') {
                      return detail;
                    }
                  });
                });

                const district = array.find((detail, index) => {
                  return detail.types.find(detail => {
                    if (
                      detail == 'locality' ||
                      detail == 'sublocality_level_1'
                    ) {
                      return detail;
                    }
                  });
                });

                countryname = {
                  country: found.long_name.replace(/\s/g, ''),
                  aumphur: aumphur.long_name
                    .replace(/\s/g, '')
                    .replace('อำเภอ', ''),
                  district: district.long_name
                    .replace(/\s/g, '')
                    .replace('ตำบล', ''),
                };

                console.log(countryname);
              }

              const country = {
                address: json.results[1].formatted_address,
                subAddress: countryname,
              };

              console.log(country);

              setButtonAllow(true);
              setMapinputdata({
                ...mapinputdata,
                location_name: json.results[1].formatted_address,
                position: position,
                country: countryname,
                name: '',
                rmks: '',
              });

              let newroute = {...trip};
              newroute.point[0].bookmark.status = false;
              newroute.point[0].bookmark.id = null;
              newroute.point[0].location_name =
                json.results[1].formatted_address;
              newroute.point[0].location = {
                location_name: json.results[1].formatted_address,
                position: position,
                country: countryname,
                name: '',
                rmks: '',
              };

              console.log(mapinputdata);

              console.log(trip.point.length);

              if (trip.point.length > 2) {
                console.log(123456);
                newroute.point[trip.point.length - 1].bookmark.status = false;
                newroute.point[trip.point.length - 1].bookmark.id = null;
                newroute.point[trip.point.length - 1].location_name =
                  json.results[1].formatted_address;
                newroute.point[trip.point.length - 1].location = {
                  location_name: json.results[1].formatted_address,
                  position: position,
                  country: countryname,
                  name: '',
                  rmks: '',
                };
              }

              setTrip(newroute);
            })
            .catch(error => console.warn(error));

          // console.log(longitude, latitude);
          // setmyPosition(toRegion)
          // mapRef.current.animateToRegion(toRegion, 2000);
        },
        error => alert(error.message),
        {timeout: 20000, distanceFilter: 0},
      );
    }

    return unsubsrcribe;
  }, [navigation]);

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [myMarker, setMymarker] = useState([
    {
      latitude: 13.726912,
      longitude: 100.476083,
    },
    {
      latitude: 13.726912,
      longitude: 100.475083,
    },
  ]);

  function coder(lat, lng) {
    Geocoder.init(query.key, {language: 'th'}); // set the language

    Geocoder.from(lat, lng)
      .then(json => {
        let position = json.results[1].geometry.location;
        console.log(json.results[0]);
        let array = json.results[1].address_components;
        console.log(json.results[1]);
        const found = array.find((detail, index) => {
          if (detail.types[0] === 'administrative_area_level_1') {
            return detail;
          }
        });

        let countryname;

        if (found.long_name === 'กรุงเทพมหานคร') {
          const aumphur = array.find((detail, index) => {
            return detail.types.find(detail => {
              if (detail == 'sublocality_level_1') {
                return detail;
              }
            });
          });

          const district = array.find((detail, index) => {
            return detail.types.find(detail => {
              if (detail == 'sublocality_level_2') {
                return detail;
              }
            });
          });

          countryname = {
            country: found.long_name.replace(/\s/g, ''),
            aumphur: aumphur.long_name.replace(/\s/g, ''),
            district: district.long_name.replace(/\s/g, '').replace('แขวง', ''),
          };

          console.log(countryname);
        } else {
          const aumphur = array.find((detail, index) => {
            return detail.types.find(detail => {
              if (detail == 'administrative_area_level_2') {
                return detail;
              }
            });
          });

          const district = array.find((detail, index) => {
            return detail.types.find(detail => {
              if (detail == 'locality' || detail == 'sublocality_level_1') {
                return detail;
              }
            });
          });

          countryname = {
            country: found.long_name.replace(/\s/g, ''),
            aumphur: aumphur.long_name.replace(/\s/g, '').replace('อำเภอ', ''),
            district: district.long_name.replace(/\s/g, '').replace('ตำบล', ''),
          };

          console.log(countryname);
        }

        const country = {
          address: json.results[1].formatted_address,
          subAddress: countryname,
        };

        console.log(country);

        setButtonAllow(true);
        setMapinputdata({
          ...mapinputdata,
          location_name: json.results[1].formatted_address,
          position: position,
          country: countryname,
          name: '',
          rmks: '',
        });

        console.log(mapinputdata);
      })
      .catch(error => console.warn(error));
  }

  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalrmks, setModalrmks] = useState(false);
  const [isModalFavour, setModalFavour] = useState(false);
  const [isModalAddFavourVisible, setModalAddFavourVisible] = useState(false);
  const [isModalrmksFavourAdd, setModalrmksFavourAdd] = useState(false);
  const [ismodalautoassign, setismodalautoassign] = useState(false);

  const [onPressautocomplete, setonPressautocomplete] = useState(false);

  const [placeDetail, setPlaceDetail] = useState('');

  const [mapMode, setMapMode] = useState('search');

  const [loading, setLoading] = useState(true);

  const LeftContent = props => <Avatar.Icon {...props} icon="account" />;

  function steper() {
    return (
      <Card style={{backgroundColor: '#FFC40C'}}>
        <Card.Content>
          <View
            style={{
              alignContent: 'center',
              alignItems: 'center',
              width: '100%',
              // paddingHorizontal:20,
              // marginHorizontal:20,
            }}>
            <View style={{flexDirection: 'row',   alignItems: 'center', paddingHorizontal:20}}>
              <View style={{alignItems: 'center', marginLeft: 40}}>
                <TouchableRipple
                  style={[styles.roundButton1]}
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
                  style={[styles.roundButton1Here]}
                  rippleColor="rgba(0, 0, 0, 0.1)">
                  <Text style={{fontSize: 14}}>2</Text>
                </TouchableRipple>
              </View>

              <View style={{justifyContent: 'center', left: -8}}>
                <FontAwesome
                  name="long-arrow-right"
                  size={26}
                  color="rgb(232, 232, 232)"
                />
              </View>

              <View style={{alignItems: 'center', left: -16}}>
                <TouchableRipple
                  style={[styles.roundButton1NoActive]}
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
            <Title style={{textAlign: 'center'}}>กรอกข้อมูลผู้เดินทาง</Title>

            <Title style={{textAlign: 'center', width: '10%'}}> </Title>
          </View>
        </Card.Content>
      </Card>
    );
  }

  const [data, setData] = React.useState({
    passenger: '',
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setDTimePickerVisibility] = useState(false);
  const [isTimePickerCgVisible, setDTimePickerCgVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const showTimePicker = () => {
    setDTimePickerVisibility(true);
  };

  const showTimePickerCg = () => {
    setDTimePickerCgVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const hideTimePicker = () => {
    setDTimePickerVisibility(false);
  };

  const hideTimeCgPicker = () => {
    setDTimePickerCgVisibility(false);
  };

  const ontestChange = () => {
    console.log(4156156);
  };

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

    setTrip({
      ...trip,
      date: {
        ...trip.date,
        date: date.toISOString().split('T')[0],
        datestr:
          date.getDate() +
          ' ' +
          monthNames[date.getMonth()] +
          ' ' +
          (Number(date.getFullYear()) + Number(543)),
      },
    });

    hideDatePicker();
  };
  const timeConfirm = date => {
    let time =
      (date.getHours() < 10 ? '0' : '') +
      date.getHours() +
      ':' +
      (date.getMinutes() < 10 ? '0' : '') +
      date.getMinutes();

    setTrip({
      ...trip,
      date: {
        ...trip.date,
        time: time,
      },
    });

    hideTimePicker();
  };

  const timeCgConfirm = date => {
    let time =
      (date.getHours() < 10 ? '0' : '') +
      date.getHours() +
      ':' +
      (date.getMinutes() < 10 ? '0' : '') +
      date.getMinutes();

    setTrip({
      ...trip,
      gmm_cg_time: time,
    });

    hideTimeCgPicker();
  };

  function passengerCard() {
    return (
      <Card>
        <Card.Content>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <Text style={{fontSize: 20}}>ระบุผู้โดยสาร</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Regispassenger')}>
              <Text style={{color: '#2980B9'}}>เพิ่ม / แก้ไขผู้โดยสาร</Text>
            </TouchableOpacity>
          </View>

          {/* <Dropdown
            label="เลือกผู้โดยสาร *"
            value={trip.passengerSelect}
            data={passengerlist}
            valueExtractor={({value}) => value}
            labelExtractor={({label}) => label}
            dropdownMargins={{min: 16, max: 16}}
            itemPadding={10}
            onChangeText={(value, index, e) => {
              setTrip({
                ...trip,
                passengerSelect: value,
              });
            }}
          /> */}

          <VStack alignItems="center" space={1}>
            <Select
              selectedValue={trip.passengerSelect}
              minWidth="100%"
              fontSize="14"
              padding="3"
              accessibilityLabel="เลือกผู้โดยสาร "
              placeholder="เลือกผู้โดยสาร *"
              _selectedItem={{
                // bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={itemValue =>
                setTrip({
                  ...trip,
                  passengerSelect: itemValue,
                })
              }>
              {passengerlist.map((item, key) => (
                <Select.Item key={key} label={item.label} value={item.value} />
              ))}
            </Select>
          </VStack>

          <List.Item
            titleStyle={{color: trip.date.datestr ? 'black' : 'red'}}
            onPress={() => showDatePicker()}
            title="วันที่เดินทาง *"
            description={
              trip.date.datestr ? trip.date.datestr : 'เลือกวันที่เดินทาง'
            }
            left={props => (
              <List.Icon {...props} icon="calendar" color="gray" />
            )}
          />
          <Divider />

          <List.Item
            titleStyle={{color: trip.date.time ? 'black' : 'red'}}
            onPress={() => showTimePicker()}
            title="เวลาเดินทาง *"
            description={
              trip.date.time ? trip.date.time : 'เลือกเวลาที่ต้องการเดินทาง'
            }
            left={props => <List.Icon {...props} icon="clock" color="gray" />}
          />
          <Divider />
        </Card.Content>
      </Card>
    );
  }

  const settt = async (item, key) => {
    let arr = {...testData};
    arr.bookmark[key].status = !arr.bookmark[key].status;

    setTestData(arr);
  };

  function locationCard() {
    return (
      <Card style={{marginTop: 10}}>
        <Card.Content>
          {/* {testData.bookmark.map((item, key) => (
            <TouchableOpacity onPress={() => settt(item, key)}>
              <Text>{item.status.toString()}</Text>
            </TouchableOpacity>
          ))} */}

          <Text style={{fontSize: 20, marginBottom: 20}}>ระบุสถานที่</Text>

          {trip.point.map((item, key) => (
            <View key={key} style={{marginVertical: 5}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text>{item.name}</Text>

                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: 10,
                    }}
                    onPress={() => {
                      if (item.location) {
                        if (!item.bookmark.status) {
                          openRmks(item, key, 'add');
                        } else {
                          removeFavourite(item, key);
                        }
                      } else {
                        alert(
                          'ไม่สามารถเพิ่มที่อยู่โปรดได้ กรุณาเลือกจุดที่ต้องการ',
                        );
                      }
                    }}>
                    <Icon
                      name="star"
                      size={24}
                      color={item.bookmark.status ? '#FFC40C' : 'gray'}
                    />
                  </TouchableOpacity>

                  <TouchableRipple
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: 10,
                    }}
                    onPress={() => openFavour(key)}
                    rippleColor="rgba(0, 0, 0, 0.1)">
                    <Icon name="bookmark-plus" size={24} color="#FFC40C" />
                  </TouchableRipple>
                </View>
              </View>

              <View
                style={{
                  // flexDirection: 'row',
                  // justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    openPickMap(item, key);
                  }}
                  style={{
                    flexDirection: 'row',
                    borderRadius: 5,
                    width: '100%',
                    // backgroundColor: 'rgb(232, 232, 232)',
                    padding: 10,
                    justifyContent: 'space-between',
                  }}>
                  {item.location ? (
                    <Icon
                      name="map-marker"
                      size={24}
                      color="#FE7569"
                      // style={{alignSelf:'flex-start'}}
                    />
                  ) : null}

                  <View style={{alignSelf: 'center', flex: 1}}>
                    {item.location ? (
                      <View>
                        {item.location.name ? (
                          <Text
                            style={{
                              textAlign: 'left',
                              fontSize: 16,
                              marginLeft: 10,
                            }}>
                            {item.location ? item.location.name : null}
                          </Text>
                        ) : null}
                      </View>
                    ) : null}

                    <Text
                      numberOfLines={1}
                      style={{
                        textAlign: 'left',
                        fontSize: 14,
                        color: 'gray',
                        flex: 1,
                      }}>
                      {item.location
                        ? item.location.location_name
                        : item.placeholder}
                    </Text>
                  </View>

                  <Icon
                    name="chevron-right"
                    size={24}
                    color={'gray'}
                    style={{alignItems: 'center', alignSelf: 'center'}}
                  />
                </TouchableOpacity>
              </View>

              {item.location ? (
                <View
                  style={{
                    marginVertical: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: 'rgb(232, 232, 232)',
                    borderRadius: 3,
                    padding: 10,
                  }}>
                  <Text style={{fontSize: 12}} numberOfLines={1}>
                    <Text numberOfLines={1}>
                      {item.location.rmks
                        ? item.location.name + ' : ' + item.location.rmks
                        : 'ยังไม่มีรายละเอียดที่อยู่ถึงคนขับ'}
                    </Text>
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      openRmks(item, key, 'edit');
                    }}>
                    <Text
                      style={{fontSize: 14, color: '#2980B9'}}
                      numberOfLines={1}>
                      แก้ไข
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              <Divider />
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  }

  function taxiHours() {
    return (
      <Card style={{marginTop: 10}}>
        {/* <Card.Title title="คนขับรถ" left={LeftContent} /> */}
        <Card.Content>
          <Text style={{fontSize: 20, marginBottom: 10}}>คนขับรถ</Text>

          <Divider style={{marginVertical: 10}} />

          <Text style={{color: 'gray'}}>ชั่วโมงที่ต้องการให้คนขับรอเพิ่ม</Text>

          <VStack alignItems="center" space={1}>
            <Select
              selectedValue={trip.hrleft}
              minWidth="100%"
              fontSize="14"
              padding="3"
              accessibilityLabel="จำนวนที่ต้องการให้คนขับรอเพิ่ม "
              placeholder="ชั่วโมงที่ต้องการให้คนขับรอเพิ่ม *"
              _selectedItem={{
                // bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={itemValue =>
                setTrip({...trip, hrleft: itemValue})
              }>
              {trip.taxiHrpicker.map((item, key) => (
                <Select.Item key={key} label={item.label} value={item.value} />
              ))}
            </Select>
          </VStack>

          {/* <TextInput
            label="ชั่วโมงที่ต้องการให้คนขับรอเพิ่ม"
            left={<TextInput.Icon name="clock-time-eleven-outline" />}
            theme={{roundness: 5}}
            value={trip.hrleft}
            keyboardType="numeric"
            minLength={1}
            maxLength={1}
            // secureTextEntry={showpassword}
            // minLength={1}
            // maxLength={1}
            right={<TextInput.Affix text="ชั่วโมง" />}
            placeholder="ชั่วโมงที่ต้องการให้คนขับรอเพิ่ม"
            mode="outlined"
            // error={!data.isValidPassword && data.check_passwordChange}
            onChangeText={text => {
              setTrip({...trip, hrleft: text.replace(/[^0-9]/g, '')});
            }}
          /> */}
        </Card.Content>
      </Card>
    );
  }

  function CareCard() {
    return (
      <Card style={{marginTop: 10}}>
        {/* <Card.Title title="ผู้ดูแลติดตาม" left={LeftContent} /> */}
        <Card.Content>
          <Text style={{fontSize: 20, marginBottom: 10}}>ผู้ดูแลติดตาม</Text>
          <List.Item
            titleStyle={{color: trip.gmm_cg_time ? 'black' : 'red'}}
            onPress={() => showTimePickerCg()}
            title="เวลาเจอผู้ดูแลที่จุดนัดพบ *"
            description={trip.gmm_cg_time ? trip.gmm_cg_time : 'เลือกเวลา'}
            left={props => <List.Icon {...props} icon="clock" color="gray" />}
          />
          <Divider />

          <Divider style={{marginVertical: 10}} />

          {/* <TouchableOpacity
            onPress={() => {
              setTrip({...trip, cgstatus: !trip.cgstatus});
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Checkbox
                color="#FFC40C"
                status={trip.cgstatus ? 'checked' : 'unchecked'}
              />
              <Text>บริการผู้ดูแลติดตาม</Text>
            </View>
          </TouchableOpacity> */}
          <Text>จุดที่ต้องการเจอผู้ดูแล</Text>

          {trip.cgstatus ? (
            <View>
              <RadioButton.Group
                value={trip.cglocationvalue}
                onValueChange={value =>
                  setTrip({...trip, cglocationvalue: value})
                }>
                {trip.point.map((item, key) => (
                  <View key={key}>
                    <RadioButton.Item
                      style={{marginLeft: -15}}
                      labelStyle={{textAlign: 'left', fontSize: 14}}
                      position="leading"
                      color="#FFC40C"
                      label={item.name}
                      value={key + 1}
                    />
                    {item.location ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingLeft: 20,
                        }}>
                        <Text
                          numberOfLines={1}
                          style={{color: 'gray', fontSize: 12}}>
                          {item.location.location_name}
                        </Text>
                      </View>
                    ) : null}

                    <Divider style={{marginVertical: 5}} />
                  </View>
                ))}
              </RadioButton.Group>
            </View>
          ) : null}

          <Text style={{color: 'gray', marginTop: 10}}>
            ชั่วโมงที่ต้องการให้ผู้ดูแลรอเพิ่ม
          </Text>

          <VStack alignItems="center" space={1}>
            <Select
              selectedValue={trip.cghrleft}
              minWidth="100%"
              fontSize="14"
              padding="3"
              accessibilityLabel="ชั่วโมงที่ต้องการให้ผู้ดูแลรอเพิ่ม "
              placeholder="ชั่วโมงที่ต้องการให้ ผู้ดูแลรอเพิ่ม *"
              _selectedItem={{
                // bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={itemValue =>
                setTrip({...trip, cghrleft: itemValue})
              }>
              {trip.cgHrpicker.map((item, key) => (
                <Select.Item key={key} label={item.label} value={item.value} />
              ))}
            </Select>
          </VStack>

          {/* <TextInput
            label="ชั่วโมงที่ต้องการให้ ผู้ดูแลรอเพิ่ม"
            left={<TextInput.Icon name="clock-time-eleven-outline" />}
            right={<TextInput.Affix text="ชั่วโมง" />}
            theme={{roundness: 5}}
            value={trip.cghrleft}
            keyboardType="numeric"
            minLength={1}
            maxLength={1}
            // secureTextEntry={showpassword}
            // minLength={1}
            // maxLength={1}
            placeholder="ชั่วโมงที่ต้องการให้คนขับรอเพิ่ม"
            mode="outlined"
            // error={!data.isValidPassword && data.check_passwordChange}
            onChangeText={text => {
              setTrip({...trip, cghrleft: text.replace(/[^0-9]/g, '')});
            }}
          /> */}
        </Card.Content>
      </Card>
    );
  }

  // Geocoder.init(query.key, {language: 'th'}); // set the language

  const regionChange = e => {
    if (!onPressautocomplete) {
      console.log(e);
      console.log('in');
      clearTimeout(timoutGeo);
      setMapinputdata({...mapinputdata, location_name: '-'});
      setButtonAllow(false);
      timoutGeo = setTimeout(function () {
        console.log('out');

        coder(e.latitude, e.longitude);
      }, 3000);
    }
  };

  function renderMapview() {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          showsUserLocation
          // showsMyLocationButton={false}
          style={styles.map}
          initialRegion={myposition}
          onRegionChangeComplete={regionChange}
          ref={mapRef}></MapView>
      </View>
    );
  }

  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = query => setSearchQuery(query);

  function rederMark() {
    return (
      <Image
        style={{
          width: 40,
          height: 40,
          position: 'absolute',
          zIndex: 999999,
          top: '50%',
          alignSelf: 'center',
        }}
        resizeMode="contain"
        source={require('./map-marker.png')}
      />
      // </View>
    );
  }

  const confirmPoint = () => {
    setModalVisible(false);

    let newroute = {...trip};
    newroute.point[nowAction].bookmark.status = false;
    newroute.point[nowAction].bookmark.id = null;
    newroute.point[nowAction].location_name = mapinputdata.location_name;
    newroute.point[nowAction].location = mapinputdata;

    console.log(mapinputdata);

    console.log(trip.point.length);

    if (nowAction == 0 && trip.point.length > 2) {
      console.log(123456);
      newroute.point[trip.point.length - 1].bookmark.status = false;
      newroute.point[trip.point.length - 1].bookmark.id = null;
      newroute.point[trip.point.length - 1].location_name =
        mapinputdata.location_name;
      newroute.point[trip.point.length - 1].location = mapinputdata;
    }

    setTrip(newroute);

    // console.log(newroute);
  };

  const confirmAddFavourPoint = () => {
    console.log(1150);
    setModalAddFavourVisible(false);
    setModalrmksFavourAdd(true);

    // const openRmks = (item, key, mode) => {
    // console.log(item);

    setRmksdataFavour({
      ...rmksDataFavour,
      mode: 'add',
      name: '',
      rmks: '',
      location_name: mapinputdata.location_name,
      location: mapinputdata,
    });

    setModalrmksFavourAdd(true);

    // const [rmksDataFavour, setRmksdataFavour] = useState({
    //   mode: '',
    //   name: '',
    //   rmks: '',
    //   location_name: '',
    //   location:
    // });

    // setModalVisible(false);

    // let newroute = {...trip};
    // newroute.point[nowAction].bookmark.status = false;
    // newroute.point[nowAction].bookmark.id = null;
    // newroute.point[nowAction].location_name = mapinputdata.location_name;
    // newroute.point[nowAction].location = mapinputdata;

    // setRmksdataFavour({...rmksDataFavour,
    //   location_name:mapinputdata.location_name,
    //   location:mapinputdata})

    // console.log(trip.point.length);

    // setTrip(newroute);

    // console.log(newroute);
  };

  const addFavouriteAdd = async () => {
    console.log(rmksDataFavour);

    let datass = {
      location: rmksDataFavour.location,
      location_name: rmksDataFavour.location_name,
      name: rmksDataFavour.name,
      rmks: rmksDataFavour.rmks,
    };

    console.log(datass);
    setLoader(true);

    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'addFavouriteAdd',
        data: loginUser,
        location: datass,
      }),
    };

    fetch(url + 'booking.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        setLoader(false);

        setModalrmksFavourAdd(false);

        getFavourite();

        console.log('response', response.status);
      })
      .catch(error => {
        console.log(error);
        setLoader(false);

        // alert(error.message);
      });
  };

  const addFavourite = async e => {
    console.log(e);
    setLoader(true);

    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({key: 'addFavourite', data: loginUser, location: e}),
    };

    fetch(url + 'booking.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        setLoader(false);

        if (response.status == true) {
          let newroute = {...trip};
          // console.log(newroute);

          newroute.point[nowAction] = response.data;

          setTrip(newroute);
        } else {
        }

        console.log('response', response.status);
      })
      .catch(error => {
        console.log(error);
        setLoader(false);

        // alert(error.message);
      });
  };

  const removeFavourite = async (item, key) => {
    setNowAction(key);
    setLoader(true);
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'removeFavourite',
        data: loginUser,
        location: item,
      }),
    };
    fetch(url + 'booking.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        setLoader(false);
        if (response.status == true) {
          let newroute = {...trip};
          newroute.point[nowAction] = response.data;
          setTrip(newroute);
          // setTrip(newroute);
        } else {
        }
        console.log('response', response.status);
      })
      .catch(error => {
        console.log(error);
        setLoader(false);
        // alert(error.message);
      });
  };

  function pickmap() {
    return (
      <Modal
        isVisible={isModalVisible}
        // animationInTiming={1000}
        animationOutTiming={1000}
        style={styles.containerModal}>
        {mapMode == 'map' ? (
          <View style={{height: '100%', backgroundColor: 'red'}}>
            {rederMark()}
            <View
              style={{
                width: '100%',
                zIndex: 99,
              }}>
              <Card style={{padding: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={styles.roundButton2}
                    onPress={() => {
                      setModalVisible(false);
                    }}
                    rippleColor="rgba(0, 0, 0, .32)">
                    <Icon name="arrow-left" color="gray" size={28} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.roundButton2}
                    onPress={() => {
                      setMapMode('search');
                      getFavouriteAuto();
                    }}
                    rippleColor="rgba(0, 0, 0, .32)">
                    <Icon name="map-search-outline" color="gray" size={28} />
                  </TouchableOpacity>
                </View>
              </Card>
            </View>

            <View style={styles.mapContainer}>{renderMapview()}</View>

            <View
              style={{
                zIndex: 99999,
                position: 'absolute',
                width: '100%',
                bottom: 0,
              }}>
              <Card style={{padding: 10}}>
                <View
                  style={{
                    padding: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View style={{flex: 12}}>
                    {!buttonAllow ? (
                      <ActivityIndicator
                        animating={true}
                        color="#F7DC6F"
                        style={{alignSelf: 'flex-start'}}
                      />
                    ) : (
                      <Text numberOfLines={2}>
                        {mapinputdata.location_name}
                      </Text>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                  }}>
                  <Button
                    disabled={!buttonAllow}
                    mode="contained"
                    style={{
                      width: '100%',
                    }}
                    onPress={() => confirmPoint()}>
                    ยืนยันจุด
                  </Button>
                </View>
              </Card>
            </View>
          </View>
        ) : (
          <View style={{justifyContent: 'flex-start'}}>
            <Card style={{padding: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={styles.roundButton2}
                  onPress={() => {
                    setModalVisible(false);
                  }}
                  rippleColor="rgba(0, 0, 0, .32)">
                  <Icon name="arrow-left" color="gray" size={28} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.roundButton2}
                  onPress={() => {
                    setMapMode('map');
                  }}
                  rippleColor="rgba(0, 0, 0, .32)">
                  <Icon name="map-outline" color="gray" size={28} />
                </TouchableOpacity>
              </View>
            </Card>
            <View
              style={{
                width: '100%',
                height: '100%',
                padding: 10,
              }}>
              <GooglePlacesAutocomplete
                predefinedPlaces={favourDataAuto}
                ref={ref}
                autoFocus={true}
                placeholder="คุณต้องการไปที่ไหน"
                fetchDetails={true}
                onPress={(data, details = null) => {
                  console.log(data);
                  console.log(details);

                  if (details.type == 'favourite') {
                    // coder(data.structured_formatting.main_text);
                    let position = {
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05,
                    };

                    /////////new
                    let positions = details.geometry.location;

                    setButtonAllow(true);
                    setMapinputdata({
                      ...mapinputdata,
                      location_name: details.address.location_name,
                      position: positions,
                      country: details.countryname,
                      name: details.description,
                      rmks: details.rmks,
                    });
                    // console.log(mapinputdata);
                    ////////new
                    setMapMode('map');
                    setonPressautocomplete(true);
                    setTimeout(() => {
                      setonPressautocomplete(false);
                    }, 4000);
                    setmyPosition(position);
                  } else {
                    // coder(data.structured_formatting.main_text);
                    let position = {
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05,
                    };
                    /////////new
                    let positions = details.geometry.location;
                    let array = details.address_components;
                    const found = array.find((detail, index) => {
                      if (detail.types[0] === 'administrative_area_level_1') {
                        return detail;
                      }
                    });
                    let countryname;

                    console.log(found);
                    if (found.long_name === 'กรุงเทพมหานคร') {
                      const aumphur = array.find((detail, index) => {
                        return detail.types.find(detail => {
                          if (detail == 'sublocality_level_1') {
                            return detail;
                          }
                        });
                      });
                      const district = array.find((detail, index) => {
                        return detail.types.find(detail => {
                          if (detail == 'sublocality_level_2') {
                            return detail;
                          }
                        });
                      });
                      countryname = {
                        country: found.long_name.replace(/\s/g, ''),
                        aumphur: aumphur.long_name.replace(/\s/g, ''),
                        district: district.long_name
                          .replace(/\s/g, '')
                          .replace('แขวง', ''),
                      };
                      console.log(countryname);
                    } else {
                      const aumphur = array.find((detail, index) => {
                        return detail.types.find(detail => {
                          if (detail == 'administrative_area_level_2') {
                            return detail;
                          }
                        });
                      });
                      const district = array.find((detail, index) => {
                        return detail.types.find(detail => {
                          if (
                            detail == 'locality' ||
                            detail == 'sublocality_level_1'
                          ) {
                            return detail;
                          }
                        });
                      });

                      console.log(aumphur);
                      console.log(district);

                      countryname = {
                        country: found.long_name.replace(/\s/g, ''),
                        aumphur: aumphur.long_name
                          .replace(/\s/g, '')
                          .replace('อำเภอ', ''),
                        district: district.long_name
                          .replace(/\s/g, '')
                          .replace('ตำบล', ''),
                      };
                      console.log(countryname);
                    }
                    const country = {
                      address: data.description,
                      subAddress: countryname,
                    };
                    console.log(country);
                    setButtonAllow(true);
                    setMapinputdata({
                      ...mapinputdata,
                      location_name: data.description,
                      position: positions,
                      country: countryname,
                      name: '',
                      rmks: '',
                    });
                    console.log(mapinputdata);
                    ////////new
                    setMapMode('map');
                    setonPressautocomplete(true);
                    setTimeout(() => {
                      setonPressautocomplete(false);
                    }, 4000);
                    setmyPosition(position);
                  }
                }}
                query={query}
                enablePoweredByContainer={false}
                isFocused={() => console.log(focus)}
                renderRightButton={() => (
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity
                      onPress={() => ref.current?.setAddressText('')}>
                      <Icon
                        name="close"
                        size={18}
                        color="gray"
                        style={{marginRight: 10}}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                debounce={300}
              />
            </View>
          </View>
        )}
      </Modal>
    );
  }

  function addFavourpickmap() {
    return (
      <Modal
        isVisible={isModalAddFavourVisible}
        // animationInTiming={1000}
        animationOutTiming={1000}
        style={styles.containerModal}>
        {mapMode == 'map' ? (
          <View style={{height: '100%', backgroundColor: 'red'}}>
            {rederMark()}
            <View
              style={{
                width: '100%',
                zIndex: 99,
              }}>
              <Card style={{padding: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={styles.roundButton2}
                    onPress={() => {
                      setModalAddFavourVisible(false);
                    }}
                    rippleColor="rgba(0, 0, 0, .32)">
                    <Icon name="arrow-left" color="gray" size={28} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.roundButton2}
                    onPress={() => {
                      setMapMode('search');
                      getFavouriteAutoNoOpenModal();
                    }}
                    rippleColor="rgba(0, 0, 0, .32)">
                    <Icon name="map-search-outline" color="gray" size={28} />
                  </TouchableOpacity>
                </View>
              </Card>
            </View>

            <View style={styles.mapContainer}>{renderMapview()}</View>

            <View
              style={{
                zIndex: 99999,
                position: 'absolute',
                width: '100%',
                bottom: 0,
              }}>
              <Card style={{padding: 10}}>
                <View
                  style={{
                    padding: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View style={{flex: 12}}>
                    {!buttonAllow ? (
                      <ActivityIndicator
                        animating={true}
                        color="#F7DC6F"
                        style={{alignSelf: 'flex-start'}}
                      />
                    ) : (
                      <Text numberOfLines={2}>
                        {mapinputdata.location_name}
                      </Text>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                  }}>
                  <Button
                    disabled={!buttonAllow}
                    mode="contained"
                    style={{
                      width: '100%',
                    }}
                    onPress={() => confirmAddFavourPoint()}>
                    ยืนยันจุด
                  </Button>
                </View>
              </Card>
            </View>
          </View>
        ) : (
          <View style={{justifyContent: 'flex-start'}}>
            <Card style={{padding: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={styles.roundButton2}
                  onPress={() => {
                    setModalAddFavourVisible(false);
                  }}
                  rippleColor="rgba(0, 0, 0, .32)">
                  <Icon name="arrow-left" color="gray" size={28} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.roundButton2}
                  onPress={() => {
                    setMapMode('map');
                  }}
                  rippleColor="rgba(0, 0, 0, .32)">
                  <Icon name="map-outline" color="gray" size={28} />
                </TouchableOpacity>
              </View>
            </Card>
            <View
              style={{
                width: '100%',
                height: '100%',
                padding: 10,
              }}>
              <GooglePlacesAutocomplete
                predefinedPlaces={favourDataAuto}
                ref={ref}
                autoFocus={true}
                placeholder="คุณต้องการไปที่ไหน"
                fetchDetails={true}
                onPress={(data, details = null) => {
                  console.log(data);
                  console.log(details);

                  // coder(data.structured_formatting.main_text);
                  let position = {
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  };

                  console.log(details);

                  setMapinputdata({
                    ...mapinputdata,
                    location_name: data.description,
                  });

                  setMapMode('map');
                  setmyPosition(position);
                }}
                query={query}
                enablePoweredByContainer={false}
                isFocused={() => console.log(focus)}
                renderRightButton={() => (
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity
                      onPress={() => ref.current?.setAddressText('')}>
                      <Icon
                        name="close"
                        size={18}
                        color="gray"
                        style={{marginRight: 10}}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                debounce={300}
              />
            </View>
          </View>
        )}
      </Modal>
    );
  }

  function rmks() {
    return (
      <Modal
        isVisible={isModalrmks}
        animationInTiming={500}
        animationOutTiming={500}
        style={styles.containerModal}>
        <View style={{height: '100%'}}>
          <View
            style={{
              width: '100%',
              zIndex: 99,
            }}>
            <Card style={{padding: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={styles.roundButton2}
                  onPress={() => {
                    setModalrmks(false);
                  }}
                  rippleColor="rgba(0, 0, 0, .32)">
                  <Icon name="arrow-left" color="gray" size={28} />
                </TouchableOpacity>
                <Text style={{left: -20}}>เพิ่มรายละเอียด</Text>
                <Text></Text>
              </View>
            </Card>
          </View>

          <View style={{padding: 20}}>
            <Text style={{color: 'gray'}}>
              <Icon name="map-marker" size={26} color="#FE7569" />
              {rmksData.location_name}
            </Text>
            <Divider style={{marginTop: 10}} />
          </View>

          <ScrollView>
            <View style={{padding: 20}}>
              {rmksData.mode !== 'edit' ? (
                <View>
                  <Title>ชื่อ</Title>

                  <TextInput
                    numberOfLines={1}
                    value={rmksData.name}
                    theme={{roundness: 10}}
                    maxLength={20}
                    placeholder="ตั้งชื่อที่อยู่ของคุณเช่น บ้าน,ออฟฟิศ,โรงพยาบาล ฯลฯ"
                    mode="outlined"
                    onChangeText={text =>
                      setRmksdata({...rmksData, name: text})
                    }
                  />
                </View>
              ) : null}

              <Title style={{marginTop: 20}}>รายละเอียด</Title>
              <TextInput
                numberOfLines={5}
                value={rmksData.rmks}
                theme={{roundness: 10}}
                maxLength={100}
                placeholder="หมายเหตุถึงคนขับเช่น เข้าซอยแล้วเลี้ยวขวา , จอดรอตรงหน้าซอย"
                mode="outlined"
                multiline={true}
                onChangeText={text => setRmksdata({...rmksData, rmks: text})}
              />

              <Button
                mode="contained"
                style={{
                  marginVertical: 20,
                  width: '100%',
                }}
                onPress={() => {
                  setModalrmks(false);

                  let newroute = {...trip.point};
                  console.log(newroute);
                  newroute[nowAction].location.rmks = rmksData.rmks;
                  newroute[nowAction].location.name = rmksData.name;

                  console.log(trip.point[nowAction]);

                  if (rmksData.mode !== 'edit') {
                    addFavourite(trip.point[nowAction]);
                  }
                }}>
                ยืนยัน
              </Button>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }

  function rmksFavourAdd() {
    return (
      <Modal
        isVisible={isModalrmksFavourAdd}
        animationInTiming={500}
        animationOutTiming={500}
        style={styles.containerModal}>
        <View style={{height: '100%'}}>
          <View
            style={{
              width: '100%',
              zIndex: 99,
            }}>
            <Card style={{padding: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={styles.roundButton2}
                  onPress={() => {
                    setModalrmksFavourAdd(false);
                  }}
                  rippleColor="rgba(0, 0, 0, .32)">
                  <Icon name="arrow-left" color="gray" size={28} />
                </TouchableOpacity>
                <Text style={{left: -20}}>เพิ่มรายละเอียด</Text>
                <Text></Text>
              </View>
            </Card>
          </View>

          <View style={{padding: 20}}>
            <Text style={{color: 'gray'}}>
              <Icon name="map-marker" size={26} color="#FE7569" />
              {rmksDataFavour.location_name}
            </Text>
            <Divider style={{marginTop: 10}} />
          </View>

          <ScrollView>
            <View style={{padding: 20}}>
              {rmksDataFavour.mode !== 'edit' ? (
                <View>
                  <Title>ชื่อ</Title>

                  <TextInput
                    numberOfLines={1}
                    value={rmksDataFavour.name}
                    theme={{roundness: 10}}
                    maxLength={20}
                    placeholder="ตั้งชื่อที่อยู่ของคุณเช่น บ้าน,ออฟฟิศ,โรงพยาบาล ฯลฯ"
                    mode="outlined"
                    onChangeText={text =>
                      setRmksdataFavour({...rmksDataFavour, name: text})
                    }
                  />
                </View>
              ) : null}

              <Title style={{marginTop: 20}}>รายละเอียด</Title>
              <TextInput
                numberOfLines={5}
                value={rmksDataFavour.rmks}
                theme={{roundness: 10}}
                maxLength={100}
                placeholder="หมายเหตุถึงคนขับเช่น เข้าซอยแล้วเลี้ยวขวา , จอดรอตรงหน้าซอย"
                mode="outlined"
                multiline={true}
                onChangeText={text =>
                  setRmksdataFavour({...rmksDataFavour, rmks: text})
                }
              />

              <Button
                mode="contained"
                style={{
                  marginVertical: 20,
                  width: '100%',
                }}
                onPress={() => {
                  console.log(rmksDataFavour);
                  // setModalrmksFavourAdd(false);

                  if (rmksDataFavour.name) {
                    addFavouriteAdd();
                  } else {
                    Alert.alert(
                      'แจ้งเตือน',
                      'กรุณาตั้งชื่อที่อยู่ก่อนบันทึก',
                      [
                        {
                          text: 'OK',
                        },
                      ],
                      {cancelable: false},
                    );
                  }

                  // let newroute = {...trip.point};
                  // console.log(newroute);
                  // newroute[nowAction].location.rmks = rmksData.rmks;
                  // newroute[nowAction].location.name = rmksData.name;
                  // console.log(trip.point[nowAction]);

                  // if (rmksData.mode !== 'edit') {
                  //   addFavourite(trip.point[nowAction]);
                  // }
                }}>
                + เพิ่มที่อยู่
              </Button>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }

  const renderItem = ({item, key}) => {
    return (
      <View key={key}>
        <List.Item
          style={{padding: 10}}
          onPress={() => {
            // setModalVisible(false);
            console.log(item);

            let newroute = {...trip};
            newroute.point[nowAction].bookmark.status = true;
            newroute.point[nowAction].bookmark.id = item.favourite_nbr;
            newroute.point[nowAction].location_name = item.favourite_address;

            newroute.point[nowAction].location = item.location;

            if (nowAction == 0 && trip.point.length > 2) {
              console.log(123456);
              newroute.point[trip.point.length - 1].bookmark.status = true;
              newroute.point[trip.point.length - 1].bookmark.id =
                item.favourite_nbr;
              newroute.point[trip.point.length - 1].location_name =
                mapinputdata.favourite_address;
              newroute.point[trip.point.length - 1].location = item.location;
            }

            // setTrip(newroute);

            setTrip(newroute);
            setModalFavour(false);
          }}
          title={item.favourite_name}
          description={item.favourite_address}
          left={props => (
            <Icon
              name="map-marker"
              size={26}
              color="#FE7569"
              style={{alignSelf: 'center'}}
            />
          )}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <Divider />
      </View>
    );
  };

  function favour() {
    return (
      <Modal
        isVisible={isModalFavour}
        animationInTiming={800}
        animationOutTiming={800}
        style={[styles.containerModal]}>
        <View style={{height: '100%'}}>
          <View
            style={{
              flexDirection: 'row',
              padding: 20,
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 30}}>ที่อยู่โปรด</Text>
            <TouchableOpacity
              onPress={() => {
                setModalFavour(false);
              }}>
              <Avatar.Icon
                size={50}
                style={{backgroundColor: 'white'}}
                icon="close"
              />
            </TouchableOpacity>
          </View>

          <View style={{paddingHorizontal: 20}}>
            <TouchableOpacity
              onPress={() => {
                setModalFavour(false);
                navigation.navigate('Favourite');
              }}>
              <Text style={{textAlign: 'right', color: '#2980B9'}}>แก้ไข</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={favourData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
          />

          <View>
            <Divider />

            <List.Item
              style={{padding: 10}}
              onPress={() => {
                setModalAddFavourVisible(true);

                Geolocation.getCurrentPosition(
                  position => {
                    console.log(position);
                    const {longitude, latitude} = position.coords;
                    let toRegion = {
                      latitude: latitude,
                      longitude: longitude,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    };

                    console.log(longitude, latitude);
                    setmyPosition(toRegion);

                    // mapRef.current.animateToRegion(toRegion, 2000);
                  },
                  error => alert(error.message),
                  {timeout: 20000, distanceFilter: 0},
                );
              }}
              title="เพิ่มที่อยู่โปรด"
              left={props => (
                <Icon
                  name="plus"
                  size={26}
                  color="#FE7569"
                  style={{alignSelf: 'center'}}
                />
              )}
              // right={props => <List.Icon {...props} icon="plus" />}
            />
            <Divider />
          </View>
        </View>
      </Modal>
    );
  }

  function findautoassign() {
    return (
      <Modal
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={ismodalautoassign}
        onDismiss={() => setismodalautoassign(false)}
        // animationInTiming={1000}
        // animationOutTiming={1000}
        style={[styles.containerModal, {backgroundColor: '#FFFF'}]}>
        <StatusBar
          // translucent
          animated={true}
          backgroundColor="#FFFF"
          barStyle="dark-content"
          showHideTransition="fade"
        />

        <SafeAreaView style={{flex: 1, backgroundColor: '#FFFF'}}>
          {/* <TouchableRipple onPress={() => setismodalautoassign(false)}>
            <View>
              <Text>asdasd</Text>
            </View>
          </TouchableRipple> */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              zIndex: 99999,
              position: 'absolute',
              left: 20,
              top: 20,
            }}
            onPress={() => setismodalautoassign(false)}>
            <Icon name="arrow-left" color="gray" size={28} />
            <Text style={{marginHorizontal: 10}}>ย้อนกลับ</Text>
          </TouchableOpacity>
          {!loading ? (
            <View style={{flex: 1}}>
              {taxiResponse.status ? findTrue() : findFalse()}
            </View>
          ) : (
            <View style={[styles.container, {backgroundColor: '#FFFF'}]}>
              <View></View>

              <View>
                <View
                  style={{
                    padding: 20,
                    height: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    // backgroundColor:'red'
                  }}>
                  <Title style={{top: '20%'}}>กำลังค้นหาคนขับ. . . </Title>

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
      </Modal>
    );
  }

  function findTrue() {
    return (
      <View
        style={[
          {
            flex: 1,
            justifyContent: 'space-between',
          },
        ]}>
        <View
          style={{
            paddingHorizontal: 20,
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}>
          <Title style={{textAlign: 'center'}}>
            เราเลือกคนขับให้คุณได้แล้วกดถัดไปเพื่อทำรายการต่อ
          </Title>

          <View style={{justifyContent: 'center'}}>
            <LottieView
              style={{height: 300, width: '100%', alignItems: 'center'}}
              source={require('../79952-successful')}
              autoPlay
              loop
            />
          </View>
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
              justifyContent: 'center',
            }}
            onPress={() => {
              setismodalautoassign(false);

              // navigation.navigate('Booking4', {trip: trip});
              navigation.navigate('Booking5', {trip: {...trip}});

              // if (trip.gmm_product_cg_radio == 'ON') {
              //   navigation.navigate('Booking4', {trip: trip});
              // } else {
              //   navigation.navigate('Booking5', {trip: {...trip}});
              // }
            }}>
            ถัดไป
          </Button>
        </Card>
      </View>
    );
  }

  function findFalse() {
    return (
      <View
        style={[
          {
            flex: 1,
            justifyContent: 'space-between',
          },
        ]}>
        <View
          style={{
            paddingHorizontal: 20,
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}>
          <Title style={{textAlign: 'center'}}>
            ไม่เจอคนขับที่ว่างในพื้นที่เดินทางดังกล่างกดย้อนกลับเพื่อเลือกวันเวลาในการเดินทางใหม่
          </Title>

          <View style={{justifyContent: 'center'}}>
            <LottieView
              style={{height: 200, width: '100%', alignItems: 'center'}}
              source={require('../10110-sad')}
              autoPlay
              loop
            />
          </View>
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
              justifyContent: 'center',
            }}
            onPress={() => {
              setismodalautoassign(false);
            }}>
            ย้อนกลับ
          </Button>
        </Card>
      </View>
    );
  }

  const openPickMap = (item, key) => {
    console.log(item);
    setNowAction(key);

    if (item.location) {
      console.log(true);
      setMapinputdata({
        ...mapinputdata,
        location_name: item.location.location_name,
        position: item.location.position,
        country: item.location.country,
      });

      setButtonAllow(false);
      setonPressautocomplete(true);
      setModalVisible(true);

      let initPosition = {
        latitude: Number(item.location.position.lat),
        longitude: Number(item.location.position.lng),
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      setmyPosition(initPosition);
      setMapMode('map');

      setTimeout(() => {
        setButtonAllow(true);

        setonPressautocomplete(false);
      }, 5000);
    } else {
      getFavouriteAuto();

      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
          const {longitude, latitude} = position.coords;
          let toRegion = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };

          console.log(longitude, latitude);
          setmyPosition(toRegion);

          // mapRef.current.animateToRegion(toRegion, 2000);
        },
        error => alert(error.message),
        {timeout: 20000, distanceFilter: 0},
      );

      setMapinputdata({});
    }
  };

  const openRmks = (item, key, mode) => {
    console.log(item);
    setNowAction(key);

    setRmksdata({
      ...rmksData,
      mode: mode,
      rmks: item.location.rmks,
      location_name: item.location_name,
    });

    setModalrmks(true);
  };

  const openFavour = async key => {
    setNowAction(key);
    setLoader(true);
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'getFavourite',
        data: loginUser,
      }),
    };
    fetch(url + 'booking.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        setLoader(false);
        setModalFavour(true);

        if (response.status == true) {
          setFavourData(response.data);
        } else {
          setFavourData(response.data);
        }
        console.log('response', response);
      })
      .catch(error => {
        console.log(error);
        setLoader(false);
        // alert(error.message);
      });
  };

  const getFavourite = async () => {
    setLoader(true);

    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'getFavourite',
        data: loginUser,
      }),
    };
    fetch(url + 'booking.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        setLoader(false);

        if (response.status == true) {
          setFavourData(response.data);
        } else {
          setFavourData(response.data);
        }
        console.log('response', response);
      })
      .catch(error => {
        console.log(error);
        setLoader(false);
        // alert(error.message);
      });
  };

  const getFavouriteAuto = async () => {
    setLoader(true);
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'getFavouriteAuto',
        data: loginUser,
      }),
    };
    fetch(url + 'booking.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        setFavourDataAuto(response.data);

        setTimeout(() => {
          setModalVisible(true);
          setLoader(false);

          setMapMode('search');
        }, 1000);

        // }
        console.log('response', response);
      })
      .catch(error => {
        console.log(error);
        // setLoader(false);
        // alert(error.message);
      });
  };

  const getFavouriteAutoNoOpenModal = async () => {
    setLoader(true);
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'getFavouriteAuto',
        data: loginUser,
      }),
    };
    fetch(url + 'booking.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        setFavourDataAuto(response.data);

        setTimeout(() => {
          setModalVisible(true);
          setLoader(false);

          setMapMode('search');
        }, 1000);

        // }
        console.log('response', response);
      })
      .catch(error => {
        console.log(error);
        // setLoader(false);
        // alert(error.message);
      });
  };

  const getTaxi = async () => {
    console.log(trip);
    // setLoader(true);

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        // key: 'findTaxi',
        key: 'calculateTaxiCg',
        position: {
          aumphur: trip.point[0].location.country.aumphur,
          tumbol: trip.point[0].location.country.district,
          date: trip.date.date,
          time: trip.date.time,
        },
        trip: trip,
      }),
    };

    fetch(url + 'autoassign.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        setTimeout(() => {
          console.log('response :', response);
          console.log(trip);
          if (response.status == true) {
            setTaxiResponse({...taxiResponse, status: true});

            setTrip({
              ...trip,
              taxiSelect: response.taxi.data,
              cgSelect: response.cg ? response.cg.data : false,
            });

            let lastTrip = {...trip};

            console.log(lastTrip);

            // if (response.favour == false) {
            //   console.log(response.data);
            //   setTrip({
            //     ...trip,
            //     taxiSelect: response.data,
            //     passengerSelect: route.params.passenger,
            //   });
            // }
          } else {
            setTaxiResponse({...taxiResponse, status: false});

            // setTaxi({...taxi, message: response.message, status: false});
          }

          setLoading(false);
          // Animated.timing(fadeAnim, {
          //   toValue: 1,
          //   duration: 1000,
          // }).start();
          // setBarcolor('#FFC40C');
        }, 2000);
      })
      .catch(error => {
        console.log(error);
        setLoader(false);

        // alert(error.message);
      });
  };

  const selectTaxi = () => {
    // alert(trip.passengerSelect)
    // console.log(trip);

    // setTimeout(() => {
    //   setLoading(false);
    // }, 5000);

    let passengerStatus = trip.passengerSelect ? true : false;

    let tripDateStatus = () => {
      const {date} = {...trip};
      if (date.date && date.time) {
        return true;
      } else {
        return false;
      }
    };

    let tripPoint = () => {
      const {point} = {...trip};
      console.log(point);

      return point.find(element => element.location == null);
    };

    let tripPointStatus = !tripPoint() ? true : false;

    if (passengerStatus && tripDateStatus() && tripPointStatus) {
      setismodalautoassign(true);
      setLoading(true);
      getTaxi();
      // navigation.navigate('Booking3', {passenger: data.passenger, trip: trip});
    } else {
      Alert.alert(
        'แจ้งเตือน',
        'ข้อมูลในการเดินทางไม่ครบถ้วนโปรดระบุ ผู้โดยสาร , วันเวลา ,สถานที่รับส่ง',
        [
          {
            text: 'OK',
            onPress: () => {
              if (!tripPointStatus) {
                scrollRef.current?.scrollTo({
                  y: 200,
                  animated: true,
                });
              }

              if (!passengerStatus || !tripDateStatus()) {
                scrollRef.current?.scrollTo({
                  y: 0,
                  animated: true,
                });
              }
            },
          },
        ],
        {cancelable: false},
      );
    }
  };

  return (
    <View style={styles.container}>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onChange={ontestChange}
        minimumDate={new Date(trip.datestart)}
        maximumDate={new Date(trip.dateend)}
        // maxDate="2021-10-28"
        onConfirm={dateConfirm}
        onCancel={hideDatePicker}
      />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onChange={ontestChange}
        minuteInterval={trip.minuteInterval}
        locale="th_TH"
        display="spinner"
        onConfirm={timeConfirm}
        onCancel={hideTimePicker}
      />

      <DateTimePickerModal
        isVisible={isTimePickerCgVisible}
        mode="time"
        onChange={ontestChange}
        minuteInterval={trip.minuteInterval}
        locale="th_TH"
        display="spinner"
        onConfirm={timeCgConfirm}
        onCancel={hideTimeCgPicker}
      />

      <Loader visible={loader} />

      {steper()}
      {pickmap()}
      {addFavourpickmap()}
      {rmks()}
      {rmksFavourAdd()}
      {favour()}
      {findautoassign()}

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View>
          {passengerCard()}
          {locationCard()}

          {trip.gmm_product_drop > 2 ? <View>{taxiHours()}</View> : null}

          {trip.gmm_product_cg_radio == 'ON' ? <View>{CareCard()}</View> : null}

          <Button
            mode="contained"
            contentStyle={{height: 60}}
            style={{
              borderRadius: 10,
              margin: 20,
              justifyContent: 'center',
            }}
            onPress={() => selectTaxi()}>
            ค้นหาคนขับรถ
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default Booking2;

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
    // paddingHorizontal: 0,
    flex: 1,
    backgroundColor: 'rgb(232, 232, 232)',
    // alignItems: 'center',
    justifyContent: 'center',
    // width:'100%'
    // height:'200%'
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
