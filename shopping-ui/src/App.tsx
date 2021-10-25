import './App.css';
import { HashRouter, Route, Switch } from 'react-router-dom';
import NavAppbar from './navbar/navAppbar';
import Clip from './common/clip';
import Login from './Login/login';
import ShopLoader from './common/loader';
import { getJwt } from './service/utils';

function App() {
  const isLoggedIn = getJwt() !== null;
  return (
    <><NavAppbar props={isLoggedIn}></NavAppbar>
      <HashRouter>
        <Switch>
          <Route
            exact
            path='/'
            component={Login} />
          <Route
            exact
            path='/portal'
            component={Clip} />
          <Route
            exact
            path='/load'
            component={ShopLoader} />
        </Switch>
      </HashRouter></>
  );
}

export default App;
