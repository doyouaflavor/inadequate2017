showdown.setOption('simplifiedAutoLink',true);
showdown.setOption('openLinksInNewWindow',true);
showdown.setOption('simpleLineBreaks',true);
showdown.setOption('headerLevelStart',2);
showdown.setOption('tables',true);
showdown.setOption('parseImgDimensions',true);
showdown.setOption('disableForced4SpacesIndentedSublists',true);



var treloloBoardID = 'Qu1ESrH2';

var app = angular.module("page", ['ngSanitize']).config(function($sceDelegateProvider) {  
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain. **.
    'https://trello.com/**'
  ]);
}).config(function($locationProvider) {
  $locationProvider.html5Mode({ enabled: true, requireBase: false, rewriteLinks: false });
});

app.controller('MgCtrl',['$scope','$http','$sce',function($scope, $http, $sce){

  doRouter = function($scope){
    if(typeof window.cardID != 'undefined'){
      $scope.cardID = cardID;
      if( !$scope.myData ){
        $scope.jsonUrl ='https://trello.com/c/'+$scope.cardID+'.json';
        doUpdateFromCardJson();
        return;
      }
      // setContent($scope);
    }
    else if(typeof window.boardID != 'undefined'){
        $scope.boardID = boardID;
    }else{
        $scope.boardID = treloloBoardID;
    }
    if( !$scope.myData ){
        $scope.jsonUrl ='https://trello.com/b/'+$scope.boardID+'.json';
        doUpdateFromBoardJson();
        return;
    }
  }

  setHeader = function($scope){
    if($scope.myData.prefs.backgroundImage){
      if(window.outerWidth > 960){
        $scope.bgImage = $scope.myData.prefs.backgroundImage;
      }else{
        var backgroundImageScaled = $scope.myData.prefs.backgroundImageScaled;
        for(var i=0;i< backgroundImageScaled.length;i++){
          $scope.bgImage = backgroundImageScaled[i].url;
          if(backgroundImageScaled[i].width > window.innerWidth)break;
        }
      } 
    }else{
      $scope.bgColor = $scope.myData.prefs.backgroundColor;
    }
    if($scope.myData.prefs.backgroundBrightness == 'dark'){
      $scope.bgTextColor = 'white';
    }else{
      $scope.bgTextColor = 'black';
    }

  }

  setMenu = function($scope){
    var menu = [];
    var lists = $scope.myData.lists;
    lists.forEach(function(item){
      if(!item.closed){
        var object = {
          title : item.name,
          id : item.id,
          children : [],
        }
        menu.push(object);   
      }
    });

    $scope.menu = menu;

    $scope.myData.cards.forEach(function(item){
      if(!item.closed){
        if(!$scope.homeCardId){
          $scope.homeCardId = item.shortLink;
        }
        parent = getMenuParent($scope, item.idList);
        if(parent){
          if(!item.desc){
            var url = "#";
          }else{
            var reg = RegExp(/^http(s)?:\/\/[^\n]+$/);
            if(reg.exec(item.desc)){
              var url = item.desc;
            }else{
              var url = '/c/'+item.shortLink;    
            }
          }
          if(parent.children.length == 0){
            if(parent.title == item.name){
              parent.url = url;
            }else{
              parent.url = '#';
            }
          }
          if(parent.children.length != 0 || parent.title != item.name){
            parent.children.push({
              title : item.name,
              url : url,
              shortLink : item.shortLink,
            });
          }
        }
      }
    });

    if(typeof postSetMenu != 'undefined'){
      postSetMenu();
    }
  }

  setContent = function($scope){
    var converter = new showdown.Converter();
    $scope.actions = []
    $scope.myData.cards.forEach(function(item){
      if(item.shortLink == 'JYvozS7h'){
        $scope.info = $sce.trustAsHtml(converter.makeHtml(item.desc));
      }
      if(item.shortLink == 'YYxOPQSS'){
        $scope.main = $sce.trustAsHtml(converter.makeHtml(item.desc));
      }
      if(item.shortLink == 'cmjOXN2i'){
        $scope.actions[1] = {
          img : 'https://dummyimage.com/720x120/000/fff?text=看見',
          title : '看見',
          content : $sce.trustAsHtml(converter.makeHtml(item.desc)),
        }
        $scope.action1 = $sce.trustAsHtml(converter.makeHtml(item.desc));
      }
      if(item.shortLink == 'A7y1NQK1'){
        $scope.actions[2] = {
          img : 'https://dummyimage.com/720x120/450b45/ffffff?text=體驗',
          title : '體驗',
          content : $sce.trustAsHtml(converter.makeHtml(item.desc)),
        }
        $scope.action1 = $sce.trustAsHtml(converter.makeHtml(item.desc));
      }
      if(item.shortLink == 'Eph7OA64'){
        $scope.actions[3] = {
          img : 'https://dummyimage.com/720x120/50634f/ffffff?text=聆聆',
          title : '聆聆',
          content : $sce.trustAsHtml(converter.makeHtml(item.desc)),
        }
        $scope.action1 = $sce.trustAsHtml(converter.makeHtml(item.desc));
      }
      if(item.shortLink == 'ykmnOKtA'){
        $scope.actions[4] = {
          img : 'https://dummyimage.com/720x120/273b57/ffffff?text=團結',
          title : '團結',
          content : $sce.trustAsHtml(converter.makeHtml(item.desc)),
        }
        $scope.action1 = $sce.trustAsHtml(converter.makeHtml(item.desc));
      }
    });
//    
//      $scope.isHome = false;
//      if(!$scope.cardID){
//          $scope.cardID = $scope.homeCardId;
//          $scope.isHome = true;
//      }
//      else if($scope.cardID == $scope.homeCardId){
//          $scope.isHome = true;
//      }
//      var cards = $scope.myData.cards.forEach(function(item){
//          if(item.shortLink == $scope.cardID){
//              $scope.title = item.name;
//              var converter = new showdown.Converter();
//              $scope.content = converter.makeHtml(item.desc);
//              $scope.content = $sce.trustAsHtml($scope.content);
//          }
//      });
//      document.title = $scope.title + ' | ' + $scope.myData.name;
//      ga('set', 'page', location.search);
//      ga('send', 'pageview');
  };

  getMenuParent = function($scope, menuID){
      var returnObj = null;
      $scope.menu.forEach(function(parent){
          if(parent.id.match(menuID)){
              returnObj = parent;
          }
      });
      return returnObj;
  };

  doUpdateFromCardJson = function(){
      var jsonUrl = $scope.jsonUrl;
      $http.get(jsonUrl)
      .then(function(response){
          $scope.boardID = response.data.actions[0].data.board.shortLink;
          $scope.jsonUrl = 'https://trello.com/b/'+$scope.boardID+'.json';
          doUpdateFromBoardJson();
      });
  }

  doUpdateFromBoardJson = function(){
      var jsonUrl = $scope.jsonUrl;
      $http.get(jsonUrl)
      .then(function(response){
          $scope.myData = response.data;
//          setHeader($scope);
//          setMenu($scope);
          setContent($scope);
      });
  }

  $scope.changeContent = function changeContent($event){
      var obj = $event.target;
      var href = obj.getAttribute('href');
      if(href == '#'){
          return
      }else{
          history.pushState(null,'',href);
          var reg = RegExp(/^\/([bc]+)\/([^\/]+)(?:\/([^\/]+))?/);
          $event.preventDefault();
          if(reg.exec(href)){
              $scope.cardID = reg.exec(href)[2];
              setContent($scope);
              $event.preventDefault();
          }
      }
  }

  $scope.toggleAction =function(i){
    console.log($scope.showAction);
    if(!$scope.showAction){
      $scope.showAction = [0,0,0,0,0];
    }
    if($scope.showAction[i] == 1){
      $scope.showAction[i] = 0;
    }else{
      $scope.showAction = [0,0,0,0,0];
      $scope.showAction[i] = 1;  
    }
    console.log($scope.showAction);
    
  }


  init = function(){
      doRouter($scope);
      doUpdateFromBoardJson();
  }

  init();
}]);