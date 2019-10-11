import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Menu } from 'semantic-ui-react';
import { setCurrentChannel } from '../../redux/actions';

class Starred extends Component {
  state = { channel: null, starredChannels: [] };

  changeChannel = channel => {
    const { setCurrentChannel } = this.props;
    setCurrentChannel(channel, false);
    this.setState({ channel });
  };

  displayChannels = channels => {
    return (
      channels.length > 0 &&
      channels.map(channel => (
        <Menu.Item
          key={channel.id}
          name={channel.name}
          style={{ opacity: '0.7' }}
          active={channel.id === this.props.currentChannel.id}
          onClick={() => this.changeChannel(channel)}
        ></Menu.Item>
      ))
    );
  };

  render() {
    const { starredChannels } = this.state;

    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="star" /> Favorite Channels ({starredChannels.length})
          </span>
        </Menu.Item>
        {this.displayChannels(starredChannels)}
      </Menu.Menu>
    );
  }
}

const mapStateToProps = ({
  user: { currentUser },
  channel: { currentChannel, firstLoad }
}) => ({
  currentUser,
  currentChannel,
  firstLoad
});

export default connect(
  mapStateToProps,
  { setCurrentChannel }
)(Starred);
