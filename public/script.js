var data = {
  "products": {
    "flipkart": {
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
      "image": "http://n2.sdlcdn.com/imgs/a/j/u/198x232/LG-Google-Nexus-5-32-SDL927497489-1-6af39.jpg",
      "link": "http://www.snapdeal.com/product/lg-google-nexus-5-32/562698690#bcrumbSearch:nexus%205",
      "price": "Rs.  26,899",
      "ratings": "4.3",
      "reviews": "3348",
      "title": "LG Google Nexus 5 4G 32GB White"
    }
  }
};

$(document).ready(function () {
  $('.loading').hide();
  $('.products').hide();
  $('.error').hide();
  
  function getResults() {
    $('.products').hide();
    
    $('.loading').show();
    var search = $('#search-input').val();

    $.ajax({
      url: '/scrape?q=' + search,
      dataType: 'json',
      complete: function (res, status) {
        $('.search .loading').hide()
      },
      success: function (data) {
        var flipkart = data.products.flipkart,
          snapdeal = data.products.snapdeal,
          $flipkart = $('.products .flipkart'),
          $snapdeal = $('.products .snapdeal')

        $flipkart.find('.image').css('background-image', 'url('+flipkart.image+')');
        $flipkart.find('.price h4').text(flipkart.price);
        $flipkart.find('.image img').attr('alt', flipkart.title);
        $flipkart.find('.title a').attr('href', flipkart.link);
        $flipkart.find('.title h3').text(flipkart.title);
        $flipkart.find('.ratings span').html("&#127775; " + flipkart.ratings.replace(/[^0-9]/g, ''));
        $flipkart.find('.reviews span').text(flipkart.reviews + " reviews");

        $snapdeal.find('.image').css('background-image', 'url('+snapdeal.image+')');
        $snapdeal.find('.price h4').text(snapdeal.price);
        $snapdeal.find('.image img').attr('alt', snapdeal.title);
        $snapdeal.find('.title a').attr('href', snapdeal.link);
        $snapdeal.find('.title h3').text(snapdeal.title);
        $snapdeal.find('.ratings span').html("&#127775; " + snapdeal.ratings);
        $snapdeal.find('.reviews span').text(snapdeal.reviews + " reviews");
        
        $('.products').show();
        
        compare($flipkart, $snapdeal);
      },
      error: function (res) {        
        $('.error').show();
      }
    })
  }

  function compare($flipkart, $snapdeal) {
    
  }
  
  $('input').keypress(function (e) {
    if (e.which == 13) {
      getResults()

      return false
    }
  })

  function adjustSearchBar() {
    var width = "300px";
    var borderColor = "#3F51B5";

    if ($("#search-input").val() == "") {
      width = "0px";
      borderColor = "#fff";
    }

    $('#search-input').css('width', width);
    $('#search-input').css('border-color', borderColor);
  };

  $('.search i').click(function () {
    $('#search-input').css('width', '300px');
    $('#search-input').css('border-color', '#3F51B5');
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
