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

const Booking3Detail = ({navigation, route}) => {
  console.log(route);
  const {title, img} = route.params;
  console.log(title);
  console.log(img);

  const [data, setData] = React.useState([
    {
      value: 'note',
    },
    {
      value: 'aum',
    },
  ]);

  const [taxi, setTaxi] = useState([
    {title: 'บรรพต คล้ายศร', desc: 'สถานะ : ไม่ว่าง'},
    {title: 'สมชาย ใจดี', desc: 'สถานะ : ว่าง'},
  ]);

  const LeftContent = props => <Avatar.Icon {...props} icon="account" />;

  function steper() {
    return (
      <Card style={{}}>
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
                color="#FFC40C"
                rippleColor="rgba(0, 0, 0, 0.1)"
              />
            </TouchableRipple>
            <Title style={{textAlign: 'center'}}>เลือกคนขับรถ</Title>

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
              onPress={() => navigation.navigate('Booking4')}
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
    <View style={styles.container}>
        {steper()}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {backgroundColor: 'red', borderRadius: 10, height: 200},
        ]}>
        <Avatar.Image
          marginLeft={15}
          marginVertical={15}
          size={40}
          source={{
            uri: 'https://www.pngrepo.com/download/46892/taxi-driver.png',
          }}
        />
      </View>
    </View>
  );
};

export default Booking3Detail;

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 0,
    flex: 1,
    backgroundColor: '#FFFF',
    // alignItems: 'center',
    justifyContent: 'center',
    // width:'100%'
    // height:'200%'
  },
  img: {
    width: 100,
    height: 200,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 0,
  },
});
