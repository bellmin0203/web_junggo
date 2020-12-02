const express = require('express');
const user = require('./user');

module.exports = (router) => {
  router.get('/',user.create)
}
