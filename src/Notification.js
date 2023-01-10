import React, {useState, useEffect, useRef} from 'react';

import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  Animated,
  StatusBar,
  Image,
  FlatList,
  RefreshControl,
  Linking,
} from 'react-native';

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {useTheme, Text, Title, TouchableRipple} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {url as urls} from './center/url';

const url = urls.url;

import {Actionsheet, useDisclose} from 'native-base';

const HEADER_HEIGHT = (Dimensions.get('window').height * 10) / 100;

function Notification({navigation, animatedValue}) {
  const insets = useSafeAreaInsets();

  const {colors} = useTheme();

  const [userData, setUserdata] = React.useState({});

  const [tripcount, setTripcount] = React.useState();

  const [isReady, setIsReady] = React.useState(false);

  const STORAGE_KEY = '@login';

  return (
    <View style={{paddingHorizontal: 10, width: '100%'}}>
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
      }}>
      <View style={{flex: 2, justifyContent: 'flex-end'}}>
        {/* <Image
            style={{width: 50, height: 50}}
            source={require('./img/bookmenu/2.png')}
          /> */}
      </View>
      <View style={{flex: 4, justifyContent: 'flex-end'}}>
        <Text
          style={{fontSize: 24, color: 'black', alignSelf: 'center'}}
          numberOfLines={1}>
          แจ้งเตือน
        </Text>
      </View>

      <View
        style={{
          flex: 2,
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}></View>
    </View>
  </View>
  );
}

function Body({navigation}) {
  const [notilist, setNotiList] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectItem, setSelectItem] = useState([]);

  const updateNoti = async notification => {
    let key = '@noti';

    const notidata = await AsyncStorage.getItem(key);
    const notilist = notidata ? JSON.parse(notidata) : undefined;

    let notilistk = notilist ? notilist : [];
    let noti = {
      title: notification.title,
      body: notification.body,
      date: new Date(),
    };

    notilistk.push(noti);

    AsyncStorage.setItem(key, JSON.stringify(notilistk));
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      let response = await fetchData();

      setRefreshing(false);
    } catch (error) {
      console.error(error);
    }
  }, [refreshing]);

  const STORAGE_KEY = '@login';

  const {isOpen, onOpen, onClose} = useDisclose();

  const deletItem = async () => {
    let key = '@noti';
    let newarr = [...notilist];
    newarr.splice(selectItem, 1);
    setNotiList(newarr);

    AsyncStorage.setItem(key, JSON.stringify(newarr));
  };

  const getNoti = async () => {
    setNotiList(notilist.reverse());
  };

  const fetchData = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'notificationList',
        user: loginUser,
      }),
    };

    fetch(url + 'notification.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        if (response.status == true) {
          if (response.count > 0) {
            navigation.setOptions({
              tabBarBadge: response.count,
            });
          } else {
            navigation.setOptions({
              tabBarBadge: null,
            });
          }

          setNotiList(response.data);
        } else {
          navigation.setOptions({
            tabBarBadge: null,
          });
        }
      })
      .catch(error => {});
  };

  const readData = async key => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'readNoti',
        user: loginUser,
        not_id: key,
      }),
    };

    fetch(url + 'notification.php', requestOptions)
      .then(response => response.json())
      .then(response => {})
      .catch(error => {});
  };

  const readDataAll = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'readNotiAll',
        user: loginUser,
      }),
    };

    fetch(url + 'notification.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        // console.log(response);
        navigation.setOptions({
          tabBarBadge: null,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  React.useEffect( () => {

    async function getawait(){
      await fetchData();
      await readDataAll();
    }
    const willFocusSubscription = navigation.addListener('focus', async () => {
      getawait()
    });

    return willFocusSubscription;
  }, []);

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View>
        {notilist.length > 0 ? (
          <FlatList
            scrollEventThrottle={16}
            data={notilist}
            renderItem={({item, index}) => (
              <View key={index}>
                <TouchableRipple
                  style={{
                    backgroundColor: !item.noti_status_read
                      ? 'rgba(255,255,204,0.7)'
                      : 'white',
                  }}
                  onPress={() => {
                    let newNoti = [...notilist];
                    newNoti[index].noti_status_read = true;
                    setNotiList(newNoti);

                    readData(item.noti_id);
                    if (item.noti_url) {
                      Linking.openURL(item.noti_url);
                    }
                  }}>
                  <View style={{padding: 20}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{fontSize: 14}}>{item.noti_title}</Text>
                    </View>
                    <Text style={{color: 'gray'}}>{item.noti_body}</Text>
                    <Text style={{color: 'gray', fontSize: 12}}>
                      {item.monthdescShort.monthdesc} {item.monthdescShort.time}
                    </Text>
                  </View>
                </TouchableRipple>

                {/* <Divider /> */}
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <Title style={{padding: 20, textAlign: 'center'}}>
            ไม่มีรายการแจ้งเตือน
          </Title>
        )}
      </View>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item
            onPress={() => {
              deletItem();
              onClose();
            }}
            startIcon={<Icon color="red" size={20} name="delete" />}>
            ลบ
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
}

function NotificationScreen({route, navigation}) {
  const [expanded, setExpanded] = React.useState(true);
  const [checked, setChecked] = React.useState('first');
  const handlePress = () => setExpanded(!expanded);
  const offset = useRef(new Animated.Value(0)).current;

  useEffect(() => {}, []);
  return (
    <SafeAreaView style={styleDetail1.container}>
    <View style={{flex: 1}}>
      <Notification navigation={navigation} />
      <Body navigation={navigation} />
    </View>
    </SafeAreaView>
    // <View style={{flex: 1}} forceInset={{top: 'always'}}>
    //   <Notification style={{}} animatedValue={offset}/>

    //   <View style={{flex: 1,  paddingBottom: 0}}>
    //     <ScrollView
    //       style={{backgroundColor: 'white'}}
    //       contentContainerStyle={{
    //         alignItems: 'center',
    //       }}
    //       showsVerticalScrollIndicator={false}
    //       scrollEventThrottle={16}
    //       onScroll={Animated.event(
    //         [{nativeEvent: {contentOffset: {y: offset}}}],
    //         {useNativeDriver: false},
    //       )}>
    //       <Body navigation={navigation} />
    //       {/* {[1, 2, 4, 5, 6, 7, 8, 9, 10, 1, 2, 4, 5, 6, 7, 8, 9, 10].map(
    //       item => (
    //         <View
    //           key={item.id}
    //           style={{
    //             marginBottom: 20,
    //           }}>
    //           <Text style={{color: '#101010', fontSize: 32}}>{item}</Text>
    //         </View>
    //       ),
    //     )} */}
    //     </ScrollView>
    //   </View>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flex: 1,
  },
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  roundButton1: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'orange',
  },
  roundButton2: {
    marginTop: 20,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#ccc',
  },
});

const styleDetail1 = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#FFC40C',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
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

export default NotificationScreen;
