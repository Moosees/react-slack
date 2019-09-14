import React from 'react';
import { Grid } from 'semantic-ui-react';
import './App.css';
import ColorPanel from './ColorPanel/ColorPanel';
import MessagesContainer from './Messages/MessagesContainer';
import MetaPanel from './MetaPanel/MetaPanel';
import SidePanel from './SidePanel/SidePanel';

const App = () => {
  return (
    <Grid columns="equal" className="app">
      <ColorPanel />
      <SidePanel />
      <Grid.Column style={{ marginLeft: '320px' }}>
        <MessagesContainer />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  );
};

export default App;
