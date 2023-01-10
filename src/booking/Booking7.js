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
} from 'react-native-paper';
import {url as urls} from '../center/url';
import Loader from '../center/Loader';
import {Dropdown} from 'react-native-material-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconMat from 'react-native-vector-icons/MaterialIcons';
import Dialogconfirm from '../center/Dialogconfirm';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const url = urls.url;
const STORAGE_KEY = '@login';

const Booking7 = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Title style={{textAlign: 'center'}}>
        ท่านต้องการเดินทาง Go2 + ผู้ดูแล
      </Title>

      <Card.Cover
        style={{height: 150, flex: 1}}
        source={{
          uri: 'https://digimove.365supplychain.com/banner/banner_file2.jpeg',
        }}
        resizeMode="stretch"
      />
      {/* <View style={[styles.lineBreak,{flex:1}]}></View> */}

      <View style={{flex: 1}}>
        <List.Item
          title="ไป-กลับ (รอรับกลับภายใน 2 ชม.) 500 บาท รอเพิ่ม 1 ชั่วโมง + 100 บาท"
          description="ไป-กลับ (รอรับกลับภายใน 2 ชม.) 500 บาท รอเพิ่ม 1 ชั่วโมง + 100 บาท"
          left={props => (
            <List.Icon {...props} icon="car" color="rgba(0, 255, 0, 0.54)" />
          )}
        />

        <List.Item
          title="ไป-กลับ (รอรับกลับภายใน 2 ชม.) 500 บาท รอเพิ่ม 1 ชั่วโมง + 100 บาท"
          description="ไป-กลับ (รอรับกลับภายใน 2 ชม.) 500 บาท รอเพิ่ม 1 ชั่วโมง + 100 บาท"
          left={props => (
            <List.Icon {...props} icon="car" color="rgba(0, 255, 0, 0.54)" />
          )}
        />
      </View>

      {/* <View
        style={{
          flex: 1,
          paddingVertical: 10,
        }}>
        <View style={{flexDirection: 'row',}}>
          <View>

          <Icon
            name="check"
            size={26}
            color="rgba(0, 255, 0, 0.54)"
            style={{marginHorizontal:10}}
          />
          </View>

          <Text>
            ไป-กลับ (รอรับกลับภายใน 2 ชม.) 500 บาท รอเพิ่ม 1 ชั่วโมง + 100 บาท
          </Text>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          paddingVertical: 10,
        }}>
        <View style={{flexDirection: 'row',}}>
          <View>

          <Icon
            name="check"
            size={26}
            color="rgba(0, 255, 0, 0.54)"
            style={{marginHorizontal:10}}
          />
          </View>

          <Text>
            ไป-กลับ (รอรับกลับภายใน 2 ชม.) 500 บาท รอเพิ่ม 1 ชั่วโมง + 100 บาท
          </Text>
        </View>
      </View> */}

      {/* <View
          style={{
            flex:1,
            flexDirection: 'row',
          }}>
          <Icon
            name="check"
            size={26}
            color="rgba(0, 255, 0, 0.54)"
            // style={{padding:5}}
          />
          <View>
            <Text>
              ไป-กลับ (รอรับกลับภายใน 2 ชม.) 500 บาท รอเพิ่ม 1 ชั่วโมง + 100 บาท
            </Text>
          </View>
        </View> */}

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          alignContent: 'center',
          alignSelf: 'center',
          justifyContent: 'space-between',
          // padding:10,
          margin: 10,
        }}>
        <Button
          mode="outlined"
          style={{borderColor: '#FFC40C', flex: 1, margin: 5}}
          onPress={() => {
            navigation.navigate('Register1');
          }}>
          ย้อนกลับ
        </Button>

        <Button
          mode="contained"
          style={{
            flex: 1,
            margin: 5,
            // marginBottom: 20,
          }}
          onPress={() => {
            navigation.navigate('Register1');
          }}>
          จองรถ
        </Button>
      </View>
    </View>
  );
};

export default Booking7;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    justifyContent: 'center',
    // width:'100%'
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
});
