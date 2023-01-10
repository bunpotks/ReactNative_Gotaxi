import React, {useState, useEffect, useRef} from 'react';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {
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
  Linking,
  Modal,
  Pressable,
} from 'react-native';

import {
  TextInput,
  Checkbox,
  IconButton,
  TouchableRipple,
  Banner,
  Paragraph,
  Button,
  Portal,
  Dialog,
  Colors,
  Card,
  Title,
  Text,
} from 'react-native-paper';
import {url as urls} from '../center/url';
import Loader from '../center/Loader';
import {ListItem, Avatar} from 'react-native-elements';
// import MapView from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Geocoder from 'react-native-geocoding';

import ImageView from 'react-native-image-viewing';

import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
  Animated,
} from 'react-native-maps';
import {style} from 'dom-helpers';
const url = urls.url;
const STORAGE_KEY = '@login';

const ImageViews = props => {
  return (
    <ImageView
      images={props.images}
      imageIndex={0}
      visible={props.visible}
      onRequestClose={() => props.setVisible(false)}
    />
  );
};

const MonitorStatus = props => {
  const [loader, setLoader] = React.useState(false);
  const [bookingnbr, setBookingnbr] = useState(props.route.params.bookingnbr);
  const [statusList, setStatusList] = useState([]);

  const [visible, setVisible] = useState(false);

  const [images, setImages] = React.useState([
    {
      uri: 'https://images.unsplash.com/photo-1571501679680-de32f1e7aad4',
    },
    {
      uri: 'https://images.unsplash.com/photo-1573273787173-0eb81a833b34',
    },
    {
      uri: 'https://images.unsplash.com/photo-1569569970363-df7b6160d111',
    },
  ]);

  const getStatus = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'getStatus',
        user: loginUser,
        bookingnbr: bookingnbr,
      }),
    };

    fetch(url + 'monitor.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        // console.log(response);
        setStatusList(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getStatus();
      //Put your Data loading function here instead of my loadData()
    });

    return unsubscribe;
  }, [props.navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Title numberOfLines={1}>รายละเอียดการเดินทาง</Title>
        {statusList.map((item, key) => (
          <Card style={{borderRadius: 10, marginVertical: 5}} key={key}>
            <Card.Content>
              <View>
                <Title>{item.gmm_booking_ac_message1}</Title>
                <Text style={{color: 'gray'}}>
                  {item.monthdesc.monthdesc} {item.monthdesc.time}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  {item.gmm_location_address ? (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                      }}>
                      <Icon
                        name="map-marker"
                        size={26}
                        color="#FE7569"
                        style={{marginLeft: 5}}
                      />
                      <Text style={{color: 'gray'}} numberOfLines={4}>
                        {item.gmm_location_address}
                      </Text>
                    </View>
                  ) : null}
                </View>
                {item.gmm_booking_ac_camera == 'ต้องการ' ? (
                  <TouchableOpacity
                    onPress={() => {
                      let img = [];
                      for (let i = 0; i < item.picpath.length; i++) {
                        console.log(item.picpath[i]);
                        img.push({uri: item.picpath[i].gmm_pic_store});
                      }
                      setImages(img);
                      setVisible(true);
                    }}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                    }}>
                    {item.picpath.map((img, keys) => (
                      <Image
                        key={keys}
                        style={{flex: 1, height: 100, marginHorizontal: 2}}
                        resizeMode="cover"
                        source={{
                          uri: img.gmm_pic_store,
                        }}
                      />
                    ))}
                  </TouchableOpacity>
                ) : null}

                <View></View>
              </View>
            </Card.Content>
          </Card>
        ))}
        {statusList.length == 0 ? (
          <Text style={{textAlign: 'center', marginTop: 20}}>
            รายการนี้ยังไม่เริ่มเดินทาง
          </Text>
        ) : null}

        {/* <Card style={{borderRadius: 10, marginVertical: 5}}>
          <Card.Content>
            <View>
              <Title>08:00 น. ถึงจุดรับ</Title>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    flex: 1,
                  }}>
                  <Text style={{color: 'gray'}} numberOfLines={4}>
                    62/40 เขตบางกอกใหญ่ วัดท่าพระ กรุงเทพมหานคร
                    กรุงเทพมหานครกรุงเทพมหานครกรุงเทพมหานครกรุงเทพมหานครกรุงเทพมหานครกรุงเทพมหานครกรุงเทพมหานคร
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setVisible(true)}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                  }}>
                  <Image
                    style={{flex: 1, height: 100, marginHorizontal: 2}}
                    resizeMode="cover"
                    source={{
                      uri: images[0].uri,
                    }}
                  />

                  <Image
                    style={{flex: 1, height: 100, marginHorizontal: 2}}
                    resizeMode="cover"
                    source={{
                      uri: images[1].uri,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={{borderRadius: 10, marginVertical: 5}}>
          <Card.Content>
            <View>
              <Title>08:00 น. ถึงจุดรับ</Title>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    flex: 1,
                  }}>
                  <Text style={{color: 'gray'}} numberOfLines={4}>
                    62/40 เขตบางกอกใหญ่ วัดท่าพระ กรุงเทพมหานคร
                    กรุงเทพมหานครกรุงเทพมหานครกรุงเทพมหานครกรุงเทพมหานครกรุงเทพมหานครกรุงเทพมหานครกรุงเทพมหานคร
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                  }}>
                  <Image
                    style={{flex: 1, height: 100}}
                    resizeMode="contain"
                    source={{
                      uri: 'http://203.154.158.121/Mobile/img/GomammaWithText.png',
                    }}
                  />
                </View>
              </View>
            </View>
          </Card.Content>
        </Card> */}

        <ImageViews visible={visible} setVisible={setVisible} images={images} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MonitorStatus;
const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  roundButton1: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: 'white',
    textAlign: 'center',
  },
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
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    // alignItems: 'center',
    // marginTop: 22,
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    // padding: 35,
    alignItems: 'center',
    // width: '100%',
    height: '20%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  lineBreak: {
    marginVertical: 10,
    backgroundColor: 'rgba(232, 232, 232,0.5)',
    height: 1,
  },
});
