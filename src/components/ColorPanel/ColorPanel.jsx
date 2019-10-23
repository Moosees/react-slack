import React from 'react';
import { connect } from 'react-redux';
import { Divider, Menu, Sidebar } from 'semantic-ui-react';
import ColorsDisplay from './ColorsDisplay';
import ColorsModal from './ColorsModal';

const ColorPanel = ({ currentUser }) => (
  <Sidebar as={Menu} icon="labeled" inverted vertical visible width="very thin">
    <Divider />
    <ColorsModal />
    {currentUser.uid && <ColorsDisplay key={currentUser.uid} />}
  </Sidebar>
);

const mapStateToProps = ({ user: { currentUser } }) => ({
  currentUser
});

export default connect(mapStateToProps)(ColorPanel);
