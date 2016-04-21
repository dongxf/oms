Template.order.helpers({
  truncated_title: function(){
    return this.title.substring(0,12);
    //return this.outer_sku_id+' '+this.title.substring(0,12);
  },
  shipping_state: function(){
    return this.state_str;
  },
  mark_style: function(){
    if (this.state_str=='已发货') return 'text-decoration: line-through';
    return '';
  }
});
Template.orderGeng.helpers({
  markedGeng: function(){
    return this.title[this.title.length-1]=='G';
  },
  truncated_title: function(){
    return 'g '+this.title.substring(0,14);
    //return this.outer_sku_id+' '+this.title.substring(0,12);
  },
  shipping_state: function(){
    return this.state_str;
  },
  noticed_num: function(){
    return this.num=='1' ? '1' : '*'+this.num;
  },
  mark_style: function(){
    if (this.state_str=='已发货') return 'text-decoration: line-through';
    return '';
  }
});
Template.orderOther.helpers({
  markedOther: function(){
    var mark=this.title[this.title.length-1];
    return mark!=='G'&&mark!=='Y'&&mark!='L'&&mark!='M';
  },
  truncated_title: function(){
    return 'o '+this.title.substring(0,14);
    //return this.outer_sku_id+' '+this.title.substring(0,12);
  },
  noticed_num: function(){
    return this.num=='1' ? '1' : '*'+this.num;
  },
  shipping_state: function(){
    return this.state_str;
  },
  mark_style: function(){
    if (this.state_str=='已发货') return 'text-decoration: line-through';
    return '';
  }
});
Template.orderYe.helpers({
  markedYe: function(){
    return this.title[this.title.length-1]=='Y';
  },
  truncated_title: function(){
    return 'y '+this.title.substring(0,14);
    //return this.outer_sku_id+' '+this.title.substring(0,12);
  },
  noticed_num: function(){
    return this.num=='1' ? '1' : '*'+this.num;
  },
  shipping_state: function(){
    return this.state_str;
  },
  mark_style: function(){
    if (this.state_str=='已发货') return 'text-decoration: line-through';
    return '';
  }
});
Template.orderLeng.helpers({
  markedLeng: function(){
    return this.title[this.title.length-1]=='L';
  },
  truncated_title: function(){
    return 'l '+this.title.substring(0,14);
    //return this.outer_sku_id+' '+this.title.substring(0,12);
  },
  noticed_num: function(){
    return this.num=='1' ? '1' : '*'+this.num;
  },
  shipping_state: function(){
    return this.state_str;
  },
  mark_style: function(){
    if (this.state_str=='已发货') return 'text-decoration: line-through';
    return '';
  }
});
Template.orderMian.helpers({
  markedLeng: function(){
    return this.title[this.title.length-1]=='M';
  },
  truncated_title: function(){
    return 'm '+this.title.substring(0,14);
    //return this.outer_sku_id+' '+this.title.substring(0,12);
  },
  noticed_num: function(){
    return this.num=='1' ? '1' : '*'+this.num;
  },
  shipping_state: function(){
    return this.state_str;
  },
  mark_style: function(){
    if (this.state_str=='已发货') return 'text-decoration: line-through';
    return '';
  }
});
