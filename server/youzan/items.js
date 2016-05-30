Meteor.methods({
  syncYouzanItems: function(params){
    check(params,Match.Any);
    var hub = Meteor.settings.public.hub;
    var appid = Meteor.settings.yzAppId[hub];
    var appsecret = Meteor.settings.yzAppSecret[hub];
    var proxy = null;
    var apiClient = Meteor.npmRequire('youzan-api')(appid, appsecret);
    getYouzanItems = function(cmd, pn, file_name) {
      var yzParams = { page_no: pn, page_size: 300};
      apiClient.get(cmd, yzParams,Meteor.bindEnvironment(function(res){
          var result = JSON.parse(res);
          var items = result.response.items;
          var csv = json2csv(items,true,true);
          var fs = Meteor.npmRequire('fs');
          fs.writeFileSync( process.env.PWD + "/public/"+ file_name, csv ) ;
          console.log("Items fetched: "+items.length );
      }),function(error){console.log(error);});
    };
    getYouzanItems('kdt.items.inventory.get',1, "inventory_1.csv");
    getYouzanItems('kdt.items.inventory.get',2, "inventory_2.csv");
    getYouzanItems('kdt.items.onsale.get',1, "onsale_1.csv");
    getYouzanItems('kdt.items.onsale.get',2, "onsale_2.csv");
    getYouzanItems('kdt.items.onsale.get',3, "onsale_3.csv");
    getYouzanItems('kdt.items.onsale.get',4, "onsale_4.csv");
    getYouzanItems('kdt.items.onsale.get',5, "onsale_5.csv");
  }
});

var yzItems_full = function(){
  console.log('full-sync youzan Items');
  Meteor.call('syncYouzanItems');
  //Customers.update({},{$set: {hide_amount: false}}, {multi: true});
};

var cron = new Meteor.Cron({
  events: {
    "0 * * * *": yzItems_full //every hour do a full sync
  }
});
