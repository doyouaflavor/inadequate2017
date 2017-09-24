showdown.setOption('simplifiedAutoLink',true);
showdown.setOption('openLinksInNewWindow',true);
showdown.setOption('simpleLineBreaks',true);
showdown.setOption('headerLevelStart',2);
showdown.setOption('tables',true);
showdown.setOption('parseImgDimensions',true);
showdown.setOption('disableForced4SpacesIndentedSublists',true);



var treloloBoardID = 'Qu1ESrH2';

var app = angular.module("page", ['ngSanitize','ngAnimate']).config(function($sceDelegateProvider) {  
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
  
  setStaticContent = function($scope){
    $scope.actions = [];
    $scope.actions[1] = {
      word_image: "https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c60d208ce8059dfba9154a/f6592e5c01b43f1a686949a4295af020/%E7%9C%8B%E8%A6%8B.png",
      img : 'https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c22f00597fbf473c4cbaeb/5d7d3798b6bc51d94d549c81ed217afa/%E9%BB%83%E5%AD%90%E6%98%8E_%E7%84%A1%E5%AE%B6%E8%80%85_(2).jpg',
      title : '看見',
      subtitle : '是什麼風把你吹來了'
      
    }
    $scope.actions[2] = {
      word_image: "https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c60d208ce8059dfba9154a/4d4be07396a6428c268be79db9e45266/%E9%AB%94%E9%A9%97.png",
      img : 'https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c22f00597fbf473c4cbaeb/dcf49a92ec0c6dd51c5a313370b01f31/%E6%9E%97%E7%92%9F%E7%91%8B_10_20150223_8435-Good-1-Print%E8%BF%91%E5%8F%B0%E5%8C%97101%E6%9F%90%E8%99%95%E5%B8%82%E5%A0%B4.jpg',
      title : '體驗',
      subtitle : '城市狹縫旅行團'
    }
    $scope.actions[3] = {
      word_image: "https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c60d208ce8059dfba9154a/f4ab20327f3d4efe0e875e78233c0516/%E8%81%86%E8%81%BD.png",
      img : 'https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c22f00597fbf473c4cbaeb/ada50d3610bb4227db1796cacfe83609/%E9%BB%83%E5%AD%90%E6%98%8E_%E7%84%A1%E5%AE%B6%E8%80%85_(5).jpg',
      title : '聆聽',
      subtitle : '漂流部落・真人圖書館・專題講座'
    }
    $scope.actions[4] = {
      word_image:"https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c60d208ce8059dfba9154a/3fe3fdb4e67f4873372df3f82a93d8cd/%E5%9C%98%E7%B5%90.png",
      img : 'https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c22f00597fbf473c4cbaeb/646bf59a3eba76bef7ad05c60e2196b5/%E5%90%B3%E6%89%BF%E7%B4%98_%E7%94%9F%E6%B4%BB_(10).jpg',
      title : '團結',
      subtitle : '遊行・宣言・立碑'
    }
    $scope.news = [];
    $scope.cta = [];
  }

  setContent = function($scope){
    var converter = new showdown.Converter();
    $scope.myData.cards.forEach(function(item){
      if(item.shortLink == 'JYvozS7h'){
        $scope.intro = $sce.trustAsHtml(converter.makeHtml(item.desc));
      }
      if(item.shortLink == 'YYxOPQSS'){
        $scope.group = $sce.trustAsHtml(converter.makeHtml(item.desc));
      }
      if(item.shortLink == 'cmjOXN2i'){
        $scope.actions[1].content = $sce.trustAsHtml(converter.makeHtml(item.desc));
        if(item.attachments[0]){
          $scope.actions[1].url = item.attachments[0].url;
          $scope.actions[1].url_title = item.attachments[0].name;
        }
      }
      if(item.shortLink == 'Eph7OA64'){
        $scope.actions[2].content = $sce.trustAsHtml(converter.makeHtml(item.desc));
        if(item.attachments[0]){
          $scope.actions[2].url = item.attachments[0].url;
          $scope.actions[2].url_title = item.attachments[0].name;
        }
      }
      if(item.shortLink == 'A7y1NQK1'){
        $scope.actions[3].content = $sce.trustAsHtml(converter.makeHtml(item.desc));
        if(item.attachments[0]){
          $scope.actions[3].url = item.attachments[0].url;
          $scope.actions[3].url_title = item.attachments[0].name;
        }
      }
      if(item.shortLink == 'ykmnOKtA'){
        $scope.actions[4].content = $sce.trustAsHtml(converter.makeHtml(item.desc));
        if(item.attachments[0]){
          $scope.actions[4].url = item.attachments[0].url;
          $scope.actions[4].url_title = item.attachments[0].name;
        }
      }
      if(item.shortLink == 'FcmGQdRN'){
        item.attachments.forEach(function(a){
          $scope.cta.push({
            utl: a.url,
            title: a.name
          });
        })
      }
      if(item.idList == '59c72c49258c6973bb6c6ad1'){
        // 媒體報導
        var news = {
          author: "",
          title : item.name,
          source: "",
          source_img: "",
        }
        item.attachments.forEach(function(a){
          if(a.bytes){
            news.img = a.url;
          }else{
            news.url = a.url;
            news.source = a.name;
          }
        })
        $scope.news.push(news);
      }
    });
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

  $scope.toggleAction =function(i){
    var ms = 500;
    if(!$scope.showAction){
      $scope.showAction = [0,0,0,0,0];
    }
    var sum = $scope.showAction.reduce(function(a,b){
      return a+b;
    }, 0);
    if(sum == 0){
      $scope.showAction[i] = 1;
      return ;
    }
    
    if($scope.showAction[i] == 1){
      $scope.showAction[i] = 0;
      var top = $('#action-section-'+i).offset().top;
      $('body,html').animate({scrollTop: top}, ms);
      
      setTimeout(function(){
      },ms);
    }else{
      $scope.showAction = [0,0,0,0,0];
      var top = $('#action-section-1').offset().top;
      $('body,html').animate({scrollTop: top}, ms);
      setTimeout(function(){
        $scope.showAction[i] = 1;
        var top = $('#action-section-'+i).offset().top;
        $('body,html').animate({scrollTop: top}, ms);
      },ms);
      
    }
  }


  init = function(){
      console.log(1);
      setStaticContent($scope);
      doRouter($scope);
  }

  init();
}]);

// https://codepen.io/MicoTheArtist/pen/gbDlj
// https://stackoverflow.com/questions/30689040/angular-scroll-directive
// https://stackoverflow.com/questions/26588300/scroll-event-in-angularjs
app.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
      scope.header_bg_top = -20/3;
      
        angular.element($window).bind("scroll", function() {
            scope.header_bg_top = (this.pageYOffset-20)/3;
            scope.$apply();
        });
    };
});

// from https://stackoverflow.com/questions/17284005/scrollto-function-in-angularjs
app.directive('scrollOnClick', function() {
  return {
    restrict: 'A',
    link: function(scope, $elm, attrs) {
      var idToScroll = attrs.href;
      $elm.on('click', function() {
        var $target;
        if (idToScroll) {
          $target = $(idToScroll);
        } else {
          $target = $elm;
        }
        $("body").animate({scrollTop: $target.offset().top}, "slow");
      });
    }
  }
});