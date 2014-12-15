/**
 * Event.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    place: {
      type: 'STRING',
      required: true
    },
    date: {
      type: 'DATETIME',
      required: true
    },
    content: {
      type: 'STRING'
    },
    readed: {
      type: 'JSON'
    },
    created: {
      model: 'user'
    },
    guests: {
      collection: 'user',
      via: 'participated'
    }
  },

  // Lifecycle Callbacks
  beforeCreate: function(values, next) {
    if (values.date) {
      values.date = new Date(values.date);
      next();
    }
  }
};