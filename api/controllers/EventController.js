/**
 * EventController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Q = require('q');

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

  // Function for views
  add: function(scope) {
    var deferred = Q.defer();

    if (!scope) {
      deferred.resolve("You can't add undefined record");
    } else {
      User.find(scope.user).exec(function(err, user) {
        if (err) return deferred.reject(err);
        scope.created = user;

        scope.guest =
      });
    }

    Event.create(scope).exec(function(err, created) {
      if (err) return deferred.reject(err);
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
  }

};