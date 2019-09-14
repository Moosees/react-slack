import React, { Component } from 'react';
import { Comment, Segment } from 'semantic-ui-react';
import MessageForm from './MessageForm';
import MessagesHeader from './MessagesHeader';
import firebase from '../../firebase/firebase';

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref('messages')
  };

  render() {
    const { messagesRef } = this.state;

    return (
      <>
        <MessagesHeader />
        <Segment>
          <Comment.Group className="messages">{/* Messages */}</Comment.Group>
        </Segment>
        <MessageForm messagesRef={messagesRef} />
      </>
    );
  }
}

export default Messages;
