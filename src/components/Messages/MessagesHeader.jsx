import React, { Component } from 'react';
import { Header, Icon, Input, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';

class MessageForm extends Component {
  displayChannelName = () =>
    this.props.currentChannel ? `#${this.props.currentChannel.name}` : '';

  displayNumUsers = () => {
    const { numUniqueUsers } = this.props;
    const plural = !numUniqueUsers === 1;
    return `${numUniqueUsers} user${plural ? 's' : ''} is here`;
  };

  render() {
    return (
      <Segment clearing>
        <Header
          fuid="true"
          as="h2"
          floated="left"
          style={{ marginBottom: '0' }}
        >
          <span>
            {this.displayChannelName()}{' '}
            <Icon name="star outline" color="black" />
          </span>
          <Header.Subheader>{this.displayNumUsers()}</Header.Subheader>
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

const mapStateToProps = ({ channel: { currentChannel, numUniqueUsers } }) => ({
  currentChannel,
  numUniqueUsers
});

export default connect(mapStateToProps)(MessageForm);
