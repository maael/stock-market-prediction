$(function() {
    /* Autofocus relying on markitondemand api */
    $("#symbolsearch")
    .focus()
    .autocomplete({
        source: function(request,response) {
            $.ajax({
                beforeSend: function(){ 
                    $('.confirmPrompt').fadeOut('fast');
                    $('.loading').fadeIn('fast');
                },
                url: "http://dev.markitondemand.com/api/v2/Lookup/jsonp",
                dataType: "jsonp",
                data: {
                    input: request.term
                },
                success: function(data) {
                    response( $.map(data, function(item) {
                        return {
                            label: item.Name + " (" +item.Exchange+ ")",
                            value: item.Symbol
                        }
                    }));
                    $('.loading').fadeOut('fast');
                }
            });
        },
        minLength: 0,
        select: function( event, ui ) {
            $('.confirmPrompt').data('symbol', ui.item.value);
            $('.confirmPrompt').data('label', ui.item.label);
            $(this).val(ui.item.value + ' | ' + ui.item.label);
            $('.confirmPrompt').fadeIn('fast');
            $(this).blur();
            return false;
        },
        open: function( event, ui ) {
            $('.confirmPrompt').fadeOut('fast');
        }
    });
    /* Remove companies before adding them */
    $('body').on('click', '.confirmPrompt', function() { 
        $("#symbolsearch").val('');
        var symbol = $(this).data('symbol'),
            label = $(this).data('label'),
            name = label.split('(')[0],
            market = label.split('(')[1];
            market = market.substring(0, market.length - 1);
        post('/api/user/company', {name: name, symbol: symbol, market: market});
        $('.companies tbody').append('<tr data-href=/companies/"' + symbol + '" class="company"><td>' + symbol + '</td><td>' + name + '</td><td>' + market + '</td><td></td></tr>');
        $(this).fadeOut('fast');
    });
    /* Link table rows to company pages */
    $('body').on('click', '.company', function() {
        if($(this).data('href') !== undefined){
            document.location = $(this).data('href');
        }
    });
});