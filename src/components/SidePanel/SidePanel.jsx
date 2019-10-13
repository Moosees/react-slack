import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import Channels from './Channels';
import DirectMessages from './DirectMessages';
import Starred from './Starred';
import UserPanel from './UserPanel';

class SidePanel extends Component {
  render() {
    return (
      <Menu
        size="large"
        inverted
        vertical
        fixed="left"
        className="side-panel"
      >
        <UserPanel />
        <Starred />
        <Channels />
        <DirectMessages />
      </Menu>
    );
  }
}

export default SidePanel;
