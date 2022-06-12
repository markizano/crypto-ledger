#!/usr/bin/env node

const express = require('express');
const CryptoViewApp = require('../lib/cryptoview/index');

function getEnv(name, theDefault=null) {
  return process.env.hasOwnProperty(name)? process.env[name]: theDefault;
}

const expApp = express();
const port = getEnv('LISTEN_PORT', 3000);

const app = new CryptoViewApp(expApp);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

