import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import {url as urls} from '../center/url';

import {
  TextInput,
  Button,
  Checkbox,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';
import Modal from 'react-native-modal';
import Loader from '../center/Loader';

const url = urls.url;

const Register2 = ({navigation, route}) => {
  const {data} = route.params;
  const [loader, setLoader] = useState(false);

  console.log(data.tel);

  const [checked, setChecked] = React.useState(false);
  let interval;

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    clearInterval(interval);
    interval = setInterval(() => {
      setTimer(lastTimerCount => {
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000);
  };

  const closeModal = () => {
    setModalVisible(!isModalVisible);
    clearInterval(interval);
  };

  const [timerCount, setTimer] = useState(300);

  const requestOTP = () => {
    if (checked) {
      navigation.navigate('Confirmotp', {data: data});
      // setModalVisible(!isModalVisible);
    } else {
      Alert.alert(
        'แจ้งเตือน',
        'กรุณายอมรับเงื่อนไขงานเพื่อลงทะเบียน',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  };

  const register = () => {
    if (checked) {
      setLoader(true);

      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({key: 'register', data: data}),
      };
      fetch(url + 'register.php', requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log('response', data);
          setLoader(false);

          if (data.status == true) {
            navigation.reset({
              index: 0,
              routes: [{name: 'PermisionScreen'}],
            });
          }

          alert(data.message);
        })
        .catch(error => {
          setLoader(false);

          console.log(error);

          alert(error.message);
        });
    } else {
      Alert.alert(
        'แจ้งเตือน',
        'กรุณายอมรับเงื่อนไขงานเพื่อลงทะเบียน',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  };

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <Loader visible={loader} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Card>
          <Card.Title
            title="เงื่อนไขการใช้บริการของ Gomama"
            // subtitle="Card Subtitle"
          />
          <Card.Content>
            <Paragraph>
              Where does it come from? Contrary to popular belief, Lorem Ipsum
              is not simply random text. It has roots in a piece of classical
              Latin literature from 45 BC, making it over 2000 years old.
              Richard McClintock, a Latin professor at Hampden-Sydney College in
              Virginia, looked up one of the more obscure Latin words,
              consectetur, from a Lorem Ipsum passage, and going through the
              cites of the word in classical literature, discovered the
              undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
              1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good
              and Evil) by Cicero, written in 45 BC. This book is a treatise on
              the theory of ethics, very popular during the Renaissance. The
              first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes
              from a line in section 1.10.32. The standard chunk of Lorem Ipsum
              used since the 1500s is reproduced below for those interested.
              Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum"
              by Cicero are also reproduced in their exact original form,
              accompanied by English versions from the 1914 translation by H.
              Rackham.
            </Paragraph>
          </Card.Content>

          <TouchableOpacity
            onPress={() => {
              setChecked(!checked);
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Checkbox
                color="#FFC40C"
                status={checked ? 'checked' : 'unchecked'}
              />
              <Text>ยอมรับเงื่อนไขการใช้งาน</Text>
            </View>
          </TouchableOpacity>
        </Card>

        <Button
          mode="outlined"
          style={{borderColor: '#FFC40C', marginTop: 20}}
          onPress={requestOTP}>
          สมัครสมาชิกเข้าใช้งาน
        </Button>
      </ScrollView>
    </View>
  );
};

export default Register2;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    // width:'100%'
  },
  containerModal: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',

    justifyContent: 'center',
  },

  borderStyleBase: {
    // margin:10,
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },

  underlineStyleBase: {
    height: 45,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'black',
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
});
