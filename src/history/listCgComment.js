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
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const {modalVisible, setModalVisible, booking} = props;
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

  return (
    <Modal
      statusBarTranslucent={true}
      isVisible={modalVisible}
      animationInTiming={800}
      animationOutTiming={800}
      onBackButtonPress={() => setModalVisible(false)}
      style={[styles.containerModal]}>
      <SafeAreaView
        style={{
          marginTop: StatusBar.currentHeight,
          flex: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          }}>
          <Text style={{fontSize: 30}}>รายการบันทึก</Text>
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

        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <ImageView
            images={imageViewValue}
            imageIndex={imageViewIndex}
            visible={imageViewVisible}
            onRequestClose={() => setImageViewVisible(false)}
          />
          <View>
            {commentList.length > 0 ? (
              <>
                {commentList.map((item, key) => (
                  <View>
                    <Card
                      mode="elevated"
                      style={{
                        marginHorizontal: 20,
                        padding: 10,
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
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Avatar.Image
                          size={30}
                          source={{
                            uri: 'http://backoffice.go-mamma.com/image/cgicon.png',
                          }}
                        />
                        <View style={{paddingHorizontal: 10}}>
                          <View style={{flexDirection: 'row'}}>
                            <Text>ผู้ดูแล</Text>
                          </View>

                          <Text style={{color: 'gray'}}>
                            {item.monthdesc.monthdesc} {item.monthdesc.time}
                          </Text>
                        </View>
                      </View>
                      <Paragraph style={{marginTop: 10}}>
                        {item.gmm_comment_desc}
                      </Paragraph>
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
                              <Card.Cover
                                resizeMode="cover"
                                source={{uri: items.gmm_pic_store}}
                                style={{width: 200, marginHorizontal: 10}}
                              />
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </Card>
                  </View>
                ))}
              </>
            ) : (
              <Text style={{textAlign: 'center', color: 'gray'}}>
                ยังไม่มีรายการบันทึก
              </Text>
            )}
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
