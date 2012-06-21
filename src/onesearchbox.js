$.widget( "custom.autocompleteOSB", $.ui.autocomplete, {
  _renderMenu: function( ul, items ) {
      var self = this,
      currentCategory = "";
      
      $.each( items, function( index, item ) {
          
          if ( item.category != currentCategory ) {
              currentCategory = item.category;
          }
          
          ul.addClass('ui-autocomplete-onesearchBox');
          self._renderItem( ul, item );
      });
  },
  _renderItem: function( ul, item ) {
  		var divCat = $("<div class='category " + item.category + "'>" + item.category + "</div>"),
  			divLabel = $("<div class='label'>" + item.label + "</div>");

  		divCat.css('color', item.color);
  		var link = $("<a>").append(divCat).append(divLabel);
  		 
      return $( "<li></li>" )
      .data( "item.autocomplete", item )
      .append(link)
      .appendTo(ul);
  }
});  

(function($){
    
  var defaults = {};

  var methods = {
    init: function(options) {
    	var defaults = {
    		allLabel: "All",
    		categories: []
    	};
    	
      var settings = $.extend({}, defaults, options );

      return this.each(function(){
        var $this = $(this),
            self = $this,
            data = $this.data('onesearchbox'); 
  
        if(!data){
          
          $this.data('onesearchbox', {
            target : $this,
            options : settings
          });
         	
         	var categoriesSel = $("<select>").insertAfter($this);
					categoriesSel.append("<option value='" + settings.allLabel + "'>" + settings.allLabel + "</option>");
					
					var cats = settings.categories;
					var lists = [];
					lists[settings.allLabel]= [];
					for (var i=0; i< cats.length; i++){
						var cName = cats[i].name;
						
						for(var j=0; j<cats[i].items.length; j++){
							var item = cats[i].items[j]; 
							item.category = cName;
							if(cats[i].fields){
								item.id = item[cats[i].fields.id] || item.id;
								item.label = item[cats[i].fields.label] || item.label;
								item.color = cats[i].color;
							}
						}
						
						lists[cName] = cats[i].items;
						
						categoriesSel.append("<option value='" + cName + "'>" + cName + "</option>");
						lists[settings.allLabel] = lists[settings.allLabel].concat(lists[cName]);
					}
					
										
         	$this.autocompleteOSB({
				    delay: 0,
				    source: lists[settings.allLabel],
				    open: function(event, ui){
				    	var newWidth = $this.width() + $('.ui-combobox').width();
				    	var ul = $($this.autocompleteOSB("widget")[0]);
				    	
				    	ul.width(newWidth - 10);
				    	$('li .label').width($this.width()-10);
				    },
				    select: function( event, ui ) {
				      var tag = $("<li>" + ui.item.label + "<a href='#' class='close'>x</a></li>")
				      .addClass(ui.item.category);
				          
				      $("#tags").append(tag);
				      $("#searchBox").val("");
				      return false;
				    }
				  }).attr('class', 'ui-state-default ui-autocomplete-input ui-widget ui-widget-content ui-corner-left');
         	
					categoriesSel.combobox({
				    selected: function (e){
				      $this.autocompleteOSB("option" , "source" , lists[categoriesSel.val()]);
				    },
				    opened: function( event, ui ) {
							$('li', ui).each(function(){
								if ($(this).text() != settings.allLabel){
								  var cat = lists[$(this).text()];
								  if (cat) $('a', this).css('color', cat[0].color || '');
							  }
							});
		        }
				  })
				  .change(function(e){
				    $this.autocompleteOSB("option" , "source" , lists[categoriesSel.val()]);
				  })
				  .next('span.ui-combobox').find('input').attr('readonly', 'readonly').removeClass('ui-corner-left');
        }
      });
    },
    sampleMethod: function(arguments) {
      //Setup Variables
      var settings = $.extend({}, settings, options ),
          $this = $(this),
          self = $this,
          data = $this.data('onesearchbox');
      
      //Method Logic  
      return this.each(function(){
        
      });
    }
  };

  $.fn.onesearchbox = function( method ) {
    
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.onesearchbox' );
    }
  
  };

})(jQuery);

