import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown, Grid, Header, Icon, Image } from 'semantic-ui-react';
import firebase from '../../firebase/firebase.js';

class UserPanel extends Component {
  dropdownOptions = () => {
    const { displayName } = this.props.currentUser;
    return [
      {
        key: 'user',
        text: (
          <span>
            Signed in as <strong>{displayName}</strong>
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
  };

  handleSignOut = () => {
    firebase.auth().signOut();
  };

  render() {
    const { photoURL } = this.props.currentUser;

    return (
      <Grid style={{ backgroundColor: '#4c3c4c' }}>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
            <Header as="h2" inverted floated="left">
              <Icon name="code" />
              <Header.Content>DevChat</Header.Content>
            </Header>
            <Header as="h4" inverted style={{ padding: '0.25em' }}>
              <Dropdown
                trigger={
                  <span>
                    <Image src={photoURL} spaced="right" avatar />
                    User Settings
                  </span>
                }
                options={this.dropdownOptions()}
              ></Dropdown>
            </Header>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = ({ user: { currentUser } }) => ({
  currentUser
});

export default connect(mapStateToProps)(UserPanel);
