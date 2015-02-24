$('#toolbar select').chosen();

var toolbar_datasource_name = '';

var toolbar = {
    all_classes_properties: [],
    labels: [],
    classes_query_paginate_by: 10000,

    sort_f: function(a, b) {
        return uri_to_label(a.uri).length - uri_to_label(b.uri).length;
    },

    clear: function() {
        this.all_classes_properties = [];
        this.labels = [];
    },

    load_classes: function(that, name, p) {
        $.ajax({ //make request for classes
            url: ADVANCED_BUILDER_API_URI + "active_classes/" +  name + "?p=" + p,
            type: "GET",
            success: function(data, textStatus, jqXHR) {
                if ($(that).val() != name) { //check if datasource has changed
                    return;
                }
                var bindings = data.results.bindings;

                for (var i=0; i<bindings.length; i++) { //add all classes
                    if (!bindings[i].class) {
                        continue;
                    }

                    var class_uri = bindings[i].class.value;
                    toolbar.all_classes_properties.push({type: "class", uri: class_uri});
                }

                if (bindings.length == toolbar.classes_query_paginate_by) { //continue gathering classes
                    toolbar.load_classes(that, name, p+1);
                    setTimeout(function() {
                        var val = $( '#toolbar > input[type="search"]' ).val();
                        if (val === undefined) {
                            val = "";
                        }
                        toolbar.show_classes(val, undefined, true);
                    }, 10);
                } else { //sort results in the end
                    $("#toolbar").css('cursor', 'wait');
                    setTimeout(function() {
                        this.labels = [];
                        toolbar.all_classes_properties.sort(toolbar.sort_f);
                        toolbar.show_classes($( '#toolbar > input[type="search"]' ).val());
                        $("#toolbar").css('cursor', 'default');
                    }, 10);
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus + ': ' + errorThrown);
                return -1;
            }

        });
    },

    show_classes: function(filter, offset, appending) {
        var limit = 10;
        var added = 0;
        var total = 0;
        var start = 0;
        var is_full = false;

        if (appending) { //used to optimize loading large data sources
            var is_full = $("#toolbar .active-classes .button").length == 10;
            if ((this.prev_state) && (filter == this.prev_state.filter)) {
                start = this.prev_state.len;
                added = this.prev_state.added;
                total = this.prev_state.total;
                offset = this.prev_state.offset;
            } else {
               $("#toolbar .active-classes").html('');
            }
        } else {
            $("#toolbar .active-classes").html('');
            if ((this.prev_state != undefined) && (filter == this.prev_state.filter)) {
                var prev_total = this.prev_state.total;
            }
            this.prev_state = undefined;
        }

        if (offset === undefined) {
            offset = 0;
        }

        if ((offset > 0) && (this.prev_state === undefined)) {
            $("#toolbar .active-classes").append('<span class="prev-next-classes-button" data-offset="' + (Math.max(offset-limit, 0)) + '">‹</span>');
        }
        if (this.prev_state === undefined) {
            $("#toolbar .active-classes").append('<div class="classes-container"></div>');
        }

        for (var i=start; i<this.all_classes_properties.length; i++) {
            if (this.labels[i] === undefined) {
                this.labels[i] = uri_to_label(this.all_classes_properties[i].uri);
            }
            var label = this.labels[i];

            if (!filter || (label.toLowerCase().indexOf(filter.toLowerCase()) >= 0)) {
                total++;
                if ((total > offset) && (total <= offset + limit)) {
                    if (!is_full) {
                        var data_str = 'data-uri="' + this.all_classes_properties[i].uri + '" data-type="' + this.all_classes_properties[i].type + '"';
                        var type_class = "class";
                        if (this.all_classes_properties[i].type == "property") {
                            data_str += 'data-domain="' + this.all_classes_properties[i].domain + '" data-range="' + this.all_classes_properties[i].range + '"';
                            type_class = "property";
                            label += '&rArr;';
                        }

                        var new_button = '<div class="class_button button ' + type_class + '" ' + data_str + '>' + label + '</div>';
                        $("#toolbar .active-classes .classes-container").append(new_button);
                    }

                    added++;
                }
                else if ((prev_total != undefined) && (total > offset)) {
                    //total already known so we may break;
                    total = prev_total;
                    break;
                }
            }
        }

        if (!is_full) {
            if ((offset + added < total) && ($("#toolbar .active-classes .prev-next-classes-button").length < 2)) {
                $("#toolbar .active-classes").append('<span class="prev-next-classes-button" data-offset="' + (offset+limit) + '">›</span>');
            }
        }

        if ((added == 0) && (this.prev_state == undefined)) {
            $("#toolbar .active-classes").append('<span class="info">No terms found</span>');
        } else if (this.all_classes_properties.length>limit) {
            var info_str = 'Showing ' + (offset+1) + '-' + (offset+added) + '/' + total.toLocaleString() + ' terms';
            if (this.prev_state !== undefined) {
                $("#toolbar .active-classes .info").html(info_str);
            } else {
                $("#toolbar .active-classes").append('<span class="info">' + info_str + '</span>');
            }
        }

        this.prev_state = {
            total: total,
            added: added,
            len: this.all_classes_properties.length,
            filter: filter,
            offset: offset
        };

        $("#tree_toolbar").css('top', $("#toolbar").position().top + $("#toolbar").height() + 30);
    }
};

