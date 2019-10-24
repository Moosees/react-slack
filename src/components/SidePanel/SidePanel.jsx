import React from 'react';
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';
import Channels from './Channels';
import DirectMessages from './DirectMessages';
import Starred from './Starred';
import UserPanel from './UserPanel';

const SidePanel = ({ primaryColor }) => {
  return (
    <Menu
      size="large"
      inverted
      vertical
      fixed="left"
      className="side-panel"
      style={{ backgroundColor: primaryColor }}
    >
      <UserPanel />
      <Starred />
      <Channels />
      <DirectMessages />
    </Menu>
  );
};

const mapStateToProps = ({ colors: { primaryColor } }) => ({
  primaryColor
});

export default connect(mapStateToProps)(SidePanel);
