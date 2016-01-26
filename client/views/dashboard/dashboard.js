Template.registerHelper('trades_filters', function(){
  var sparams={};
  var stype = Session.get('shippingType');
  if (stype){
      switch (stype) {
        case 'express':
          sparams={shipping_type: 'express', liner: {$ne: 'KD'}};
          Session.set('shippingFilter','配送上门');
          break;
        case 'fetch':
          sparams={shipping_type: 'fetch'};
          Session.set('shippingFilter','到店自提');
          break;
        case 'kdonly':
          sparams={liner: 'KD'};
          Session.set('shippingFilter','只看快递');
          break;
        default:
          sparams={};
          Session.set('shippingFilter','全部类型');
      }
  }
  var vparams={};
  var vtype = Session.get('viewMode');
  if (vtype){
    switch(vtype){
      case 'monitor':
        vparams={};
        Session.set('viewFilter','订单总览');
        break;
      case 'printer':
        vparams={};
        Session.set('viewFilter','打印专用');
        break;
        case 'dispatch':
          vparams={};
          Session.set('viewFilter','配送分捡');
          break;
        case 'printer':
          vparams={};
          Session.set('viewFilter','结算记帐');
          break;
      }
  }
  var ttypes = Session.get('tradeTypes');
  var tparams={};
  if (ttypes){
    switch(ttypes) {
      case 'not-delivered':
        tparams={status: {$in: ['WAIT_SELLER_SEND_GOODS']}};
        Session.set('statusFilter','待发货');
        break;
      case 'shipped':
        tparams={status: {$in: ['WAIT_BUYER_CONFIRM_GOODS']}};
        Session.set('statusFilter','待收货');
        break;
      case 'finished':
        tparams={status: {$in: ['TRADE_BUYER_SIGNED']}};
        Session.set('statusFilter','已完成');
        break;
      case 'not-checked-out':
        tparams={status: {$in: ['TRADE_NO_CREATE_PAY','WAIT_BUYER_PAY']}};
        Session.set('statusFilter','未提交');
        break;
      case 'closed':
        tparams={status: {$in: ['TRADE_CLOSED']}};
        Session.set('statusFilter','已退款');
        break;
      case 'buyer-closed':
        tparams={status: {$in: ['TRADE_CLOSED_BY_USER']}};
        Session.set('statusFilter','被取消');
        break;
      default:
        tparams={};
        Session.set('statusFilter','所有的');
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
        tbody+="<td>"+merged_orders[idx].total_fee+"</td>";
        var payment_style = this_trade.outer_tid!=='' && this_trade.pay_time!=='' ? '<span style="text-decoration: line-through">' : '<span>';
        //if ( todx.indexOf(idx) > -1 ) tbody += "<td rowspan='"+ttrsp+"'>"+payment_style+this_trade.payment+"</span></td>";
        tbody += todx.indexOf(idx)>-1 ? '<td>'+payment_style+this_trade.payment+'</span></td>' : '<td>..</td>';
        var PayTypeNick={};
        PayTypeNick.WEIXIN='微支付';
        PayTypeNick.PEERPAY='三方付';
        PayTypeNick.ALIPAY='支付宝';
        PayTypeNick.BANKCARDPAY='银行卡';
        PayTypeNick.CODPAY='货到付';
        PayTypeNick.BAIDUPAY='百付宝';
        PayTypeNick.PRESENTTAKE='领赠品';
        PayTypeNick.COUPONPAY='抵扣';
        PayTypeNick.BULKPURCHASE='分销';
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
  printModeActive: function(){
    return Session.get('print-mode')=='active' ? true : false;
  },
  reportModeActive: function(){
    return Session.get('report-mode')=='active' ? true : false;
  },
  isMonitorMode: function(){
    return Session.get('viewMode')==='monitor' ? true : false;
  },
  isPrinterMode: function(){
    return Session.get('viewMode')==='printer' ? true : false;
  },
  isDispatchMode: function(){
    return Session.get('viewMode')==='dispatch' ? true : false;
  },
  isCashierMode: function(){
    return Session.get('viewMode')==='cashier' ? true : false;
  }
});

Template.dashboard.events({
});
