import md5 from 'md5';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Form,
  Grid,
  GridColumn,
  Header,
  Icon,
  Message,
  Segment
} from 'semantic-ui-react';
import firebase from '../../firebase/firebase';

class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users')
  };

  handleChange = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  };

  isFormValid = () => {
    let isValid = true;
    let errors = [];
    if (this.isFormEmpty(this.state)) {
      errors.push({ message: 'Please fill in all fields' });
      isValid = false;
    }
    if (!this.isPasswordEqualToPasswordConfirm(this.state)) {
      errors.push({ message: 'Passwords must match' });
      isValid = false;
    }
    if (!this.isPasswordValid(this.state.password)) {
      errors.push({
        message: 'Password must be at least eigth characters long'
      });
      isValid = false;
    }
    if (!isValid) {
      this.setState({ errors });
      return false;
    } else {
      this.setState({ errors: [] });
      return true;
    }
  };

  isFormEmpty = ({ username, email, password, passwordConfirm }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirm.length
    );
  };

  isPasswordEqualToPasswordConfirm = ({ password, passwordConfirm }) => {
    if (password !== passwordConfirm) {
      return false;
    } else {
      return true;
    }
  };

  isPasswordValid = password => {
    if (password.length < 8) {
      return false;
    } else {
      return true;
    }
  };

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  saveUser = newUser => {
    return this.state.usersRef.child(newUser.user.uid).set({
      displayName: newUser.user.displayName,
      avatar: newUser.user.photoURL
    });
  };

  handleInputErrors = (errors, inputValue, inputName) => {
    return errors.some(error =>
      error.message.toLowerCase().includes(inputName)
    ) ||
      (errors.length && !inputValue)
      ? 'error'
      : '';
  };

  handleSubmit = evt => {
    evt.preventDefault();
    const { username, email, password } = this.state;
    if (this.isFormValid()) {
      this.setState({ loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(newUser => {
          newUser.user
            .updateProfile({
              displayName: username,
              photoURL: `https://gravatar.com/avatar/${md5(
                newUser.user.email
              )}?d=identicon`
            })
            .then(() => {
              this.saveUser(newUser);
            })
            .then(() => {
              this.setState({
                username: '',
                email: '',
                password: '',
                passwordConfirm: '',
                loading: false
              });
            })
            .catch(error => {
              console.error(error);
              this.setState({
                loading: false,
                errors: [error]
              });
            });
        })
        .catch(error => {
          console.error(error);
          this.setState({
            loading: false,
            errors: [error]
          });
        });
    }
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirm,
      errors,
      loading
    } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <GridColumn style={{ maxWidth: 450 }}>
          <Header as="h1" icon size="large" color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register to begin chatting!
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                type="text"
                name="username"
                value={username}
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
                className={this.handleInputErrors(errors, username, 'username')}
              />
              <Form.Input
                fluid
                type="email"
                name="email"
                value={email}
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={this.handleChange}
                className={this.handleInputErrors(errors, email, 'email')}
              />
              <Form.Input
                fluid
                type="password"
                name="password"
                value={password}
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                className={this.handleInputErrors(errors, password, 'password')}
              />
              <Form.Input
                fluid
                type="password"
                name="passwordConfirm"
                value={passwordConfirm}
                icon="repeat"
                iconPosition="left"
                placeholder="Confirm Password"
                onChange={this.handleChange}
                className={this.handleInputErrors(
                  errors,
                  passwordConfirm,
                  'password'
                )}
              />
              <Button
                disabled={loading}
                className={loading ? 'loading' : ''}
                type="submit"
                color="orange"
                fluid
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Already a user? <Link to="/login">Sign in here</Link>
          </Message>
        </GridColumn>
      </Grid>
    );
  }
}

export default Register;
