var express = require('express')
  , fs = require('fs')
  , exec = require('child_process').exec
  , app = express()
  , request = require('request')
  , url = require('url')
  , port = process.env.PORT || 5000

app.use('/', express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/public/index.html')
})

app.get('/scrape', function (req, res) {
  var searchQuery = url.parse(req.url, true).query.q.replace(' ', '+')
//  fs.unlink('./result.json')
  exec('casperjs server.js ' + searchQuery, function(err, stdout, stderr) {
    if (err) {
      console.log(err)
      res.json({
        "success" : false
      })
    }
    else {
      var results = JSON.parse(fs.readFileSync(__dirname + '/data/result.json', 'utf8'))

      res.json({
        "success" : true,
        "products": results
      })
    }
  })
})

app.listen(port)