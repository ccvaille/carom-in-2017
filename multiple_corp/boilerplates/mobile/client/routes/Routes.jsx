import React, { PropTypes } from 'react';
import { Router } from 'react-router';
import MainLayout from 'layouts/MainLayout';

const getRoutes = (store) => ({
    path: '/',
    component: MainLayout,
});

const Routes = ({ history, store }) => (<Router history={history} routes={getRoutes(store)} />);

Routes.propTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
};

export default Routes;
