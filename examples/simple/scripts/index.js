
$.widget( "custom.searchBox", $.ui.autocomplete, {
    _renderMenu: function( ul, items ) {
        var self = this,
        currentCategory = "";
        
        $.each( items, function( index, item ) {
            
            if ( item.category != currentCategory ) {
                currentCategory = item.category;
            }
            
            ul.addClass('ui-autocomplete-searchBox');
            self._renderItem( ul, item );
        });
    },
    _renderItem: function( ul, item ) {
        return $( "<li></li>" )
        .data( "item.autocomplete", item )
        .append("<a><div class='categoria " + item.category + "'>" + item.category + "</div><div class='etiqueta'>" + item.label + "</div></a>")
        .appendTo( ul );
    }
});

var getData = function (callback){
    var servicioDef = $.Deferred(),
    clienteDef = $.Deferred(),
    usuarioDef = $.Deferred();

    var mergeLists = function(servicios, clientes, usuarios){
        getData["all"] = [];
        getData["clientes"] = [];
        getData["servicios"] = [];
        getData["usuarios"] = [];

        for(var i = 0; i < servicios.length; i++){
            getData["servicios"].push({
                id: servicios[i].id,
                label: servicios[i].descripcion,
                category: "Servicios"
            });
        }
        
        for(var i = 0; i < clientes.length; i++){
            getData["clientes"].push({
                id: clientes[i].id,
                label: clientes[i].nombre,
                category: "Clientes"
            });
        }

        for(var i = 0; i < usuarios.length; i++){
            getData["usuarios"].push({
                id: usuarios[i].id,
                label: usuarios[i].apellido + ', ' + usuarios[i].nombre,
                category: "Usuarios"
            });
        }
        
        getData["all"] = getData["servicios"].concat(getData["clientes"], getData["usuarios"]);
        
        callback();
    }
        
    $.when(servicioDef, clienteDef, usuarioDef).done(mergeLists);
    
    $.getJSON('data/servicios.json', function (_servicios) {
        servicioDef.resolve(_servicios);
    });
    
    $.getJSON('data/clientes.json', function (_clientes) {
        clienteDef.resolve(_clientes);
    });
    
    $.getJSON('data/usuarios.json', function (_usuarios) {
        usuarioDef.resolve(_usuarios);
    });
}

$(document).ready(function(){
    
    getData(function(){
        
        $("#searchBox").searchBox({
            delay: 0,
            source: getData["all"],
            select: function( event, ui ) {
                var tag = $("<li>" + ui.item.label + "<a href='#' class='close'>x</a></li>")
                .addClass(ui.item.category);
                    
                $("#tags").append(tag);
                $("#searchBox").val("");
                return false;
            }
        });
        
        $('#searchBox-categories').combobox({
            selected: function (e){
                var v = $('#searchBox-categories').val();
                $("#searchBox").searchBox("option" , "source" , getData[v]);
            }
        })
        .change(function(e){
            var v = $('#searchBox-categories').val();
            $("#searchBox").searchBox("option" , "source" , getData[v]);
        })
        .next('span.ui-combobox').find('input')
        .attr('readonly', 'readonly')
        .removeClass('ui-corner-left');
      
    });    
    
    $("a.close", "#tags").live('click', function(){
        $(this).parents('li').remove();
    });
    
    $("li", "#tags").live('mouseenter', function(){
        var lis = $(this).parents('ul').children('li');
        var cl = $(this).attr('class');
        lis.not('.' + cl).stop(true).animate({opacity: 0.2},500);
    });
    
    $("li", "#tags").live('mouseleave', function(){
        var lis = $(this).parents('ul').children('li');
        var cl = $(this).attr('class');
        lis.not('.' + cl).stop(true).animate({opacity: 1},500);
    });
    
});


