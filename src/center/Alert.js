import React, {useState, useEffect} from 'react';

import {Paragraph, Button, Portal, Dialog, Colors} from 'react-native-paper';




const AlertDialog = ({visible, setvisible}) => {
  return (
    <Portal>
      <Dialog style={{borderRadius: 10}} visible={visible.status}>
        <Dialog.Title>{visible.title}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{visible.params}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>

          <Button >
            Agree
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default AlertDialog;

