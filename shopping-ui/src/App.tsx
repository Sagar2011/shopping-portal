import './App.css';
import { HashRouter, Route, Switch } from 'react-router-dom';
import NavAppbar from './navbar/navAppbar';
import Clip from './common/clip';
import Login from './Login/login';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <><NavAppbar></NavAppbar>
      <HashRouter>
        <Switch>
          <Route
            exact
            path='/'
            component={Login} />
          <ProtectedRoute
            exact
            path='/portal'
            component={Clip} />
        </Switch>
      </HashRouter></>
  );
}

export default App;
