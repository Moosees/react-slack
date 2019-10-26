import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// prettier-ignore
import { Button, Dropdown, Grid, Header, Icon, Image, Input, Modal } from 'semantic-ui-react';
import firebase from '../../firebase/firebase';

class UserPanel extends Component {
  state = { modalOpen: false };

  handleSignOut = () => {
    firebase.auth().signOut();
    this.props.history.push('/login');
  };

  openModal = () => this.setState({ modalOpen: true });
  closeModal = () => this.setState({ modalOpen: false });

  render() {
    const { displayName, photoURL } = this.props.currentUser;
    const { modalOpen } = this.state;

    return (
      <>
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
                    <Dropdown.Item
                      text="Change Avatar"
                      onClick={this.openModal}
                    />
                    <Dropdown.Item
                      text="Sign Out"
                      onClick={this.handleSignOut}
                    />
                  </Dropdown.Menu>
                </Dropdown>
              </Header>
            </Grid.Row>
          </Grid.Column>
        </Grid>
        <Modal basic open={modalOpen} onClose={this.closeModal}>
          <Header icon="id card" content="Change avatar" />
          <Modal.Content>
            <Input fluid type="file" label="New Avatar" name="previewImage" />
            <Grid centered stackable columns={2}>
              <Grid.Row centered>
                <Grid.Column className="ui centered aligned grid">
                  Image Preview
                </Grid.Column>
                <Grid.Column>Cropped</Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted>
              <Icon name="save" /> Change Avatar
            </Button>
            <Button color="green" inverted>
              <Icon name="image" /> Preview
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = ({ user: { currentUser } }) => ({
  currentUser
});

export default withRouter(connect(mapStateToProps)(UserPanel));
