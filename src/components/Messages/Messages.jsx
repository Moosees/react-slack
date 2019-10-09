import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Comment } from 'semantic-ui-react';
import firebase from '../../firebase/firebase';
import { setNumUniqueUsers } from '../../redux/actions';
import Message from './Message';

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    privateMessagesRef: firebase.database().ref('privateMessages'),
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
    const ref = this.getMessagesRef();
    const { setNumUniqueUsers } = this.props;

    let loadedMessages = [];

    ref.child(channelId).on('child_added', snapshot => {
      loadedMessages.push(snapshot.val());
      setNumUniqueUsers(this.countUniqueUsers(loadedMessages));
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
    });
  };

  removeListeners = channelId => {
    // FIX FIX FIX
    const ref = this.getMessagesRef();
    ref.child(channelId).off();
  };

  // change to redux?
  getMessagesRef = () => {
    return this.props.isPrivateChannel
      ? this.state.privateMessagesRef
      : this.state.messagesRef;
  };

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    return uniqueUsers.length;
  };

  displayMessages = (messages, currentUser) => {
    return (
      messages.length > 0 &&
      messages.map(message => (
        <Message key={message.timestamp} message={message} user={currentUser} />
      ))
    );
  };

  displaySearch = (messages, currentUser, searchTerm) => {
    const channelMessages = [...messages];
    const regex = new RegExp(searchTerm, 'gi');

    const searchResults = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);

    return searchResults.map(message => (
      <Message key={message.timestamp} message={message} user={currentUser} />
    ));
  };

  render() {
    const { messages } = this.state;
    const { currentUser, searchTerm } = this.props;

    return (
      <Comment.Group className="messages">
        {searchTerm
          ? this.displaySearch(messages, currentUser, searchTerm)
          : this.displayMessages(messages, currentUser)}
      </Comment.Group>
    );
  }
}

const mapStateToProps = ({
  channel: { currentChannel, isPrivateChannel },
  user: { currentUser },
  search: { searchTerm }
}) => ({
  currentChannel,
  isPrivateChannel,
  currentUser,
  searchTerm
});

export default connect(
  mapStateToProps,
  { setNumUniqueUsers }
)(Messages);
