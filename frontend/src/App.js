import '../node_modules/bootswatch/dist/lux/bootstrap.min.css';
import './App.css';
import { Helmet } from 'react-helmet'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

// CONTEXTS
import PetState from './context/pets/PetState'
import AuthState from './context/auth/AuthState'

// COMPOENTS
import Navbar from './components/Navbar'
import PetListing from './components/pets/PetListing'
import PetDetails from './components/pets/PetDetails'
import AddPet from './components/pets/AddPet'
import MyPets from './components/pets/MyPets'
import EditPet from './components/pets/EditPet'
import Login from './components/auth/Login'
import SignUp from './components/auth/SignUp'


function App() {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Adopt a Friend</title>
      </Helmet>
      <Router >
        <div className="children">

          <AuthState>
            <Navbar/>
            <PetState>
                <Switch>
                  <Route
                    path='/addpet'
                    component={AddPet}
                    exact
                  />
                  <Route
                    path='/mypets'
                    component={MyPets}
                    exact
                  />
                  <Route
                    path='/edit/:id/:name/:type/:breed/:sex'
                    component={EditPet}
                    exact
                  />
                  <Route
                    path='/'
                    component={PetListing}
                    exact
                  />
                  <Route
                    path='/detail/:id'
                    component={PetDetails}
                    exact
                  />
                  <Route
                    path='/signup'
                    component={SignUp}
                    exact
                  />
                  <Route
                    path='/login'
                    component={Login}
                    exact
                  />
                </Switch>
              </PetState>
          </AuthState>
        </div>
      </Router>
        
      
    </>
  );
}

export default App;
