import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Divider } from 'semantic-ui-react';
import firebase from '../../firebase/firebase';
import { setColors } from '../../redux/actions';

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

  componentWillUnmount() {
    const { currentUser } = this.props;

    if (currentUser.uid) {
      this.removeListener(currentUser.uid);
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

  removeListener = userId => {
    const { usersRef } = this.state;

    usersRef.child(`${userId}/colors`).off();
  };

  handleSetColors = (primaryColor, secondaryColor) => {
    this.props.setColors(primaryColor, secondaryColor);
  };

  render() {
    const { userColors } = this.state;

    return (
      <>
        {userColors.length > 0 &&
          userColors.map((color, i) => (
            <React.Fragment key={i}>
              <Divider />
              <div
                className="color__container"
                onClick={() =>
                  this.handleSetColors(color.primaryColor, color.secondaryColor)
                }
              >
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

export default connect(
  mapStateToProps,
  { setColors }
)(ColorsDisplay);
