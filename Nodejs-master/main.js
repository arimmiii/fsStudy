const port = 3000;
//express 모듈을 로드해옴
var express = require("express");
//express 함수를 호출해 app이란 객체를 만든다
var app = express();
//fs(File System) 모듈 로드
var fs = require("fs");

var bodyParser = require("body-parser");
var compression = require("compression");

var indexRouter = require("./routes/index");
var topicRouter = require("./routes/topic");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

//get 방식 요청에 대해서만 동작하는 미들웨어
app.use(function (request, response, next) {
  fs.readdir("./data", function (error, filelist) {
    request.list = filelist;
    next();
  });
});

app.use("/", indexRouter);
//topic으로 시작하는 주소들에게 topicRouter라는 미들웨어를 사용하겠다
app.use("/topic", topicRouter);

app.use((req, res, next) => {
  res.status(404).send("Sorry cant find that!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

//listen이 실행되며 웹 서버가 실행되기 시작
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

/*
var http = require('http');
var url = require('url');
var qs = require('querystring');


var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
       
      } else {
        
      }
    } else if(pathname === '/create'){
      
    } else if(pathname === '/create_process'){
      
    } else if(pathname === '/update'){
      
    } else if(pathname === '/update_process'){
      
    } else if(pathname === '/delete_process'){
      
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
*/
