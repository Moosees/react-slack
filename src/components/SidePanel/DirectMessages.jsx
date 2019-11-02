import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Menu } from 'semantic-ui-react';
import firebase from '../../firebase/firebase';
import { setCurrentChannel } from '../../redux/actions';

class DirectMessages extends Component {
  state = {
    users: [],
    usersRef: firebase.database().ref('users'),
    connectedRef: firebase.database().ref('.info/connected'),
    presenceRef: firebase.database().ref('presence')
  };

  componentDidMount() {
    const { currentUser } = this.props;

    if (currentUser.uid) {
      this.addListerners(currentUser.uid);
    }
  }

  componentWillUnmount() {
    const { currentUser } = this.props;

    if (currentUser.uid) {
      this.removeListerners(currentUser.uid);
    }
  }

  removeListerners = currentUserId => {
    const { usersRef, connectedRef, presenceRef } = this.state;

    usersRef.off('child_added');
    connectedRef.off('value');
    presenceRef.off('child_added');
    presenceRef.off('child_removed');
  };

  addListerners = currentUserId => {
    const { usersRef, connectedRef, presenceRef } = this.state;

    let loadedUsers = [];
    usersRef.on('child_added', snapshot => {
      if (currentUserId !== snapshot.key) {
        let user = snapshot.val();
        user['uid'] = snapshot.key;
        user['status'] = 'offline';
        loadedUsers.push(user);
        this.setState({ users: loadedUsers });
      }
    });

    connectedRef.on('value', snapshot => {
      if (snapshot.val() === true) {
        const ref = presenceRef.child(currentUserId);
        ref.set(true);
        ref.onDisconnect().remove(error => {
          if (error !== null) {
            console.error(error);
          }
        });
      }
    });

    presenceRef.on('child_added', snapshot => {
      if (currentUserId !== snapshot.key) {
        this.addStatusToUser(snapshot.key, true);
      }
    });

    presenceRef.on('child_removed', snapshot => {
      if (currentUserId !== snapshot.key) {
        this.addStatusToUser(snapshot.key, false);
      }
    });
  };

  addStatusToUser = (userId, connected = true) => {
    const { users } = this.state;

    const updatedUsers = users.reduce((acc, user) => {
      if (user.uid === userId) {
        user['status'] = connected ? 'online' : 'offline';
      }
      return acc.concat(user);
    }, []);
    this.setState({ user: updatedUsers });
  };

  isUserOnline = user => user.status === 'online';

  changeToUserChannel = user => {
    const channelId = this.getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.displayName
    };
    this.props.setCurrentChannel(channelData, true);
  };

  getChannelId = userId => {
    const { currentUser } = this.props;
    return userId < currentUser.uid
      ? `${userId}/${currentUser.uid}`
      : `${currentUser.uid}/${userId}`;
  };

  render() {
    const { users } = this.state;
    const { currentChannel } = this.props;

    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" /> Direct Messages{' '}
          </span>
          ({users.length})
        </Menu.Item>
        {users.map(user => (
          <Menu.Item
            key={user.uid}
            onClick={() => this.changeToUserChannel(user)}
            active={currentChannel.id.includes(user.uid)}
            style={{ opacity: '0.7', fontStyle: 'italic' }}
          >
            <Icon
              name="circle"
              color={this.isUserOnline(user) ? 'green' : 'red'}
            />
            @ {user.displayName}
          </Menu.Item>
        ))}
      </Menu.Menu>
    );
  }
}

const mapStateToProps = ({
  channel: { currentChannel },
  user: { currentUser }
}) => ({
  currentChannel,
  currentUser
});

export default connect(
  mapStateToProps,
  { setCurrentChannel }
)(DirectMessages);
