//Meteor.npmRequire('datejs');

Meteor.methods({
  syncYouzanTrades: function(params){
    check(params,Match.Any);
    var hub = Meteor.settings.hub;
    var appid = Meteor.settings.yzAppId[hub];
    var appsecret = Meteor.settings.yzAppSecret[hub];
    var proxy = null;
    var youzan = Meteor.npmRequire('youzan');
    var youzanAPI = new youzan(proxy, appid, appsecret);

    getYouzanTradeList = function(page_no, use_has_next) {
      var yzParams = _.extend({ 'page_no': page_no, 'page_size': 100, 'use_has_next': use_has_next},params);
      youzanAPI.getSoldTradeList(yzParams,Meteor.bindEnvironment(function(err,res,result){
        if(err){
            console.log('error:'+err.reason);
        }else{
          var solds = result.response.trades;
          solds.forEach(function(sold){
            var existed = Trades.findOne({tid: sold.tid});

            if (!existed) {
              Trades.insert(sold);
            }else{
              if ( existed.shipping_type=='fetch' && existed.liner === undefined ) sold.liner='Z';
              Trades.update(existed._id, {$set: sold});
            }
          });
          console.log("trades fetched: "+solds.length);
          var has_next = result.response.has_next;
          if (has_next){
            getYouzanTradeList(page_no+1, true);
          }
        }
      }),function(error){console.log(error);});
    };
    getYouzanTradeList(1,true);

    var sync_time = new moment().format('YYYY-MM-DD HH:mm:ss');
    sync = Syncs.findOne({appid: appid});
    if (sync) {
      Syncs.update({_id: sync._id},{$set: {sync_time: sync_time}});
    }else{
      Syncs.insert({appid: appid, sync_time: sync_time});
    }
    console.log('youzan synced at: '+sync_time);
  },
  'reloadCard': function(id){
    check(id,Match.Any);
    trade = Trades.findOne({_id: id});
    var visible = trade.hide_amount;
    if (visible == 'hide') {
      Trades.update({_id: id}, {$set: {hide_amount: 'show'}});
    }else{
      Trades.update({_id: id}, {$set: {hide_amount: 'hide'}});
    }
  },
  'linerSelector': function(id){
    check(id,Match.Any);
    trade = Trades.findOne({_id: id});
    var liner = trade.liner;
    var lines = {};
    lines[' ']='KD';
    lines.Z='KD';
    lines.KD='A';
    lines.A='B';
    lines.B='C';
    lines.C='D';
    lines.D='W'; //W and Z is reserverd for external temporary route & self route
    lines.W='Z'; //KD is reserved for express
    var new_liner = lines[liner];
    if (new_liner === undefined ) new_liner = ' '; //both null & undefined
    Trades.update({_id: id}, {$set: {liner: new_liner}});
  },
  'tradeReminder': function(id){
    check(id,Match.Any);
    trade = Trades.findOne({_id: id});
    var noticed = trade.noticed;
    if ( noticed === undefined ) noticed = false;
    Trades.update({_id: id}, {$set: {noticed: !noticed}});
  }
});

var yzTask_update = function(){
  var start_time = '2015-05-05 00:00:00';
  var last_sync_rec = Syncs.findOne({appid: '97970104f0a3fb11d3'});
  if (last_sync_rec){
    last_sync_time = last_sync_rec.sync_time;
    last_moment = new moment(last_sync_time, 'YYYY-MM-DD HH:mm:ss');
    start_time = last_moment.subtract('200','seconds').format('YYYY-MM-DD HH:mm:ss');
  }
  console.log('fast-sync youzan trades since: '+start_time);
  Meteor.call('syncYouzanTrades',{start_update: start_time});
  //if seller changed trade_memo, start_update will not changed
};

var yzTask_full = function(){
  console.log('full-sync youzan trades');
  Meteor.call('syncYouzanTrades');
  //Trades.update({},{$set: {hide_amount: false}}, {multi: true});
};

var cron = new Meteor.Cron({
  events: {
    "* * * * *": yzTask_update,
    "0 * * * *": yzTask_full //every hour do a full sync to get memo
  }
});
