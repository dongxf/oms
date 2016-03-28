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

/*
TRADE_NO_CREATE_PAY（没有创建支付交易）
WAIT_BUYER_PAY（等待买家付款）
WAIT_SELLER_SEND_GOODS（等待卖家发货，即：买家已付款）
WAIT_BUYER_CONFIRM_GOODS（等待买家确认收货，即：卖家已发货）
TRADE_BUYER_SIGNED（买家已签收）
TRADE_CLOSED（付款以后用户退款成功，交易自动关闭）
WAIT_BUYER_CONFIRM_GOODS
ALL_WAIT_PAY（包含：WAIT_BUYER_PAY、TRADE_NO_CREATE_PAY）
ALL_CLOSED（所有关闭订单）
*/
