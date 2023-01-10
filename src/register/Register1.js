import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Iconmatrail from 'react-native-vector-icons/MaterialIcons';

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

import {
  TextInput,
  Card,
  Button,
  Checkbox,
  RadioButton,
  Title,
  Paragraph,
} from 'react-native-paper';
import {url as urls} from '../center/url';
import Loader from '../center/Loader';
import Dialogconfirm from '../center/Dialogconfirm';

const url = urls.url;
const Register1 = ({navigation}) => {
  const [data, setData] = useState({
    fname: '',
    lname: '',
    tel: '',
    password: '',
    repassword: '',
    email: '',
    isValidfname: false,
    isValidlname: false,
    isValidtel: false,
    isValidteltype: false,
    isValidpassword: false,
    isValidrepassword: false,
    isValidrConfirmpassword: false,
    isValidemail: false,
    type: 'REGISTER',
    job: '',
    age: '',
    gender: '',
  });

  // const [data, setData] = useState({
  //   fname: 'บรรพต',
  //   lname: 'คล้ายศร',
  //   tel: '0960653611',
  //   password: '12345678',
  //   repassword: '12345678',
  //   email: 'test@gmail.com',
  //   isValidfname: true,
  //   isValidlname: true,
  //   isValidtel: true,
  //   isValidpassword: true,
  //   isValidrepassword: true,
  //   isValidrConfirmpassword: true,
  //   isValidemail: true,
  //   type: 'REGISTER',
  //   job: '',
  //   age: '',
  //   gender: '',
  // });

  const [showpassword, setShowpassword] = useState(true);
  const [iconpassword, setIconpassword] = useState('eye');

  const toggleHide = () => {
    if (showpassword) {
      setIconpassword('eye-off');
    } else {
      setIconpassword('eye');
    }
    setShowpassword(!showpassword);
  };

  const [loader, setLoader] = useState(false);

  const [dialogVisible, setDialogVisible] = useState({
    status: false,
    title: 'Alert',
    params: 'test001',
  });

  const [isLoading, setLoading] = useState(true);
  const [resdata, setResdata] = useState([]);
  const [checked, setChecked] = React.useState('');

  const [gender, setGender] = useState([]);
  const [age, setAge] = useState([]);
  const [job, setJob] = useState([]);

  const [checkedgender, setCheckedgender] = React.useState('');
  const [checkedage, setCheckedage] = React.useState('');
  const [checkedjob, setCheckedjob] = React.useState('');

  const [itemdata, setItem] = useState([
    {val: true, desc: 'คำถาม1'},
    {val: false, desc: 'คำถาม2'},
    {val: true, desc: 'คำถาม3'},
    {val: false, desc: 'คำถาม4'},
  ]);

  const fnameChange = val => {
    if (val.trim().length >= 1) {
      setData({
        ...data,
        fname: val,
        isValidfname: true,
      });
    } else {
      setData({
        ...data,
        fname: val,
        isValidfname: false,
      });
    }
  };

  const lnameChange = val => {
    if (val.trim().length >= 1) {
      setData({
        ...data,
        lname: val,
        isValidlname: true,
      });
    } else {
      setData({
        ...data,
        lname: val,
        isValidlname: false,
      });
    }
  };

  const telChange = val => {
    if (val.trim().length == 10) {
      if (
        val.substring(0, 2) == '06' ||
        val.substring(0, 2) == '08' ||
        val.substring(0, 2) == '09'
      ) {
        setData({
          ...data,
          tel: val.replace(/[^0-9]/g, ''),
          isValidtel: true,
          isValidteltype: true,
        });
      } else {
        setData({
          ...data,
          tel: val.replace(/[^0-9]/g, ''),
          isValidtel: true,
          isValidteltype: false,
        });
      }
    } else {
      setData({
        ...data,
        tel: val.replace(/[^0-9]/g, ''),
        isValidtel: false,
      });
    }
  };

  const passwordChange = val => {
    if (val.trim().length >= 8 && val.trim().length <= 12) {
      if (val == data.repassword) {
        setData({
          ...data,
          password: val,
          isValidpassword: true,
          isValidrConfirmpassword: true,
        });
      } else {
        setData({
          ...data,
          password: val,
          isValidpassword: true,
          isValidrConfirmpassword: false,
        });
      }
    } else {
      setData({
        ...data,
        password: val,
        isValidpassword: false,
        isValidrConfirmpassword: false,
      });
    }
  };

  const repasswordChange = val => {
    if (val.trim().length >= 8 && val.trim().length <= 12) {
      if (val == data.password) {
        setData({
          ...data,
          repassword: val,
          isValidrepassword: true,
          isValidrConfirmpassword: true,
        });
      } else {
        setData({
          ...data,
          repassword: val,
          isValidrepassword: true,
          isValidrConfirmpassword: false,
        });
      }
    } else {
      setData({
        ...data,
        repassword: val,
        isValidrepassword: false,
        isValidrConfirmpassword: false,
      });
    }
  };

  const emailChange = val => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(val) === true) {
      setData({
        ...data,
        email: val,
        isValidemail: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        isValidemail: false,
      });
    }

    // if (val.trim().length >= 1) {
    //   setData({
    //     ...data,
    //     email: val,
    //     isValidemail: true,
    //   });
    // } else {
    //   setData({
    //     ...data,
    //     email: val,
    //     isValidemail: false,
    //   });
    // }
  };

  const requestOTP = async () => {
    console.log(data);
    if (
      data.isValidfname &&
      data.isValidlname &&
      data.isValidtel &&
      data.isValidpassword &&
      data.isValidrepassword &&
      data.isValidteltype
      // data.isValidemail &&
      // data.job &&
      // data.age &&
      // data.gender
    ) {
      setLoader(true);

      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({key: 'checkTel', data: data}),
      };
      fetch(url + 'register.php', requestOptions)
        .then(response => response.json())
        .then(response => {
          console.log('response', response);
          setLoader(false);

          if (response.status == true) {
            navigation.navigate('Register2', {data: data});
          } else {
            alert(response.message);
          }
        })
        .catch(error => {
          console.log(error);
          setLoader(false);

          alert(error.message);
        });
    } else {
      setDialogVisible({
        status: true,
        title: 'แจ้งเตือน',
        params: 'ข้อมูลไม่ครบถ้วน กรุณาตรวจสอบข้อมูลให้ครบถ้วนก่อนลงทะเบียน',
      });
      // Alert.alert(
      //   'แจ้งเตือน',
      //   'ข้อมูลไม่ครบถ้วน กรุณาตรวจสอบข้อมูลให้ครบถ้วนก่อนลงทะเบียน',
      //   [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      //   {cancelable: false},
      // );
    }
  };

  const getMovies = async () => {
    Alert.alert(
      'แจ้งเตือน',
      'สวัสดี',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
    console.log(url);
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({title: 'React POST Request Example'}),
    };
    fetch(url + 'test.php', requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setResdata(data);
      })
      .catch(error => {
        // console.log('Api call error');
        alert(error.message);
      });
  };

  const getpassenger = async () => {
    setLoader(true);

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({key: 'getmstr'}),
    };
    fetch(url + 'register.php', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log('response', response.age);
        setLoader(false);

        if (response.status == true) {
          setGender([...response.gender]);
          setJob([...response.job]);
          setAge([...response.age]);

          // navigation.navigate('Register2', {data: data});
        } else {
        }
      })
      .catch(error => {
        console.log(error);
        setLoader(false);

        alert(error.message);
      });
  };

  useEffect(() => {
    getpassenger();
  }, []);

  return (
    <View style={styles.container}>
      <Loader visible={loader} />
      <Dialogconfirm visible={dialogVisible} setvisible={setDialogVisible} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View>
          <View style={{marginBottom: 10}}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              ข้อมูลผู้ใช้บริการ <Text style={{color: 'red'}}>*</Text>
            </Text>
            {/* <Text style={styles.fontInput}>ชื่อ</Text> */}
            <TextInput
              maxLength={80}
              placeholder="ชื่อ"
              label="ชื่อ *"
              mode="flat"
              style={[styles.textInputs]}
              value={data.fname}
              onChangeText={text => {
                fnameChange(text);
              }}
            />
          </View>
          <View style={{marginBottom: 10}}>
            {/* <Text style={styles.fontInput}>นามสกุล</Text> */}
            <TextInput
              maxLength={80}
              placeholder="นามสกุล"
              label="นามสกุล *"
              mode="flat"
              style={[styles.textInputs]}
              value={data.lname}
              onChangeText={text => {
                lnameChange(text);
              }}
            />
          </View>
          <View style={{marginBottom: 10}}>
            <TextInput
              keyboardType="numeric"
              label="เบอร์โทรศัพท์ *"
              maxLength={10}
              placeholder="เบอร์โทรศัพท์ 10"
              mode="flat"
              style={[styles.textInputs]}
              value={data.tel}
              onChangeText={text => {
                telChange(text);
              }}
            />
          </View>
          {!data.isValidteltype && data.tel.length == 10 ? (
            <Text style={{color: 'red'}}>
              รองรับเบอร์โทรศัพท์ 10 หลัก เฉพาะมือถือขึ้นต้นด้วย (06,08,02)
            </Text>
          ) : null}
          <View style={{marginBottom: 10}}>
            <TextInput
              placeholder="รหัสผ่าน 8-12 ตัวอักษร"
              label="รหัสผ่าน *"
              maxLength={12}
              right={
                <TextInput.Icon name={iconpassword} onPress={toggleHide} />
              }
              secureTextEntry={showpassword}
              mode="flat"
              style={[styles.textInputs]}
              value={data.password}
              onChangeText={text => {
                passwordChange(text);
              }}
            />

            {data.password.length < 8 ? (
              <Text style={{color: 'red'}}>
                กรอกรหัสผ่านความยาว 8-12 ตัวอักษร
              </Text>
            ) : null}
          </View>
          <View style={{marginBottom: 10}}>
            <TextInput
              maxLength={12}
              label="ยืนยันรหัสผ่าน *"
              right={
                <TextInput.Icon name={iconpassword} onPress={toggleHide} />
              }
              secureTextEntry={showpassword}
              placeholder="ยืนยันรหัสผ่าน 8-12 ตัวอักษร"
              mode="flat"
              style={[styles.textInputs]}
              value={data.repassword}
              onChangeText={text => {
                repasswordChange(text);
              }}
            />

            {!data.isValidrConfirmpassword &&
            data.isValidpassword &&
            data.isValidrepassword ? (
              <Text style={{color: 'red'}}>รหัสผ่านไม่ตรงกัน</Text>
            ) : null}

            {data.repassword.length < 8 ? (
              <Text style={{color: 'red'}}>
                กรอกรหัสผ่านความยาว 8-12 ตัวอักษร
              </Text>
            ) : null}
          </View>
          <View style={{marginBottom: 10}}>
            {/* <Text style={styles.fontInput}>อีเมลล์</Text> */}

            <TextInput
              maxLength={80}
              label="อีเมล"
              placeholder="อีเมล Example@Example.com"
              mode="flat"
              style={styles.textInputs}
              value={data.email}
              onChangeText={text => {
                emailChange(text);
              }}
            />
            {data.email.length > 0 && !data.isValidemail ? (
              <Text style={{color: 'red'}}>รูปแบบ E-mail ไม่ถูกต้อง</Text>
            ) : null}
          </View>

          <View style={{marginTop: 50}}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              ข้อมูลเพื่อพัฒนาการบริการ
            </Text>
            <View style={{marginTop: 20}}>
              {/* {itemdata.map((item, key) => (
                <View
                  key={key}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Checkbox
                    status={item.val ? 'checked' : 'unchecked'}
                    onPress={() => {
                      let newItem = itemdata;
                      newItem[key].val = !newItem[key].val;

                      console.log(newItem[key].val);
                      setItem(newItem);
                    }}
                  />
                  <Text>{item.desc}</Text>
                </View>
              ))} */}

              {/* <Card>
    <Card.Content>
      <Title>Card title</Title>
      <Paragraph>Card content</Paragraph>
    </Card.Content>
  </Card> */}
              <View style={styles.borderGroup}>
                <Text style={{fontSize: 18}}>
                  <Icon
                    name="human-female-female"
                    size={26}
                    color="rgba(0, 0, 0, 0.54)"
                    style={{marginLeft: 5}}
                  />
                  เพศ
                </Text>

                <View style={styles.lineBreak}></View>

                {/* {gender.map((l, i) => (
                  <View
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <RadioButton
                      color="#FFC40C"
                      value={l.gmm_sex_id}
                      status={
                        data.gender === l.gmm_sex_id ? 'checked' : 'unchecked'
                      }
                      onPress={() => setData({...data, gender: l.gmm_sex_id})}
                    />
                    <Text>{l.gmm_sex_name}</Text>
                  </View>
                ))} */}

                <RadioButton.Group
                  value={data.gender}
                  onValueChange={value => setData({...data, gender: value})}>
                  {gender.map((l, i) => (
                    <View key={i}>
                      <RadioButton.Item
                        key={i}
                        labelStyle={{textAlign: 'left'}}
                        position="leading"
                        color="#FFC40C"
                        label={l.gmm_sex_name}
                        value={l.gmm_sex_id}
                      />
                    </View>
                    // <RadioButton.Item color="#FFC40C" label="คูปอง" value="COUPON" />
                  ))}
                </RadioButton.Group>
              </View>

              <View style={styles.borderGroup}>
                <Text style={{fontSize: 18, marginVertical: 10}}>
                  <Iconmatrail
                    name="data-usage"
                    size={26}
                    color="rgba(0, 0, 0, 0.54)"
                    style={{marginLeft: 5}}
                  />{' '}
                  ช่วงอายุ
                </Text>

                <View style={styles.lineBreak}></View>

                <RadioButton.Group
                  value={data.age}
                  onValueChange={value => setData({...data, age: value})}>
                  {age.map((l, i) => (
                    <View key={i}>
                      <RadioButton.Item
                        key={i}
                        labelStyle={{textAlign: 'left'}}
                        position="leading"
                        color="#FFC40C"
                        label={l.gmm_age_name}
                        value={l.gmm_age_id}
                      />
                    </View>
                    // <RadioButton.Item color="#FFC40C" label="คูปอง" value="COUPON" />
                  ))}
                </RadioButton.Group>

                {/* {age.map((l, i) => (
                  <View
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <RadioButton
                      color="#FFC40C"
                      value={l.gmm_age_id}
                      status={
                        data.age === l.gmm_age_id ? 'checked' : 'unchecked'
                      }
                      onPress={() => setData({...data, age: l.gmm_age_id})}
                    />
                    <Text>{l.gmm_age_name}</Text>
                  </View>
                ))} */}
              </View>

              <View style={styles.borderGroup}>
                <Text style={{fontSize: 18}}>
                  <Icon
                    name="purse"
                    size={26}
                    color="rgba(0, 0, 0, 0.54)"
                    style={{marginLeft: 5}}
                  />{' '}
                  อาชีพ
                </Text>

                <View style={styles.lineBreak}></View>

                <RadioButton.Group
                  value={data.job}
                  onValueChange={value => setData({...data, job: value})}>
                  {job.map((l, i) => (
                    <View key={i}>
                      <RadioButton.Item
                        labelStyle={{textAlign: 'left'}}
                        position="leading"
                        color="#FFC40C"
                        label={l.gmm_job_name}
                        value={l.gmm_job_id}
                      />
                    </View>
                  ))}
                </RadioButton.Group>

                {/* {job.map((l, i) => (
                  <View
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <RadioButton
                      color="#FFC40C"
                      value={l.gmm_job_id}
                      status={
                        data.job === l.gmm_job_id ? 'checked' : 'unchecked'
                      }
                      onPress={() => setData({...data, job: l.gmm_job_id})}
                    />
                    <Text>{l.gmm_job_name}</Text>
                  </View>
                ))} */}
              </View>
            </View>
          </View>

          <Button
            mode="outlined"
            style={{borderColor: '#FFC40C'}}
            onPress={() => {
              requestOTP();
              // navigation.navigate('Register2');
              // console.log(data);
            }}>
            สมัครสมาชิก
          </Button>
          <View style={{height: 20}}></View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Register1;

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
    alignItems: 'center',
    // justifyContent: 'center',
    // width:'100%'
  },
  textInputs: {
    backgroundColor: 'transparent',
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
  fontInput: {
    marginBottom: -10,
    fontWeight: 'bold',
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
