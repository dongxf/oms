// { "path" : "routes/mainRoutes.js" }
Router.route('/', function () {
  this.render('home');
  SEO.set({ title: '丰巢 -' + Meteor.App.NAME });
});
