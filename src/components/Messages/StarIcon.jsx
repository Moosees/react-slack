import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { setChannelStar } from '../../redux/actions';
import firebase from '../../firebase/firebase';

class StarIcon extends Component {
  state = {
    usersRef: firebase.database().ref('users')
  };

  componentDidMount() {
    const { currentUser, currentChannel } = this.props;
    if (currentUser.uid && currentChannel.id) {
      this.addListener(currentUser.uid, currentChannel.id);
    }
  }

  addListener = (userId, channelId) => {
    const { usersRef } = this.state;
    const { setChannelStar } = this.props;

    usersRef
      .child(userId)
      .child('starred')
      .child(channelId)
      .once('value', snapshot => {
        if (snapshot.exists()) {
          setChannelStar(true);
        } else {
          setChannelStar(false);
        }
      });
  };

  handleStar = () => {
    const { usersRef } = this.state;
    const {
      currentUser,
      currentChannel,
      isChannelStarred,
      setChannelStar
    } = this.props;
    if (!isChannelStarred) {
      usersRef
        .child(`${currentUser.uid}/starred`)
        .update({
          [currentChannel.id]: {
            ...currentChannel
          }
        })
        .then(() => setChannelStar(true));
    } else {
      usersRef
        .child(`${currentUser.uid}/starred`)
        .child(currentChannel.id)
        .remove(error => {
          if (error !== null) {
            console.error(error);
          }
        })
        .then(() => setChannelStar(false));
    }
  };

  render() {
    const { isChannelStarred } = this.props;

    return (
      <Icon
        name={isChannelStarred ? 'star' : 'star outline'}
        color={isChannelStarred ? 'yellow' : 'black'}
        onClick={this.handleStar}
      />
    );
  }
}

const mapStateToProps = ({
  user: { currentUser },
  channel: { currentChannel, isChannelStarred }
}) => ({
  currentUser,
  currentChannel,
  isChannelStarred
});

export default connect(
  mapStateToProps,
  { setChannelStar }
)(StarIcon);
