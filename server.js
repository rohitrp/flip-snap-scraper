var casper = require('casper')
  , flipCasper = casper.create()
  , snapCasper = casper.create()
  , fs = require('fs')
  , flipDone = false
  , snapDone = false
  , product = {
      flipkart: {
        success: false
      },
      snapdeal: {
        success: false
      }
    }
  , search = casper.create().cli.args[0]
  , flipUrl = 'http://www.flipkart.com/search?q=' + search
  , snapUrl = 'http://www.snapdeal.com/search?keyword=' + search
  , resultPath = './data/result.json'

console.log(search)

flipCasper.start(flipUrl, function() { });

flipCasper.waitForSelector('.results #products .product-unit', function() {
  product.flipkart = this.evaluate(function() {    
    var product = {}
    var $product = $('.results #products .product-unit').first()
    
    var getFeatures = function () {
      var features = []
      $($product.find('.pu-usp .text')).each(function() {
        features.push($(this).text())
      })
      return features
    }
    
    product = {
      success : true,
      image   : $product.find('.fk-product-thumb img').attr('src'),
      link    : "http://www.flipkart.com" + $product.find('.fk-product-thumb').attr('href'),
      title   : $product.find('.pu-title a').attr('title').trim(),
      ratings : $product.find('.pu-rating .fk-stars-small').attr('title'),
      reviews : $product.find('.pu-rating').text().replace(/[^0-9]/g, ''),
      price   : $product.find('.pu-price .pu-final span').text(),
      emi     : $product.find('.pu-price .pu-emi').text(),
      features: getFeatures()
    }
    
    return product
  })
  
  if (!Boolean(product.flipkart)) {
    product.flipkart = {
      success : false
    }
  }

}, function() {
  this.echo('Search timed out')
}, 20000)

flipCasper.run(function() {
  this.echo('Flipkart Scraping done')
  flipDone = true
  if (snapDone) {
    fs.write(resultPath, JSON.stringify(product), 'w')
    this.exit('flipCasper')
  }
})

snapCasper.start(snapUrl, function() {})

snapCasper.waitForSelector('#products', function() {
  product.snapdeal = this.evaluate(function() {
    var product = {}
      , $product = $('#products .product-tuple-listing').first()
    
    product = {
      success : true,
      image   : $product.find('.product-tuple-image img').attr('src'),
      link    : $product.find('.product-tuple-image a').attr('href'),
      title   : $product.find('.product-tuple-description p.product-title').text().trim(),
      ratings : $product.find('.rating span').attr('data-rating'),
      reviews : $product.find('.rating p.product-rating-count').text().replace(/[^0-9]/g, ''),
      price   : $product.find('.product-tuple-description .productPrice .product-price').text()
    }
    
    return product
  })
  
  if (!Boolean(product.snapdeal)) {
    product.snapdeal = {
      success : false
    }
  }
  
}, function() {
  this.echo('Search timed out')
}, 20000)

snapCasper.run(function() {
  this.echo('Snapdeal Scraping done')
  snapDone = true
  if (flipDone) {
    fs.write(resultPath, JSON.stringify(product), 'w')
    this.exit('snapCasper')
  }  
})
