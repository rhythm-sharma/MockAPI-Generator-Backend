const express = require('express');
const mockRoute = require('./mock.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/',
    route: mockRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
