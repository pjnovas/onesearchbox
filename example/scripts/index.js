
function initPlugin(services, customers, users){
	$("#searchBox").onesearchbox({
		allLabel: "All",
		tags: "#tags",
		categories: [{
			name: "Services",
			color: "#B6D64F",
			items: services,
			fields: {
				id: "id",
				label: "description"
			}
		},{
			name: "Customers",
			color: "#4FD6D1",
			items: customers,
			fields: {
				id: "id",
				label: "name"
			},
			single: true
		},{
			name: "Users",
			color: "#C64FD6",
			items: users,
			fields: {
				id: "id",
				label: "userName"
			}
		}],
		added: function(category, id){
			if (category === "Customers") {
		 		$("#searchBox")
		 			.onesearchbox("clear", ["Services"])
		 			.onesearchbox("rebind", {
						name: "Services",
						items: [services[0], services[1]]
					});
		 	}
		},
		removed: function(category){
			if (category === "Customers") {
		 		$("#searchBox")
		 			.onesearchbox("clear", ["Services"])
		 			.onesearchbox("rebind", {
						name: "Services",
						items: services
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
    var serviceDef = $.Deferred(),
    customerDef = $.Deferred(),
    userDef = $.Deferred();

    $.when(serviceDef, customerDef, userDef).done(initPlugin);
    
    $.getJSON('data/services.json', function (_services) {
        serviceDef.resolve(_services);
    });
    
    $.getJSON('data/customers.json', function (_customers) {
        customerDef.resolve(_customers);
    });
    
    $.getJSON('data/users.json', function (_users) {
        userDef.resolve(_users);
    });
}

