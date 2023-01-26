import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Text, Title} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {SafeAreaView} from 'react-native-safe-area-context';

const AboutmeScreen = ({navigation}) => {
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
          paddingVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon
            name="arrow-left-thick"
            size={24}
            color="gray"
            style={{marginRight: 10, alignSelf: 'center'}}
          />
        </TouchableOpacity>
        <Title>เกี่ยวกับเรา</Title>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}>
        <View style={{backgroundColor: 'white'}}>
          <View style={{alignItems: 'center'}}>
            <Image
              resizeMode="contain"
              source={require('../img/GM_logo.png')}
              style={{width: '100%', height: 150, maxWidth: 500}}
            />
          </View>
          <View style={{marginVertical: 10}}>
            <Text style={styles.fontParagrap}>
              พันธกิจของเราคือ
              สนับสนุนการออกไปใช้ชีวิตของผู้สูงอายุด้วยบริการเดินทางที่สะดวก
              ปลอดภัย ไรกังวล
            </Text>

            <Text style={styles.fontParagrap}>
              Go Mamma (โกว-มาม่า)
              เป็นมากกว่าบริการการเดินทางแต่เราคือผู้ที่เข้าใจในปัญหาและความต้องการของผู้สูงอายุกับครอบครัว
              เราสนับสนุนให้ผู้ใหญ่ในบ้านทุกท่านมีอิสระในการเดินทางโดยเพิ่มทางเลือกและโอกาสในการออกแบบชีวิตดั่งใจต้องการ
            </Text>

            <Text style={styles.fontParagrap}>
              Go Mamma
              เชื่อว่าการออกไปใช้ชีวิตคือจุดเริ่มต้นในการยืดอายุความสุขให้ยืนยาว
              เพื่อลดความเสื่อมถอยของร่างกายและเติมเต็มชีวิตเพื่อก้าวไปสู่การใช้ชีวิตในรูปแบบที่มีคุณภาพสำหรับผู้สูงอายุ
            </Text>
          </View>

          <View style={{alignItems: 'center', marginTop: 20}}>
            <Text style={{fontSize: 16}}>
            ให้ Go Mamma พาไป ไว้ใจได้

            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Image
                resizeMode="contain"
                source={require('../img/ab_1.png')}
                style={{height: 100}}
              />
              <Text>Healthcare</Text>
            </View>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Image
                resizeMode="contain"
                source={require('../img/ab_2.png')}
                style={{height: 100}}
              />
              <Text>Lifestyle</Text>
            </View>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Image
                resizeMode="contain"
                source={require('../img/ab_3.png')}
                style={{height: 100}}
              />
              <Text>Residence</Text>
            </View>
          </View>
       
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default AboutmeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  fontParagrap: {
    marginTop:10,
    fontSize: 16,
  },
  listItem: {
    height: 70,
    backgroundColor: 'rgba(255,255,204,1)',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    shadowColor: '#000',

  },

});
