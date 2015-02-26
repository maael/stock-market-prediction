$(function() {
    $("#symbolsearch")
    .focus()
    .autocomplete({
        source: function(request,response) {
            $.ajax({
                beforeSend: function(){ 
                    $("span.help-inline").show();
                    $("span.label-info").empty().hide();
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
                    $("span.help-inline").hide();
                }
            });
        },
        minLength: 0,
        select: function( event, ui ) {
            var companyString = "<div class='companyToAdd' data-symbol='" + ui.item.value + "'>" + ui.item.label + "</div>";
            $(".companiesToAdd").append(companyString).fadeIn("fast");
            $(this).val('');
            return false;
        }
    });
});