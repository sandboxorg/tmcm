requirejs.config({
    "baseUrl": "js/lib",
    "paths": {
      "app": "../app"
    }
});

requirejs(["jquery"]);
requirejs(["json2"]);
requirejs(["underscore"]);
requirejs(["backbone"]);
requirejs(["backbone.localStorage"]);
requirejs(["app/todos"]);