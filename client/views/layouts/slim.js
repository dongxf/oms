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
  shippingFilter: function(){
    if (Session.get('shippingFilter')) return Session.get('shippingFilter');
    return '配送方式';
  },
  statusFilter: function(){
    if (Session.get('statusFilter')) return Session.get('statusFilter');
    return '订单状态';
  },
  printModeColor: function(){
    return Session.get('print-mode')=='active' ? 'green' : '';
  },
  reportModeColor: function(){
    return Session.get('report-mode')=='active' ? 'green' : '';
  }
});

Template.slimLayout.events({
  'click .js-all-shipping-types': function(event){
    event.preventDefault();
    Session.set('shippingType','all');
  },
  'click .js-print-mode': function(event){
    event.preventDefault();
    if (Session.get('print-mode') === ''){
      Session.set('print-mode','active');
      Session.set('report-mode','');
    }else {
      Session.set('print-mode','');
    }
  },
  'click .js-report-mode': function(event){
    event.preventDefault();
    if (Session.get('report-mode') === ''){
      Session.set('report-mode','active');
      Session.set('print-mode','');
    }else{
      Session.set('report-mode','');
    }
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
  'click .js-fetch': function(event){
    event.preventDefault();
    Session.set('shipping-types','fetch');
  },
  'click .js-express': function(event){
    event.preventDefault();
    Session.set('shipping-types','express');
  },
  'click .js-shipping-all': function(event){
    event.preventDefault();
    Session.set('shipping-types','all');
  },
  'click .js-not-delivered': function(event){
    event.preventDefault();
    Session.set('tradeTypes','not-delivered');
  },
  'click .js-shipped': function(event){
    event.preventDefault();
    Session.set('tradeTypes','shipped');
  },
  'click .js-finished': function(event){
    event.preventDefault();
    Session.set('tradeTypes','finished');
  },
  'click .js-not-checked-out': function(event){
    event.preventDefault();
    Session.set('tradeTypes','not-checked-out');
  },
  'click .js-closed': function(event){
    event.preventDefault();
    Session.set('tradeTypes','closed');
  },
  'click .js-buyer-closed': function(event){
    event.preventDefault();
    Session.set('tradeTypes','buyer-closed');
  },
  'click .js-all-trades': function(event){
    event.preventDefault();
    Session.set('tradeTypes','all-trades');
  }
});
