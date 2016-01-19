# { "path" : "routes/mainRoutes.coffee" }

Router.route '/', ->
  this.render 'home'
  SEO.set { title: "丰巢 - #{Meteor.App.NAME}" }
