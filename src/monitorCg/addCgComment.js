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

import {useToast} from 'react-native-toast-notifications';

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

const AddCgComment = props => {
  console.log('999');
  const {modalVisible, setModalVisible, booking, loader, setLoader} = props;

  const [visible, setVisible] = useState(false);
  const [response, setResponse] = React.useState(null);
  const [imageuri, setimguri] = useState([]);
  const [commentText, setCommentText] = useState('');

  const toast = useToast();

  useEffect(() => {
    setCommentText('');
    setimguri([]);

    if(Platform.OS =='android'){
      requestCameraPermission();

    }
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

 
      }
    });
  };

  const addComment = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    if (commentText || imageuri.length > 0) {
      // setLoader(true);
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 20,
            backgroundColor: '#FFC40C',
          }}>
          <Text style={{fontSize: 30}}>เพิ่มรายละเอียดผู้ดูแล</Text>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}>
            <Avatar.Icon size={50} icon="close" />
          </TouchableOpacity>
        </View>
        <Divider />

        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={{height: 200}}>
            <TextInput
              right={<TextInput.Affix text={commentText.length + '/255'} />}
              mode="flat"
              theme={{roundness: 10}}
              maxLength={255}
              multiline={true}
              label="เพิ่มรายละเอียดการบันทึกของผู้โดยสาร"
              placeholder="เพิ่มรายละเอียดการบันทึกของผู้โดยสาร"
              onChangeText={text => {
                setCommentText(text);
              }}
              style={{
                borderColor: 'white',
                borderWidth: 0,
                backgroundColor: 'transparent',
                fontSize: 24,
              }}
              numberOfLines={5}
            />
          </View>
          <View style={{padding: 20}}>
            <View style={{marginBottom: 10}}>
              <Text style={{textAlign: 'right'}}>
                {imageuri.length} / {imgCount}
              </Text>
            </View>

            {imageuri.length > 0 ? (
              <View
                style={{
                  backgroundColor: 'white',
                  height: 100,
                  flexDirection: 'row',
                }}>
                <ScrollView horizontal={true}>
                  {imageuri.map((item, key) => (
                    <View key={key}>
                      <Image
                        resizeMode="cover"
                        key={key}
                        source={{uri: item}}
                        style={{
                          height: 100,
                          width: 100,
                          borderRadius: 5,
                          borderWidth: 0.2,
                          borderColor: 'gray',
                        }}
                      />
                      <TouchableOpacity
                        style={{position: 'absolute', right: 0, padding: 5}}
                        onPress={() => {
                          let newarr = [...imageuri];
                          newarr.splice(key, 1);
                          setimguri(newarr);
                        }}>
                        <Icon name="trash-can" size={24} color="red" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            ) : null}

            <View style={{alignSelf: 'center', marginTop: 10}}>
              <Divider />

              <TouchableRipple onPress={() => launchCameras()}>
                <View
                  style={{
                    paddingVertical: 20,
                    paddingHorizontal: 20,
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon name="file-image" color="#ADFF2F" size={24} />
                  <Text style={{width: '100%', marginLeft: 5, fontSize: 18}}>
                    แนบรูปภาพ
                  </Text>
                </View>
              </TouchableRipple>
              <Divider />
            </View>
            <View style={{alignSelf: 'center'}}>
              <TouchableRipple onPress={() => takeCameras()}>
                <View
                  style={{
                    paddingVertical: 20,
                    paddingHorizontal: 20,
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon name="camera" color="#00BFFF" size={24} />
                  <Text style={{width: '100%', marginLeft: 5, fontSize: 18}}>
                    ถ่ายรูป
                  </Text>
                </View>
              </TouchableRipple>
              <Divider />
            </View>
          </View>
        </ScrollView>
        <Divider />
        <Button
          mode="contained"
          disabled={!commentText && imageuri.length <= 0}
          contentStyle={{height: 50}}
          style={{
            // flex: 2,
            // padding:10,
            // marginHorizontal:10,
            borderRadius: 10,
            marginVertical: 10,
            marginHorizontal: 10,
            justifyContent: 'center',
          }}
          onPress={() => {
            addComment();
          }}>
          ยืนยัน
        </Button>
      </SafeAreaView>
    </Modal>
  );
};

export default AddCgComment;
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
