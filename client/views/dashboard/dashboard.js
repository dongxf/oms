Template.registerHelper('trades_filters', function(){
  var sparams={};
  var stype = Session.get('shippingFilter');
  if (stype){
      switch (stype) {
        case 'express':
          sparams={shipping_type: 'express', liner: {$ne: 'KD'}};
          break;
        case 'fetch':
          sparams={shipping_type: 'fetch'};
          break;
        case 'kdonly':
          sparams={liner: 'KD'};
          break;
        default:
          sparams={};
          Session.set('shippingFilter','all');
      }
  }
  var vparams={};
  var vtype = Session.get('viewMode');
  var ttypes = Session.get('tradeStatus');
  var tparams={};
  if (ttypes){
    switch(ttypes) {
      case 'notdelivered':
        tparams={status: {$in: ['WAIT_SELLER_SEND_GOODS']}};
        break;
      case 'shipped':
        tparams={status: {$in: ['WAIT_BUYER_CONFIRM_GOODS']}};
        break;
      case 'finished':
        tparams={status: {$in: ['TRADE_BUYER_SIGNED']}};
        break;
      case 'notcheckedout':
        tparams={status: {$in: ['TRADE_NO_CREATE_PAY','WAIT_BUYER_PAY']}};
        break;
      case 'closed':
        tparams={status: {$in: ['TRADE_CLOSED']}};
        break;
      case 'buyerclosed':
        tparams={status: {$in: ['TRADE_CLOSED_BY_USER']}};
        break;
      case 'validated':
        tparams={status: {$in: ['WAIT_SELLER_SEND_GOODS','WAIT_BUYER_CONFIRM_GOODS','TRADE_BUYER_SIGNED']}};
        break;
      case 'alltrades':
        tparams={};
        break;
      default:
        tparams={status: {$in: ['WAIT_SELLER_SEND_GOODS']}};
        Session.set('tradeStatus','notdelivered');
        break;
    }
  }
  var params = _.extend(sparams,tparams);
  return params;
});
Template.dashboard.helpers({
  //add page break to trades
  filtered_trades: function(){
    var params = UI._globalHelpers.trades_filters();
    var allTrades = Trades.find(params,{sort: {created: -1}});
    var atc = allTrades.count();
    Session.set('tradesCount',atc);
    var trades_amount = 0.0;
    Trades.find(params).map(function(doc){ trades_amount+=parseFloat(doc.payment);});
    Session.set('tradesAmount',trades_amount.toFixed(2));
    return allTrades.fetch();
  },
  filtered_trades_pair: function(){
    var params = UI._globalHelpers.trades_filters();
    var allTrades = Trades.find(params,{sort: {created: -1}}).fetch();
    Session.set('tradesCount',allTrades.length);
    var trades_amount = 0.0;
    Trades.find(params).map(function(doc){ trades_amount+=parseFloat(doc.payment);});
    Session.set('tradesAmount',trades_amount.toFixed(2));
    var tradesPairA=[];
    var tradesPairB=[];
    for(var i=1; i<allTrades.length+1; i++) {
      if(i%2===0) {
        tradesPairB.push(allTrades[i-1]);
      }else{
        tradesPairA.push(allTrades[i-1]);
      }
    }
    var len = tradesPairA.length; //which is max :)
    var tradesPair=[];
    for (var k=0; k<len; k++){
      tradesPair.push({trade_a: tradesPairA[k], trade_b: tradesPairB[k]});
    }
    return tradesPair;
  },
  cashierHtml: function() {
    var params = UI._globalHelpers.trades_filters();
    Session.set('tradesCount',Trades.find(params).fetch().length);
    var trades_amount = 0.0;
    Trades.find(params).map(function(doc){ trades_amount+=parseFloat(doc.payment);});
    Session.set('tradesAmount',trades_amount.toFixed(2));

    var cod_params = _.extend(UI._globalHelpers.trades_filters(),{pay_type: {$in: ['CODPAY']}});
    var dueTrades = Trades.find(cod_params,{sort: {update_time: 1}}).fetch();
    var cod_amount = 0.0;
    Trades.find(cod_params).map(function(doc){ cod_amount+=parseFloat(doc.payment);});
    var phead = "<h2>收入分类明细表-货到付款 总额："+cod_amount.toFixed(2)+"("+dueTrades.length+")</h2>";
    var thead = "<table class='ui celled structured table'>"+
      "<thead><tr>"+
        "<th>订单号</th><th>名称</th><th>电话</th><th>商品</th><th>规格</th><th>已发</th><th>数量</th><th>小计</th><th>支付</th><th>总计</th><th>备注</th>"+
      "</tr></thead>";
    var ttail = "</tbody></table>";
    var tbody = "<tbody>";

    for (var tdx in dueTrades){
      var trd=dueTrades[tdx];
      var this_trade = trd;
      if (trd.orders===undefined) {break;} // if size of dueTrades==88, seems tdx could be 88, I don't know why
      var rsp = trd.orders.length;
      var cname;
      if (this_trade.shipping_type == 'fetch') cname = this_trade.fetch_detail.fetcher_name;
      if (this_trade.shipping_type == 'express') cname = this_trade.receiver_name;
      if (cname !== this_trade.buyer_nick ) cname += '('+this_trade.buyer_nick+')';
      if (cname === '') cname= '('+this_trade.buyer_nick+')';
      var cmobile = this_trade.shipping_type == 'fetch' ? this_trade.fetch_detail.fetcher_mobile :  this_trade.receiver_mobile;
      for (var odx in trd.orders) {
        var order = trd.orders[odx];
        if (order===undefined) {break;}
        tbody+= "<tr>";
        //if (odx==0){
          tbody+="<td>"+trd.tid+'</td>';
          tbody+="<td>"+cname+"</td>";
          tbody+="<td>"+cmobile+"</td>";
        //}
        tbody+="<td>"+order.title+'<td>';
        var shipped = order.state_str=='已发货' ? 'Y' : 'n';
        tbody+="<td>"+ shipped +"</td>";
        tbody+="<td>"+order.num+"</td>";
        tbody+="<td>"+order.payment+'</td>';
        //if (odx==0){
          var ptn = PAY_TYPE_NICK[trd.pay_type] || '未知';
          tbody+="<td>"+ptn+'</td>';
          tbody+="<td>"+trd.payment+'</td>';
          var payment_sn= trd.outer_tid || '';
          if (payment_sn!== '') payment_sn='PSN'+payment_sn+'<br>';
          var bm = trd.buyer_message;
          if (bm !== '') bm = '丰蜜留言：'+bm+'<br>';
          var tm = trd.trade_memo;
          if (tm !== '') tm = '客服备注：'+tm+'<br>';
          tbody += "<td>"+payment_sn+bm+tm+'</td>';
        //}
        tbody+="</tr>";
      }
    }

    var html_content = phead+thead+tbody+ttail;

    var wx_params = _.extend(UI._globalHelpers.trades_filters(),{pay_type: {$in: ['WEIXIN','PEERPAY','BANKCARDPAY']}});
    var wxTrades = Trades.find(wx_params,{sort: {update_time: 1}}).fetch();
    var wx_amount = 0.0;
    Trades.find(wx_params).map(function(doc){ wx_amount+=parseFloat(doc.payment);});
    //phead = "<h2>收入分类明细表-微信支付 总额："+wx_amount+"("+wxTrades.length+")</h2>";
    phead = "<h2>收入分类明细表-其他支付 总额："+wx_amount.toFixed(2)+"("+wxTrades.length+")"+"</h2>";
    thead = "<table class='ui celled structured table'>"+
      "<thead><tr>"+
        "<th>订单号</th><th>名称</th><th>电话</th><th>商品</th><th>规格</th><th>已发</th><th>数量</th><th>小计</th><th>支付</th><th>总计</th><th>备注</th>"+
      "</tr></thead>";
    ttail = "</tbody></table>";
    tbody = "<tbody>";

    for (var wxtdx in wxTrades){
      var wxtrd=wxTrades[wxtdx];
      if (wxtrd.orders===undefined) {break;}
      var wxrsp = wxtrd.orders.length;
      wxrsp = 1;
      var wxcname;
      if (wxtrd.shipping_type == 'fetch') wxcname = wxtrd.fetch_detail.fetcher_name;
      if (wxtrd.shipping_type == 'express') wxcname = wxtrd.receiver_name;
      if (wxcname !== wxtrd.buyer_nick ) wxcname += '('+wxtrd.buyer_nick+')';
      if (wxcname === '') wxcname= '('+wxtrd.buyer_nick+')';
      var wxcmobile = wxtrd.shipping_type == 'fetch' ? wxtrd.fetch_detail.fetcher_mobile :  wxtrd.receiver_mobile;
      for (var wxodx in wxtrd.orders) {
        var wxorder = wxtrd.orders[wxodx];
        if (wxorder===undefined) {break;}
        tbody+= "<tr>";
        //if (wxodx==0){
          tbody+="<td>"+wxtrd.tid+'</td>';
          tbody+="<td>"+wxcname+"</td>";
          tbody+="<td>"+wxcmobile+"</td>";
        //}
        tbody+="<td>"+wxorder.title+'<td>';
        var wxshipped = wxorder.state_str=='已发货' ? 'Y' : 'n';
        tbody+="<td>"+ wxshipped +"</td>";
        tbody+="<td>"+wxorder.num+"</td>";
        tbody+="<td>"+wxorder.payment+'</td>';
        //if (wxod==0){
          var wxptn = PAY_TYPE_NICK[wxtrd.pay_type] || '未知';
          tbody+="<td>"+wxptn+'</td>';
          tbody+="<td>"+wxtrd.payment+'</td>';
          var wxpayment_sn= wxtrd.outer_tid || '';
          if (wxpayment_sn!== '') wxpayment_sn='PSN'+wxpayment_sn+'<br>';
          var wxbm = wxtrd.buyer_message;
          if (wxbm !== '') wxbm = '丰蜜留言：'+wxbm+'<br>';
          var wxtm = wxtrd.trade_memo;
          if (wxtm !== '') wxtm = '客服备注：'+wxtm+'<br>';
          //tbody += "<td rowspan='"+wxrsp+"'>"+wxpayment_sn+wxbm+wxtm+'</td>';
          tbody += "<td>"+wxpayment_sn+wxbm+wxtm+"</td>";
        //}
        tbody+="</tr>";
      }
    }

    html_content += phead+thead+tbody+ttail;
    return html_content;
  },
  fansHtml: function(){
    var thead = "<table class='ui celled structured table'>"+
    "<thead><tr>"+
      "<th>user_id</th><th>x</th><th>avatar</th><th>nick</th><th>openid</th><th>traded_money</th><th>points</th><th>mobile</th><th>state</th><th>city</th><th>address</th>"+
    "</tr></thead><tbody>";
    var ttail="</tbody></table>";
    var allFans = Customers.find().fetch(); // filters has been set in publish.js
    var tbody="";
    allFans.forEach(function(fan){
      tbody+="<tr><td>"+fan.user_id+"</td><td>"+fan.sex+"</td><td>"+fan.avatar+"</td><td>"+fan.nick+
      "</td><td>"+fan.weixin_openid+"</td><td>"+fan.traded_money+"</td><td>"+fan.points+"</td>"+
      "<td>"+fan.mobile+"</td>"+"<td>"+fan.state+"</td><td>"+fan.city+"</td><td>"+fan.address+"</td>"+
      "</tr>";
    });
    var fansHtml=thead+tbody+ttail;
    return fansHtml;
  },
  reportHtml: function(){
    var thead = "<table class='ui celled structured table'>"+
    "<thead><tr>"+
      "<th>NO</th><th>收货人</th><th>地址</th><th>手机</th><th>线路</th><th>日期</th><th>发货</th><th>商品</th><th>单位</th><th>数量</th>"+
      "<th>价格</th><th>支付</th><th>类型</th><th>方式</th><th>备注</th><th>订单号</th>"+
    "</tr></thead><tbody>";
    var ttail = "</tbody></table>";
    var params = UI._globalHelpers.trades_filters();
    var filteredTrades = Trades.find(params,{sort: {liner: 1}}).fetch();
    var atc = filteredTrades.length;
    Session.set('tradesCount',atc);
    var trades_amount = 0.0;
    Trades.find(params).map(function(doc){ trades_amount+=parseFloat(doc.payment);});
    Session.set('tradesAmount',trades_amount.toFixed(2));
    Array.prototype.unique = function(a){
        return function(){ return this.filter(a); };
    }(function(a,b,c){ return (c.indexOf(a,b+1) < 0); });
    var receiverMobiles = [];
    //for (var ft of filteredTrades) { receiverMobiles.push(ft.receiver_mobile)}; /*only works in ES6*/
    for ( var ftx in filteredTrades ){
      var ftt=filteredTrades[ftx];
      receiverMobiles.push(ftt.receiver_mobile);
    }
    var uniqueMobiles = receiverMobiles.unique();
    var receivers = [];
    /*for (var ft of filteredTrades) {
      receivers.push(ft.receiver_name+ft.receiver_address+ft.receiver_mobile)
    };
    var uniqueReceivers = receivers.unique();
    */
    var tbody="";
    for ( var mdx in uniqueMobiles ){
      var mobile = uniqueMobiles[mdx];
      var new_params = _.extend(params,{receiver_mobile: mobile});
      var her_trades = Trades.find(new_params,{sort: {created: -1}}).fetch();
      var merged_orders = [];
      var merged_trades = [];
      var odx_to_tdx = {}; //this will index which trade a order belongs to
      var todx = []; //record odx which indicate new trade
      var tmp = 0;
      //for ( var td of her_trades) {
      for ( var i=0; i<her_trades.length; i++) {
        var td=her_trades[i];
        merged_orders = merged_orders.concat(td.orders);
        for ( var j=0; j<td.orders.length; j++){
          odx_to_tdx[tmp]=i;
          if(j===0) todx.push(tmp);
          tmp++;
        }
      }
      var trades_rowspan = merged_orders.length;
      for ( var idx=0; idx<merged_orders.length; idx++ ) {
        tbody+="<tr>";
        //JSON.stringify(odx_to_tdx)
        var tdx=odx_to_tdx[idx];
        var this_trade = her_trades[tdx];
        var ttrsp = this_trade.orders.length;//this_trade's rowspan
        if ( idx ===0 ) tbody+="<td rowspan='"+trades_rowspan+"'>"+(parseInt(mdx)+1)+"</td>";

        var cname;
        if (this_trade.shipping_type == 'fetch') cname = this_trade.fetch_detail.fetcher_name;
        if (this_trade.shipping_type == 'express') cname = this_trade.receiver_name;
        if (cname !== this_trade.buyer_nick ) cname += '('+this_trade.buyer_nick+')';
        if (cname === '') cname= '('+this_trade.buyer_nick+')';
        //if ( todx.indexOf(idx) > -1 ) tbody+="<td rowspan='"+ttrsp+"'>"+cname+"</td>";
        tbody += todx.indexOf(idx)>-1 ? '<td>'+cname+'</td>' : '<td>..</td>';

        var caddr =  this_trade.shipping_type=='fetch' ? this_trade.fetch_detail.shop_name : this_trade.receiver_address;

        //if ( todx.indexOf(idx) > -1 ) tbody+="<td rowspan='"+ttrsp+"'>"+caddr+"</td>";
        tbody += todx.indexOf(idx)>-1 ? '<td>'+caddr+'</td>' : '<td>..</td>';
        var cmobile = this_trade.shipping_type == 'fetch' ? this_trade.fetch_detail.fetcher_mobile :  this_trade.receiver_mobile;
        //if ( todx.indexOf(idx) > -1 ) tbody+="<td rowspan='"+ttrsp+"'>"+this_trade.receiver_mobile+"</td>";
        tbody += todx.indexOf(idx)>-1 ? '<td>'+cmobile+'</td>' : '<td>..</td>';
        var this_liner = this_trade.liner || '';
        //if ( todx.indexOf(idx) > -1 ) tbody+="<td rowspan='"+ttrsp+"'>"+this_liner+"</td>";
        //tbody += todx.indexOf(idx)>-1 ? '<td>'+this_liner+'</td>' : '<td>..</td>';
        tbody += '<td>'+this_liner+'</td>';
        var tdate = this_trade.pay_time.substring(5,10);
        tbody += todx.indexOf(idx)>-1 ? '<td>'+tdate+'</td>' : '<td>..</td>';

        //var shipping_style =  merged_orders[idx].state_str=='已发货' ? '<span style="text-decoration: line-through">' : '<span>';
        //tbody+="<td>"+shipping_style+merged_orders[idx].title+"</span></td>";
        tbody+= merged_orders[idx].state_str=='已发货' ? '<td>Y</td>' : '<td></td>';
        tbody+="<td>"+merged_orders[idx].title+"</td>";
        tbody+="<td>"+merged_orders[idx].sku_properties_name+"</td>";
        tbody+="<td>"+merged_orders[idx].num+"</td>";
        tbody+="<td>"+merged_orders[idx].payment+"</td>";
        var payment_style = this_trade.outer_tid!=='' && this_trade.pay_time!=='' ? '<span style="text-decoration: line-through">' : '<span>';
        //if ( todx.indexOf(idx) > -1 ) tbody += "<td rowspan='"+ttrsp+"'>"+payment_style+this_trade.payment+"</span></td>";
        tbody += todx.indexOf(idx)>-1 ? '<td>'+payment_style+this_trade.payment+'</span></td>' : '<td>..</td>';
        var stn = SHIP_TYPE_NICK[this_trade.shipping_type] || '未知';
        //if ( todx.indexOf(idx) > -1 ) tbody+="<td rowspan='"+ttrsp+"'>"+stn+"</td>";
        tbody += todx.indexOf(idx)>-1 ? '<td>'+stn+'</td>' : '<td>..</td>';

        var ptn = PAY_TYPE_NICK[this_trade.pay_type] || '未知';
        //if ( todx.indexOf(idx) > -1 ) tbody+="<td rowspan='"+ttrsp+"'>"+ptn+"</td>";
        tbody += todx.indexOf(idx)>-1 ? '<td>'+ptn+'</td>' : '<td>..</td>';


        var payment_sn= this_trade.outer_tid || '';
        if (payment_sn!== '') payment_sn='PSN'+payment_sn+'<br>';
        var bm = this_trade.buyer_message;
        if (bm !== '') bm = '丰蜜留言：'+bm+'<br>';
        var tm = this_trade.trade_memo;
        if (tm !== '') tm = '客服备注：'+tm+'<br>';
        //if ( todx.indexOf(idx) > -1 ) tbody+="<td rowspan='"+ttrsp+"'>"+payment_sn+bm+tm+"</td>";
        tbody += todx.indexOf(idx)>-1 ? '<td>'+payment_sn+bm+tm+'</td>' : '<td>..</td>';
        tbody += todx.indexOf(idx)>-1 ? '<td>'+this_trade.tid+'</td>' : '<td>..</td>';
        tbody+="</tr>";
      }
    }
    var reportHtml = thead + tbody + ttail;
    return reportHtml;
  },
  lastCommand: function(){
    return Session.get('lastCommand');
  },
  tradesCount: function(){
    if(Session.get('tradesCount')) return Session.get('tradesCount');
    return Trades.find().count();
  },
  trades: function(){
    return Trades.find();
  },
  isMonitorMode: function(){
    switch(Session.get('viewMode')){
      case 'printer':
        return false;
      case 'dispatch':
        return false;
      case 'cashier':
        return false;
      case 'fans':
        return false;
      default:
        return true;
    }
  },
  isPrinterMode: function(){
    return Session.get('viewMode')==='printer';
  },
  isDispatchMode: function(){
    return Session.get('viewMode')==='dispatch';
  },
  isCashierMode: function(){
    return Session.get('viewMode')==='cashier';
  },
  isFansMode: function(){
    return Session.get('viewMode')==='fans';
  }
});

Template.dashboard.events({
});
