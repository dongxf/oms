Template.slimLayout.rendered = function(){
  $('.ui.sidebar')
    .sidebar('setting', 'transition', 'scale down')
    .sidebar('attach events', '.launch')
  ;
  $(".dropdown").dropdown();
};

Template.slimLayout.onRendered(function() {
  this.picker = new Pikaday({
    field: document.getElementById('datepicker'),
  });
});

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
  viewName: function(){
    if (Session.get('viewMode')===undefined) Session.set('viewMode','monitor');
    return VIEW_NAME[Session.get('viewMode')];
  },
  shippingFilter: function(){
    if (Session.get('shippingFilter')===undefined) Session.set('shippingFilter','all');
    return SHIPPING_FILTER[Session.get('shippingFilter')];
  },
  statusFilter: function(){
    if (Session.get('tradeStatus')===undefined) Session.set('tradeStatus','notdelivered');
    return STATUS_FILTER[Session.get('tradeStatus')];
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
  'click .js-fans-view': function(event){
    event.preventDefault();
    Session.set('viewMode','fans');
  },
  'click .js-all-shipping-types': function(event){
    event.preventDefault();
    Session.set('shippingFilter','all');
  },
  'click .js-express-only': function(event){
    event.preventDefault();
    Session.set('shippingFilter','express');
  },
  'click .js-kd-only': function(event){
    event.preventDefault();
    Session.set('shippingFilter','kdonly');
  },
  'click .js-fetch-only': function(event){
    event.preventDefault();
    Session.set('shippingFilter','fetch');
  },
  'click .setting': function(event){
    event.preventDefault();
    alert('已设为读取20日内数据');
  },
  'click .sync': function(event){
    event.preventDefault();
    Meteor.call('syncYouzanTrades');
    Meteor.call('syncYouzanItems');
  },
  'click .signOut': function(event){
    event.preventDefault();
    Meteor.logout();
  },
  'click .js-not-delivered': function(event){
    event.preventDefault();
    Session.set('tradeStatus','notdelivered');
  },
  'click .js-shipped': function(event){
    event.preventDefault();
    Session.set('tradeStatus','shipped');
  },
  'click .js-finished': function(event){
    event.preventDefault();
    Session.set('tradeStatus','finished');
  },
  'click .js-validated-orders': function(event){
    event.preventDefault();
    Session.set('tradeStatus','validated');
  },
  'click .js-not-checked-out': function(event){
    event.preventDefault();
    Session.set('tradeStatus','notcheckedout');
  },
  'click .js-wait-group': function(event){
    event.preventDefault();
    Session.set('tradeStatus','waitgroup');
  },
  'click .js-closed': function(event){
    event.preventDefault();
    Session.set('tradeStatus','closed');
  },
  'click .js-buyer-closed': function(event){
    event.preventDefault();
    Session.set('tradeStatus','buyerclosed');
  },
  'click .js-all-trades': function(event){
    event.preventDefault();
    Session.set('tradeStatus','alltrades');
  }
});
