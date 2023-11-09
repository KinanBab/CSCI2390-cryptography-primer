const express = require('express');
const Neptune = require('neptune-notebook');

const neptune = new Neptune();
neptune.addDocument('mpc', 'util/mpc.md', true);
neptune.start(9111);

global.neptune = neptune;
global.app = neptune.app;
global.server = neptune.server;

/* global app */
app.use('/dist', express.static('../node_modules/jiff-mpc/dist/'));

/* JIFF server */
const { JIFFServer } = require('jiff-mpc');
const jiffServer = new JIFFServer(server, { logs: true });
