"use strict";

const express = require('express');

const route = express.Router();
const workerMngController = require('../../controllers/workerMngController');
const {isAdmin} = require("../../middleware/auth");

module.exports = route;