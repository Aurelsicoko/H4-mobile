/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  connection: "someMongodbServer",
  attributes: {
    facebook_id: {
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
      via: 'createdBy'
    },
    participated: {
      collection: 'event',
      via: 'guests',
      dominant: true
    }
  }
};