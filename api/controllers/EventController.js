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

  register: function(req, res) {
    Event.subscribe(req.params.all()).exec(function(err, cb) {
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
        if (err) return deferred.reject(err);
        scope.createdBy = user;
      });
    }

    Event.create(scope).exec(function(err, event) {
      if (err) return deferred.reject(err);

      _.each(scope.guests, function(guest) {
        User.findOne(guest).exec(function(err, user) {
          if (err) return deferred.reject(err);

          event.save(function(err) {
            if (err) {
              sails.log(err);
              return deferred.reject(err);
            } else {
              var scope = event;
              scope.user = user;
              scope.answer = null;

              sails.controllers['event'].subscribe(scope).then(function(data) {
                deferred.resolve(data);
              }).catch(function(err) {
                return deferred.reject(err);
              });
            }
          });
        });
      });

      sails.controllers['event'].get(event).then(function(data) {
        deferred.resolve(data);
      });

      console.log('Created - Event');
    });

    return deferred.promise;
  },

  get: function(scope) {
    var deferred = Q.defer();

    if (!scope) {
      scope = null;
    }

    Event.find(scope).populate('guests').populate('createdBy').exec(function(err, readed) {
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

  subscribe: function(scope) {
    var deferred = Q.defer();

    if (!scope) {
      deferred.resolve("You can't update undefined record");
    }

    Event.findOne(scope.id).exec(function(err, event) {
      sails.controllers['event'].updateJSONReader(event.readed, scope.user.id, scope.answer).then(function(data) {
        event.readed = data;
        sails.controllers['event'].edit(event).then(function(data) {
          deferred.resolve(data);
        }).catch(function(err) {
          deferred.reject(err);
        });
      }).catch(function(err) {
        deferred.reject(err);
      });
    });

    return deferred.promise;
  },

  updateJSONReader: function(event_readed, user, bool) {
    var deferred = Q.defer();

    var parse = (event_readed.length > 0) ? event_readed : [];
    var tmp = {};
    tmp[user] = {
      readed: (bool) ? bool : null
    };

    parse.push(tmp);

    deferred.resolve(parse);

    return deferred.promise;
  }

};