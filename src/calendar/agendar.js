import React, {Component} from 'react';
import {Alert, StyleSheet, View, TouchableOpacity} from 'react-native';

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
  Avatar,
  TouchableRipple,
  Divider,
  Portal,
  Dialog,
  Colors,
} from 'react-native-paper';
// @ts-expect-error
import {
  Agenda,
  CalendarList,
  Calendar,
  LocaleConfig,
} from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Modal from 'react-native-modal';

import moment from 'moment';

import Loader from '../center/Loader';
import {url as urls} from '../center/url';
import {ScrollView} from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
const url = urls.url;
const STORAGE_KEY = '@login';



const RANGE = 24;
const initialDate = '2022-01-09';



const testIDs = {
  menu: {
    CONTAINER: 'menu',
    CALENDARS: 'calendars_btn',
    CALENDAR_LIST: 'calendar_list_btn',
    HORIZONTAL_LIST: 'horizontal_list_btn',
    AGENDA: 'agenda_btn',
    EXPANDABLE_CALENDAR: 'expandable_calendar_btn',
    WEEK_CALENDAR: 'week_calendar_btn',
  },
  calendars: {
    CONTAINER: 'calendars',
    FIRST: 'first_calendar',
    LAST: 'last_calendar',
  },
  calendarList: {CONTAINER: 'calendarList'},
  horizontalList: {CONTAINER: 'horizontalList'},
  agenda: {
    CONTAINER: 'agenda',
    ITEM: 'item',
  },
  expandableCalendar: {CONTAINER: 'expandableCalendar'},
  weekCalendar: {CONTAINER: 'weekCalendar'},
};

const vacation = {
  key: 'vacation',
  color: 'red',
  selectedDotColor: 'blue',
  selected: true,
};
const massage = {
  selected: true,
  selectedColor: 'blue',
};
const workout = {key: 'workout', color: 'green', selected: true};

const d1 = {key: 'vacation', color: 'red', selectedDotColor: 'blue'};
const d2 = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
const d3 = {key: 'workout', color: 'green'};

const dots = {dots: [d1, d2], disabled: false};

const item1 = {
  '2022-01-16': vacation,
  '2022-01-21': massage,
  '2022-01-22': workout,
  '2022-01-23': {dots: [d1, d2], selected: true, selectedColor: 'red'},
  '2022-01-24': {color: '#70d7c7', textColor: 'white'},
  '2022-01-25': {endingDay: true, color: '#50cebb', textColor: 'white'},
};

const item2 = {
  '2022-01-17': vacation,
  '2022-01-28': massage,
  '2022-01-29': workout,
  '2022-01-30': {dots: [d1, d2], selected: true, selectedColor: 'red'},
  '2022-01-15': {color: '#70d7c7', textColor: 'white'},
  '2022-01-14': {endingDay: true, color: '#50cebb', textColor: 'white'},
};

export default class AgendaScreen extends Component {
  state = {
    user: {},
    loader: false,
    items: {},
    itemDetail: [],
    agendaModal: false,
    disabled_days: [],
  };

  myuser = async () => {
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    this.setState({...this.state, user: loginUser});
  };

  getDaysInMonth(month, year, days) {
    let pivot = moment().month(month).year(year).startOf('month');
    const end = moment().month(month).year(year).endOf('month');

    let dates = {};
    const disabled = {disabled: true, disableTouchEvent: true};
    while (pivot.isBefore(end)) {
      days.forEach(day => {
        dates[pivot.day(day).format('YYYY-MM-DD')] = disabled;
      });
      pivot.add(7, 'days');
    }

    return dates;
  }

  renderCustomHeader(date) {
    const header = date.toString('MMMM yyyy');
    const [month, year] = header.split(' ');
    const textStyle = {
      fontSize: 18,
      fontWeight: 'bold',
      paddingTop: 10,
      paddingBottom: 10,
      color: '#5E60CE',
      paddingRight: 5,
    };

    return (
      <View style={styles.header}>
        <Text style={[styles.month, textStyle]}>{`${month}`}</Text>
        <Text style={[styles.year, textStyle]}>{year}</Text>
      </View>
    );
  }

