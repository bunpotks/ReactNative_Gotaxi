import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Button,
  Image,
  StatusBar,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {Text, Title} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconZocial from 'react-native-vector-icons/Zocial';
import Fontisto from 'react-native-vector-icons/Fontisto';

import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';

const ContactScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        animated={false}
        barStyle="dark-content"
        showHideTransition
      />

      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon
            name="arrow-left-thick"
            size={24}
            color="black"
            style={{marginRight: 10}}
          />
        </TouchableOpacity>
        <Text style={{fontSize: 24}}>ติดต่อเรา</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}>
        <View style={{backgroundColor: 'white'}}>
          <View
            style={{
              flex: 1,
              height: 300,
              backgroundColor: 'white',
              padding: 20,
            }}>
            <Image
              source={require('../img/1.png')}
              style={{width: '100%', height: '100%', alignSelf: 'center'}}
              resizeMode="cover"
            />
          </View>

          <View style={{padding: 20, flex: 1}}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('https://line.me/ti/p/~@Gomamma');
              }}>
              <View style={styles.listItem}>
                <Fontisto
                  name="line"
                  size={24}
                  color="black"
                  style={{marginRight: 10}}
                />
                <View>
                  <Text style={{fontSize: 14}}>Line Official</Text>
                  <Text style={{fontSize: 14, color: 'gray'}}>@GoMamma</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`tel:$0944292296`);
              }}>
              <View style={styles.listItem2}>
                <View style={{marginRight: 10}}>
                  <IconZocial name="call" size={24} color="black" />
                </View>

                <View>
                  <Text style={{fontSize: 14}}>Call Center</Text>
                  <Text style={{fontSize: 12}}>
                    ( ทำการทุกวันจันทร์-อาทิตย์ เวลา 09:00-18:00น. )
                  </Text>

                  <Text style={{fontSize: 14, color: 'gray'}}>
                    094-429-2296
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Linking.openURL('https://www.facebook.com/GoMAMMAtaxi/');
              }}>
              <View style={styles.listItem}>
                <IconZocial
                  name="facebook"
                  size={24}
                  color="black"
                  style={{marginRight: 10}}
                />
                <View>
                  <Text style={{fontSize: 14}}>Facebook Fanpage</Text>
                  <Text style={{fontSize: 14, color: 'gray'}}>Go Mamma</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Linking.openURL('mailto:csc.gomamma@gmail.com');
              }}>
              <View style={styles.listItem2}>
                <View style={{marginRight: 10}}>
                  <IconZocial name="gmail" size={24} color="black" />
                </View>

                <View>
                  <Text style={{fontSize: 14}}>Email</Text>
                  <Text style={{fontSize: 14, color: 'gray'}}>
                    csc.gomamma@gmail.com
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>

 
  );
};
export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  fontParagrap: {
    fontSize: 12,
  },
  listItem: {
    height: 70,
    backgroundColor: '#ffe874',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    shadowColor: '#000',
    // borderColor:'black',
    // borderWidth:0.1,
  },
  listItem2: {
    height: 80,
    backgroundColor: '#ffcb08',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    shadowColor: '#000',
    // borderColor:'black',
    // borderWidth:0.1,
  },
});
