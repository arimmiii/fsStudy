var express = require("express");
//express가 갖고 있는 Router라는 메소드를 호출해 router 리턴받음
var router = express.Router();

var template = require("../lib/template.js");
var qs = require("querystring");

router.get("/", (request, response) => {
  var title = "Welcome";
  var description = "Hello, Node.js";
  var list = template.list(request.list);
  var html = template.HTML(
    title,
    list,
    `
    <h2>${title}</h2>${description}
    <img src='/images/cat.jpg' style="width:300px; display:block; margin-top:10px;">
    `,
    `<a href="/topic/create">create</a>`,
  );
  response.send(html);
});

module.exports = router;
