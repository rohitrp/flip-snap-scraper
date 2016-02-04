var testData = {
  "success": true,
  "products": {
    "flipkart": {
      "success": true,
      "emi": "EMI from Rs. 1,019 ",
      "features": ["Android v6 OS", "12.3 MP Primary Camera", "5MP Secondary Camera", "Single SIM 4G LTE"],
      "image": "http://img5a.flixcart.com/image/mobile/w/2/z/lg-nexus-5x-lgh791-125x125-imaecgqk6yswfrju.jpeg",
      "link": "http://www.flipkart.com/nexus-5x/p/itmecjyntncgqkpd?pid=MOBECEJDNGVZHUFT&ref=L%3A630786360414850356&srno=p_1&query=nexus+5&otracker=from-search",
      "price": "Rs. 20,999",
      "ratings": "4 stars",
      "reviews": "62",
      "title": "Nexus 5X (Carbon, 16 GB)"
    },
    "snapdeal": {
      "success": true,
      "image": "http://n2.sdlcdn.com/imgs/a/j/u/198x232/LG-Google-Nexus-5-32-SDL927497489-1-6af39.jpg",
      "link": "http://www.snapdeal.com/product/lg-google-nexus-5-32/562698690#bcrumbSearch:nexus%205",
      "price": "Rs.  26,899",
      "ratings": "4.3",
      "reviews": "3348",
      "title": "LG Google Nexus 5 4G 32GB White"
    }
  }
};

var container =
  `
      <div class="container">
        <div class="image">
        </div>
        <div class="price">
          <h4></h4>
        </div>
        <div class="title">
          <a target="_blank"><h3></h3></a>
        </div>
        <div class="ratings">
          <span></span>
        </div>
        <div class="reviews">
          <span></span>
        </div>
      </div>
      `;

$(document).ready(function () {
  $('.loading').hide();
  $('.products').hide();
  $('.error').hide();

  function getResults() {
    $('.products').hide();
    $('.products .container').remove();
    $('.flipkart, .snapdeal').removeClass('winner loser');
    $('.error').hide();
    $('.loading').show();

    var search = $('#search-input').val();

    var flipSort, snapSort;
    
    switch ($('input:checked').attr('value')) {
      case '2':
        flipSort = 'popularity';
        snapSort = 'plrty';
        break;
      case '3':
        flipSort = 'price_desc';
        snapSort = 'phtl';
        break;
      case '4':
        flipSort = 'price_asc';
        snapSort = 'plth';
        break;
      default:
        flipSort = 'relevance';
        snapSort = 'rlvncy';
    }
    
    console.log(flipSort, snapSort);
    
    $.ajax({
      url: '/scrape?q=' + search + '&flipSort=' + flipSort + '&snapSort=' + snapSort,
      dataType: 'json',
      complete: function (res, status) {
        $('#loading').hide()
      },
      success: function (data) {
        console.log(data)

        if (data.success) {
          $('.products .flipkart, .products .snapdeal').append(container);

          var flipkart = data.results.flipkart.products[0],
            snapdeal = data.results.snapdeal.products[0],
            $flipkart = $('.products .flipkart'),
            $snapdeal = $('.products .snapdeal')

          if (data.results.flipkart.success) {
            $('.flipkart-error').hide()
            $('.flipkart .container').show()

            $flipkart.find('.image').css('background-image', 'url(' + flipkart.image + ')');
            $flipkart.find('.price h4').text(flipkart.price);
            $flipkart.find('.title a').attr('href', flipkart.link);
            $flipkart.find('.title h3').text(flipkart.title);
            $flipkart.find('.ratings span').html("&#127775; " + (flipkart.ratings || "0").replace(/[^0-9]/g, ''));
            $flipkart.find('.reviews span').text((flipkart.reviews || "0") + " reviews");
          } else {
            $('.flipkart-error').show()
            $('.flipkart .container').hide()
          }

          if (data.results.snapdeal.success) {
            $('.snapdeal-error').hide()
            $('.snapdeal .container').show()

            $snapdeal.find('.image').css('background-image', 'url(' + snapdeal.image + ')');
            $snapdeal.find('.price h4').text(snapdeal.price);
            $snapdeal.find('.title a').attr('href', snapdeal.link);
            $snapdeal.find('.title h3').text(snapdeal.title);
            $snapdeal.find('.ratings span').html("&#127775; " + (snapdeal.ratings || "0"));
            $snapdeal.find('.reviews span').text((snapdeal.reviews || "0") + " reviews");

          } else {
            $('.snapdeal-error').show()
            $('.snapdeal .container').hide()
          }

          $('.products').show();

          compare($flipkart, $snapdeal, data);
        } else {
          $('.error').show()
        }
      },
      error: function (res) {
        $('.error').show();
      }
    })
  }

  function compare($flipkart, $snapdeal, data) {
    var flipScore = 0,
      snapScore = 0,
      flipPrice = data.results.flipkart.price || '999999999',
      snapPrice = data.results.snapdeal.price || '999999999',
      flipRatings = data.results.flipkart.ratings || '0',
      snapRatings = data.results.snapdeal.ratings || '0',
      flipReviews = data.results.flipkart.reviews || '0',
      snapReviews = data.results.snapdeal.reviews || '0'

    if (+flipPrice.replace(/[^0-9]/g, '') < +snapPrice.replace(/[^0-9]/g, '')) {
      $flipkart.find('.price').addClass('winner')
      $snapdeal.find('.price').addClass('loser')
      flipScore++;
    } else {
      $snapdeal.find('.price').addClass('winner')
      $flipkart.find('.price').addClass('loser')
      snapScore++;
    }

    if (+flipRatings.replace(/[^0-9.]+/g, '') > +snapRatings.replace(/[^0-9.]+/g, '')) {
      $flipkart.find('.ratings').addClass('winner')
      $snapdeal.find('.ratings').addClass('loser')
      flipScore++;
    } else {
      $snapdeal.find('.ratings').addClass('winner')
      $flipkart.find('.ratings').addClass('loser')
      snapScore++;
    }

    if (+flipReviews.replace(/[^0-9]+/g, '') > +snapReviews.replace(/[^0-9]+/g, '')) {
      $flipkart.find('.reviews').addClass('winner')
      $snapdeal.find('.reviews').addClass('loser')
      flipScore++;
    } else {
      $snapdeal.find('.reviews').addClass('winner')
      $flipkart.find('.reviews').addClass('loser')
      snapScore++;
    }

    $flipkart.addClass(flipScore > snapScore ? "winner" : "loser");
    $snapdeal.addClass(flipScore > snapScore ? "loser" : "winner");
  };

  $('#search-input').keyup(function (e) {
    adjustSearchBar();
  });

  $(document).keypress(function (e) {
    $('#search-input').focus();
    adjustSearchBar();

    if (e.which == 13) {
      getResults()

      return false
    }
  });
  
  $('.sortby input').click(function() {
    if ($('#search-input').val() !== '') getResults();
  });
  
  function adjustSearchBar() {
    var width = "300px";
    var borderColor = "#fff";

    if ($("#search-input").val() == "") {
      width = "0px";
      borderColor = "transparent";
    }

    $('#search-input').css('width', width);
    $('#search-input').css('border-color', borderColor);
  };

  $('.search i').click(function () {
    $('#search-input').css('width', '300px');
    $('#search-input').css('border-color', '#fff');
    $('#search-input').focus();

    if ($('#search-input').val() != '') getResults();
  });

  $('html').click(function (e) {
    var target = $(e.target)
    if (!target.is($(".search i")) && !target.is($('#search-input'))) {
      adjustSearchBar();
    }
  })
});
