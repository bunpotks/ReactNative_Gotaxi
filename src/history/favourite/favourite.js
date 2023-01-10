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
  FlatList,
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
  Divider,
  ActivityIndicator,
  Colors,
  TouchableRipple,
} from 'react-native-paper';
import {url as urls} from '../center/url';
import Loader from '../center/Loader';
import {Dropdown} from 'react-native-material-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconMat from 'react-native-vector-icons/MaterialIcons';
import Dialogconfirm from '../center/Dialogconfirm';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SplashScreen from 'react-native-splash-screen';

const url = urls.url;

const STORAGE_KEY = '@login';

const Favourite = ({navigation}) => {
  const [isloading, setIsloading] = useState(true);
  const [favourData, setFavourData] = useState();
  const [loader, setLoader] = useState(false);


  const getFavourite = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'getFavourite',
        data: loginUser,
      }),
    };
    fetch(url + 'booking.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        // setLoader(false);

        if (response.status == true) {
          setFavourData(response.data);
        } else {
          setFavourData(response.data);
        }
      })
      .catch(error => {
        console.log(error);
        setLoader(false);
        // alert(error.message);
      });
  };

  const removeFavourite = async (item, key) => {
      console.log(item)
    setLoader(true);
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'removeFavouriteByitem',
        data: loginUser,
        location: item,
      }),
    };
    fetch(url + 'booking.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        setLoader(false);
        if (response.status == true) {
          getFavourite();
          // setTrip(newroute);
        } else {
        }
        console.log('response', response.status);
      })
      .catch(error => {
        console.log(error);
        setLoader(false);
        // alert(error.message);
      });
  };

  useEffect(() => {
    getFavourite();
  }, []);

  const renderItem = ({item, key}) => {
    return (
      <View key={key}>
        <List.Item
          style={{padding: 10}}
          title={item.favourite_name}
          description={item.favourite_address}
          left={props => (
            <Icon
              name="map-marker"
              size={26}
              color="#FE7569"
              style={{alignSelf: 'center'}}
            />
          )}
          right={props => (
            <TouchableRipple
              style={{alignItems: 'center', alignSelf: 'center'}}
              onPress={() => {
                removeFavourite(item, key);
              }}>
              <Icon
                style={{
                  // alignItems: 'center',
                  // alignSelf: 'center',
                  paddingHorizontal: 10,
                }}
                size={30}
                color="gray"
                name="trash-can-outline"
              />
            </TouchableRipple>
          )}
        />
        <Divider />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, {padding: 0}]}>
      <Loader visible={loader} />

      <FlatList
        data={favourData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
      />
    </SafeAreaView>
  );
};

export default Favourite;

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
