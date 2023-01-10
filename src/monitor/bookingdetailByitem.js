import React, {useState, useEffect, useRef} from 'react';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {View, StyleSheet, Text} from 'react-native';

import {url as urls} from '../center/url';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Bookingdetail from './bookingdetail';
import BookingdetailCg from '../monitorCg/bookingdetail';

const url = urls.url;
const STORAGE_KEY = '@login';

const BookingdetailByitem = ({navigation, route}) => {
  const {bookingnbr} = route.params;
  const [trip, setTrip] = useState();
  const [user, setUser] = useState();

  console.log(bookingnbr);
  const fetchData = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'getbooking',
        user: loginUser,
        bookingnbr: bookingnbr,
      }),
    };

    fetch(url + 'monitor.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        // setAllpoint(response.data);
        if (response.status == true) {
          setTrip(response.data);
          //   setNotiList(response.data);
        }

        // setQeustion(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getUser = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    return loginUser;
  };

  useEffect(async () => {
    const login = await getUser();
    setUser(login);
    await fetchData();
    if (user) {
      return;
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        {user ? (
          <View style={{flex: 1}}>
            {user.gmm_emp_type == 'Taxi' ? (
              <View style={{flex: 1}}>
                {trip ? <Bookingdetail route={{params: {trip: trip}}} /> : null}
              </View>
            ) : (
              <View style={{flex: 1}}>
                {trip ? (
                  <BookingdetailCg route={{params: {trip: trip}}} />
                ) : null}
              </View>
            )}
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default BookingdetailByitem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(232, 232, 232)',
    justifyContent: 'center',
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
  roundButton1: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#F7DC6F',
    textAlign: 'center',
  },
  roundButton1NoActive: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'rgb(232, 232, 232)',
    textAlign: 'center',
  },
  roundButton1Here: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#FFFF',
    borderColor: '#F7DC6F',
    borderWidth: 1,
    textAlign: 'center',
  },
  containerModal: {
    margin: 0,
    justifyContent: 'flex-start',
    backgroundColor: '#ffff',
  },
});
