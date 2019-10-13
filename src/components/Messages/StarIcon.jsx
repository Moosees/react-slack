import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import firebase from '../../firebase/firebase';
import { setChannelStar } from '../../redux/actions';

class StarIcon extends Component {
  state = {
    usersRef: firebase.database().ref('users'),
    isLoading: false
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
        setChannelStar(snapshot.exists());
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

    this.setState({ isLoading: true }, () => {
      if (!isChannelStarred) {
        usersRef
          .child(`${currentUser.uid}/starred`)
          .update({
            [currentChannel.id]: {
              ...currentChannel
            }
          })
          .then(() => {
            setChannelStar(true);
            this.setState({ isLoading: false });
          });
      } else {
        usersRef
          .child(`${currentUser.uid}/starred`)
          .child(currentChannel.id)
          .remove(error => {
            if (error !== null) {
              console.error(error);
            }
          })
          .then(() => {
            setChannelStar(false);
            this.setState({ isLoading: false });
          });
      }
    });
  };

  render() {
    const { isChannelStarred } = this.props;
    const { isLoading } = this.state;

    return (
      <Icon
        style={{ cursor: 'pointer' }}
        aria-label="Toggle favorite channel"
        name={
          isLoading
            ? 'star half full'
            : isChannelStarred
            ? 'star'
            : 'star outline'
        }
        color={isChannelStarred || isLoading ? 'yellow' : 'black'}
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
