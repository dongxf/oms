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
Template.order_zero.helpers({
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
Template.order_fresh.helpers({
  cold_chain_needed: function(){
    return this.title[this.title.length-1]=='L'||this.title[this.title.length-1]=='Ｌ';
  },
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
Template.order_zero_fresh.helpers({
  cold_chain_needed: function(){
    return this.title[this.title.length-1]=='L'||this.title[this.title.length-1]=='Ｌ';
  },
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
Template.order_nonfresh.helpers({
  cold_chain_needed: function(){
    return this.title[this.title.length-1]=='L'||this.title[this.title.length-1]=='Ｌ';
  },
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
Template.order_zero_nonfresh.helpers({
  cold_chain_needed: function(){
    return this.title[this.title.length-1]=='L'||this.title[this.title.length-1]=='Ｌ';
  },
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
