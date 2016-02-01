$(document).ready(function () {
  $('.loading').hide();

  function getResults() {
    $('.loading').show()
    var search = $(this).val()
    $('body').append("<h1>searching " + search + "</h1>")
    
    $.ajax({
      url: '/scrape?q=' + search,
      dataType: 'json',
      complete: function (res, status) {
        $('.search .loading').hide()
      },
      success: function (data) {
        $('body').append("<p>" + JSON.stringify(data) + "</p>")
      },
      error: function (res) {
        $('body').append('<h1>ERROR</h1>')
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
