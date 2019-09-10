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

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: [],
    loading: false
  };

  handleChange = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  };

  isFormValid = ({ email, password }) => email && password;

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

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
    const { email, password } = this.state;
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(signedInUser => {
          this.setState({
            email: '',
            password: '',
            loading: false
          });
        })
        .catch(error => {
          console.error(error);
          this.setState({
            errors: [error],
            loading: false
          });
        });
    }
  };

  render() {
    const { email, password, errors, loading } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <GridColumn style={{ maxWidth: 450 }}>
          <Header as="h1" icon size="large" color="violet" textAlign="center">
            <Icon name="code branch" color="violet" />
            Sign in to begin chatting!
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
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
              <Button
                disabled={loading}
                className={loading ? 'loading' : ''}
                type="submit"
                color="violet"
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
            Don't have an account? <Link to="/register">Register here</Link>
          </Message>
        </GridColumn>
      </Grid>
    );
  }
}

export default Login;
