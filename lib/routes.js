// Home Route
Router.map(function() {
    this.route('/',{
      name: 'home',
      action: function () {
        this.render('home');
        SEO.set({title: '丰巢－'+Meteor.App.NAME});
      }
    });
    this.route('/dashboard',{
      name: 'dashboard',
      action: function(){
        this.layout('slimLayout');
        this.render('dashboard');
      },
      waitOn: function(){
        Meteor.subscribe('validTrades');
        Meteor.subscribe('allFans');
        return;
      }
    });
    this.route('/setting',{
      name: 'setting',
      action: function(){
        //this.layout('slimLayout');
        this.render('setting');
      }
    });
    Router.route('/(.*)', function () {
        this.layout('basicLayout');
        this.redirect('/');
    });
});

var mustBeSignedIn = function() {
    if (!(Meteor.user() || Meteor.loggingIn())) {
        Router.go('home');
    } else {
        this.next();
    }
};
var goDashboard = function() {
    if (Meteor.user()) {
        Router.go('dashboard');
    } else {
        this.next();
    }
};

Router.onBeforeAction(mustBeSignedIn, {except: ['home']});
Router.onBeforeAction(goDashboard, {only: ['home']});
