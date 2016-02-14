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
  , flipSort = casper.create().cli.args[1]
  , snapSort = casper.create().cli.args[2]
  , flipUrl = 'http://www.flipkart.com/search?p%5B%5D=sort%3D' + flipSort + '&q=' + search
  , snapUrl = 'http://www.snapdeal.com/search?keyword=' + search + '&sort=' + snapSort
  , resultPath = './data/result.json'

flipCasper.start(flipUrl, function() { });

flipCasper.waitForSelector('.results #products .product-unit', function() {
  product.flipkart = this.evaluate(function() {    
    var products = []
    
    $('.results #products .product-unit').each(function() {
      
//      var getFeatures = function($this) {
//        var features = []
//        $($this.find('.pu-usp .text')).each(function() {
//          features.push($this.text().replace(/\n+/g, ''))
//        })
//        return features
//      }

      var product = {
        image   : $(this).find('.fk-product-thumb img').attr('src'),
        link    : "http://www.flipkart.com" + $(this).find('.fk-product-thumb').attr('href'),
        title   : $(this).find('.pu-title a').attr('title').trim(),
        ratings : $(this).find('.pu-rating .fk-stars-small').attr('title'),
        reviews : $(this).find('.pu-rating').text().replace(/[^0-9]/g, ''),
        price   : $(this).find('.pu-price .pu-final span').text()
//        emi     : $(this).find('.pu-price .pu-emi').text(),
//        features: getFeatures($(this))
      }

      products.push(product)
    })
    
    return { products : products }
  })
    
  if (!Boolean(product.flipkart)) {
    product.flipkart = {
      success : false,
      products: []
    }
  } else {
    product.flipkart.success = true
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
    var products = []
    
    $('#products .product-tuple-listing').each(function() {
      
      var product = {
        image: $(this).find('.product-tuple-image img').attr('src'),
        link: $(this).find('.product-tuple-image a').attr('href'),
        title: $(this).find('.product-tuple-description p.product-title').text().trim(),
        ratings: $(this).find('.rating span').attr('data-rating'),
        reviews: $(this).find('.rating p.product-rating-count').text().replace(/[^0-9]/g, ''),
        price: $(this).find('.product-tuple-description .productPrice .product-price').text()
      }

      products.push(product)
    })
    
    return { products: products }
    
  })
    
  if (!Boolean(product.snapdeal)) {
    product.snapdeal = {
      success : false,
      products: []
    }
  } else {
    product.snapdeal.success = true
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
