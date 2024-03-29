import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter
} from 'react-router-dom';
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import 'semantic-ui-css/semantic.min.css';
import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Spinner from './components/Spinner';
import firebase from './firebase/firebase';
import { clearUser, setUser } from './redux/actions';
import rootReducer from './redux/reducers';
import * as serviceWorker from './serviceWorker';

const store = createStore(rootReducer, composeWithDevTools());

class Root extends Component {
  unsubscribeFromAuthChange = null;

  componentDidMount() {
    const { history, setUser, clearUser } = this.props;
    this.unsubscribeFromAuthChange = firebase
      .auth()
      .onAuthStateChanged(user => {
        if (user) {
          setUser(user);
          history.push('/');
        } else {
          clearUser();
        }
      });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuthChange();
  }

  render() {
    const { isLoading, currentUser } = this.props;
    return isLoading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route exact path="/" component={currentUser ? App : Login} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }
}

const mapStateToProps = ({ user: { currentUser, isLoading } }) => ({
  currentUser,
  isLoading
});

const RootWithAuth = withRouter(
  connect(
    mapStateToProps,
    { setUser, clearUser }
  )(Root)
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