/*On select change load active classes in dataset*/
    $( "#toolbar > select" ).change(function() {
        var name = $(this).val();
        var that = this;
        if (name == "") return;

        $("#toolbar .active-classes").html('<span class="loading">Loading classes and properties...</span>');
        $("#tree_toolbar").css('top', $("#toolbar").position().top + $("#toolbar").height() + 30);
        toolbar.clear();

        $.ajax({ //make request for properties
            url: ADVANCED_BUILDER_API_URI + "object_properties/" +  name + "/",
            type: "GET",
            success: function(data, textStatus, jqXHR) {
                if ($(that).val() != name) { //check if datasource has changed
                    return;
                }

                var bindings = data.results.bindings;

                for (var i=0; i<bindings.length; i++) { //add all object properties
                    if (!bindings[i].property || !bindings[i].domain || !bindings[i].range) {

                        continue;
                    }
                    var property_uri = bindings[i].property.value;
                    var domain_uri = bindings[i].domain.value;
                    var range_uri = bindings[i].range.value;
                    toolbar.all_classes_properties.push({
                        type: "property", uri: property_uri, domain: domain_uri, range: range_uri
                    });
                }

                toolbar.load_classes(that, name, 1);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#toolbar .active-classes").html('<span class="error">Error while connecting to server</span>');
            }
        });
    });

/*On search text change*/

$( '#toolbar > input[type="search"]' ).on('input propertychange paste', function() {
    var search_val = $(this).val();
    var that = this;

    setTimeout(function(){
        if (search_val === $(that).val()) { // input value has not changed
            toolbar.show_classes($(that).val());
        }
    }, 250);

});

/*On class start drag*/
$("body").on('mousedown','.class_button', function(e) {
    if (e.which == 1) { //only for left click
        builder_workbench.selection = {'type': $(this).data("type"), 'uri': $(this).data("uri"), 'dt_name': $( "#toolbar > select" ).val()};
        if ($(this).data("type") == "property") {
            builder_workbench.selection.domain = $(this).data("domain");
            builder_workbench.selection.range = $(this).data("range");
        }

        $(".toolbar").addClass("accepting-instance");
        e.preventDefault();
        e.stopPropagation();
    }
});

/*On class cancel drag*/
$("body").on('mouseup','.toolbar', function(e) {
    builder_workbench.selection = undefined;
});

/*On toolbar prev & next*/
 $("body").on('click','.prev-next-classes-button', function() {
    var offset = $(this).data('offset');
    toolbar.show_classes($( '#toolbar > input[type="search"]' ).val(), offset);
});

/*Load root classes*/
$( "#toolbar > select" ).change(function() {
    var name = $(this).val();
    if (name == "") return;

    TreeObjects = [];
    $('#tree_toolbar_objects').empty();

    $.ajax({ //make request for classes
        url: ADVANCED_BUILDER_API_URI + "active_root_classes/" +  name + "/",
        type: "GET",

        success: function(data, textStatus, jqXHR) {
            var bindings = data.results.bindings;

            for (var i=0; i<bindings.length; i++) { //add all classes
                var class_uri = bindings[i].class.value;
                var instance_cnt = bindings[i].cnt.value;

                var id = 'tree_class_' + i;
                var text = uri_to_label(class_uri) + ' (' + Number(instance_cnt).toLocaleString() + ')';
                $("#tree_toolbar_objects").append('<div id="' + id + '" class="class-wrapper"><span class="ui-icon ui-icon-carat-1-e arrow closed unset"></span><span class="class">' + text + '</span></div>');
                TreeObjects[id] = encodeURIComponent(class_uri);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus + ': ' + errorThrown);
        }
    });
});

/*Open a class*/
$("#tree_toolbar").on('click', '.arrow.closed', function(e) {
    $(this).removeClass('closed');
    $(this).addClass('open');

    $(this).removeClass('ui-icon-carat-1-e');
    $(this).addClass('ui-icon-carat-1-s');

    $(this).parent().find(".class-contents").show();
});

