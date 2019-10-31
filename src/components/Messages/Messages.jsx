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
    typingRef: firebase.database().ref('typing'),
    connectedRef: firebase.database().ref('.info/connected'),
    messages: [],
    messagesLoading: true,
    typingUsers: []
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
    this.addTypingListeners(channelId);
    this.addMessageListener(channelId);
  };

  addTypingListeners = channelId => {
    const { currentUser } = this.props;
    const { typingRef, connectedRef } = this.state;
    let typingUsers = [];

    typingRef.child(channelId).on('child_added', snapshot => {
      if (snapshot.key !== currentUser.uid) {
        typingUsers = typingUsers.concat({
          id: snapshot.key,
          name: snapshot.val()
        });
        this.setState({ typingUsers });
      }
    });

    typingRef.child(channelId).on('child_removed', snapshot => {
      const index = typingUsers.findIndex(user => user.id === snapshot.key);
      if (index !== -1) {
        typingUsers = typingUsers.filter(user => user.id !== snapshot.key);
        this.setState({ typingUsers });
      }
    });

    connectedRef.on('value', snapshot => {
      if (snapshot.val() === true) {
        typingRef
          .child(channelId)
          .child(currentUser.uid)
          .onDisconnect()
          .remove(error => {
            if (error !== null) {
              console.error(error);
            }
          });
      }
    });
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

  displayTypingUsers = typingUsers => {
    if (typingUsers.length > 0) {
      return typingUsers.map(user => (
        <div className="user-typing" key={user.id}>
          <span className="user-typing__user">{user.name}</span>is typing
          <Typing />
        </div>
      ));
    }
  };

  render() {
    const { messages, typingUsers } = this.state;
    const { currentUser, searchTerm } = this.props;

    return (
      <Comment.Group className="messages">
        {searchTerm
          ? this.displaySearch(messages, currentUser, searchTerm)
          : this.displayMessages(messages, currentUser)}
        {this.displayTypingUsers(typingUsers)}
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
