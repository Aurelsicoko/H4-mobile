/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    id_facebook: {
      type: 'STRING',
      required: true,
      unique: true
    },
    username: {
      type: 'STRING',
      minLength: 3,
      maxLength: 25,
      required: true
    },
    device: {
      type: 'STRING',
      required: true
    },
    owner: {
      collection: 'event',
      via: 'created'
    },
    participated: {
      collection: 'event',
      via: 'guests',
      dominant: true
    }
  }
};