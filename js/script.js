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
          word_image: "https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c12e11e814ab9ad6d3d9f3/2e23d292402b5557c505125839c04650/%E7%9C%8B%E8%A6%8B.png",
          img : 'https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c22f00597fbf473c4cbaeb/5d7d3798b6bc51d94d549c81ed217afa/%E9%BB%83%E5%AD%90%E6%98%8E_%E7%84%A1%E5%AE%B6%E8%80%85_(2).jpg',
          title : '看見',
    }
    $scope.actions[2] = {
          word_image: "https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c12e1bb1b2cc15416f648e/a922d9232f0d5e1f9043d7138ab6d405/%E9%AB%94%E9%A9%97%E6%96%87%E5%AD%97.png",
          img : 'https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c22f00597fbf473c4cbaeb/dcf49a92ec0c6dd51c5a313370b01f31/%E6%9E%97%E7%92%9F%E7%91%8B_10_20150223_8435-Good-1-Print%E8%BF%91%E5%8F%B0%E5%8C%97101%E6%9F%90%E8%99%95%E5%B8%82%E5%A0%B4.jpg',
          title : '體驗',
        }
              $scope.actions[3] = {
          word_image: "https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c12e2d38ddfae2d8046f5b/586813c36a71a8241b735398036e8a02/%E8%81%86%E8%81%BD.png",
          img : 'https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c22f00597fbf473c4cbaeb/1af33ba14dedce749bd561d8093a2be0/%E8%8A%92%E8%8D%89%E5%BF%83_%E5%8B%9E%E5%8B%95_(9).jpg',
          title : '聆聆',
        }
              $scope.actions[4] = {
          word_image:"https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c12e30a9bc5f7acfa9da36/8eaacb7e5189e5774cfc5b1d869d3253/%E5%9C%98%E7%B5%90%E6%96%87%E5%AD%97.png",
          img : 'https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c22f00597fbf473c4cbaeb/646bf59a3eba76bef7ad05c60e2196b5/%E5%90%B3%E6%89%BF%E7%B4%98_%E7%94%9F%E6%B4%BB_(10).jpg',
          title : '團結',
        }
    $scope.news = [];
    $scope.news[0] = {
      img : "https://trello-attachments.s3.amazonaws.com/59bbde47c615354494cbff80/59c3a4885938ed7af0fb2506/33ef73b7be35c4ac16a0edc8b1544832/image.png",
      url : "https://www.twreporter.org/a/opinion-project-inadequate2017",
      title : "巫彥德／不只是飢餓而已—體驗貧窮者的流浪",
      source : "報導者",
      source_img : "",
    }
  }

  setContent = function($scope){
    var converter = new showdown.Converter();
    $scope.myData.cards.forEach(function(item){
      if(item.shortLink == 'JYvozS7h'){
        $scope.info = $sce.trustAsHtml(converter.makeHtml(item.desc));
      }
      if(item.shortLink == 'YYxOPQSS'){
        $scope.main = $sce.trustAsHtml(converter.makeHtml(item.desc));
      }
      if(item.shortLink == 'cmjOXN2i'){
        $scope.actions[1].content = $sce.trustAsHtml(converter.makeHtml(item.desc));
      }
      if(item.shortLink == 'A7y1NQK1'){
        $scope.actions[2].content = $sce.trustAsHtml(converter.makeHtml(item.desc));
      }
      if(item.shortLink == 'Eph7OA64'){
        $scope.actions[3].content = $sce.trustAsHtml(converter.makeHtml(item.desc));
      }
      if(item.shortLink == 'ykmnOKtA'){
        $scope.actions[4].content = $sce.trustAsHtml(converter.makeHtml(item.desc));
      }
      if(item.shortLink == 'FcmGQdRN'){
        $scope.cta = {
          utl: item.attachments[0].url,
          title: item.attachments[0].name
        }
      }
    });
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
    if(!$scope.showAction){
      $scope.showAction = [0,0,0,0,0];
    }
    if($scope.showAction[i] == 1){
      $scope.showAction[i] = 0;
    }else{
      $scope.showAction = [0,0,0,0,0];
      $scope.showAction[i] = 1;  
    }
  }


  init = function(){
      console.log(1);
      setStaticContent($scope);
      doRouter($scope);
      doUpdateFromBoardJson();
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