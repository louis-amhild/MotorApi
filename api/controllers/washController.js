'use strict';
var mongoose = require('mongoose');
var Wash = mongoose.model('Wash');

exports.listAllWashes = function(req, res) {
  Wash.find({}, function(err, wash) {
    if (err)
      res.send(err);
    res.json(wash);
  });
};

exports.registerWash = function(req, res) {
  var new_wash = new Wash(req.body);
  new_wash.save(function(err, wash) {
    if (err)
      res.send(err);
    res.json(wash);
  });
};

exports.findWash = function(req, res) {
  Wash.findById(req.params.washId, function(err, wash) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.updateWash = function(req, res) {
  Wash.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    res.json(wash);
  });
};

exports.deleteWash = function(req, res) {
  Wash.remove({
    _id: req.params.washId
}, function(err, wash) {
    if (err)
      res.send(err);
    res.json({ message: 'Wash successfully deleted' });
  });
};
