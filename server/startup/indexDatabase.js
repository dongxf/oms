Meteor.startup(function () {
  Customers._ensureIndex({weixin_openid: 1},{unique: true});
  Trades._ensureIndex({tid: 1},{unique: true});
});
