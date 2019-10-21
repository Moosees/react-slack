import React, { Component } from 'react';
import { SliderPicker } from 'react-color';
// prettier-ignore
import { Button, Divider, Header, Icon, Label, Menu, Modal, Sidebar } from 'semantic-ui-react';

class ColorPanel extends Component {
  state = {
    modalOpen: false
  };

  openModal = () => this.setState({ modalOpen: true });
  closeModal = () => this.setState({ modalOpen: false });

  render() {
    const { modalOpen } = this.state;

    return (
      <Sidebar
        as={Menu}
        icon="labeled"
        inverted
        vertical
        visible
        width="very thin"
      >
        <Divider />
        <Button icon="add" size="small" color="blue" onClick={this.openModal} />
        <Modal basic open={modalOpen} onClose={this.closeModal}>
          <Header icon="paint brush" content="Chose app colors" />
          <Modal.Content>
            <Label content="Primary Color" />
            <SliderPicker />
            <Divider />
            <Label content="Secondary Color" />
            <SliderPicker />
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted>
              <Icon name="checkmark" /> Save Colors
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Sidebar>
    );
  }
}

export default ColorPanel;
