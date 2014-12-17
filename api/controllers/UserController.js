/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Q = require('q');
var _ = require('lodash');

module.exports = {

  /**
   * Basic CRUD
   */

  create: function(req, res) {
    sails.controllers['user'].add(req.params.all()).then(function(data) {
      res.ok(data);
    }).catch(function(err) {
      res.badRequest(err);
    });
  },

  read: function(req, res) {
    sails.controllers['user'].get(req.params.all()).then(function(data) {
      res.ok(data);
    }).catch(function(err) {
      res.badRequest(err);
    });
  },

  update: function(req, res) {
    sails.controllers['user'].edit(req.params.all()).then(function(data) {
      res.ok(data);
    }).catch(function(err) {
      res.badRequest(err);
    });
  },

  delete: function(req, res) {
    User.destroy(scope).exec(function(err, cb) {
      if (err) res.badRequest(err);
      res.ok(cb);
    });
  },

  // Function for views
  add: function(scope) {
    var deferred = Q.defer();

    if (!scope) {
      deferred.resolve("You can't add undefined record");
    }

    User.create(scope).exec(function(err, created) {
      if (err) return deferred.reject(err);
      deferred.resolve(created);

      console.log('Created - User');
    });

    return deferred.promise;
  },

  get: function(scope) {
    var deferred = Q.defer();

    if (!scope || !scope.id) {
      scope = null;

      User.find(scope).populate('owner').populate('participated').exec(function(err, readed) {
        if (err) return deferred.reject(err);
        deferred.resolve(readed);

        console.log('Readed - User');
      });
    } else {
      scope = {
        facebook_id: scope.id
      };

      User.findOne(scope).populate('participated').populate('owner').exec(function(err, user) {
        if (!user) {
          deferred.resolve([]);
        } else {

          sails.log("#{1} LENGTH : " + user.participated.length);
          sails.log(user.participated);

          var o = 0;
          while (o < user.participated.length) {
            if (user.participated[o].createdBy) {
              sails.log("#{2} USER participated createdBy exist : " + user.participated[o].createdBy);
              User.findOne(user.participated[o].createdBy).exec(function(err, found) {
                sails.log("#{3} FOUND exist ");
                sails.log(found);
                if (found) {
                  user.participated[o].createdBy = found;
                  o++;
                } else {
                  o++;
                }
              }).catch(function(err) {
                o++;
              });
            } else {
              o++;
            }
          }

          sails.controllers['event'].get().then(function(events) {
            var array = [];
            for (var i = 0; i < events.length; ++i) {
              if (events[i]["createdBy"]) {
                if (events[i]["createdBy"]['id'] === user.id) {
                  array.push(events[i]);
                }
              }
            }

            user.owner = array;

            deferred.resolve(user);
          });
        }
      });
    }

    return deferred.promise;
  },

  edit: function(scope) {
    var deferred = Q.defer();

    if (!scope) {
      deferred.resolve("You can't update undefined record");
    }

    User.update({
      facebook_id: scope.id
    }, scope).exec(function(err, updated) {
      if (err) return deferred.reject(err);
      deferred.resolve(updated);

      console.log('Updated - User');
    });

    return deferred.promise;
  }

};