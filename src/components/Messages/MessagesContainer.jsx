import React from 'react';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import MessageForm from './MessageForm';
import Messages from './Messages';
import MessagesHeader from './MessagesHeader';

const MessagesContainer = ({ currentChannel, firstLoad }) => {
  return (
    <>
      <MessagesHeader />
      <Segment>
        {firstLoad ? null : <Messages key={currentChannel.id} />}
      </Segment>
      <MessageForm />
    </>
  );
};

const mapStateToProps = ({ channel: { currentChannel, firstLoad } }) => ({
  currentChannel,
  firstLoad
});

export default connect(mapStateToProps)(MessagesContainer);
