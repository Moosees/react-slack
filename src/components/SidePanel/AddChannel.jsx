import firebase from 'firebase';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Header, Icon, Input, Modal } from 'semantic-ui-react';

class AddChannel extends Component {
  state = {
    channelName: '',
    channelDetails: '',
    channelsRef: firebase.database().ref('channels'),
    modalOpen: false
  };

  addChannel = () => {
    const { channelsRef, channelName, channelDetails } = this.state;
    const { currentUser } = this.props;
    const key = channelsRef.push().key;
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      }
    };
    channelsRef
      .child(key)
      .update(newChannel)
      .then(
        this.setState({
          channelName: '',
          channelDetails: '',
          modalOpen: false
        })
      )
      .catch(error => {
        console.error(error);
      });
  };

  isFormValid = ({ channelName, channelDetails }) => {
    return channelName.length > 2 && channelDetails.length > 2;
  };

  handleSubmit = evt => {
    evt.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };

  handleChange = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  };

  handleOpenModal = () => {
    this.setState({ modalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ modalOpen: false });
  };

  render() {
    const { channelName, channelDetails, modalOpen } = this.state;

    return (
      <>
        <Icon
          name="add"
          style={{ cursor: 'pointer' }}
          onClick={this.handleOpenModal}
        />
        <Modal basic open={modalOpen} onClose={this.handleCloseModal}>
          <Header icon="chat" content="Add a channel" />
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  placeholder="Please name the channel"
                  label={{ tag: true, content: 'Name' }}
                  labelPosition="right"
                  name="channelName"
                  value={channelName}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  placeholder="Enter a short description"
                  label={{ tag: true, content: 'Details' }}
                  labelPosition="right"
                  name="channelDetails"
                  value={channelDetails}
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" inverted onClick={this.handleCloseModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = ({ user: { currentUser } }) => ({
  currentUser
});

export default connect(mapStateToProps)(AddChannel);
