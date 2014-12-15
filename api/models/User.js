/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  connection: 'localDiskDb',
  attributes: {
    id_facebook: {
      type: 'string',
      required: true
    },
    username: {
      type: 'string',
      minLength: 3,
      maxLength: 25,
      required: true
    },
    device: {
      type: 'string',
      required: true
    },
    participated: {
      collection: 'event',
      via: 'guests',
      dominant: true
    }
  }
};