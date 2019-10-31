import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Comment } from 'semantic-ui-react';
import firebase from '../../firebase/firebase';
import { setNumUniqueUsers, setUserPosts } from '../../redux/actions';
import Message from './Message';
import Typing from './Typing';

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
    const { setNumUniqueUsers, isPrivateChannel } = this.props;

    let loadedMessages = [];

    ref.child(channelId).on('child_added', snapshot => {
      loadedMessages.push(snapshot.val());
      setNumUniqueUsers(this.countUniqueUsers(loadedMessages));
      if (!isPrivateChannel) {
        this.countUserPosts(loadedMessages);
      }
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
    });
  };

  removeListeners = channelId => {
    const ref = this.getMessagesRef();
    ref.child(channelId).off();
  };

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

  countUserPosts = messages => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count++;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        };
      }
      return acc;
    }, {});
    this.props.setUserPosts(userPosts);
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
        <div className="user-typing">
          <span className="user-typing__user">someone</span>is typing
          <Typing />
        </div>
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
  { setNumUniqueUsers, setUserPosts }
)(Messages);
