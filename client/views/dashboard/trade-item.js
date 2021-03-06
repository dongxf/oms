Template.tradeItem.helpers({
  contact_name: function(){
    var cname;
    if (this.shipping_type == 'fetch') cname = this.fetch_detail.fetcher_name;
    if (this.shipping_type == 'express') cname = this.receiver_name;
    if (cname !== this.buyer_nick ) cname += '('+this.buyer_nick+')';
    if (cname === '') cname= '('+this.buyer_nick+')';
    return cname;
  },
  brand_name: function(){
    return BRAND_NAME;
  },
  wechat_id: function(){
    return WECHAT_ID;
  },
  phone: function(){
    return PHONE;
  },
  slogan: function(){
    return SLOGAN;
  },
  commitment: function(){
    return COMMITMENT;
  },
  discountApplied: function(){
    return this.discount_fee=='0.00' ? false : true;
  },
  postfeeApplied: function(){
    return this.post_fee=='0.00' ? false : true;
  },
  buyerMessageLeft: function(){
    return this.buyer_message==='' ? false : true;
  },
  pay_type_nick: function(){
    return PAY_TYPE_NICK[this.pay_type] || '';
  },
  tradeMemoExisted: function(){
    return this.trade_memo=== '' ? false : true ;
  },
  contact_mobile: function(){
    if (this.shipping_type == 'fetch') return this.fetch_detail.fetcher_mobile;
    return this.receiver_mobile;
  },
  shipping_icon: function(){
    if (this.shipping_type == 'fetch') return 'university icon';
    if (this.liner == 'KD') return 'mail icon';
    return 'shipping icon';
  },
  shipping_address: function(){
    return this.shipping_type=='fetch' ? this.fetch_detail.shop_name : this.receiver_city+this.receiver_district+this.receiver_address;
  },
  pay_style: function(){
    if (this.outer_tid!=='' && this.pay_time!=='') return 'text-decoration: line-through';
    return '';
  },
  pay_notice: function(){
    if (this.pay_type=='CODPAY') return ' #待付#';
    return '';
  },
  status_label: function(){
    return PAY_STATUS_NICK[this.status] || this.status;
  },
  should_hide_amount: function(){
    return ( this.hide_amount === 'hide' );
  }
});

Template.tradeItem.events({
  'click .payment': function(event){
    event.preventDefault();
    Meteor.call('reloadCard',this._id);
  },
  'click .linerSelector': function(event){
    event.preventDefault();
    Meteor.call('linerSelector',this._id);
  },
  'click .tradeReminder': function(event){
    event.preventDefault();
    Meteor.call('tradeReminder',this._id);
  }
});
