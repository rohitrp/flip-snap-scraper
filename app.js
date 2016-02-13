var express = require('express')
  , fs = require('fs')
  , exec = require('child_process').exec
  , app = express()
  , request = require('request')
  , url = require('url')
  , port = process.env.PORT || 5000

app.use('/', express.static(__dirname + '/public'))
app.use('/data', express.static(__dirname + '/data'))

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/public/index.html')
})

app.get('/scrape', function (req, res) {

  var args = url.parse(req.url, true).query
    , searchQuery = args.q.replace(/[ ]+/g, '+')
    , flipSort = args.flipSort
    , snapSort = args.snapSort
  console.log(searchQuery)
  exec('casperjs server.js ' + searchQuery + ' ' + flipSort + ' ' + snapSort, function(err, stdout, stderr) {
    if (err) {
      console.log(err)
      res.json({
        "success" : false
      })
    }
    else {
      var results = JSON.parse(fs.readFileSync(__dirname + '/data/result.json', 'utf8'))

      res.json({
        "success" : results.flipkart.success || results.snapdeal.success,
        "results": results
      })
    }
  })
})

app.listen(port, function() {
  console.log("Listening at port " + port + "...")
})