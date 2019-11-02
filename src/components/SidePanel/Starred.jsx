import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Menu } from 'semantic-ui-react';
import firebase from '../../firebase/firebase';
import { setCurrentChannel } from '../../redux/actions';

class Starred extends Component {
  state = {
    channel: null,
    starredChannels: [],
    usersRef: firebase.database().ref('users')
  };

  componentDidMount() {
    const { currentUser } = this.props;

    if (currentUser.uid) {
      this.addListeners(currentUser.uid);
    }
  }

  componentWillUnmount() {
    const { currentUser } = this.props;

    if (currentUser.uid) {
      this.removeListeners(currentUser.uid);
    }
  }

  removeListeners = userId => {
    const { usersRef } = this.state;

    usersRef
      .child(userId)
      .child('starred')
      .off('child_added');
    usersRef
      .child(userId)
      .child('starred')
      .off('child_removed');
  };

  addListeners = userId => {
    const { usersRef } = this.state;

    usersRef
      .child(userId)
      .child('starred')
      .on('child_added', snapshot => {
        const starAdded = { id: snapshot.key, ...snapshot.val() };
        this.setState(prev => ({
          starredChannels: [...prev.starredChannels, starAdded]
        }));
      });

    usersRef
      .child(userId)
      .child('starred')
      .on('child_removed', snapshot => {
        const starRemovedId = snapshot.key;
        this.setState(prev => ({
          starredChannels: prev.starredChannels.filter(
            channel => channel.id !== starRemovedId
          )
        }));
      });
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
          onClick={() => this.changeChannel(channel)}
        >
          # {channel.name}
        </Menu.Item>
      ))
    );
  };

  render() {
    const { starredChannels } = this.state;

    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="star" /> Favorite Channels ({starredChannels.length})
          </span>
        </Menu.Item>
        {this.displayChannels(starredChannels)}
      </Menu.Menu>
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
)(Starred);
