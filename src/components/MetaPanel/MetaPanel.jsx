import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Accordion, Header, Icon, Image, Segment } from 'semantic-ui-react';

class MetaPanel extends Component {
  state = {
    activeIndex: 0
  };

  setActiveIndex = (evt, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { activeIndex } = this.state;
    const { currentChannel, isPrivateChannel } = this.props;

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
            top posters
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
            <Image
              src={
                currentChannel.createdBy.avatar &&
                currentChannel.createdBy.avatar
              }
            />
            {currentChannel.createdBy.name && currentChannel.createdBy.name}
          </Accordion.Content>
        </Accordion>
      </Segment>
    );
  }
}

const mapStateToProps = ({
  channel: { currentChannel, isPrivateChannel }
}) => ({
  currentChannel,
  isPrivateChannel
});

export default connect(mapStateToProps)(MetaPanel);
