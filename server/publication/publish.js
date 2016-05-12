/*
Meteor.publish('allTrades',function(){
  if (this.userId){
    return Trades.find();
  }else{
    this.ready();
  }
});*/

Meteor.publish('validTrades',function(){
  if(this.userId){
    var start_time = '2015-05-05 00:00:00';
    var hub = Meteor.settings.public.hub;
    var appid = Meteor.settings.yzAppId[hub];
    var last_sync_rec = Syncs.findOne({appid: appid});
    if (last_sync_rec){
      last_sync_time = last_sync_rec.sync_time;
      last_moment = new moment(last_sync_time, 'YYYY-MM-DD HH:mm:ss');
      start_time = last_moment.subtract('20','days').format('YYYY-MM-DD HH:mm:ss');
    }
    console.log('publish using start_time '+start_time);
    return Trades.find(
      //{}
      {created: {$gt: start_time}}
      //{status: {$in: ['WAIT_SELLER_SEND_GOODS']}}
      //{status: {$in: ['WAIT_SELLER_SEND_GOODS','WAIT_BUYER_CONFIRM_GOODS']}}
      //{status: {$in: ['TRADE_BUYER_SIGNED','WAIT_SELLER_SEND_GOODS','WAIT_BUYER_CONFIRM_GOODS']}}
      //{status: {$in: ['WAIT_SELLER_SEND_GOODS','WAIT_BUYER_CONFIRM_GOODS']}}
    );
  }else{
    this.ready();
  }
});

Meteor.publish('allFans',function(){
  if(this.userId){
    return Customers.find({weixin_openid: {$ne: ''}, traded_money: {$ne: '0.00'}},{sort: {points: -1}});
  }else{
    this.ready();
  }
});
