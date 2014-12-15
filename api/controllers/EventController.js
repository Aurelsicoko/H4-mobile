/**
 * EventController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Q = require('q');
var _ = require('lodash');

module.exports = {

  /**
   * Basic CRUD
   */

  create: function(req, res) {
    sails.controllers['event'].add(req.params.all()).then(function(data) {
      res.ok(data);
    }).catch(function(err) {
      res.badRequest(err);
    });
  },

  read: function(req, res) {
    sails.controllers['event'].get(req.params.all()).then(function(data) {
      res.ok(data);
    }).catch(function(err) {
      res.badRequest(err);
    });
  },

  update: function(req, res) {
    sails.controllers['event'].edit(req.params.all()).then(function(data) {
      res.ok(data);
    }).catch(function(err) {
      res.badRequest(err);
    });
  },

  delete: function(req, res) {
    Event.destroy(req.param('id')).exec(function(err, cb) {
      if (err) res.badRequest(err);
      res.ok(cb);
    });
  },

  add: function(scope) {
    var deferred = Q.defer();

    if (!scope) {
      deferred.resolve("You can't add undefined record");
    } else {
      // Find the author's event
      User.find(scope.author).exec(function(err, user) {
        if (err) deferred.reject(err);
        scope.createdBy = user;
      });
    }

    Event.create(scope).exec(function(err, event) {
      if (err) deferred.reject(err);

      _.each(scope.guests, function(guest) {
        User.find(guest).exec(function(err, user) {
          if (err) deferred.reject(err);

          event.guests.add(user);
          event.save(function(err) {
            if (err) {
              deferred.reject(err);
            } else {
              sails.controllers['event'].addReader(event.reader, user).then(function(data) {
                sails.log("User update : " + data);
              }).catch(function(err) {
                deferred.reject(err);
              });
            }
          });
        });
      });

      deferred.resolve(created);

      console.log('Created - Event');
    });

    return deferred.promise;
  },

  get: function(scope) {
    var deferred = Q.defer();

    if (!scope) {
      scope = null;
    }

    Event.find(scope).exec(function(err, readed) {
      if (err) return deferred.reject(err);
      deferred.resolve(readed);

      console.log('Readed - Event');
    });

    return deferred.promise;
  },

  edit: function(scope) {
    var deferred = Q.defer();

    if (!scope) {
      deferred.resolve("You can't update undefined record");
    }

    Event.update(scope.id, scope).exec(function(err, updated) {
      if (err) return deferred.reject(err);
      deferred.resolve(updated);

      console.log('Updated - Event');
    });

    return deferred.promise;
  },

  addReader: function(json, reader) {
    var deferred = Q.defer();
    var parse = JSON.parse(json);
    var json = {
      user: reader.id,
      readed: false
    };

    parse.push(json);

    sails.controllers['event'].edit(parse).then(function(data) {
      deferred.resolve(updated);
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }

};