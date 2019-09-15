import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Comment } from 'semantic-ui-react';
import firebase from '../../firebase/firebase';
import Message from './Message';

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    messages: [],
    messagesLoading: true
  };

  componentDidMount() {
    const { currentChannel, currentUser } = this.props;
    if (currentChannel && currentUser) {
      this.addListeners(currentChannel.id);
    }
  }

  componentWillUnmount() {
    const { currentChannel } = this.props;
    this.removeListeners(currentChannel.id);
  }

  addListeners = channelId => {
    this.addMessageListener(channelId);
  };

  addMessageListener = channelId => {
    const { messagesRef } = this.state;
    let loadedMessages = [];
    messagesRef.child(channelId).on('child_added', snapshot => {
      loadedMessages.push(snapshot.val());
      this.setState({ messages: loadedMessages, messagesLoading: false });
    });
  };

  removeListeners = channelId => {
    const { messagesRef } = this.state;
    messagesRef.child(channelId).off();
  };

  displayMessages = messages => {
    const { currentUser } = this.props;

    return (
      messages.length > 0 &&
      messages.map(message => (
        <Message key={message.timestamp} message={message} user={currentUser} />
      ))
    );
  };

  render() {
    const { messages } = this.state;

    return (
      <Comment.Group className="messages">
        {this.displayMessages(messages)}
      </Comment.Group>
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

export default connect(mapStateToProps)(Messages);
