describe("OneSearchBox", function() {

  beforeEach(function() {
  
    function createDOM(){
      $('body').append(
        '<div id="container"> \
          <div style="display:block"> \
            <input id="searchBox" type="text" style="width:400px; margin-left: 50px;"/> \
          </div> \
          <div style="display:block"> \
            <ul id="tags" style="width:600px; margin-left: 50px;"> \
            </ul> \
          </div> \
        </div>');
    }

    createDOM();
  });

  afterEach(function() {
    
    function cleanDom(){
      $('#container').remove();
    }

    cleanDom();
  });

  it("should exist and be a jQuery function", function() {
    expect($.fn.onesearchbox).not.toBe(undefined);
    expect($.fn.onesearchbox).toEqual(jasmine.any(Function));
  });

  describe("#init", function() {

    it("should initiate correctly by a selector", function() {
      var init = function(){
        $('#searchBox').onesearchbox();
        var isAutocomplete = $('#searchBox').hasClass('ui-autocomplete-input');
        expect(isAutocomplete).toBe(true);
      }

      expect(init).not.toThrow();
    });

    it("should initiate with a custom All label and category labels & colors", function() {
      var myCustomAllLabel = "CustomAllLabel",
        categoryName1 = 'categoryName1',
        categoryName2 = 'categoryName2',
        categoryColor1 = 'rgb(255, 255, 0)',
        categoryColor2 = 'rgb(255, 0, 0)';

      $('#searchBox').onesearchbox({
        allLabel: myCustomAllLabel,
        tags: "#tags",
        categories: [{
          name: categoryName1,
          color: categoryColor1,
          items: [{
            id: 1,
            description: 'x'
          }],
          fields: {
            id: "id",
            label: "description"
          }
        },{
          name: categoryName2,
          color: categoryColor2,
          items: [{
            id: 1,
            description: 'y'
          }],
          fields: {
            id: "id",
            label: "description"
          }
        }]
      });

      var selectedOpt = $('span.ui-combobox input').val();
      expect(selectedOpt).toEqual(myCustomAllLabel);
      
      $('span.ui-combobox a').trigger('click');

      var categoriesLI = $('ul.ui-autocomplete.ui-menu:not(.ui-autocomplete-onesearchBox) li a');
      
      expect(categoriesLI.eq(0).text()).toEqual(myCustomAllLabel);
      expect(categoriesLI.eq(1).text()).toEqual(categoryName1);
      expect(categoriesLI.eq(2).text()).toEqual(categoryName2);

      expect(categoriesLI.eq(1).css('color')).toEqual(categoryColor1);
      expect(categoriesLI.eq(2).css('color')).toEqual(categoryColor2);
    });

    it("should initiate the All label with category name if only one category is bound", function() {
      var allLabel = "All",
        categoryName = "Magic";

      $('#searchBox').onesearchbox({
        allLabel: allLabel,
        tags: "#tags",
        categories: [{
          name: categoryName,
          color: 'red',
          items: [{
            id: 1,
            description: 'x'
          }],
          fields: {
            id: "id",
            label: "description"
          }
        }]
      });

      var selectedOpt = $('span.ui-combobox input').val();
      expect(selectedOpt).toEqual(categoryName);
    });

    it("should initiate with all categories bound to the autocomplete", function() {

      $('#searchBox').onesearchbox({
        allLabel: 'all',
        tags: "#tags",
        categories: [{
          name: 'countries',
          color: 'red',
          items: [{
            id: 1,
            name: 'Argentina'
          },{
            id: 2,
            name: 'Spain'
          },{
            id: 3,
            name: 'Brazil'
          }],
          fields: {
            id: "id",
            label: "name"
          }
        },{
          name: 'cities',
          color: 'blue',
          items: [{
            id: 1,
            name: 'Buenos Aires'
          },{
            id: 2,
            name: 'Madrid'
          },{
            id: 3,
            name: 'Rio de Janeiro'
          }],
          fields: {
            id: "id",
            label: "name"
          }
        }]
      });

      $('#searchBox').val('a').trigger('click').trigger('keydown');
      
      runs(function() {
        flag = false;

        setTimeout(function() {
          flag = true;
        }, 500);
      });

      waitsFor(function() {
        return flag;
      }, "x", 1000);

      runs(function() {
        var categoriesLILen = $('ul.ui-autocomplete-onesearchBox li a').length;
        expect(categoriesLILen).toEqual(6);
      });
      
    });
    
  });

  describe("#category", function() {

    //TODO: find a way to change the selected item in jqueryUI combobox
    it("should rebind elements when a category is selected");
    
  });

});