import React, { Component } from 'react';
import { Dropdown, Grid, Header, Icon } from 'semantic-ui-react';
import firebase from '../../firebase/firebase.js';

class UserPanel extends Component {
  dropdownOptions = () => [
    {
      key: 'user',
      text: (
        <span>
          Signed in as <strong>User</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: 'avatar',
      text: <span>Change Avatar</span>
    },
    {
      key: 'signOut',
      text: <span onClick={this.handleSignOut}>Sign Out</span>
    }
  ];

  handleSignOut = () => {
    firebase.auth().signOut();
  };

  render() {
    return (
      <Grid style={{ backgroundColor: '#4c3c4c' }}>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
            <Header as="h2" inverted floated="left">
              <Icon name="code" />
              <Header.Content>DevChat</Header.Content>
            </Header>
          </Grid.Row>
          <Header as="h4" style={{ padding: '0.25em' }}>
            <Dropdown
              trigger={<span>User</span>}
              options={this.dropdownOptions()}
            ></Dropdown>
          </Header>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
