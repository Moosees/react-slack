import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Input, Segment } from 'semantic-ui-react';
import firebase from '../../firebase/firebase';

class MessageForm extends Component {
  state = {
    message: '',
    messagesRef: firebase.database().ref('messages'),
    loading: false,
    errors: []
  };

  handleChange = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  };

  createMessage = () => {
    const { message } = this.state;
    const { currentUser } = this.props;

    const createdMessage = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      content: message,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      }
    };
    return createdMessage;
  };

  sendMessage = () => {
    const { currentChannel } = this.props;
    const { message, messagesRef } = this.state;

    if (message) {
      this.setState({ loading: true });
      messagesRef
        .child(currentChannel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ message: '', loading: false, errors: [] });
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
    const { message, loading, errors } = this.state;

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
            />
          </Form>
        </Segment>
        <Segment style={{ flexGrow: '0' }}>
          <Button
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Segment>
      </Segment.Group>
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

export default connect(mapStateToProps)(MessageForm);
