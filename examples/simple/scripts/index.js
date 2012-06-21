
function initPlugin(servicios, clientes, usuarios){
	$("#searchBox").onesearchbox({
		allLabel: "Todos",
		tags: "",
		categories: [{
			name: "Servicios",
			color: "#B6D64F",
			items: servicios,
			fields: {
				id: "id",
				label: "descripcion"
			}
		},{
			name: "Clientes",
			color: "#4FD6D1",
			items: clientes,
			fields: {
				id: "id",
				label: "nombre"
			}
		},{
			name: "Usuarios",
			color: "#C64FD6",
			items: usuarios,
			fields: {
				id: "id",
				label: "apellido"
			}
		}]
  });
}

$(document).ready(function(){
    
    getData();
    
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

function getData(){
    var servicioDef = $.Deferred(),
    clienteDef = $.Deferred(),
    usuarioDef = $.Deferred();

    $.when(servicioDef, clienteDef, usuarioDef).done(initPlugin);
    
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