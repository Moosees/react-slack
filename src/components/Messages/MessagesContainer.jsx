import React from 'react';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import MessageForm from './MessageForm';
import Messages from './Messages';
import MessagesHeader from './MessagesHeader';

const MessagesContainer = ({ firstLoad }) => {
  return (
    <>
      <MessagesHeader />
      <Segment>{firstLoad ? null : <Messages />}</Segment>
      <MessageForm />
    </>
  );
};

const mapStateToProps = ({ channel: { firstLoad } }) => ({
  firstLoad
});

export default connect(mapStateToProps)(MessagesContainer);
