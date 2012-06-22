
function initPlugin(servicios, clientes, usuarios){
	$("#searchBox").onesearchbox({
		allLabel: "Todos",
		tags: "#tags",
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
			},
			single: true
		},{
			name: "Usuarios",
			color: "#C64FD6",
			items: usuarios,
			fields: {
				id: "id",
				label: "apellido"
			}
		}],
		added: function(category, id){
			if (category === "Clientes") {
		 		$("#searchBox")
		 			.onesearchbox("clear", ["Servicios"])
		 			.onesearchbox("rebind", {
						name: "Servicios",
						items: [servicios[0], servicios[1]]
					});
		 	}
		},
		removed: function(category){
			if (category === "Clientes") {
		 		$("#searchBox")
		 			.onesearchbox("clear", ["Servicios"])
		 			.onesearchbox("rebind", {
						name: "Servicios",
						items: servicios
					});
		 	}
		}
  });
}

$(document).ready(function(){
    getData();
    
    $("#showSelections").click(function(){
    	 var categoriesSelected = $("#searchBox").onesearchbox("selection");
    	 console.dir(categoriesSelected);
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

