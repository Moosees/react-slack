import React, { Component } from 'react';
import { connect } from 'react-redux';
// prettier-ignore
import { Button, Form, Header, Icon, Input, Menu, Modal } from 'semantic-ui-react';
import firebase from '../../firebase/firebase';
import { setCurrentChannel } from '../../redux/actions';

class Channels extends Component {
  state = {
    channels: [],
    channelName: '',
    channelDetails: '',
    channelsRef: firebase.database().ref('channels'),
    modalOpen: false
  };

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners = () => {
    const { channelsRef } = this.state;
    let loadedChannels = [];

    channelsRef.on('child_added', snapshot => {
      loadedChannels.push(snapshot.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
    });
  };

  removeListeners = () => {
    const { channelsRef } = this.state;
    channelsRef.off();
  };

  setFirstChannel = () => {
    const { channels } = this.state;
    const { firstLoad } = this.props;
    if (firstLoad && channels.length) {
      this.changeChannel(channels[0]);
    }
  };

  changeChannel = channel => {
    const { setCurrentChannel } = this.props;
    setCurrentChannel(channel, false);
  };

  displayChannels = channels =>
    channels.length &&
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        name={channel.name}
        style={{ opacity: '0.7' }}
        active={channel.id === this.props.currentChannel.id}
        onClick={() => this.changeChannel(channel)}
      >
        # {channel.name}
      </Menu.Item>
    ));

  addChannel = () => {
    const { channelName, channelDetails, channelsRef } = this.state;
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
    const { channels, channelName, channelDetails, modalOpen } = this.state;

    return (
      <>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="exchange" /> Channels ({channels.length})
            </span>
            <Icon
              name="add"
              style={{ cursor: 'pointer' }}
              onClick={this.handleOpenModal}
            />
          </Menu.Item>
          {this.displayChannels(channels)}
        </Menu.Menu>
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

const mapStateToProps = ({
  user: { currentUser },
  channel: { currentChannel, firstLoad }
}) => ({
  currentUser,
  currentChannel,
  firstLoad
});

export default connect(
  mapStateToProps,
  { setCurrentChannel }
)(Channels);
