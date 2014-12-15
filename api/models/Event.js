/**
 * Event.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  connection: 'localDiskDb',
  attributes: {
    place: {
      type: 'integer',
      required: true
    },
    date: {
      type: 'datetime',
      required: true
    },
    content: {
      type: 'string'
    },
    readed: {
      type: 'json'
    },
    guests: {
      collection: 'user',
      via: 'participated'
    }
  }
};