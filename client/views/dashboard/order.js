Template.order.helpers({
  truncated_title: function(){
    var ostat = this.title + (this.state_str==='退款中' ? '维权中'  : '');
    return ostat.substring(0,16);
    //return this.title.substring(0,16);
    //return this.outer_sku_id+' '+this.title.substring(0,16);
  },
  mark_style: function(){
    if (this.state_str=='已发货') return 'text-decoration: line-through';
    if (this.state_str=='退款中') return 'text-decoration: line-throug';
    return '';
  }
});
Template.orderGeng.helpers({
  markedGeng: function(){
    return this.title[this.title.length-1]=='G';
  },
  truncated_title: function(){
    var ostat = (this.state_str==='退款中' ? '退'  : 'g ')+ (this.num=='1' ? '1 ' : this.num+'*') + this.title;
    return ostat.substring(0,16);//return 'g '+this.title.substring(0,14);
    //return this.outer_sku_id+' '+this.title.substring(0,16);
  },
  noticed_num: function(){
    return this.num=='1' ? '1' : '*'+this.num;
  },
  mark_style: function(){
    if (this.state_str=='已发货') return 'text-decoration: line-through';
    if (this.state_str=='退款中') return 'text-decoration: line-throug';
    return '';
  }
});
Template.orderOther.helpers({
  markedOther: function(){
    var mark=this.title[this.title.length-1];
    return mark!=='G'&&mark!=='Y'&&mark!='L'&&mark!='M';
  },
  truncated_title: function(){
    var ostat = (this.state_str==='退款中' ? '退'  : 'o ')+ (this.num=='1' ? '1 ' : this.num+'*') + this.title;
    return ostat.substring(0,16);//return 'o '+this.title.substring(0,14);
    //return this.outer_sku_id+' '+this.title.substring(0,16);
  },
  noticed_num: function(){
    return this.num=='1' ? '1' : '*'+this.num;
  },
  mark_style: function(){
    if (this.state_str=='已发货') return 'text-decoration: line-through';
    if (this.state_str=='退款中') return 'text-decoration: line-throug';
    return '';
  }
});
Template.orderYe.helpers({
  markedYe: function(){
    return this.title[this.title.length-1]=='Y';
  },
  truncated_title: function(){
  var ostat = (this.state_str==='退款中' ? '退'  : 'y ')+ (this.num=='1' ? '1 ' : this.num+'*') + this.title;
    return ostat.substring(0,16);//return 'y '+this.title.substring(0,14);
    //return this.outer_sku_id+' '+this.title.substring(0,16);
  },
  noticed_num: function(){
    return this.num=='1' ? '1' : '*'+this.num;
  },
  mark_style: function(){
    if (this.state_str=='已发货') return 'text-decoration: line-through';
    if (this.state_str=='退款中') return 'text-decoration: line-throug';
    return '';
  }
});
Template.orderLeng.helpers({
  markedLeng: function(){
    return this.title[this.title.length-1]=='L';
  },
  truncated_title: function(){
  var ostat = (this.state_str==='退款中' ? '退'  : 'l ')+ (this.num=='1' ? '1 ' : this.num+'*') + this.title;
    return ostat.substring(0,16);//return 'l '+this.title.substring(0,14);
    //return this.outer_sku_id+' '+this.title.substring(0,16);
  },
  noticed_num: function(){
    return this.num=='1' ? '1' : '*'+this.num;
  },
  mark_style: function(){
    if (this.state_str=='已发货') return 'text-decoration: line-through';
    if (this.state_str=='退款中') return 'text-decoration: line-throug';
    return '';
  }
});
Template.orderMian.helpers({
  markedLeng: function(){
    return this.title[this.title.length-1]=='M';
  },
  truncated_title: function(){
  var ostat = (this.state_str==='退款中' ? '退'  : 'm ')+ (this.num=='1' ? '1 ' : this.num+'*') + this.title;
    return ostat.substring(0,16);//return 'm '+this.title.substring(0,14);
    //return this.outer_sku_id+' '+this.title.substring(0,16);
  },
  noticed_num: function(){
    return this.num=='1' ? '1' : '*'+this.num;
  },
  mark_style: function(){
    if (this.state_str=='已发货') return 'text-decoration: line-through';
    if (this.state_str=='退款中') return 'text-decoration: line-throug';
    return '';
  }
});
