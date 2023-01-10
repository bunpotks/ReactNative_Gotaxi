import React, {useState, useEffect, useRef} from 'react';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {
  View,
  Text,
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
} from 'react-native-paper';
import {url as urls} from '../center/url';
import Loader from '../center/Loader';
import {Card, ListItem, Icon, Avatar} from 'react-native-elements';
// import MapView from 'react-native-maps';

import Feather from 'react-native-vector-icons/Feather';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Geocoder from 'react-native-geocoding';

import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
  Animated,
} from 'react-native-maps';

// import {MapView, Marker} from 'react-native-maps';
const url = urls.url;

const windowWidth = Dimensions.get('window').width;

const Map = ({navigation}) => {
  const [loader, setLoader] = useState(false);
  const [bannerVisivle, setBannerVisible] = useState(false);
  const [visible, setVisible] = useState(false);

  const [address, setAddress] = useState('');

  const [position, setPosition] = useState({
    latitude: 13.726912,
    longitude: 100.476083,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const mapRef = useRef(null);

  // useEffect(() => {
  //   Geocoder.init('AIzaSyBo3lCqmuC-pjXjafl1DkBlLZsu-nVO5TU', {language: 'th'}); // set the language
  //   Geocoder.from(13.705389, 100.480613)
  //     .then(json => {
  //       var addressComponent = json.results[0].address_components[0];
  //       console.log(json.results[0].formatted_address);
  //       setAddress(json.results[0].formatted_address);
  //       // alert(JSON.stringify(json.results))
  //     })
  //     .catch(error => console.warn(error));
  // }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setBannerVisible(true);
  //   }, 5000);
  // }, []);

  function zoomIn() {}

  function zoomOut() {}

  function rederButton() {
    return (
      <View style={{justifyContent: 'space-between', marginBottom: 20}}>
        <TouchableOpacity
          style={[styles.roundButton2, {marginBottom: 10}]}
          onPress={() => {
            setVisible(true);
            // navigation.goBack();
          }}
          rippleColor="rgba(0, 0, 0, .32)">
          <MaterialIcons name="my-location" color="gray" size={22} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roundButton2}
          onPress={() => {
            setVisible(true);
            // navigation.goBack();
          }}
          rippleColor="rgba(0, 0, 0, .32)">
          <MaterialIcons name="my-location" color="gray" size={22} />
        </TouchableOpacity>
      </View>
    );
  }

  function potal() {
    return (
      <Portal>
        <Dialog
          style={{borderRadius: 10, position: 'absolute'}}
          onDismiss={() => {
            setVisible(false);
          }}
          visible={visible}
          // dismissable={false}
        >
          <Dialog.Title>แจ้งเตือน</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              ไม่สามารถค้นหาตำแหน่งที่คุณอยู่ได้ กรุณนาลองใหม่อีกครั้ง
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              color={Colors.grey500}
              onPress={() => {
                setVisible(false);
              }}>
              Disagree
            </Button>
            <Button
              onPress={() => {
                onsetPosition();
                setVisible(false);
              }}>
              Agree
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }

  function baner() {
    return (
      <View style={{position: 'absolute', width: '100%'}}>
        <Banner
          style={{zIndex: 99999999}}
          visible={bannerVisivle}
          actions={[
            // {
            //   label: 'ติดตามการเดินทาง',
            //   onPress: () => setBannerVisible(false),
            // },
            {
              label: 'ปิด',
              onPress: () => setBannerVisible(false),
            },
          ]}>
          <Text>แสดงรายละเอียดเมื่ออยู่ระหว่างการเดินทาง</Text>
        </Banner>
      </View>
    );
  }

  function rederModal() {}

  const onsetPosition = () => {
    let position = {
      latitude: 13.726912,
      longitude: 100.486193,
      latitudeDelta: 0.001,
      longitudeDelta: 0.01,
    };

    console.log(mapRef.current);

    mapRef.current.animateToRegion(position, 1000);
  };

  function renderMapview() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={position}
          ref={mapRef}
          onRegionChangeComplete={region => {
            console.log(region);
          }}></MapView>
      </View>
    );
  }

  function renderBottomview() {
    return (
      <View
        style={{
          zIndex: 9999,
          paddingHorizontal: 20,
          // padding:10,
          position: 'absolute',
          bottom: '0%',
          width: '100%',
          alignItems: 'center',
          // justifyContent:''
        }}>
        <View style={{alignSelf: 'flex-end'}}>
          <TouchableOpacity
            style={styles.roundButton2}
            onPress={() => {
              onsetPosition();
              // setVisible(true);
              // navigation.goBack();
            }}
            rippleColor="rgba(0, 0, 0, .32)">
            <MaterialIcons name="my-location" color="gray" size={22} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: '100%',
            borderRadius: 10,
            backgroundColor: 'white',
            paddingHorizontal: 10,
            paddingVertical: 15,
            margin: 10,
          }}>
          <View>
            <View
              style={
                {
                  // display: 'flex',
                  // flexDirection: 'row',
                  // justifyContent: 'space-around',
                  // alignItems: 'center',
                }
              }>
              <View style={{marginLeft: 10}}>
                <Text style={{fontWeight: 'bold', fontSize: 12}}>
                  สมชาย ใจดี (คนขับ)
                </Text>
                <Text style={{color: 'gray', fontSize: 12}}>
                  กต1001 สีแดง-ดำ
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  function rederMark() {
    return (
      <View
        style={{
          zIndex: 9999,
          // paddingHorizontal: 20,
          // padding:10,
          // position: 'absolute',
          // bottom: '50%',
          // right:'50%',
          // width: '100%',
          // alignItems: 'center',
          backgroundColor:'red',
          // flexDirection:'row',
          // justifyContent:'center'
        }}>
        <Image
          style={{width: 40, height: 40}}
          resizeMode="contain"
          source={require('./map-marker.png')}
        />
      </View>
    );
  }


  return (
    <View>
      {/* {rederMark()} */}
      {potal()}
      {baner()}
      {renderMapview()}
      {renderBottomview()}
    </View>
  );
};

const MonitorDetail = ({navigation,route}) => {
  const [loader, setLoader] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(true);
  console.log('detail',route)

  useEffect(() => {}, []);

  return (
    <View>
      <Map navigation={navigation} />
    </View>
  );
};

export default MonitorDetail;
const styles = StyleSheet.create({
  container: {
    height: '100%',
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
