import React, { Component } from 'react';
import { Button, Header, Icon, Input, Modal } from 'semantic-ui-react';

class FileModal extends Component {
  state = {};
  render() {
    const { modal, closeModal } = this.props;

    return (
      <Modal basic open={modal} onClose={closeModal}>
        <Header icon="file image" content="Select an image file" />
        <Modal.Content>
          <Input fluid label=".jpg or .png" name="file" type="file" />
        </Modal.Content>
        <Modal.Actions>
          <Button inverted color="green">
            <Icon name="checkmark" /> Send
          </Button>
          <Button inverted color="red" onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FileModal;
