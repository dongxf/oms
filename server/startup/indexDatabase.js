Meteor.startup(function () {
  Customers._ensureIndex({weixin_openid: 1},{unique: true});
});
