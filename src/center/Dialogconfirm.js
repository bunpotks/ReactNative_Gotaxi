import * as React from 'react';
import {Paragraph, Button, Portal, Dialog, Colors} from 'react-native-paper';

const DialogWithLongText = ({visible, setvisible}) => {
  return (
    <Portal>
      <Dialog style={{borderRadius: 10}} visible={visible.status}>
        <Dialog.Title>{visible.title}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{visible.params}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>

          <Button onPress={() => setvisible({...visible, status: false})}>
            Agree
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DialogWithLongText;
