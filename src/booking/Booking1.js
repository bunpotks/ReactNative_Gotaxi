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
  Divider,
  ActivityIndicator,
  Colors,
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

const Booking1 = ({navigation, route}) => {
  const {query} = route.params;

  const [isloading, setIsloading] = useState(true);
  const [loader, setLoader] = useState(false);
  const [product, setProduct] = useState();

  console.log(query);

  const queryProduct = async () => {
    setLoader(true);
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({key: 'searchProduct', data: query}),
    };
    fetch(url + 'booking.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        setTimeout(() => {
          setIsloading(false);
        }, 1000);

        console.log(response);
        if (response.status == true) {
          setProduct(response.data);
        } else {
          setProduct(false);
        }
        // console.log(setData(response.data));
        setLoader(false);
      })
      .catch(error => {
        console.log(error);
        setLoader(false);
        alert(error);
      });
  };

  const showSplash = () => {
    SplashScreen.show();
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  };

  const hideSplash = () => {
    SplashScreen.hide();
  };

  useEffect(() => {
    queryProduct();
  }, []);

  return (
    <SafeAreaView style={[styles.container, {padding: 0}]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View style={styles.container}>
          {/* <Text>{query.productType}</Text> */}

          {isloading ? (
            <ActivityIndicator animating={true} color="#F7DC6F" />
          ) : (
            <View>
              {product ? (
                <Card style={{borderRadius: 10}}>
                  <Title style={{textAlign: 'center', paddingVertical: 10}}>
                    ท่านต้องการเดินทาง {product.gmm_product_name}
                  </Title>
                  <Paragraph style={{textAlign: 'center'}}>
                    {product.gmm_product_desc}
                  </Paragraph>

                  <Card.Cover
                    style={{height: 150, marginVertical: 20}}
                    source={{
                      uri: product.path,
                    }}
                    resizeMode="stretch"
                  />
                  <Divider />
                  {/* <View style={[styles.lineBreak,{flex:1}]}></View> */}

                  {/* TAXI DETAIL */}

                  <Card.Content style={{paddingVertical: 20}}>
                    <Text>{product.gmm_product_message1}</Text>
                    <Text style={{color: 'gray'}}>
                      {product.gmm_product_message2}
                    </Text>

                    {/* CG DETAIL */}

                    {/* <Text>{query.cgAdd}</Text> */}
                    {query.cgAdd && query.productType == 2 ? (
                      <View>
                        <Divider style={{marginVertical: 20}} />

                        <Text>{product.gmm_product_cg_message1}</Text>
                        <Text style={{color: 'gray'}}>
                          {product.gmm_product_cg_message2}
                        </Text>
                      </View>
                    ) : null}

                    <View>
                      <Divider style={{marginVertical: 20}} />

                      <Text>รวมค่าบริการ : {product.totalprice} บาท</Text>

                      <Divider style={{marginVertical: 20}} />
                    </View>

                    <View>
                      <Text>เงื่อนไขการให้บริการ</Text>
                      <Text style={{color: 'gray'}}>1.xxxxxxxxxxxxxxxxx</Text>
                      <Text style={{color: 'gray'}}>2.xxxxxxxxxxxxxxxxx</Text>
                      <Text style={{color: 'gray'}}>3.xxxxxxxxxxxxxxxxx</Text>
                      <Text style={{color: 'gray'}}>4.xxxxxxxxxxxxxxxxx</Text>
                      <Text style={{color: 'gray'}}>5.xxxxxxxxxxxxxxxxx</Text>
                    </View>

                    {/* <Text style={{textAlign:'center',fontSize}}>5,000 </Text> */}

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignContent: 'center',
                        alignSelf: 'center',
                        justifyContent: 'space-between',
                        // padding:10,
                        marginVertical: 10,
                      }}>
                      <Button
                        mode="contained"
                        contentStyle={{height: 60}}
                        style={{
                          borderRadius: 10,
                          flex: 1,

                          justifyContent: 'center',
                        }}
                        onPress={() => {
                          navigation.navigate('Booking2', {product: product});
                        }}>
                        จองรถ
                      </Button>
                    </View>
                  </Card.Content>
                </Card>
              ) : (
                <View>
                  <Image
                    style={{
                      width: '70%',

                      alignSelf: 'center',
                    }}
                    resizeMode="contain"
                    source={require('./nodata.png')}
                  />

                  <Text
                    style={{textAlign: 'center', fontSize: 20, color: 'gray'}}>
                    ไม่พบทริปการเดินทางที่ตรงกัน
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Booking1;

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
