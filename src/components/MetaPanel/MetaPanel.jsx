import React, { Component } from 'react';
import { connect } from 'react-redux';
// prettier-ignore
import { Accordion, Header, Icon, Image, List, Segment } from 'semantic-ui-react';

class MetaPanel extends Component {
  state = {
    activeIndex: 0
  };

  setActiveIndex = (_evt, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  displayTopPosters = userPosts => {
    const posts = Object.entries(userPosts)
      .sort((a, b) => b[1].count - a[1].count)
      .filter((_x, i) => i < 5)
      .map(([key, val], i) => (
        <List.Item key={i}>
          <Image avatar src={val.avatar} />
          <List.Content>
            <List.Header>{key}</List.Header>
            <List.Description>{this.formatCount(val.count)}</List.Description>
          </List.Content>
        </List.Item>
      ));
    return posts;
  };

  formatCount = count => {
    const plural = !(count === 1);
    return `${count} post${plural ? 's' : ''}`;
  };

  render() {
    const { activeIndex } = this.state;
    const { currentChannel, isPrivateChannel, userPosts } = this.props;

    return isPrivateChannel ? null : (
      <Segment key={currentChannel.id} loading={!currentChannel.id}>
        <Header as="h3" attached="top">
          About # {currentChannel.name && currentChannel.name}
        </Header>
        <Accordion styled attached="true">
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="info" />
            Channel Details
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            {currentChannel.details && currentChannel.details}
          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="user circle" />
            Top Posters
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <List>
              {activeIndex === 1 &&
                userPosts &&
                this.displayTopPosters(userPosts)}
            </List>
          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 2}
            index={2}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="pencil alternate" />
            Created By
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 2}>
            <Header as="h4">
              <Image
                circular
                src={
                  currentChannel.createdBy.avatar &&
                  currentChannel.createdBy.avatar
                }
              />
              {currentChannel.createdBy.name && currentChannel.createdBy.name}
            </Header>
          </Accordion.Content>
        </Accordion>
      </Segment>
    );
  }
}

const mapStateToProps = ({
  channel: { currentChannel, isPrivateChannel, userPosts }
}) => ({
  currentChannel,
  isPrivateChannel,
  userPosts
});

export default connect(mapStateToProps)(MetaPanel);
