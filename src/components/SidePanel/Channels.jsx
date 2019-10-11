import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Label, Menu } from 'semantic-ui-react';
import firebase from '../../firebase/firebase';
import { setCurrentChannel } from '../../redux/actions';
import AddChannel from './AddChannel';

class Channels extends Component {
  state = {
    channel: null,
    channels: [],
    channelsRef: firebase.database().ref('channels'),
    messagesRef: firebase.database().ref('messages'),
    notifications: []
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
      this.addNotificationListener(snapshot.key);
    });
  };

  removeListeners = () => {
    const { channelsRef } = this.state;
    channelsRef.off();
  };

  addNotificationListener = channelId => {
    const { messagesRef, channel, notifications } = this.state;

    messagesRef.child(channelId).on('value', snapshot => {
      if (channel) {
        this.handleNotifications(
          channelId,
          channel.id,
          notifications,
          snapshot
        );
      }
    });
  };

  handleNotifications = (
    channelId,
    currentChannelId,
    notifications,
    snapshot
  ) => {
    let lastTotal = 0;
    // Find the correct channel in notifications
    let index = notifications.findIndex(
      notification => notification.id === channelId
    );
    // Check if channel is in notifications array
    if (index !== -1) {
      // Don't show notifications for current channel
      if (channelId !== currentChannelId) {
        // Check for new messages
        lastTotal = notifications[index].total;
        if (snapshot.numChildren() - lastTotal > 0) {
          notifications[index].count = snapshot.numChildren() - lastTotal;
        }
      }
      // Update lastKnowTotal for removing notifications on channel change
      notifications[index].lastKnownTotal = snapshot.numChildren();
      // Add channel to notifications array if it does not exist
    } else {
      notifications.push({
        id: channelId,
        total: snapshot.numChildren(),
        lastKnownTotal: snapshot.numChildren(),
        count: 0
      });
    }

    this.setState({ notifications });
  };

  clearNotifications = () => {
    const { channel, notifications } = this.state;
    let index = notifications.findIndex(
      notification => notification.id === channel.id
    );

    if (index !== -1) {
      let updatedNotifications = [...notifications];
      updatedNotifications[index].total = notifications[index].lastKnowTotal;
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };

  setFirstChannel = () => {
    const { channels } = this.state;
    const { firstLoad } = this.props;
    if (firstLoad && channels.length) {
      this.changeChannel(channels[0]);
      this.setState({ channel: channels[0] });
    }
  };

  changeChannel = channel => {
    const { setCurrentChannel } = this.props;
    setCurrentChannel(channel, false);
    this.setState({ channel });
  };

  displayChannels = channels => {
    return (
      channels.length > 0 &&
      channels.map(channel => (
        <Menu.Item
          key={channel.id}
          name={channel.name}
          style={{ opacity: '0.7' }}
          active={channel.id === this.props.currentChannel.id}
          onClick={() =>
            channel.id === this.state.channel.id
              ? this.clearNotifications()
              : this.changeChannel(channel)
          }
        >
          {this.getNotificationCount(channel)}# {channel.name}
        </Menu.Item>
      ))
    );
  };

  getNotificationCount = channel => {
    const { notifications } = this.state;
    let count = 0;

    notifications.forEach(notification => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    return count > 0 ? <Label color="red">{count}</Label> : null;
  };

  render() {
    const { channels } = this.state;

    return (
      <>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="exchange" /> Channels ({channels.length})
            </span>
            <AddChannel addChannel={this.addChannel} />
          </Menu.Item>
          {this.displayChannels(channels)}
        </Menu.Menu>
      </>
    );
  }
}

const mapStateToProps = ({ channel: { currentChannel, firstLoad } }) => ({
  currentChannel,
  firstLoad
});

export default connect(
  mapStateToProps,
  { setCurrentChannel }
)(Channels);
