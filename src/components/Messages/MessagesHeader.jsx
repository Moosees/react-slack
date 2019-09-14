import React, { Component } from 'react';
import { Header, Icon, Input, Segment } from 'semantic-ui-react';

class MessageForm extends Component {
  render() {
    return (
      <Segment clearing>
        <Header fuid as="h2" floated="left" style={{ marginBottom: '0' }}>
          <span>
            Channel
            <Icon name="star outline" color="black" />
          </span>
          <Header.Subheader>2 Users</Header.Subheader>
        </Header>
        <Header floated="right">
          <Input
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Messages"
          />
        </Header>
      </Segment>
    );
  }
}

export default MessageForm;
