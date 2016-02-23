$(function() {

  updateStats();
  setInterval(updateStats, 60000);

  function updateStats() {
    $.ajax({
      url : '/api/v1/get_stats',
      type: 'GET',
      success: function(response) {

        if (!response.error) {
          var usd_last = (response.btc_last * response.usd_price).toString().substr(0,4);
          var usd_prev = response.prev_day * response.usd_price;

          if (usd_prev <= response.btc_last * response.usd_price) {
            $('span.stats-lastprice')
              .html('$' + usd_last + '<i class="glyphicon glyphicon-arrow-up"></i>')
              .css('color', '#64A537');
          } else {
            $('span.stats-lastprice')
              .html('$' + usd_last + '<i class="glyphicon glyphicon-arrow-down"></i>')
              .css('color', '#C1314A');
          }

          var usd_low = (response.btc_low * response.usd_price).toString().substr(0,4);
          $('span.stats-daylow').text('$' + usd_low);

          var usd_high = (response.btc_high * response.usd_price).toString().substr(0,4);
          $('span.stats-dayhigh').text('$' + usd_high);

          if (response.prev_day <= response.btc_last) {
            $('span.stats-btc')
              .html(response.btc_last + '<i class="glyphicon glyphicon-arrow-up"></i>')
              .css('color', '#64A537');
          } else {
            $('span.stats-btc')
              .html(response.btc_last + '<i class="glyphicon glyphicon-arrow-down"></i>')
              .css('color', '#C1314A');
          }

          $('span.stats-btc-usd').text('$' + response.usd_price);

          var hashrate = (response.networkhashps / 1000 / 1000 / 1000 / 1000).toString().substr(0,5) + ' <span class="hidden-xs">Thash/s</span>';
          $('span.stats-hashrate').html(hashrate);
          $('span.stats-blocks').html(numberFormat(response.blocks));
          $('span.stats-difficulty').html(numberFormat(Math.floor(response.difficulty)));
          $('span.stats-time').html('0' + response.average_minutes + ':' + response.average_seconds);
          var ticket_price = response.sbits.toString().substr(0,4);
          $('span.stats-ticketprice').html(ticket_price + ' <span class="hidden-xs">DCR</span>');
          $('span.stats-poolsize').html(numberFormat(response.poolsize));
          $('span.stats-mempool').html(numberFormat(response.pooledtx));
          var avg_fee = response.fees ? response.fees.toString().substr(0,6) : 0.05;
          var max_fee = response.max_fees ? response.max_fees.toString().substr(0,6) : 0.05;
          $('span.stats-fees').html(avg_fee + ' <span class="hidden-xs">DCR</span>');

          /***** Hints blocks *****/
          /* PoS tickets */
          var html = '';
          if (response.sbits <= 3) {
            html = '<div class="hint hint-red"><h4>Time to buy PoS tickets</h4> <p>The current ticket price <b>'+ticket_price+' DCR</b> is very close to all time low. <br> Hurry to take the best price.</p></div>';
          } else {
            html = '<div class="hint hint-red"><h4>Don\'t buy new PoS tickets right now</h4> <p>The current ticket price <b>'+ticket_price+' DCR</b> is very high, compering with all time low value 2DCR. <br> We suggest to wait for the next PoS-difficulty adjustment.</p></div>';
          }
          $('div.hint-pos').html(html);
          /* Mempool fees */
          $('b.avg_fee').html(avg_fee + ' DCR');
          $('b.max_fee').html(max_fee + ' DCR');
        }
      }
    });
  };
});


$(function () {
    $.ajax({
      url: '/api/v1/pos',
      type: 'GET',
      dataType: "json",
      success: function (data) {
        drawPoolsize(data.poolsize);
        drawSbits(data.sbits);
      }
    });

    setTimeout(function(){
      $('.highcharts-button').remove();
      $("text:contains(Highcharts.com)").remove();
    }, 2000);
});

function numberFormat(number) {
    return number.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
}
