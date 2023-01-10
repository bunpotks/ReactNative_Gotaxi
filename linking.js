const config = {
  initialRouteName: 'Menu',
  screens: {
    Menu: {
      screens: {
        Menutabs: 'Menutabs',
        Notification: 'Notification',
      },
    },
    BookingdetailByitem: {
      path: 'BookingdetailByitem/:bookingnbr',
      parse: {
        bookingnbr: bookingnbr => `${bookingnbr}`,
      },
    },
    QuestionScreen: {
      path: 'QuestionScreen/:bookingnbr',
      parse: {
        bookingnbr: bookingnbr => `${bookingnbr}`,
      },
    },
    // Notifications: 'Notification',
  },
};

const linking = {
  prefixes: ['gotaxi://app'],
  config,
};

export default linking;
