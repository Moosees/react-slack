import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Icon, Input, Segment } from 'semantic-ui-react';
import { setSearchTerm } from '../../redux/actions';

class MessageForm extends Component {
  displayChannelName = () =>
    this.props.currentChannel ? `#${this.props.currentChannel.name}` : '';

  displayNumUsers = () => {
    const { numUniqueUsers } = this.props;
    const plural = !numUniqueUsers === 1;
    return `${numUniqueUsers} user${plural ? 's' : ''} is here`;
  };

  handleSearch = evt => {
    this.props.setSearchTerm(evt.target.value);
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
            value={this.props.searchTerm}
            onChange={this.handleSearch}
          />
        </Header>
      </Segment>
    );
  }
}

const mapStateToProps = ({
  channel: { currentChannel, numUniqueUsers },
  search: { searchTerm }
}) => ({
  currentChannel,
  numUniqueUsers,
  searchTerm
});

export default connect(
  mapStateToProps,
  { setSearchTerm }
)(MessageForm);
