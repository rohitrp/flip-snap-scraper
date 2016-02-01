$(document).ready(function () {
  $('.loading').hide();
  $('.products').hide()
  function getResults() {
    $('.products').hide()
    
    $('.loading').show()
    var search = $('#search-input').val()

    $.ajax({
      url: '/scrape?q=' + search,
      dataType: 'json',
      complete: function (res, status) {
        $('.search .loading').hide()
      },
      success: function (data) {
        console.log(data)
        var flipkart = data.products.flipkart,
          snapdeal = data.products.snapdeal,
          $flipkart = $('.products .flipkart'),
          $snapdeal = $('.products .snapdeal')

        $flipkart.find('.image').css('background-image', 'url('+flipkart.image+')')
        $flipkart.find('.price h4').text(flipkart.price)
        $flipkart.find('.image img').attr('alt', flipkart.title)
        $flipkart.find('.title a').attr('href', flipkart.link)
        $flipkart.find('.title h3').text(flipkart.title)
        $flipkart.find('.ratings span').html(flipkart.ratings + " &#127775;")
        $flipkart.find('.reviews span').text(flipkart.reviews + " reviews")

        $snapdeal.find('.image').css('background-image', 'url('+snapdeal.image+')')
        $snapdeal.find('.price h4').text(snapdeal.price)
        $snapdeal.find('.image img').attr('alt', snapdeal.title)
        $snapdeal.find('.title a').attr('href', snapdeal.link)
        $snapdeal.find('.title h3').text(snapdeal.title)
        $snapdeal.find('.ratings span').html(snapdeal.ratings + " &#127775;")
        $snapdeal.find('.reviews span').text(snapdeal.reviews + " reviews")
        
        $('.products').show()
      },
      error: function (res) {
        $('body').append('<h1>Error</h1>')
      }
    })
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
    $('#search-input').css('width', '300px')
    $('#search-input').css('border-color', '#3F51B5')
    $('#search-input').focus()

    if ($('#search-input').val() != '') getResults()
  })

  $('html').click(function (e) {
    var target = $(e.target)
    if (!target.is($(".search i")) && !target.is($('#search-input'))) {
      adjustSearchBar();
    }
  })
});
