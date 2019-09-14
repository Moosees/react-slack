import React, { Component } from 'react';
import { Segment, Form, Button, Input } from 'semantic-ui-react';
import { connect } from 'react-redux';
import firebase from '../../firebase/firebase';

class MessageForm extends Component {
  state = {
    message: '',
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
    const { messagesRef, currentChannel } = this.props;
    const { message } = this.state;

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
      <Segment className="message-form">
        <Form onSubmit={this.sendMessage}>
          <Input
            fluid
            name="message"
            value={message}
            style={{ marginBottom: '1em' }}
            label={<Button icon="add" />}
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
          <Button.Group icon widths="2">
            <Button
              disabled={loading}
              color="orange"
              content="Send Message"
              labelPosition="left"
              icon="edit"
              type="submit"
            />
            <Button
              disabled={loading}
              color="teal"
              content="Upload Media"
              labelPosition="right"
              icon="cloud upload"
            />
          </Button.Group>
        </Form>
      </Segment>
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
