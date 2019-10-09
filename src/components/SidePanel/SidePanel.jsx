import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import Channels from './Channels';
import DirectMessages from './DirectMessages';
import UserPanel from './UserPanel';

class SidePanel extends Component {
  render() {
    return (
      <Menu
        size="large"
        inverted
        vertical
        fixed="left"
        style={{ backgroundColor: '#4c3c4c', fontSize: '1.2rem' }}
      >
        <UserPanel />
        <Channels />
        <DirectMessages />
      </Menu>
    );
  }
}

export default SidePanel;
