import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import firebase from 'firebase';

class DirectMessages extends Component {
  state = {
    users: [],
    usersRef: firebase.database().ref('users'),
    connectedRef: firebase.database().ref('.info/connected'),
    presenceRef: firebase.database().ref('presence')
  };

  componentDidMount() {
    if (this.props.currentUser) {
      this.addListerners(this.props.currentUser.uid);
    }
  }

  addListerners = currentUserId => {
    let loadedUsers = [];
    this.state.usersRef.on('child_added', snapshot => {
      if (currentUserId !== snapshot.key) {
        let user = snapshot.val();
        user['uid'] = snapshot.key;
        user['status'] = 'offline';
        loadedUsers.push(user);
        this.setState({ users: loadedUsers });
      }
    });

    this.state.connectedRef.on('value', snapshot => {
      if (snapshot.val() === true) {
        const ref = this.state.presenceRef.child(currentUserId);
        ref.set(true);
        ref.onDisconnect().remove(error => {
          if (error !== null) {
            console.error(error);
          }
        });
      }
    });

    this.state.presenceRef.on('child_added', snapshot => {
      if (currentUserId !== snapshot.key) {
        this.addStatusToUser(snapshot.key, true);
      }
    });

    this.state.presenceRef.on('child_removed', snapshot => {
      if (currentUserId !== snapshot.key) {
        this.addStatusToUser(snapshot.key, false);
      }
    });
  };

  addStatusToUser = (userId, connected = true) => {
    const updatedUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user['status'] = connected ? 'online' : 'offline';
      }
      return acc.concat(user);
    }, []);
    this.setState({ user: updatedUsers });
  };

  isUserOnline = user => user.status === 'online';

  render() {
    const { users } = this.state;

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
            onClick={() => console.log({ user })}
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

const mapStateToProps = ({ user: { currentUser } }) => ({
  currentUser
});

export default connect(mapStateToProps)(DirectMessages);
