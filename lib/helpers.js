PAY_TYPE_NICK={}; //PayTypeNick
PAY_TYPE_NICK.WEIXIN='微信支付';
PAY_TYPE_NICK.PEERPAY='三方代付';
PAY_TYPE_NICK.ALIPAY='支付宝付款';
PAY_TYPE_NICK.BANKCARDPAY='银行卡支付';
PAY_TYPE_NICK.CODPAY='货到付款';
PAY_TYPE_NICK.BAIDUPAY='百度钱包';
PAY_TYPE_NICK.PRESENTTAKE='赠品领用';
PAY_TYPE_NICK.COUPONPAY='优惠抵扣';
PAY_TYPE_NICK.BULKPURCHASE='分销采购';

PAY_STATUS_NICK={};
PAY_STATUS_NICK.TRADE_NO_CREATE_PAY='未提交';
PAY_STATUS_NICK.WAIT_BUYER_PAY='待付款';
PAY_STATUS_NICK.WAIT_SELLER_SEND_GOODS='待发货';
PAY_STATUS_NICK.TRADE_BUYER_SIGNED='已完成';
PAY_STATUS_NICK.TRADE_CLOSED='已退款';
PAY_STATUS_NICK.TRADE_CLOSED_BY_USER='被取消';
PAY_STATUS_NICK.ALL_CLOSED='已关闭';
PAY_STATUS_NICK.WAIT_BUYER_CONFIRM_GOODS='待收货';

VIEW_NAME={};
VIEW_NAME.cashier='支付结算';
VIEW_NAME.monitor='订单总览';
VIEW_NAME.printer='分捡打印';
VIEW_NAME.dispatch='分线单据';

STATUS_FILTER={};
STATUS_FILTER.notdelivered='等待发货';
STATUS_FILTER.shipped='等待收货';
STATUS_FILTER.finished='已经完成';
STATUS_FILTER.notcheckedout='尚未提交';
STATUS_FILTER.closed='已经退款';
STATUS_FILTER.buyerclosed='已被取消';
STATUS_FILTER.validated='所有有效';
STATUS_FILTER.alltrades='全部订单';

SHIPPING_FILTER={};
SHIPPING_FILTER.all='全部方式';
SHIPPING_FILTER.fetch='到店自提';
SHIPPING_FILTER.express='配送上门';
SHIPPING_FILTER.kdonly='只看快递';

SHIP_TYPE_NICK={};
SHIP_TYPE_NICK.fetch='自提';
SHIP_TYPE_NICK.express='配送';

BRAND_NAME=Meteor.settings.public.brand[Meteor.settings.public.hub];
SLOGAN=Meteor.settings.public.slogan[Meteor.settings.public.hub];
COMMITMENT=Meteor.settings.public.commitment[Meteor.settings.public.hub];
WECHAT_ID=Meteor.settings.public.wechat[Meteor.settings.public.hub];
PHONE=Meteor.settings.public.phone[Meteor.settings.public.hub];
