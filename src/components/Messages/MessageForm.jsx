import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Input, Segment } from 'semantic-ui-react';
import uuidv4 from 'uuid/v4';
import firebase from '../../firebase/firebase';
import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

class MessageForm extends Component {
  state = {
    message: '',
    messagesRef: firebase.database().ref('messages'),
    privateMessagesRef: firebase.database().ref('privateMessages'),
    typingRef: firebase.database().ref('typing'),
    modalOpen: false,
    percentUploaded: 0,
    storageRef: firebase.storage().ref(),
    uploadState: 'done',
    uploadTask: null,
    loading: false,
    errors: []
  };

  handleChange = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  };

  handleKeyDown = () => {
    const { message } = this.state;
    if (message) {
      this.addTypingRef();
    } else {
      this.removeTypingRef();
    }
  };

  addTypingRef = () => {
    const { currentChannel, currentUser } = this.props;
    const { typingRef } = this.state;

    if (currentChannel.id && currentUser.uid) {
      typingRef
        .child(currentChannel.id)
        .child(currentUser.uid)
        .set(currentUser.displayName);
    }
  };

  removeTypingRef = () => {
    const { currentChannel, currentUser } = this.props;
    const { typingRef } = this.state;

    if (currentChannel.id && currentUser.uid) {
      typingRef
        .child(currentChannel.id)
        .child(currentUser.uid)
        .remove();
    }
  };

  openModal = () => this.setState({ modalOpen: true });
  closeModal = () => this.setState({ modalOpen: false });

  uploadFile = (file, metadata) => {
    const pathToUpload = this.props.currentChannel.id;
    const ref = this.getMessagesRef();
    const filePath = `${this.getPath()}/${uuidv4()}.jpg`;

    this.setState(
      {
        uploadState: 'uploading',
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
      },
      () => {
        this.state.uploadTask.on(
          'state_changed',
          snapshot => {
            const percentUploaded = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            this.setState({ percentUploaded });
          },
          error => {
            console.error(error);
            this.setState({
              uploadState: 'error',
              uploadTask: null,
              errors: this.state.errors.concat(error)
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadURL => {
                this.sendFileMessage(downloadURL, ref, pathToUpload);
              })
              .catch(error => {
                console.error(error);
                this.setState({
                  uploadState: 'error',
                  uploadTask: null,
                  errors: this.state.errors.concat(error)
                });
              });
          }
        );
      }
    );
  };

  getMessagesRef = () => {
    return this.props.isPrivateChannel
      ? this.state.privateMessagesRef
      : this.state.messagesRef;
  };

  getPath = () => {
    const { currentChannel, isPrivateChannel } = this.props;
    return isPrivateChannel
      ? `chat/private-${currentChannel.id}`
      : 'chat/public';
  };

  sendFileMessage = (downloadURL, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(downloadURL))
      .then(() => {
        this.setState({ uploadState: 'done', percentUploaded: 0 });
      })
      .catch(error => {
        console.error(error);
        this.setState({
          errors: this.state.errors.concat(error)
        });
      });
  };

  createMessage = (downloadURL = null) => {
    const { message } = this.state;
    const { currentUser } = this.props;

    const createdMessage = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      }
    };
    if (downloadURL !== null) {
      createdMessage['image'] = downloadURL;
    } else {
      createdMessage['content'] = message;
    }
    return createdMessage;
  };

  sendMessage = () => {
    const { currentChannel } = this.props;
    const { message } = this.state;
    const ref = this.getMessagesRef();

    if (message) {
      this.setState({ loading: true });
      ref
        .child(currentChannel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ message: '', loading: false, errors: [] });
          this.removeTypingRef();
        })
        .catch(error => {
          console.error(error);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(error)
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: 'Message is empty' })
      });
    }
  };

  render() {
    const {
      message,
      modalOpen,
      percentUploaded,
      uploadState,
      loading,
      errors
    } = this.state;

    return (
      <Segment.Group horizontal className="message-form">
        <Segment>
          <Form onSubmit={this.sendMessage}>
            <Input
              fluid
              name="message"
              value={message}
              label={<Button icon="add" type="submit" disabled={loading} />}
              labelPosition="left"
              placeholder="Write your message"
              className={
                errors.some(error =>
                  error.message.toLowerCase().includes('message')
                )
                  ? 'error'
                  : ''
              }
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
            />
          </Form>
        </Segment>
        <Segment
          style={{ flexGrow: '0', padding: '0 1em', alignSelf: 'center' }}
        >
          <Button
            style={{ minWidth: '12em', minHeight: '3em' }}
            disabled={uploadState === 'uploading'}
            color="blue"
            content={
              percentUploaded ? (
                <ProgressBar percentUploaded={percentUploaded} />
              ) : (
                'Upload Media'
              )
            }
            labelPosition="right"
            icon="cloud upload"
            onClick={this.openModal}
          />
        </Segment>
        <FileModal
          modal={modalOpen}
          uploadFile={this.uploadFile}
          closeModal={this.closeModal}
        />
      </Segment.Group>
    );
  }
}

const mapStateToProps = ({
  channel: { currentChannel, isPrivateChannel },
  user: { currentUser }
}) => ({
  currentChannel,
  isPrivateChannel,
  currentUser
});

export default connect(mapStateToProps)(MessageForm);
