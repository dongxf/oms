Template.slimLayout.rendered = function(){
  $('.ui.sidebar')
    .sidebar('setting', 'transition', 'scale down')
    .sidebar('attach events', '.launch')
  ;
  $(".dropdown").dropdown();
};

Template.slimLayout.helpers({
  tradesCount: function(){
    if (Session.get('tradesCount') || Session.get('tradesCount')===0  ) return Session.get('tradesCount');
    //return Trades.find().count();
  },
  tradesAmount: function(){
    if (Session.get('tradesAmount') || Session.get('tradesAmount')===0  ) return Session.get('tradesAmount');
    //return Trades.find().count();
  },
  sidebarLinks: function(){
    var links = [];

    links.push({
      className: 'dashboard',
      routeName: 'none', //use for pathFor
      label: '首页',
      icon: 'home'
    });

    links.push({
      className: 'setting',
      routeName: 'none',
      label: '设置',
      icon: 'setting'
    });

    links.push({
      className: 'sync',
      routeName: 'none',
      label: '同步',
      icon: 'refresh'
    });

    links.push({
      className: 'signOut',
      routeName: 'none',
      label: '退出',
      icon: 'sign out'
    });

    return links;
  },
  viewFilter: function(){
    if (Session.get('viewFilter')) return Session.get('viewFilter');
    Session.set('viewMode','monitor');
    return '订单总览';
  },
  shippingFilter: function(){
    if (Session.get('shippingFilter')) return Session.get('shippingFilter');
    Session.set('shippingType','all');
    return '全部方式';
  },
  statusFilter: function(){
    if (Session.get('statusFilter')) return Session.get('statusFilter');
    Session.set('tradeType','not-delivered');
    return '订单状态';
  },
});

Template.slimLayout.events({
  'click .js-monitor-view': function(event){
    event.preventDefault();
    Session.set('viewMode','monitor');
  },
  'click .js-printer-view': function(event){
    event.preventDefault();
    Session.set('viewMode','printer');
  },
  'click .js-dispatch-view': function(event){
    event.preventDefault();
    Session.set('viewMode','dispatch');
  },
  'click .js-cashier-view': function(event){
    event.preventDefault();
    Session.set('viewMode','cashier');
  },
  'click .js-all-shipping-types': function(event){
    event.preventDefault();
    Session.set('shippingType','all');
  },
  'click .js-express-only': function(event){
    event.preventDefault();
    Session.set('shippingType','express');
  },
  'click .js-kd-only': function(event){
    event.preventDefault();
    Session.set('shippingType','kdonly');
  },
  'click .js-fetch-only': function(event){
    event.preventDefault();
    Session.set('shippingType','fetch');
  },
  'click .setting': function(event){
    event.preventDefault();
    alert('已设为读取20日内数据');
  },
  'click .sync': function(event){
    event.preventDefault();
    Meteor.call('syncYouzanTrades');
  },
  'click .signOut': function(event){
    event.preventDefault();
    Meteor.logout();
  },
  'click .js-not-delivered': function(event){
    event.preventDefault();
    Session.set('tradeType','not-delivered');
  },
  'click .js-shipped': function(event){
    event.preventDefault();
    Session.set('tradeType','shipped');
  },
  'click .js-finished': function(event){
    event.preventDefault();
    Session.set('tradeType','finished');
  },
  'click .js-validated-orders': function(event){
    event.preventDefault();
    Session.set('tradeType','validated');
  },
  'click .js-not-checked-out': function(event){
    event.preventDefault();
    Session.set('tradeType','not-checked-out');
  },
  'click .js-closed': function(event){
    event.preventDefault();
    Session.set('tradeType','closed');
  },
  'click .js-buyer-closed': function(event){
    event.preventDefault();
    Session.set('tradeType','buyer-closed');
  },
  'click .js-all-trades': function(event){
    event.preventDefault();
    Session.set('tradeType','all-trades');
  }
});
