Template.home.helpers({
  'feature' : function () {
    return [
      { 'text' : '有赞订单同步', 'icon' : 'archive', 'path' : '#packages' },
      { 'text' : '批量标签打印', 'icon' : 'terminal', 'path' : '#console-tool' },
      { 'text' : '实时订单协同', 'icon' : 'html5', 'color' : 'hover-orange', 'path' : '#html5' },
      { 'text' : '疑难订单跟踪', 'icon' : 'folder', 'path' : '#structure' }
    ];
  },
  'package' : function () {
    return [
      { 'name' : '自动订单导入', 'path' : '#' },
      { 'name' : '可选反向同步', 'path' : '#' }
    ];
  },
  'consoleCommand' : function () {
    return [
      { 'command' : 'view', 'description' : 'Creates a folder under client/views with html, less and javascript files.' },
      { 'command' : 'module', 'description' : 'Similiar to a view, but under client/modules and for re-usable components' },
      { 'command' : 'layout', 'description' : 'Creates a layout template which yields your content, used by iron-router' },
      { 'command' : 'common', 'description' : 'Creates a simple html file under client/views/common' },
      { 'command' : 'routes', 'description' : 'Creates a group of routes under routes/' },
      { 'command' : 'model', 'description' : 'Creates a model with files in model/, client/subscriptions and server/publications' },
      { 'command' : 'less', 'description' : 'Creates a less stylesheet in client/stylesheets' }
    ];
  },
  'semanticElement' : function () {
    return [
      { 'what' : 'Large Buttons', 'withBootstrap' : 'btn btn-lg', 'withSemanticUI' : 'ui large button' },
      { 'what' : 'One column', 'withBootstrap' : 'col-md-1', 'withSemanticUI' : 'one wide column' },
      { 'what' : 'Vertical Menu / Navigation', 'withBootstrap' : 'nav nav-pills', 'withSemanticUI' : 'ui vertical menu' }

    ];
  },
  'bootstrapCode' : function () {
    return '<div class="btn btn-primary btn-lg"></div>';
  },
  'folder' : function () {
    return [
      { 'root' : 'client', 'children' :
        ['compatibility', 'config', ' lib', ' startup', ' stylesheets',
          'modules', 'views']
      },
      { 'root' : 'model' },
      { 'root' : 'routes' },
      { 'root' : 'private' },
      { 'root' : 'server', 'children' : ['fixtures', 'lib', 'publications', 'startup'] },
      { 'root' : 'public' },
      { 'root' : 'meteor-boilerplate' }
    ];
  }
});

Template.home.events({
});


Template.home.rendered = function () {
  // @see: http://stackoverflow.com/questions/5284814/jquery-scroll-to-div
  $('a[href*=#]:not([href=#])').click(function () {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }

    return true;
  });
};
