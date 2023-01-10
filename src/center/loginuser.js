import React, {useState, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const STORAGE_KEY = '@login';

const login_user = {
  firstValidationMethod: async function (value) {
    //inspect the value
    const login = await AsyncStorage.getItem(STORAGE_KEY);
    const loginUser = login ? JSON.parse(login) : undefined;
    return loginUser;
  },

  secondValidationMethod: function (value) {
    //inspect the value
  },
};

export default login_user;
