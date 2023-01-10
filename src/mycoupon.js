import React, {useState, useEffect, useCallback} from 'react';

import {
  StyleSheet,
  // Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Alert,
  Animated,
  Image,
  FlatList,
} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swiper from 'react-native-swiper';

import {
  Text,
  Card,
  Button,
  Title,
  Paragraph,
  Checkbox,
  TouchableRipple,
  Banner,
  Portal,
  Dialog,
  Avatar,
  Divider,
  RadioButton,
  HelperText,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {Tooltip} from 'react-native-elements';
import {
  Actionsheet,
  useDisclose,
  Box,
  Center,
  NativeBaseProvider,
} from 'native-base';

import {url as urls} from './center/url';
import Loader from './center/Loader';

import Modal from 'react-native-modal';
import PushNotification, {Importance} from 'react-native-push-notification';


const url = urls.url;
const STORAGE_KEY = '@login';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function Coupon({route, navigation}) {
  const [coupon, setMycoupon] = useState([]);
  const [loading, setLoading] = useState(false);
  const {isOpen, onOpen, onClose} = useDisclose();

  const [loader, setLoader] = useState(false);

  const [selectItem, setSelectItem] = useState({});

  const getservice = async () => {
    setLoading(true);
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({key: 'getCoupon', user: loginUser}),
    };
    fetch(url + 'coupon.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setLoading(false);

        if (response.status == true) {
          setMycoupon(response.data);

          console.log(response.data);
        } else {
          setMycoupon([]);
        }
      })
      .catch(error => {
        setLoading(false);

        console.log(error);
      });
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          borderRadius: 5,
          justifyContent: 'space-around',
          marginVertical: 5,
          maxHeight: 120,
          height: 120,
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          //   shadowOpacity: 0.25,
          //   shadowRadius: 5,
          elevation: 3,
        }}>
        <View
          style={{
            height: 50,
            width: 50,
            borderRadius: 50,
            backgroundColor: 'rgb(232, 232, 232)',
            position: 'absolute',
            zIndex: 999,
            top: '25%',
            right: -35,
          }}></View>

        <View
          style={{
            flex: 5,
            backgroundColor: '#A7C7E7',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/* <Image
            source={{uri: item.photoUrl}}
            style={{
            width:'100%',
            height:'100%',
            }}
            resizeMode="contain"
          /> */}
          <View>
            <Text style={{color: 'white'}}>{item.count} ใบ</Text>
          </View>
        </View>

        <View style={{flex: 10, padding: 10, justifyContent: 'space-between'}}>
          <View
            style={{
              backgroundColor: 'rgba(247, 220, 111,0.5)',
              borderRadius: 5,
              padding: 5,
            }}>
            <Text numberOfLines={1}>{item.gmm_package_name} </Text>
          </View>

          <View>
            <Text numberOfLines={1}>ส่วนลด : {item.tr_package_name} </Text>
          </View>
          <View>
            <Text style={{color: 'gray', textAlign: 'right', fontSize: 12}}>
              {/* หมดอายุวันที่ 28 มีนาคม{' '} */}
              หมดอายุ{item.monthdesc.monthdesc}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    getservice();
  }, []);
  return (
    <View style={styles.container}>
      <Loader visible={loader} />

      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={coupon}
        renderItem={renderItem}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
      />
    </View>
  );
}

const MyCouponScreen = props => {
  return (
    <View style={{height: '100%', backgroundColor: 'rgb(232, 232, 232)'}}>
      <Coupon navigation={props.navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    // alignItems: 'center',
    flexDirection: 'row',
  },
  roundButton1: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#F7DC6F',
    // textAlign: 'center',
  },
  containerModal: {
    margin: 0,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
});

export default MyCouponScreen;