/*Close a class*/
$("#tree_toolbar").on('click', '.arrow.open', function(e) {
    $(this).removeClass('open');
    $(this).addClass('closed');

    $(this).removeClass('ui-icon-carat-1-s');
    $(this).addClass('ui-icon-carat-1-e');

    $(this).parent().find(".class-contents").hide();
});

/*Dynamically load subclasses and properties*/
$("#tree_toolbar").on('click', '.arrow.closed.unset', function(e) {
    var parent_id = $(this).parent().attr('id');
    var parent_uri = TreeObjects[parent_id];

    $(this).removeClass('unset');
    $(this).addClass('loading');
    var arrow = $(this);

    $(this).parent().append('<div class="class-contents"></div>');
    var container = $(this).parent().find(".class-contents");

    $.ajax({ //make request for subclasses
        url: ADVANCED_BUILDER_API_URI + "active_subclasses/" +  $( "#toolbar > select" ).val() + "/?parent_class=" + parent_uri,
        type: "GET",

        success: function(data, textStatus, jqXHR) {
            var bindings = data.results.bindings;
            var nOfSubclasses = 0;
            for (var i=0; i<bindings.length; i++) { //add all classes
                if (!bindings[i].class) continue;

                nOfSubclasses++;
                var class_uri = bindings[i].class.value;
                var instance_cnt = bindings[i].cnt.value;

                var id = parent_id + '_tree_class_' + i;
                var text = uri_to_label(class_uri) + ' (' + Number(instance_cnt).toLocaleString() + ')';
                $(container).append('<div id="' + id + '"><span class="ui-icon ui-icon-carat-1-e arrow closed unset"></span><span class="class">' + text + '</span></div>');
                TreeObjects[id] = encodeURIComponent(class_uri);
            }

            /*Don't show properties for time
            $.ajax({ //make request for properties
                url: ADVANCED_BUILDER_API_URI + "active_class_properties/" +  $( "#toolbar > select" ).val() + "?order=true&class_uri=" + parent_uri,
                type: "GET",

                success: function(data, textStatus, jqXHR) {
                    var bindings = data.results.bindings;

                    for (var i=0; i<bindings.length; i++) { //add all properties
                        var property_uri = bindings[i].property.value;
                        var instance_cnt = bindings[i].cnt.value;

                        var id = parent_id + '_property_' + i;
                        var text = uri_to_label(property_uri) + ' (' + Number(instance_cnt).toLocaleString() + ')';
                        $(container).append('<div id="' + id + '"><span class="property">' + text + '</span></div>');
                        TreeObjects[id] = encodeURIComponent(property_uri);
                    }

                    arrow.removeClass('loading');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus + ': ' + errorThrown);
                }
            });*/

            arrow.removeClass('loading');
            if (nOfSubclasses == 0) {
                arrow.addClass('ui-icon-minus');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            arrow.removeClass('loading');
            arrow.removeClass('ui-icon-carat-1-s');
            arrow.addClass('ui-icon-carat-1-e');
            arrow.addClass('unset');

            console.log(textStatus + ': ' + errorThrown);
        }
    });
});

/*On class start drag*/
$("body").on('mousedown','#tree_toolbar .class', function(e) {
    if (e.which == 1) { //only for left click
        var class_uri = decodeURIComponent(TreeObjects[ $(this).parent().attr("id") ]);
        builder_workbench.selection = {'type': 'class', 'uri': class_uri, 'dt_name': $( "#toolbar > select" ).val()};
        $("#tree_toolbar").addClass("accepting-instance");

        e.preventDefault();
        e.stopPropagation();
    }
});

/*On class cancel drag*/
$("body").on('mouseup','#tree_toolbar', function(e) {
    builder_workbench.selection = undefined;
});

/*On tree toolbar close*/
$("body").on('click', '.tree-toolbar-close', function(e) {
    $("#tree_toolbar").css('max-width', 20);

    $(this).removeClass('tree-toolbar-close');
    $(this).addClass('tree-toolbar-open');

    $(this).removeClass('ui-icon-triangle-1-e');
    $(this).addClass('ui-icon-triangle-1-w');

    $('#tree_toolbar_objects').hide();
    e.preventDefault();
    e.stopPropagation();
});

/*On tree toolbar open*/
$("body").on('click', '.tree-toolbar-open', function(e) {
    $("#tree_toolbar").css('max-width', 300);

    $(this).removeClass('tree-toolbar-open');
    $(this).addClass('tree-toolbar-close');

    $(this).removeClass('ui-icon-triangle-1-w');
    $(this).addClass('ui-icon-triangle-1-e');

    $('#tree_toolbar_objects').show();
    e.preventDefault();
    e.stopPropagation();
});

$("body").on('dblclick', '.tree-toolbar-close, .tree-toolbar-open', function(e) {
    e.preventDefault();
    e.stopPropagation();
});