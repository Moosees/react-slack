import mime from 'mime-types';
import React, { Component } from 'react';
import { Button, Header, Icon, Input, Modal } from 'semantic-ui-react';

class FileModal extends Component {
  state = { file: null, authorized: ['image/jpeg', 'image/png'] };

  addFile = evt => {
    const file = evt.target.files[0];
    if (file) {
      this.setState({ file });
    }
  };

  sendFile = () => {
    const { file } = this.state;
    const { uploadFile, closeModal } = this.props;

    if (file !== null && this.isAuthorized(file.name)) {
      const metadata = { contentType: mime.lookup(file.name) };
      uploadFile(file, metadata);
      closeModal();
      this.clearFile();
    }
  };

  isAuthorized = filename =>
    this.state.authorized.includes(mime.lookup(filename));

  clearFile = () => {
    this.setState({ file: null });
  };

  render() {
    const { modal, closeModal } = this.props;

    return (
      <Modal basic open={modal} onClose={closeModal}>
        <Header icon="file image" content="Select an image file" />
        <Modal.Content>
          <Input
            fluid
            label=".jpg or .png"
            name="file"
            type="file"
            onChange={this.addFile}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button inverted color="green" onClick={this.sendFile}>
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
