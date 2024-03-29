
var utils = spot.utils
  , Error = spot.error
  , User = spot.models.user
  , Relationship = spot.models.relationship
  , async = require('async')
  , _ = require('underscore');

exports.formRelationships = function(from, to, group, next) {
	
	var contacts = _.indexBy(to, 'user');
	// delete contacts[from];

	var userIds = Object.keys(contacts);

	var query = Relationship.find({ from: from, to: {  $in: userIds }});
	
	utils.asyncStream(
		query,
		function(doc, next){
			var userId = doc.to;
			var contact = contacts[userId];
			doc.nickname = contact.nickname || doc.nickname;
			doc.group = group;
			doc.save(next);
			delete contacts[userId];
		},
		function(err){
			if (err) return next(err);

			var data = _.map(contacts, function(contact){
				return {
					from: from,
					to: contact.user,
					group: group,
					nickname: contact.nickname
				};
			});

			Relationship.create(data, function(err){
				if (err) return next(err);
				var docs = _.values(arguments).slice(1);
				next(null, docs);
			});
		});
}