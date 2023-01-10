import React, {useState, useEffect, useCallback} from 'react';

import {
  StyleSheet,
  // Text,
  View,
  SafeAreaView,
} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button} from 'react-native-paper';

const ButtonmonitorCheck = () => {
  return (
    <Button
      mode="contained"
      contentStyle={{height: 60}}
      style={{
        borderRadius: 10,
        marginVertical: 10,
        justifyContent: 'center',
      }}
      onPress={() => monitor(item)}>
      เริ่มงาน
    </Button>
  );
};
export default ButtonmonitorCheck;
