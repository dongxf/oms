Template.order.helpers({
  truncated_title: function(){
    var ostat = (this.state_str==='退款中' ? '退'  : '')+ (this.num=='1' ? '1-' : this.num+'*') + (this.sku_properties_name==='' ? '' : this.sku_properties_name.split(':')[1] + '|') + this.title;
    return ostat.substring(0,16);//+'-';
  },
  mark_style: function(){
    if (this.state_str=='已发货') return 'text-decoration: line-through';
    if (this.state_str=='退款中') return 'text-decoration: underline';
    return '';
  }
});
Template.orderGeng.helpers({
  markedGeng: function(){
    return this.title[this.title.length-1]=='G';
  },
  truncated_title: function(){
    var ostat = (this.state_str==='退款中' ? '退'  : '')+ (this.num=='1' ? '1-' : this.num+'*') + (this.sku_properties_name==='' ? '' : this.sku_properties_name.split(':')[1] + '|') + this.title;
    return ostat.substring(0,16);//+'g';
  },
  noticed_num: function(){
    return this.num=='1' ? '1' : '*'+this.num;
  },
  mark_style: function(){
    if (this.state_str=='已发货') return 'text-decoration: line-through';
    if (this.state_str=='退款中') return 'text-decoration: underline';
    return '';
  },
  price_to_show: function(){
    if (Template.parentData(1).hide_amount=='hide') return '';
    return this.payment;
  }
});
Template.orderOther.helpers({
  markedOther: function(){
    var mark=this.title[this.title.length-1];
    return mark!=='G'&&mark!=='Y'&&mark!='L'&&mark!='M';
  },
  truncated_title: function(){
    var ostat = (this.state_str==='退款中' ? '退'  : '')+ (this.num=='1' ? '1-' : this.num+'*') + (this.sku_properties_name==='' ? '' : this.sku_properties_name.split(':')[1] + '|') + this.title;
    return ostat.substring(0,16);//+'o';
  },
  noticed_num: function(){
    return this.num=='1' ? '1' : '*'+this.num;
  },
  mark_style: function(){
    if (this.state_str=='已发货') return 'text-decoration: line-through';
    if (this.state_str=='退款中') return 'text-decoration: underline';
    return '';
  },
  price_to_show: function(){
    if (Template.parentData(1).hide_amount=='hide') return '';
    return this.payment;
  }
});
Template.orderYe.helpers({
  markedYe: function(){
    return this.title[this.title.length-1]=='Y';
  },
  truncated_title: function(){
    var ostat = (this.state_str==='退款中' ? '退'  : '')+ (this.num=='1' ? '1-' : this.num+'*') + (this.sku_properties_name==='' ? '' : this.sku_properties_name.split(':')[1] + '|') + this.title;
    return ostat.substring(0,16);//+'y';
  },
  noticed_num: function(){
    return this.num=='1' ? '1' : '*'+this.num;
  },
  mark_style: function(){
    if (this.state_str=='已发货') return 'text-decoration: line-through';
    if (this.state_str=='退款中') return 'text-decoration: underline';
    return '';
  },
  price_to_show: function(){
    if (Template.parentData(1).hide_amount=='hide') return '';
    return this.payment;
  }
});
Template.orderLeng.helpers({
  markedLeng: function(){
    return this.title[this.title.length-1]=='L';
  },
  truncated_title: function(){
    var ostat = (this.state_str==='退款中' ? '退'  : '')+ (this.num=='1' ? '1-' : this.num+'*') + (this.sku_properties_name==='' ? '' : this.sku_properties_name.split(':')[1] + '|') + this.title;
    return ostat.substring(0,16);//+'l';
  },
  noticed_num: function(){
    return this.num=='1' ? '1' : '*'+this.num;
  },
  mark_style: function(){
    if (this.state_str=='已发货') return 'text-decoration: line-through';
    if (this.state_str=='退款中') return 'text-decoration: underline';
    return this.payment;
  },
  price_to_show: function(){
    if (Template.parentData(1).hide_amount=='hide') return '';
    return this.payment;
  }
});
Template.orderMian.helpers({
  markedLeng: function(){
    return this.title[this.title.length-1]=='M';
  },
  truncated_title: function(){
    var ostat = (this.state_str==='退款中' ? '退'  : '')+ (this.num=='1' ? '1-' : this.num+'*') + (this.sku_properties_name==='' ? '' : this.sku_properties_name.split(':')[1] + '|') + this.title;
    return ostat.substring(0,16);//+'m';
  },
  noticed_num: function(){
    return this.num=='1' ? '1' : '*'+this.num;
  },
  mark_style: function(){
    if (this.state_str=='已发货') return 'text-decoration: line-through';
    if (this.state_str=='退款中') return 'text-decoration: underline';
    return '';
  },
  price_to_show: function(){
    if (Template.parentData(1).hide_amount=='hide') return '';
    return this.payment;
  }
});
