import React, {useState, useEffect} from 'react';

import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';

import {
  Button,
  List,
  Card,
  RadioButton,
  useTheme,
  Text,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CalendarConfig from './calendar/calendar';
import AgendaScreen from './calendar/agendar';
// import PDFExample from './pdf/pdfscreen';

function Help() {
  const [expanded, setExpanded] = React.useState(true);

  const handlePress = () => setExpanded(!expanded);
  return (
    <SafeAreaView style={styleDetail1.container}>
      <StatusBar
        animated={true}
        backgroundColor="#FFC40C"
        barStyle="dark-content"
        showHideTransition="fade"
      />
      <View style={{padding: 20}}>
        <View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 30, color: 'white'}}>ช่วยเหลือ</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function HelpScreen() {
  return (
    <View style={{height: '100%'}}>
      <Help />

      {/* <CalendarConfig /> */}
      <AgendaScreen />
      {/* <PDFExample/> */}
    </View>
  );
}

const styleDetail1 = StyleSheet.create({
  container: {
    height: (Dimensions.get('window').height * 12) / 100,
    backgroundColor: '#FFC40C',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    // paddingBottom: ,
  },

  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
    fontFamily: 'Prompt',
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
    fontFamily: 'Prompt',
  },
});

export default HelpScreen;
