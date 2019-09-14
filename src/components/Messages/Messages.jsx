import React, { Component } from 'react';
import { Comment, Segment } from 'semantic-ui-react';
import MessageForm from './MessageForm';
import MessagesHeader from './MessagesHeader';

class Messages extends Component {
  render() {
    return (
      <>
        <MessagesHeader />
        <Segment>
          <Comment.Group className="messages">{/* Messages */}</Comment.Group>
        </Segment>
        <MessageForm />
      </>
    );
  }
}

export default Messages;
