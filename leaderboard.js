// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Mongo.Collection("players");

if (Meteor.isClient) {

  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {matches: -1, name: 1}});
  };

    Template.leaderboardView.players = function () {
        return Players.find({}, {sort: {matches: -1, name: 1}});
    };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };


    Template.leaderboard.events({
        'click img.matchesPlus': function () {
            console.log(this);
        Players.update(Session.get("selected_player"), {$inc: {matches: 1}});
    },
        'click img.matchesMinus': function () {
                if(this.matches>0) {
                    Players.update(Session.get("selected_player"), {$inc: {matches: -1}});
                }
        }
    });

    Template.leaderboard.events({
        'click img.goalsPlus': function () {
            Players.update(Session.get("selected_player"), {$inc: {goals: 1}});
        },
        'click img.goalsMinus': function () {
            if(this.goals>0) {
                Players.update(Session.get("selected_player"), {$inc: {goals: -1}});
            }
        }
    });

    Template.leaderboard.events({
        'click img.passesPlus': function () {
            Players.update(Session.get("selected_player"), {$inc: {passes: 1}});
        },
        'click img.passesMinus': function () {
            if(this.passes>0) {
                Players.update(Session.get("selected_player"), {$inc: {passes: -1}});
            }
        }
    });

    Template.leaderboard.events({
        'click img.hdmPlus': function () {
            Players.update(Session.get("selected_player"), {$inc: {hdm: 1}});
        },
        'click img.hdmMinus': function () {
            if(this.hdm>0) {
                Players.update(Session.get("selected_player"), {$inc: {hdm: -1}});
            }
        }
    });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Math",
                   "Nico",
                   "Fred",
                   "Alexis",
                   "Vincent",
                   "Enrique",
                   "Gabor",
                   "Luis",
                   "Siegfried"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], matches: 0, goals: 0, passes: 0, hdm: 0});
    }
  });
}

Router.map(function() {
    this.route('leaderboardView');
    this.route('leaderboard');
});
