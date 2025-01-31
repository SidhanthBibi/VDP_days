import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ClubPage from './pages/ClubPage';
import Login from './components/Login';
import NotFound from './pages/NotFound';

function App() {
    return (
        <Router>
            <Navbar />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/club/:id" component={ClubPage} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    );
}

export default App;