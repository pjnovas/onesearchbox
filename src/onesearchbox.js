
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
    		tags: "",
    		categories: []
    	};
    	
      var settings = $.extend({}, defaults, options );

      return this.each(function(){
        var $this = $(this),
            self = $this,
            data = $this.data('onesearchbox')
  
        if(!data){
          
          $this.data('onesearchbox', {
            target : $this,
            options : settings
          });
         	
         	data = $this.data('onesearchbox');
         	
         	var lists = [];
         	var categoriesSel = $("<select>").insertAfter($this);
         	data.options.selection = [];
         	
         	function buildCategories(){
         		
						categoriesSel.append("<option value='" + data.options.allLabel + "'>" + data.options.allLabel + "</option>");
						
						var cats = data.options.categories;
						lists[data.options.allLabel]= [];
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
							lists[data.options.allLabel] = lists[data.options.allLabel].concat(lists[cName]);
						}
					}
					
					function buildAutocomplete(){
						
						$this.autocompleteOSB({
					    delay: 0,
					    source: lists[data.options.allLabel],
					    open: function(event, ui){
					    	var newWidth = $this.width() + $('.ui-combobox').width();
					    	var ul = $($this.autocompleteOSB("widget")[0]);
					    	
					    	ul.width(newWidth - 10);
					    	$('li .label').width($this.width()-10);
					    },
					    select: function( event, ui ) {
					    	var lis = $('li[data-id=' + ui.item.id + ']', $(data.options.tags));
					    	if (lis.filter('.' + ui.item.category).length > 0)
					    		return false;
					    	
					      var tag = $("<li>" + ui.item.label + "<a href='#' class='close'>x</a></li>")
					      	.addClass(ui.item.category).css('border-color', ui.item.color)
					      	.attr('data-id', ui.item.id);
					      
					      data.options.selection.push(ui.item);
					      
					      $(data.options.tags).append(tag);
					      $("#searchBox").val("");
					      return false;
					    }
					  }).attr('class', 'ui-state-default ui-autocomplete-input ui-widget ui-widget-content ui-corner-left');
	         }
	         
	         function buildCombobox(){
	         	
						categoriesSel.combobox({
					    selected: function (e){
					      $this.autocompleteOSB("option" , "source" , lists[categoriesSel.val()]);
					    },
					    opened: function( event, ui ) {
								$('li', ui).each(function(){
									if ($(this).text() != data.options.allLabel){
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
	        
	        function buildTagsContainer(){
	        	
						$("a.close", data.options.tags).live('click', function(){
						    var idx,
						    	ele = $(this).parents('li');
						    	
						    for(var i=0; i< data.options.selection.length; i++){
						    	if(data.options.selection[i].id == ele.attr('data-id')) {
						    		idx = i;
						    		break;
						    	}
						    }
						    
						    data.options.selection.splice(idx, 1);
						    $(this).parents('li').remove();
						});
						
						function gotoOpacity(opa){
							var lis = $(this).parents('ul').children('li');
					    var cl = $(this).attr('class');
					    lis.not('.' + cl).stop(true).animate({opacity: opa},500);
						}
						
						if (!settings.tags){
							data.options.tags = $("<ul></ul>");
							data.options.tags.insertAfter($this);
						}
						
						$(data.options.tags).addClass('onesearchBox-tags');
						
						$("li", data.options.tags).live('mouseenter', function(){
					  	gotoOpacity.call(this, 0.2);
						}).live('mouseleave', function(){
					  	gotoOpacity.call(this, 1);
						});
					}
					
					buildCategories();
					buildAutocomplete();
					buildCombobox();
					buildTagsContainer();
        }
      });
    },
    selection: function() {
      var $this = $(this),
          data = $this.data('onesearchbox');
      
			var categoriesOut = {};
			var sel = data.options.selection;
			for (var i=0; i<sel.length; i++){
				catName = sel[i].category;
				if (!categoriesOut[catName]) 
					categoriesOut[catName] = [];
				categoriesOut[catName].push(sel[i].id);
			}
			
			return categoriesOut;
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

