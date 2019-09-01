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
  state = { username: '', email: '', password: '', passwordConfirm: '' };

  handleChange = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  };

  handleSubmit = evt => {
    evt.preventDefault();
    const { email, password, passwordConfirm } = this.state;
    if (password !== passwordConfirm) {
      alert('Passwords do not match');
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(newUser => {
          alert('User created');
          this.setState({
            username: '',
            email: '',
            password: '',
            passwordConfirm: ''
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  render() {
    const { username, email, password, passwordConfirm } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <GridColumn style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
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
              />
              <Button type="submit" color="orange" fluid size="large">
                Submit
              </Button>
            </Segment>
          </Form>
          <Message>
            Already a user? <Link to="/login">Login here</Link>
          </Message>
        </GridColumn>
      </Grid>
    );
  }
}

export default Register;
