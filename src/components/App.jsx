import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import './App.css';
import ColorPanel from './ColorPanel/ColorPanel';
import MessagesContainer from './Messages/MessagesContainer';
import MetaPanel from './MetaPanel/MetaPanel';
import SidePanel from './SidePanel/SidePanel';

const App = ({ secondaryColor }) => {
  return (
    <Grid
      columns="equal"
      className="app"
      style={{ backgroundColor: secondaryColor }}
    >
      <ColorPanel />
      <SidePanel />
      <Grid.Column style={{ marginLeft: '310px', paddingRight: '0' }}>
        <MessagesContainer />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = ({ colors: { secondaryColor } }) => ({
  secondaryColor
});

export default connect(mapStateToProps)(App);
