import React, {useState, useEffect} from 'react';

import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';

import {
  Card,
  Button,
  Avatar,
  Divider,
  Text,
  Title,
  Paragraph,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AgendaScreen from '../calendar/agendar';

import {url as urls} from '../center/url';

const url = urls.url;
const STORAGE_KEY = '@login';

const CarlendarScreen = ({navigation}) => {
  const [pack, setPack] = useState([]);
  const [loader, setLoader] = useState(false);

  const getPackage = async () => {
    // alert('123');
    setLoader(true);
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({key: 'getProduct'}),
    };
    fetch(url + 'package.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log('responsePAckage', response);

        // for (let i = 0; i < response.data.length; i++) {
        //   response.data[i].id = i;
        //   response.data[i].photoUrl =
        //     'https://source.unsplash.com/1024x768/?nature';
        // }

        setPack(response.data);
        setLoader(false);
      })
      .catch(error => {
        console.log(error);
        setLoader(false);
      });
  };

  // useEffect(() => {
  //   getPackage();
  // }, []);

  return (
    // <View>
      <AgendaScreen navigation={navigation}/>
    // </View>
  );
};

export default CarlendarScreen;
