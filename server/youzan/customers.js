//Meteor.npmRequire('datejs');

Meteor.methods({
  syncYouzanCustomers: function(params){
    check(params,Match.Any);
    var hub = Meteor.settings.public.hub;
    var appid = Meteor.settings.yzAppId[hub];
    var appsecret = Meteor.settings.yzAppSecret[hub];
    var proxy = null;
    var apiClient = Meteor.npmRequire('youzan-api')(appid, appsecret);

    getYouzanCustomerList = function(after_fans_id) {
      var yzParams = { 'fields': '', 'page_size': 500, 'after_fans_id': after_fans_id};
      apiClient.get('kdt.users.weixin.followers.pull', yzParams,Meteor.bindEnvironment(function(res){
          var result = JSON.parse(res);
          var customers = result.response.users;
          customers.forEach(function(cust){
            var uid = cust.user_id;
            var openid = cust.weixin_openid;
            var existed = Customers.findOne({weixin_openid: openid});
            if (!existed) {
              //console.log('openid not existed: '+openid);
              var recv = Trades.findOne({"fans_info.fans_id": uid},{receiver_mobile: {$ne: null}});
              if ( recv === undefined ){
                recv = Trades.findOne({weixin_user_id: cust.user_id},{receiver_mobile: {$ne: null}}); //old version record;
              }
              if ( recv !== undefined ){
                //console.log('customer recv mobile: '+recv.receiver_mobile);
                cust.mobile = recv.receiver_mobile;
                cust.address = recv.receiver_address;
                cust.city = recv.receiver_city;
                cust.state = recv.state;
              }
              var fetch = Trades.findOne({"fans_info.fans_id": cust.user_id},{"fetch_detail.fetcher_mobile": {$ne: null}},{sort: {update_time: -1}});
              if ( cust.mobile === undefined && fetch !== undefined ){
                cust.mobile = fetch.fetch_detail.fetcher_mobile;
              }
              Customers.insert(cust); //There's a bug the record will be insert twice; The problem currently is fixed by ensureIndex();
            }else{
              //Trades.find({'fans_info.fans_id': lm.user_id, 'receiver_address': {$ne: ''}},{sort: {update_time: -1}},{sort: {update_time: -1}}).fetch()[0];
              var cmobile, caddress, ccity, cstate;
              if (!cust.mobile){// === undefined || cust.mobile === ''){
                var t1=Trades.find({'fans_info.fans_id': uid, 'receiver_mobile': {$nin: ['',null]}},{sort: {update_time: -1}},{sort: {update_time: -1}}).fetch()[0];
                var t2=Trades.find({'weixin_user_id': uid, 'receiver_mobile': {$nin: ['',null]}},{sort: {update_time: -1}},{sort: {update_time: -1}}).fetch()[0];
                if ( t1 ){ cmobile = t1.mobile;}
                if (!cmobile && t2){ cmobile = t2.receiver_mobile; }
              }
              if (!cust.address){
                var t3=Trades.find({'fans_info.fans_id': uid, 'receiver_address': {$nin: ['',null]}},{sort: {update_time: -1}},{sort: {update_time: -1}}).fetch()[0];
                var t4=Trades.find({'weixin_user_id': uid, 'receiver_address': {$nin: ['',null]}},{sort: {update_time: -1}},{sort: {update_time: -1}}).fetch()[0];
                if ( t3 ){ caddress = t3.receiver_address;}
                if (!caddress && t4){ caddress = t4.receiver_address; }
              }
              if (!cust.city){
                var t5=Trades.find({'fans_info.fans_id': uid, 'receiver_city': {$nin: ['',null]}},{sort: {update_time: -1}},{sort: {update_time: -1}}).fetch()[0];
                var t6=Trades.find({'weixin_user_id': uid, 'receiver_city': {$nin: ['',null]}},{sort: {update_time: -1}},{sort: {update_time: -1}}).fetch()[0];
                if ( t5 ){ ccity = t5.receiver_city;}
                if (!ccity && t6){ ccity = t6.receiver_city; }
              }
              if (!cust.state){
                var t7=Trades.find({'fans_info.fans_id': uid, 'receiver_state': {$nin: ['',null]}},{sort: {update_time: -1}},{sort: {update_time: -1}}).fetch()[0];
                var t8=Trades.find({'weixin_user_id': uid, 'receiver_state': {$nin: ['',null]}},{sort: {update_time: -1}},{sort: {update_time: -1}}).fetch()[0];
                if ( t7 ){ cstate = t7.receiver_state;}
                if (!cstate && t8){ cstate = t8.receiver_state; }
              }
              if (cmobile || caddress || ccity || cstate){
                console.log("update existed customer");
                cust.mobile=cmobile;
                cust.address=caddress;
                cust.city=ccity;
                cust.state=cstate;
                Customers.update(existed._id, {$set: cust});
              }
            }
          });
          console.log("Customers fetched: "+customers.length );
          var has_next = result.response.has_next;
          if (has_next){
            getYouzanCustomerList(result.response.last_fans_id);
          }
      }),function(error){console.log(error);});
    };
    getYouzanCustomerList(0);

    var sync_time = new moment().format('YYYY-MM-DD HH:mm:ss');
    sync = Syncs.findOne({appid: appid});
    if (sync) {
      Syncs.update({_id: sync._id},{$set: {sync_time: sync_time}});
    }else{
      Syncs.insert({appid: appid, sync_time: sync_time});
    }
    console.log('youzan customers synced at: '+sync_time);
  }
});

var yzCustomers_update = function(){
  var start_time = '2015-05-05 00:00:00';
  var hub = Meteor.settings.public.hub;
  var appid = Meteor.settings.yzAppId[hub];
  var last_sync_rec = Syncs.findOne({appid: appid});
  if (last_sync_rec){
    last_sync_time = last_sync_rec.sync_time;
    last_moment = new moment(last_sync_time, 'YYYY-MM-DD HH:mm:ss');
    start_time = last_moment.subtract('200','seconds').format('YYYY-MM-DD HH:mm:ss');
  }
  console.log('fast-sync youzan customers since: '+start_time);
  Meteor.call('syncYouzanCustomers',{start_update: start_time});
  //if seller changed trade_memo, start_update will not changed
};

var yzCustomers_full = function(){
  console.log('full-sync youzan Customers');
  Meteor.call('syncYouzanCustomers');
  //Customers.update({},{$set: {hide_amount: false}}, {multi: true});
};

var cron = new Meteor.Cron({
  events: {
    "* * * * *": yzCustomers_update, // */15 * * * * every 15 minutes
    "0 * * * *": yzCustomers_full //every hour do a full sync
  }
});
