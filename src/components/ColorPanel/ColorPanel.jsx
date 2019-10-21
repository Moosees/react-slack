import React, { Component } from 'react';
import { SliderPicker } from 'react-color';
import firebase from '../../firebase/firebase';
import { connect } from 'react-redux';
// prettier-ignore
import { Button, Divider, Header, Icon, Label, Menu, Modal, Sidebar, Segment } from 'semantic-ui-react';

class ColorPanel extends Component {
  state = {
    modalOpen: false,
    primaryColor: '#40bf43',
    secondaryColor: '#2d4d86',
    usersRef: firebase.database().ref('users')
  };

  handleSaveColors = () => {
    const { primaryColor, secondaryColor, usersRef } = this.state;
    const { currentUser } = this.props;

    usersRef
      .child(currentUser.uid)
      .child('colors')
      .push()
      .update({ primaryColor, secondaryColor })
      .then(() => this.closeModal())
      .catch(error => console.error(error));
  };

  handlePrimaryColor = color => this.setState({ primaryColor: color.hex });
  handleSecondaryColor = color => this.setState({ secondaryColor: color.hex });

  openModal = () => this.setState({ modalOpen: true });
  closeModal = () => this.setState({ modalOpen: false });

  render() {
    const { modalOpen, primaryColor, secondaryColor } = this.state;

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
            <Segment inverted>
              <Label content="Primary Color" />
              <SliderPicker
                color={primaryColor}
                onChange={this.handlePrimaryColor}
              />
              <Divider />
              <Label content="Secondary Color" />
              <SliderPicker
                color={secondaryColor}
                onChange={this.handleSecondaryColor}
              />
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSaveColors}>
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

const mapStateToProps = ({ user: { currentUser } }) => ({
  currentUser
});

export default connect(mapStateToProps)(ColorPanel);
