import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Icon, Input, Segment } from 'semantic-ui-react';
import { setSearchTerm } from '../../redux/actions';

class MessageForm extends Component {
  displayChannelName = () => {
    const { currentChannel, isPrivateChannel } = this.props;
    return currentChannel
      ? `${isPrivateChannel ? '@' : '#'}${currentChannel.name}`
      : '';
  };

  displayNumUsers = () => {
    const { numUniqueUsers } = this.props;
    const plural = !(numUniqueUsers === 1);
    return `${numUniqueUsers} user${plural ? 's' : ''}`;
  };

  handleSearch = evt => {
    this.props.setSearchTerm(evt.target.value);
  };

  render() {
    const { isPrivateChannel, searchTerm } = this.props;

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
            {!isPrivateChannel ? (
              <Icon name="star outline" color="black" />
            ) : null}
          </span>
          <Header.Subheader>{this.displayNumUsers()}</Header.Subheader>
        </Header>
        <Header floated="right">
          <Input
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Messages"
            value={searchTerm}
            onChange={this.handleSearch}
          />
        </Header>
      </Segment>
    );
  }
}

const mapStateToProps = ({
  channel: { currentChannel, isPrivateChannel, numUniqueUsers },
  search: { searchTerm }
}) => ({
  currentChannel,
  isPrivateChannel,
  numUniqueUsers,
  searchTerm
});

export default connect(
  mapStateToProps,
  { setSearchTerm }
)(MessageForm);
