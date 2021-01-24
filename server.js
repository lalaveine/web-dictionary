var fs = require("fs");
var http = require("http");
var https = require("https");
var querystring = require("querystring");

var dictionary = null;

var buildHtml = (dict_entry) => {
  var header = dict_entry["word"];
  var body = "<p>Слово: " + dict_entry["word"] + "</p>";
  body += "<p>Значение: " + dict_entry["meaning"] + "</p>";
  tranlation_string =
    dict_entry["english"].length > 1
      ? dict_entry["english"].join(", ")
      : dict_entry["english"];
  body += "<p>Перевод: " + tranlation_string + "</p>";
  related_words = [];
  for (const item in dict_entry["related"]) {
    related_words.push(
      `<a href="/${dict_entry["related"][item].replace(" ", "_")}">${
        dict_entry["related"][item]
      }</a>`
    );
  }
  body += "<p>Связи: " + related_words.join(", ") + "</p>";
  // body += "<p>Источник: " + dict_entry["resource"] + "</p>";
  body += `<p>Источник: <a href="https://${dict_entry["resource"]}">${dict_entry["resource"]}</a></p>`;
  return (
    "<!DOCTYPE html>\n" +
    "<html>\n<head><title>" +
    header +
    "</title></head>\n<body>" +
    body +
    "</body>\n</html>"
  );
};

var dictionaryHandler = (request, response) => {
  var query = querystring.unescape(request.url);

  if (query == "/readyz") {
    if (dictionary) {
      response.writeHead(200);
      response.end("OK");
    } else {
      response.writeHead(404);
      response.end("Not Loaded");
    }
    return;
  }

  var key = "";
  if (query.length > 0) {
    key = query.substr(1).toUpperCase();
  }
  console.log(key);
  var def = dictionary[key];

  if (!def) {
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    response.end(key + " was not found");
    return;
  }
  response.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
  });
  // response.end(JSON.stringify(def));
  response.end(buildHtml(def));
};

var downloadDictionary = (url, file, callback) => {
  var stream = fs.createWriteStream(file);
  var req = https
    .get(url, function (res) {
      res.pipe(stream);
      stream.on("finish", function () {
        stream.close(callback);
        console.log("dictionary downloaded");
      });
    })
    .on("error", function (err) {
      fs.unlink(file);
      if (callback) cb(err.message);
    });
};

var loadDictionary = (file, callback) => {
  fs.readFile(file, (err, data) => {
    if (err) {
      console.log(err);
      callback(err);
      return;
    }
    dictionary = JSON.parse(data);
    console.log("dictionary loaded.");
    callback();
  });
};

downloadDictionary(
  "https://raw.githubusercontent.com/lalaveine/web-dictionary/master/dictionary/dictionary-fortmated.json",
  "dictionary.json",
  (err) => {
    if (err) {
      console.log(err);
      return;
    }
    loadDictionary("dictionary.json", (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("ready to serve");
    });
  }
);

const server = http.createServer(dictionaryHandler);

server.listen(8080, (err) => {
  if (err) {
    return console.log("error starting server: " + err);
  }

  console.log("server is listening on 8080");
});
