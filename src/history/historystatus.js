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
  Avatar,
} from 'react-native-paper';
import Modal from 'react-native-modal';





import {url as urls} from '../center/url';
import Loader from '../center/Loader';
import {ListItem} from 'react-native-elements';
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
      swipeToCloseEnabled={false}
      onRequestClose={() => props.setVisible(false)}
    />
  );
};

const Historystatus = props => {
  const [loader, setLoader] = React.useState(false);
  const {modalVisible, setModalVisible, bookingnbr, setBookingnbr} = props;

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
        console.log(response);
        setStatusList(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    getStatus();
    //Put your Data loading function here instead of my loadData()
  }, []);

  return (
    <Modal
      statusBarTranslucent={true}
      isVisible={modalVisible}
      animationInTiming={800}
      onBackButtonPress={() => setModalVisible(false)}
      style={[styles.containerModal]}>
      <SafeAreaView
        style={{
          marginTop: StatusBar.currentHeight,
          flex: 1,
        }}>
          <View style={{flex:1,paddingHorizontal:10}}>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontSize: 30}}>สถานะการเดินทาง</Text>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}>
            <Avatar.Icon
              size={50}
              style={{backgroundColor: 'white'}}
              icon="close"
            />
          </TouchableOpacity>
        </View>
        {/* <View style={{flex:1,paddingVertical:20}}> */}


        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          {statusList.map((item, key) => (
            <Card
              style={{
                borderRadius: 10,
                margin: 5,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.36,
                shadowRadius: 6.68,
                elevation: 5,
              }}
              key={key}>
              <Card.Content>
                <View>
                  <Title>{item.gmm_booking_ac_message1}</Title>
                  <Text style={{color: 'gray', fontSize: 12}}>
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
                          marginTop: 5,
                        }}>
                        <Icon
                          name="map-marker"
                          size={26}
                          color="#FE7569"
                          style={{marginLeft: 5}}
                        />
                        <Text
                          style={{color: 'gray', paddingRight: 20}}
                          numberOfLines={4}>
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
                        marginTop: 10,
                        flex: 1,
                        height: 300,
                        flexDirection: 'row',
                      }}>
                      {item.picpath.map((img, keys) => (
                        <Image
                          key={keys}
                          style={{flex: 1, height: '100%', marginHorizontal: 2}}
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

          <ImageViews
            visible={visible}
            setVisible={setVisible}
            images={images}
          />
        </ScrollView>
        {/* </View> */}
        </View>

      </SafeAreaView>
    </Modal>
  );
};

export default Historystatus;
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
  containerModal: {
    margin: 0,
    justifyContent: 'flex-start',
    backgroundColor: '#ffff',
  },
});
