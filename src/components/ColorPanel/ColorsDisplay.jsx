import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Divider } from 'semantic-ui-react';
import firebase from '../../firebase/firebase';

class ColorsDisplay extends Component {
  state = {
    userColors: [],
    usersRef: firebase.database().ref('users')
  };

  componentDidMount() {
    const { currentUser } = this.props;

    if (currentUser.uid) {
      this.addListener(currentUser.uid);
    }
  }

  addListener = userId => {
    const { usersRef } = this.state;

    let userColors = [];
    usersRef.child(`${userId}/colors`).on('child_added', snapshot => {
      userColors.unshift(snapshot.val());
      this.setState({ userColors });
    });
  };

  render() {
    const { userColors } = this.state;

    return (
      <>
        {userColors.length > 0 &&
          userColors.map((color, i) => (
            <React.Fragment key={i}>
              <Divider />
              <div className="color__container">
                <div
                  className="color__square"
                  style={{ backgroundColor: color.primaryColor }}
                >
                  <div
                    className="color__overlay"
                    style={{ backgroundColor: color.secondaryColor }}
                  ></div>
                </div>
              </div>
            </React.Fragment>
          ))}
      </>
    );
  }
}

const mapStateToProps = ({ user: { currentUser } }) => ({
  currentUser
});

export default connect(mapStateToProps)(ColorsDisplay);
