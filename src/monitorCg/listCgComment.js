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
  PermissionsAndroid,
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
  Divider,
} from 'react-native-paper';
import Modal from 'react-native-modal';

import {url as urls} from '../center/url';
import Loader from '../center/Loader';
import {ListItem} from 'react-native-elements';
// import MapView from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import ImagePicker from 'react-native-image-picker';

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

const imgCount = 5;

const ListCgComment = props => {
  const {modalVisible, setModalVisible, booking, loader, setLoader} = props;
  const [commentList, setCommentList] = useState([]);

  const [imageViewVisible, setImageViewVisible] = useState(false);
  const [imageViewIndex, setImageVieIndex] = useState(0);

  const [imageViewValue, setImageViewValue] = useState([
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

  const getCommentList = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'listCommentCg',
        user: loginUser,
        booking: booking,
      }),
    };

    fetch(url + 'monitor.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setCommentList(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    getCommentList();
  }, [modalVisible]);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const launchCameras = async () => {
    launchImageLibrary(
      {
        maxHeight: 800,
        maxWidth: 800,
        selectionLimit: 2,
        mediaType: 'photo',
        includeBase64: true,
        // includeExtra:true,
      },
      e => {
        let img = e.assets;
        let myimage = [...imageuri];

        if (img) {
          let lastImg = imgCount - myimage.length;
          if (lastImg <= 0) {
            Alert.alert(
              'แจ้งเตือน',
              'สามารถเพิ่มรูปภาพได้ไม่เกิน 5 รูปต่อ 1 ครั้ง',
            );
          } else {
            for (let i = 0; i < img.length; i++) {
              let baes64 = 'data:image/png;base64, ' + img[i].base64;
              myimage.push(baes64);
            }

            setimguri(myimage);
          }

          console.log(imageuri);
        }
      },
    );
  };

  const takeCameras = async () => {
    let options = {
      saveToPhotos: false,
      mediaType: 'photo',
      includeBase64: true,
    };
    launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let img = response.assets;
        let myimage = [...imageuri];

        if (img) {
          for (let i = 0; i < img.length; i++) {
            let baes64 = 'data:image/png;base64, ' + img[i].base64;
            myimage.push(baes64);
          }

          setimguri(myimage);
          console.log(imageuri);
        }

        // console.log('response', JSON.stringify(response));
        // this.setState({
        //   filePath: response,
        //   fileData: response.data,
        //   fileUri: response.uri
        // });
      }
    });
  };

  const addComment = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    if (commentText || imageuri.length > 0) {
      setLoader(true);
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          key: 'addCommentCg',
          user: loginUser,
          booking: booking,
          desc: commentText,
          img: imageuri,
        }),
      };

      fetch(url + 'monitor.php', requestOptions)
        .then(response => response.json())
        .then(response => {
          console.log(response);
          setLoader(false);
          setModalVisible(false);

          Alert.alert('แจ้งเตือน', 'บันทึกข้อมูลสำเร็จ');
        })
        .catch(error => {
          console.log(error);
          setLoader(false);
        });
    } else {
      Alert.alert('แจ้งเตือน', 'ข้อมูลไม่ครบถ้วน');
    }
  };

  return (
    <Modal
      isVisible={modalVisible}
      animationInTiming={800}
      animationOutTiming={800}
      onBackButtonPress={() => setModalVisible(false)}
      style={[styles.containerModal]}>
      <SafeAreaView style={[styles.container, {padding: 0}]}>
        <ImageView
          images={imageViewValue}
          imageIndex={imageViewIndex}
          visible={imageViewVisible}
          onRequestClose={() => setImageViewVisible(false)}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 20,
            backgroundColor: '#FFC40C',
          }}>
          <Text style={{fontSize: 30}}>รายการบันทึก</Text>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}>
            <Avatar.Icon
              size={50}
              //   style={{backgroundColor: 'white'}}
              icon="close"
            />
          </TouchableOpacity>
        </View>
        <Divider />

        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={{backgroundColor:'#DCDCDC'}}>
            {commentList.map((item, key) => (
              <Card
                style={{ marginVertical: 5}}
                key={key}>
                <Card.Content>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar.Image
                      size={30}
                      source={{
                        uri: 'https://backoffice.go-mamma.com/image/cgicon.png',
                      }}
                    />
                    <View style={{paddingHorizontal: 10}}>
                      <View style={{flexDirection: 'row'}}>
                        {/* <Text>บรรพต คล้ายศร</Text> */}
                        <Text >ผู้ดูแล</Text>
                      </View>

                      <Text style={{color: 'gray'}}>
                        เมื่อ {item.monthdesc.monthdesc} {item.monthdesc.time}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
                {item.gmm_comment_desc ? (
                  <Card.Content style={{paddingVertical: 10}}>
                    <Divider style={{marginVertical: 10}} />

                    <Text  selectable={true} selectionColor='orange'>{item.gmm_comment_desc}</Text>
                  </Card.Content>
                ) : null}

                {item.picpath.length > 0 ? (
                  <Divider />
                ) : null}

                <View>
                  <View style={{flexDirection: 'row'}}>
                    <ScrollView horizontal={true}>
                      {item.picpath.map((items, keys) => (
                        <TouchableOpacity
                          key={keys}
                          onPress={() => {
                            console.log(item.picpath);
                            let newitem = [];
                            for (let i = 0; i < item.picpath.length; i++) {
                              newitem.push({
                                uri: item.picpath[i].gmm_pic_store,
                              });
                            }
                            setImageViewValue(newitem);
                            setImageVieIndex(keys);

                            setImageViewVisible(true);
                          }}>
                          <Image
                            resizeMode="cover"
                            style={{
                              height: 100,
                              width: 120,
                              margin: 5,
                              borderRadius: 10,
                            }}
                            source={{
                              uri: items.gmm_pic_store,
                            }}
                          />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </Card>
            ))}

            {/* {commentList.map((item, key) => (
              <Card
                key={key}
                style={{ marginBottom: 10}}>
                <Card.Content style={{padding: 20}}>
                  <View style={{marginVertical: 10}}>
                    <View style={{marginVertical: 10}}>
                      <Text>
                        เวลาบันทึก : {item.monthdesc.monthdesc}{' '}
                        {item.monthdesc.time}
                      </Text>
                    </View>
                  </View>
                  <Text>
                    <Divider />
                    รายละเอียดการบันทึก :{item.gmm_comment_desc}
                  </Text>
                </Card.Content >
                <View>
                  <View style={{flexDirection: 'row', paddingHorizontal: 10}}>
                    <ScrollView horizontal={true}>
                      {item.picpath.map((items, keys) => (
                        <TouchableOpacity
                          key={keys}
                          onPress={() => {
                            console.log(item.picpath);
                            let newitem = [];
                            for (let i = 0; i < item.picpath.length; i++) {
                              newitem.push({
                                uri: item.picpath[i].gmm_pic_store,
                              });
                            }
                            setImageViewValue(newitem);
                            setImageVieIndex(keys);

                            setImageViewVisible(true);
                          }}>
                          <Image
                            resizeMode="cover"
                            style={{
                              height: 150,
                              width: 150,
                              margin: 5,
                              borderRadius: 10,
                            }}
                            source={{
                              uri: items.gmm_pic_store,
                            }}
                          />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </Card>
            ))} */}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default ListCgComment;

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
