import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Dropdown, Grid, Header, Icon, Image } from 'semantic-ui-react';
import firebase from '../../firebase/firebase';

class UserPanel extends Component {
  handleSignOut = () => {
    firebase.auth().signOut();
    this.props.history.push('/login');
  };

  render() {
    const { displayName, photoURL } = this.props.currentUser;

    return (
      <Grid>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.2em' }}>
            <Header as="h2" inverted floated="left">
              <Icon name="code" />
              <Header.Content>ReSlacT</Header.Content>
            </Header>
            <Header as="h4" inverted style={{ padding: '0.25em' }}>
              <Dropdown
                trigger={
                  <span>
                    <Image src={photoURL} spaced="right" avatar />
                    User Settings
                  </span>
                }
                clearable
              >
                <Dropdown.Menu>
                  <Dropdown.Header content={`Signed in as ${displayName}`} />
                  <Dropdown.Item text="Change Avatar" />
                  <Dropdown.Item text="Sign Out" onClick={this.handleSignOut} />
                </Dropdown.Menu>
              </Dropdown>
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

export default withRouter(connect(mapStateToProps)(UserPanel));
