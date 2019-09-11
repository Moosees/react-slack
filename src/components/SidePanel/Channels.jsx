import React, { Component } from 'react';
import { Button, Form, Icon, Input, Menu, Modal, Header } from 'semantic-ui-react';

class Channels extends Component {
  state = {
    channels: [],
    channelName: '',
    channelDetails: '',
    modalOpen: true
  };

  handleChange = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  };

  handleOpenModal = () => {
    this.setState({ modalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ modalOpen: false });
  };

  render() {
    const { channels, modalOpen } = this.state;

    return (
      <>
        <Menu.Menu style={{ paddingBottom: '2em' }}>
          <Menu.Item>
            <span>
              <Icon name="exchange" /> Channels ({channels.length})
            </span>
            <Icon
              name="add"
              style={{ cursor: 'pointer' }}
              onClick={this.handleOpenModal}
            />
          </Menu.Item>
        </Menu.Menu>
        <Modal basic open={modalOpen} onClose={this.handleCloseModal}>
          <Header icon="chat" content="Add a channel"/>
          <Modal.Content>
            <Form>
              <Form.Field>
                <Input
                  fluid
                  placeholder="Please name the channel"
                  label={{ tag: true, content: 'Name' }}
                  labelPosition="right"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  placeholder="Enter a short description"
                  label={{ tag: true, content: 'Details' }}
                  labelPosition="right"
                  name="channelDetails"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted>
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" inverted onClick={this.handleCloseModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default Channels;