  async getAcitivity() {
    // this.setState({loader: true});
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        key: 'getagenda',
        user: loginUser,
      }),
    };

    fetch(url + 'agenda.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        this.setState({...this.state, disabled_days: response.dayoff});
        let newArr = Object.assign(this.state.items, response.data);
        this.setState({...this.state, loader: false, items: newArr});
      })
      .catch(error => {
        this.setState({loader: false});

        console.error(error);
      });
  }

  componentDidMount() {
    const willFocusSubscription = this.props.navigation.addListener(
      'focus',
      () => {
        // fetchData();
        this.getAcitivity();
        this.myuser();
      },
    );

    return willFocusSubscription;
  }

  onMonthChange = date => {
    for (let i = 0; i < date.length; i++) {
      let newArr = Object.assign(
        this.state.items,
        this.getDaysInMonth(
          date[i].month - 1,
          date[0].year,
          this.state.disabled_days,
        ),
      );
      this.setState({
        items: newArr,
      });
    }
  };

  modalAgenda = () => {
    return (
      <Modal
      statusBarTranslucent={true}
        onBackButtonPress={() => this.setState({agendaModal: false})}
        visible={this.state.agendaModal}
        animationInTiming={700}
        animationOutTiming={700}
        style={[styles.containerModal]}>
          <SafeAreaView style={{flex:1}}>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            // backgroundColor: '#FFC40C',
          }}>
          <Text style={{fontSize: 30}}>รายละเอียดงาน</Text>
          <TouchableOpacity
            onPress={() => {
              this.setState({agendaModal: false});
            }}>
            <Avatar.Icon
              size={50}
              style={{backgroundColor: 'white'}}
              icon="close"
            />
          </TouchableOpacity>
        </View>

        <View style={{backgroundColor: 'white', paddingHorizontal: 20, height: '100%'}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            {this.state.itemDetail ? (
              <View>
                {this.state.itemDetail.map((item, key) => (
                  <View key={key}>
                    <Divider style={{marginVertical: 5}} />

                    {item.types == 'BOOKING' ? (
                      <TouchableRipple
                        style={{
                          backgroundColor: 'white',
                          flex: 4,
                          margin: 5,
                          padding: 20,
                          backgroundColor: item.color,
                          borderRadius: 10,
                          borderLeftColor: item.colorLeft,
                          borderLeftWidth: 10,
                        }}
                        onPress={() => {
                          this.setState({...this.state, agendaModal: false});
                          if (this.state.user.gmm_emp_type == 'Taxi') {
                            this.props.navigation.navigate('Bookingdetail', {
                              trip: item,
                            });
                          } else {
                            this.props.navigation.navigate('BookingdetailCg', {
                              trip: item,
                            });
                          }
                        }}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <View style={{flex: 1, margin: 2}}>
                            <Text style={{fontSize: 20}}>
                              {item.gmm_booking_travel_start.substring(11)} น.
                            </Text>
                          </View>

                          <View style={{flex: 2}}>
                            <Text>
                              {item.gmm_booking_travel_start.substring(11)} -{' '}
                              {item.gmm_booking_travel_end.substring(11)} น.
                            </Text>

                            <Text style={{color: 'gray'}}>
                              {item.gmm_booking_product_name}
                            </Text>

                            <Text style={{color: 'gray'}}>
                              คุณ{' '}
                              {item.gmm_passenger_fname +
                                ' ' +
                                item.gmm_passenger_lname}
                            </Text>

                            <Text>{item.gmm_booking_nbr}</Text>
                          </View>
                        </View>
                      </TouchableRipple>
                    ) : (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 10,
                        }}>
                        <View style={{flex: 1, margin: 2}}>
                          <Text style={{fontSize: 20}}>
                            {item.gmm_leave_time} น.
                          </Text>
                        </View>

                        <View style={{flex: 2}}>
                          <Text>
                            {item.gmm_leave_time} - {item.gmm_leave_time_to} น.
                          </Text>

                          <Text style={{color: 'gray'}}>
                            {item.gmm_leave_type}
                          </Text>

                          <Text style={{color: item.color}}>
                            {item.gmm_leave_status}
                          </Text>
                        </View>
                      </View>
                    )}

                    <Divider style={{marginVertical: 5}} />
                  </View>
                ))}
              </View>
            ) : (
              <Text>ไม่มีรายการในวันนี้</Text>
            )}
          </ScrollView>
        </View>
        </SafeAreaView>

      </Modal>
    );
  };
  pressDay = e => {
    console.log(
      this.getDaysInMonth(
        moment().month(),
        moment().year(),
        this.state.disabled_days,
      ),
    );
    console.log('111');
    this.setState({
      ...this.state,
      agendaModal: true,
      itemDetail: this.state.items[e.dateString]
        ? this.state.items[e.dateString].data
        : null,
    });
  };

  render() {
    return (
      <View>
        <Loader visible={this.state.loader} />
        {this.modalAgenda()}

        <CalendarList
          onDayPress={this.pressDay}
          firstDay={1}
          maxDate={'2024-12-31'}
          markedDates={this.state.items}
          // Callback which gets executed when visible months change in scroll view. Default = undefined
          onVisibleMonthsChange={this.onMonthChange}
          // Max amount of months allowed to scroll to the past. Default = 50
          pastScrollRange={5}
          futureScrollRange={12}
          // Enable or disable scrolling of calendar list
          scrollEnabled={true}
          // Enable or disable vertical scroll indicator. Default = false
          showScrollIndicator={true}
        />

        
      </View>
    );
  }

 

  renderItem(item) {
    return (
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
        style={[styles.item, {height: 50}]}
        onPress={() => Alert.alert(item.name)}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text style={{textAlign: 'center'}}>ว่าง</Text>
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    justifyContent: 'center',
    // width:'100%'
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },

  containerModal: {
    margin: 0,
    justifyContent: 'flex-start',
    backgroundColor: '#ffff',
  },
});
