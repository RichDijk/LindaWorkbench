angular.module('dist').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('partials/csv/config.html',
    "<div ng-controller=\"CsvConfigCtrl\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    CSV File:\n" +
    "  </div>\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <input type=\"file\" ng-file-select=\"onFileSelect($files)\" />\n" +
    "  </div>\n" +
    "  \n" +
    "  <br />\n" +
    "\n" +
    "  <div class=\"col-md-8\">\n" +
    "    <div class=\"progress\" ng-show=\"progress.submitting\">\n" +
    "      <div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"{{progress.value}}\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: {{progress.value}}%\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"col-md-4\">\n" +
    "    <div align=\"right\">\n" +
    "      <i class=\"fa fa-spinner fa-spin fa-lg\" ng-show=\"progress.submitting\"></i>\n" +
    "      <i class=\"fa fa-check fa-lg\" ng-show=\"success && submitted\" style=\"color: #449d44\"></i>\n" +
    "      <i class=\"fa fa-times fa-lg\" ng-show=\"!success && submitted\" style=\"color: #c9302c\"></i>\n" +
    "      <button type=\"button\" class=\"btn btn-primary\" ng-click=\"submit()\">Submit</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('partials/csv/contents.html',
    "<div ng-controller=\"CsvContentsCtrl\">\n" +
    "\n" +
    "  <p align=\"left\" ng-show=\"csv.csvFile().name\">\n" +
    "    Content of: <b>{{csv.csvFile().name}}</b>\n" +
    "  </p>\n" +
    "  <p align=\"left\" ng-show=\"!csv.csvFile().name\">\n" +
    "    No file selected!</b>\n" +
    "  </p>\n" +
    "\n" +
    "  <div class=\"table-scrollable\">\n" +
    "    <table class=\"table\">\n" +
    "      <tr>\n" +
    "        <th ng-repeat=\"column in csv.columns(table)\">\n" +
    "          <button type=\"button\" \n" +
    "                  class=\"btn btn-primary btn-sm table-btn\"\n" +
    "                  ng-class=\"{active: csv.isSelectedColumn(table, column)}\"\n" +
    "                  ng-click=\"csv.toggleSelectedColumn(table, column)\">\n" +
    "              {{column}}\n" +
    "          </button>\n" +
    "        </th>\n" +
    "      </tr>\n" +
    "\n" +
    "      <tr ng-repeat=\"data in csv.data(table)\">\n" +
    "        <td ng-repeat=\"i in data track by $id($index)\">\n" +
    "          <div ng-class=\"{treated: !csv.isSelectedColumn(table, csv.columns(table)[$index])}\">\n" +
    "            {{i}}\n" +
    "          </div>\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "    </table>\n" +
    "  </div>\n" +
    "  <hr />\n" +
    "</div>\n"
  );


  $templateCache.put('partials/csv/publish.html',
    "<div ng-controller=\"CsvPublishCtrl\">\n" +
    "  <button class=\"btn btn-default\" ng-class=\"{disabled: !csv.csvFile().name != ''}\" ng-click=\"dumpcsv()\">Download RDF dump</button>\n" +
    "  <button class=\"btn btn-default\" ng-class=\"{disabled: !csv.csvFile().name != ''}\" ng-click=\"mappingcsv()\">Download mapping file</button>\n" +
    "\n" +
    "  <br />\n" +
    "\n" +
    "  <div class=\"btn-group\">\n" +
    "    <button class=\"btn btn-primary dropdown-toggle\" ng-class=\"{disabled: !csv.csvFile().name != ''}\" data-toggle=\"dropdown\" aria-expanded=\"false\">\n" +
    "      Publish <span class=\"caret\"></span>\n" +
    "    </button>\n" +
    "    <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "      <li><a ng-click=\"publish('sparqlify')\">as SPARQL Endpoint</a></li>\n" +
    "      <li><a ng-click=\"publish('openrdf')\">to OpenRDF</a></li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "\n" +
    "  &nbsp;\n" +
    "  <i class=\"fa fa-spinner fa-spin fa-lg\" ng-show=\"publishing\"></i>\n" +
    "  <i class=\"fa fa-check fa-lg\" ng-show=\"success && published && !publishing\" style=\"color: #449d44\"></i>\n" +
    "  <i class=\"fa fa-times fa-lg\" ng-show=\"!success && published && !publishing\" style=\"color: #c9302c\"></i>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('partials/csv/revise.html',
    "<div ng-controller=\"CsvReviseCtrl\">\n" +
    "\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div class=\"col-md-2\">\n" +
    "      <label for=\"baseUriInput\" class=\"control-label\">Base URI</label>\n" +
    "    </div>\n" +
    "    <div id=\"baseUriInput\" class=\"col-md-8\">\n" +
    "      <input type=\"text\" ng-model=\"rdf.baseUri\" spellcheck=\"false\" size=\"60\" placeholder=\"http://my.company.com/dataset/\" />\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <hr />\n" +
    "  </div>\n" +
    " \n" +
    "  <div class=\"col-md-12\">\n" +
    "    <p align=\"left\" ng-show=\"csv.csvFile().name\">\n" +
    "      For file: <b>{{csv.csvFile().name}}</b>\n" +
    "    </p>\n" +
    "    <p align=\"left\" ng-show=\"!csv.csvFile().name\">\n" +
    "      No file selected!</b>\n" +
    "    </p>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-show=\"table && table != ''\">\n" +
    "    <div ng-show=\"hasColumns()\">\n" +
    "      <div class=\"col-md-2\">\n" +
    "        Columns:\n" +
    "      </div>\n" +
    "      <div class=\"col-md-10\">\n" +
    "        <button ng-repeat=\"column in columns\" type=\"button\" class=\"btn btn-default btn-sm\" ng-class=\"{active: isSelected(column)}\" ng-click=\"insert(column)\">{{column}}</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-2\">\n" +
    "      Subject URI:\n" +
    "    </div>\n" +
    "    <div class=\"col-md-10\">\n" +
    "      <textarea rows=\"1\" cols=\"60\" content=\"rdf.subjectTemplate\" cursor cursorpos=\"cursorpos\" ng-model=\"rdf.subjectTemplate\"></textarea>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-repeat=\"class in rdf.selectedClasses[table]\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-md-1\">\n" +
    "          <div align=\"right\"><i class=\"fa fa-arrow-right\"></i></div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3\" align=\"right\">\n" +
    "          <b><em>a</em></b>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-4\">\n" +
    "          <b>{{class.prefixedName[0]}}</b>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-repeat=\"prop in rdf.selectedProperties[table]\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-md-1\">\n" +
    "          <div align=\"right\"><i class=\"fa fa-arrow-right\"></i></div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3\" align=\"right\">\n" +
    "          <b><em>{{prop.prefixedName[0]}}</em></b>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-4\">\n" +
    "          <select class=\"form-control\" ng-model=\"rdf.propertyLiteralSelection[prop.prefixedName[0]]\" ng-options=\"selection for selection in propertyLiteralTypeOptions\"></select>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-4\">\n" +
    "          <select class=\"form-control\" ng-model=\"rdf.propertyLiteralTypes[prop.prefixedName[0]]\" ng-options=\"type for type in propertyLiteralTypes\" ng-show=\"rdf.propertyLiteralSelection[prop.prefixedName[0]] == 'Typed Literal'\"></select>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('partials/csv/transform.html',
    "<div ng-controller=\"CsvTransformCtrl\">\n" +
    "  \n" +
    "  <div class=\"col-md-6\">\n" +
    "    <p align=\"left\" ng-show=\"csv.csvFile().name\">\n" +
    "      For file: <b>{{csv.csvFile().name}}</b>\n" +
    "    </p>\n" +
    "    <p align=\"left\" ng-show=\"!csv.csvFile().name\">\n" +
    "      No file selected!</b>\n" +
    "    </p>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-md-6\">\n" +
    "    <p align=\"right\">\n" +
    "      <i class=\"fa fa-spinner fa-spin\" ng-show=\"loading\"></i>&nbsp;\n" +
    "      <button class=\"btn btn-primary\" ng-class=\"{disabled: !csv.csvFile().name != ''}\" ng-click=\"ask(table, columns)\">Ask the Oracle!</button>\n" +
    "    </p>\n" +
    "  </div>\n" +
    "\n" +
    "  <table class=\"table table-scrollable\">\n" +
    "    <!-- table and columns -->\n" +
    "    <tr>\n" +
    "      <th><div class=\"btn btn-sm btn-block\">Data subject</div></th>\n" +
    "      <th ng-repeat=\"column in columns\"><div class=\"btn btn-sm btn-block\">Column <a>{{column}}</a></div></th>\n" +
    "    </tr>\n" +
    "\n" +
    "    <!-- tags -->\n" +
    "    <tr>\n" +
    "      <td><input type=\"text\" class=\"table-input\" ng-model=\"tableTag[table]\" /></td>\n" +
    "      <td ng-repeat=\"column in columns\"><input type=\"text\" class=\"table-input\" placeholder=\"{{column}}\" ng-model=\"columnTags[column]\"/></td>\n" +
    "    </tr>\n" +
    "\n" +
    "    <!-- suggestions -->\n" +
    "    <tr>\n" +
    "      <td>\n" +
    "        <div class=\"list-group\">\n" +
    "          <!-- TODO: better organizing; div inside link? -->\n" +
    "          <a href=\"\" class=\"list-group-item\"\n" +
    "             ng-repeat=\"i in rdf.suggestions[table].table.recommend\" ng-click=\"selectClass(table, i)\" ng-class=\"{active: isSelectedClass(table, i)}\">\n" +
    "            <div rdf-badge\n" +
    "              uri=\"{{i.uri[0]}}\"\n" +
    "              label=\"{{i.label[0]}}\"\n" +
    "              comment=\"{{i.comment[0]}}\"\n" +
    "              definition=\"{{i.definition[0]}}\"\n" +
    "              local=\"{{i.localName[0]}}\"\n" +
    "              prefixed=\"{{i.prefixedName[0]}}\"\n" +
    "              definition=\"{{i.definition[0]}}\"\n" +
    "              vocab-uri=\"{{i['vocabulary.uri'][0]}}\"\n" +
    "              vocab-title=\"{{i['vocabulary.title'][0]}}\"\n" +
    "              vocab-descr=\"{{i['vocabulary.description'][0]}}\"\n" +
    "              score=\"{{i.score | scoreFilter}}\">\n" +
    "            </div>\n" +
    "          </a>\n" +
    "        </div>\n" +
    "      </td>\n" +
    "      <td ng-repeat=\"column in columns\">\n" +
    "        <div class=\"list-group\">\n" +
    "          <!-- TODO: see above -->\n" +
    "          <a href=\"\" class=\"list-group-item\" \n" +
    "             ng-repeat=\"i in getColumnSuggestions(table, column)\" ng-click=\"selectProperty(table, column, i)\" ng-class=\"{active: isSelectedProperty(table, column, i)}\">\n" +
    "            <div rdf-badge\n" +
    "              uri=\"{{i.uri[0]}}\"\n" +
    "              label=\"{{i.label[0]}}\"\n" +
    "              comment=\"{{i.comment[0]}}\"\n" +
    "              definition=\"{{i.definition[0]}}\"\n" +
    "              local=\"{{i.localName[0]}}\"\n" +
    "              prefixed=\"{{i.prefixedName[0]}}\"\n" +
    "              definition=\"{{i.definition[0]}}\"\n" +
    "              vocab-uri=\"{{i['vocabulary.uri'][0]}}\"\n" +
    "              vocab-title=\"{{i['vocabulary.title'][0]}}\"\n" +
    "              vocab-descr=\"{{i['vocabulary.description'][0]}}\"\n" +
    "              score=\"{{i.score | scoreFilter}}\">\n" +
    "            </div>\n" +
    "          </a>\n" +
    "        </div>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </table>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('partials/main.html',
    "<div class=\"main container-fluid\" style=\"min-height:128em\" ng-controller=\"MainCtrl\">\n" +
    "\n" +
    "  <div class=\"header\">\n" +
    "    <ul class=\"nav nav-pills pull-right\">\n" +
    "      <li><a href=\"#\">About</a></li>\n" +
    "      <li><a href=\"#\">Contact</a></li>\n" +
    "    </ul>\n" +
    "    <h3 class=\"text-muted\"><a href=\"#\">{{title}}</a></h3>\n" +
    "  </div>\n" +
    " \n" +
    "  <wizard>\n" +
    "    <step ng-repeat=\"i in steps\"\n" +
    "          name=\"{{steps[$index].name}}\" \n" +
    "          heading=\"{{steps[$index].heading}}\" \n" +
    "          description=\"{{steps[$index].description}}\" \n" +
    "          sidetip=\"sidetip\">\n" +
    "      <div ng-bind-html=\"'{{steps[$index].content}}'\"></div>\n" +
    "      <br /> \n" +
    "      <ng-include src=\"template($index)\"></ng-include>\n" +
    "    </step>\n" +
    "  </wizard>\n" +
    "\n" +
    "  <p align=\"center\" style=\"font-size: 20px;margin-top: 10em\">❦</p>\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('partials/rdb/config.html',
    "<div ng-controller=\"RdbConfigCtrl\"> \n" +
    "  <form class=\"form-horizontal\" role=\"form\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"hostInput\" class=\"col-md-4 control-label\">Host</label>\n" +
    "      <div id=\"hostInput\" class=\"col-md-8\">\n" +
    "        <input type=\"text\" class=\"form-control\" ng-model=\"rdb.datasource.host\" spellcheck=\"false\" />\n" +
    "      </div>\n" +
    "\n" +
    "      <label for=\"driverInput\" class=\"col-md-4 control-label\">Driver</label>\n" +
    "      <div id=\"driverInput\" class=\"col-md-8\">\n" +
    "        <input type=\"text\" class=\"form-control\" ng-model=\"rdb.datasource.driver\" spellcheck=\"false\" />\n" +
    "      </div>\n" +
    "\n" +
    "      <label for=\"nameInput\" class=\"col-md-4 control-label\">Datasource Name</label>\n" +
    "      <div id=\"nameInput\" class=\"col-md-8\">\n" +
    "        <input type=\"text\" class=\"form-control\" ng-model=\"rdb.datasource.name\" spellcheck=\"false\" />\n" +
    "      </div>\n" +
    "\n" +
    "      <label for=\"userInput\" class=\"col-md-4 control-label\">Username</label>\n" +
    "      <div id=\"userInput\" class=\"col-md-8\">\n" +
    "        <input type=\"text\" class=\"form-control\" ng-model=\"rdb.datasource.username\" spellcheck=\"false\" />\n" +
    "      </div>\n" +
    "\n" +
    "      <label for=\"passwordInput\" class=\"col-md-4 control-label\">Password</label>\n" +
    "      <div id=\"passwordInput\" class=\"col-md-8\">\n" +
    "        <input type=\"password\" class=\"form-control\" ng-model=\"rdb.datasource.password\" />\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div align=\"right\">\n" +
    "      <i class=\"fa fa-spinner fa-spin fa-lg\" ng-show=\"checking\"></i>\n" +
    "      <i class=\"fa fa-check fa-lg\" ng-show=\"success && checked && !checking\" style=\"color: #449d44\"></i>\n" +
    "      <i class=\"fa fa-times fa-lg\" ng-show=\"!success && checked && !checking\" style=\"color: #c9302c\"></i>\n" +
    "      &nbsp;\n" +
    "      <button type=\"button\" class=\"btn btn-default\" ng-click=\"test()\">Test</button>\n" +
    "      <button type=\"button\" class=\"btn btn-primary\" ng-click=\"apply()\">Apply</button>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n"
  );


  $templateCache.put('partials/rdb/contents.html',
    "<div ng-controller=\"RdbContentsCtrl\">\n" +
    "\n" +
    "  <table class=\"table table-scrollable\">\n" +
    "    <tr ng-repeat=\"table in rdb.tables()\">\n" +
    "      <th class=\"btn-th\">\n" +
    "        <button type=\"button\" \n" +
    "                class=\"btn btn-primary btn-sm table-btn\" \n" +
    "                ng-class=\"{active: rdb.isSelectedTable(table)}\"\n" +
    "                ng-click=\"rdb.toggleSelectTable(table)\"> \n" +
    "          {{table}}\n" +
    "        </button>\n" +
    "      </th>\n" +
    "\n" +
    "      <td>\n" +
    "        <button ng-repeat=\"column in rdb.tableColumns()[table]\" \n" +
    "                type=\"button\" \n" +
    "                class=\"btn btn-default btn-sm table-btn\"\n" +
    "                ng-class=\"{disabled: !rdb.isSelectedTable(table), active: rdb.isSelectedColumn(table, column)}\"\n" +
    "                ng-click=\"rdb.toggleSelectColumn(table, column)\"\n" +
    "                columntip table=\"{{table}}\" column=\"{{column}}\"> \n" +
    "            {{column}}\n" +
    "        </button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </table>\n" +
    "</div>\n"
  );


  $templateCache.put('partials/rdb/publish.html',
    "<div ng-controller=\"RdbPublishCtrl\">\n" +
    "  <button class=\"btn btn-default\" ng-class=\"{disabled: !table || table == ''}\" ng-click=\"dumpdb()\">Download RDF dump</button>\n" +
    "  <button class=\"btn btn-default\" ng-class=\"{disabled: !table || table == ''}\" ng-click=\"mappingdb()\">Download mapping file</button>\n" +
    "\n" +
    "  <br />\n" +
    "\n" +
    "  <div class=\"btn-group\">\n" +
    "    <button class=\"btn btn-primary dropdown-toggle\" ng-class=\"{disabled: !table || table == ''}\" data-toggle=\"dropdown\" aria-expanded=\"false\">\n" +
    "      Publish <span class=\"caret\"></span>\n" +
    "    </button>\n" +
    "    <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "      <li><a href=\"#\" ng-click=\"publish('sparqlify')\">as SPARQL Endpoint</a></li>\n" +
    "      <li><a href=\"#\" ng-click=\"publish('openrdf')\">to OpenRDF</a></li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "\n" +
    "  &nbsp;\n" +
    "  <i class=\"fa fa-spinner fa-spin fa-lg\" ng-show=\"publishing\"></i>\n" +
    "  <i class=\"fa fa-check fa-lg\" ng-show=\"success && published && !publishing\" style=\"color: #449d44\"></i>\n" +
    "  <i class=\"fa fa-times fa-lg\" ng-show=\"!success && published && !publishing\" style=\"color: #c9302c\"></i>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('partials/rdb/revise.html',
    "<div ng-controller=\"RdbReviseCtrl\">\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <label for=\"baseUriInput\" class=\"col-md-2 control-label\">Base URI</label>\n" +
    "    <div id=\"baseUriInput\" class=\"col-md-8\">\n" +
    "      <input type=\"text\" ng-model=\"rdf.baseUri\" spellcheck=\"false\" size=\"60\" placeholder=\"http://my.company.com/dataset/\" />\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    " \n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <p align=\"left\">\n" +
    "        <select class=\"form-control\" ng-model=\"table\" ng-options=\"table for table in rdb.selectedTables()\">\n" +
    "          <option>--</option>\n" +
    "        </select>\n" +
    "      </p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-show=\"table && table != ''\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-md-2\">\n" +
    "        Columns:\n" +
    "      </div>\n" +
    "      <div class=\"col-md-10\">\n" +
    "        <button ng-repeat=\"column in columns\" type=\"button\" class=\"btn btn-default btn-sm\" ng-class=\"{active: isSelected(column)}\" ng-click=\"insert(column)\">{{column}}</button>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"col-md-2\">\n" +
    "        Subject URI:\n" +
    "      </div>\n" +
    "      <div class=\"col-md-10\">\n" +
    "        <textarea rows=\"1\" cols=\"60\" content=\"rdf.subjectTemplate\" cursor cursorpos=\"cursorpos\" ng-model=\"rdf.subjectTemplate\"></textarea>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row\" ng-repeat=\"class in rdf.selectedClasses[table]\">\n" +
    "      <div class=\"col-md-1\">\n" +
    "        <div align=\"right\"><i class=\"fa fa-arrow-right\"></i></div>\n" +
    "      </div>\n" +
    "      <div class=\"col-md-3\" align=\"right\">\n" +
    "        <b><em>a</em></b>\n" +
    "      </div>\n" +
    "      <div class=\"col-md-4\">\n" +
    "        <b>{{class.prefixedName[0]}}</b>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row\" ng-repeat=\"prop in rdf.selectedProperties[table]\">\n" +
    "      <div class=\"col-md-1\">\n" +
    "        <div align=\"right\"><i class=\"fa fa-arrow-right\"></i></div>\n" +
    "      </div>\n" +
    "      <div class=\"col-md-3\" align=\"right\">\n" +
    "        <b><em>{{prop.prefixedName[0]}}</em></b>\n" +
    "      </div>\n" +
    "      <div class=\"col-md-4\">\n" +
    "        <select class=\"form-control\" ng-model=\"rdf.propertyLiteralSelection[prop.prefixedName[0]]\" ng-options=\"selection for selection in propertyLiteralTypeOptions\"></select>\n" +
    "      </div>\n" +
    "      <div class=\"col-md-4\">\n" +
    "        <select class=\"form-control\" ng-model=\"rdf.propertyLiteralTypes[prop.prefixedName[0]]\" ng-options=\"type for type in propertyLiteralTypes\" ng-show=\"rdf.propertyLiteralSelection[prop.prefixedName[0]] == 'Typed Literal'\"></select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('partials/rdb/transform.html',
    "<div ng-controller=\"RdbTransformCtrl\">\n" +
    "  <div class=\"col-md-4\">\n" +
    "    <p align=\"left\">\n" +
    "      <select class=\"form-control\" ng-model=\"table\" ng-options=\"table for table in rdb.selectedTables()\">\n" +
    "      </select>\n" +
    "    </p>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-md-8\">\n" +
    "    <p align=\"right\">\n" +
    "      <i class=\"fa fa-spinner fa-spin\" ng-show=\"loading\"></i>&nbsp;\n" +
    "      <button class=\"btn btn-primary\" ng-click=\"ask(table, columns)\" ng-class=\"{disabled: !table || table == ''}\">Ask the Oracle!</button>\n" +
    "    </p>\n" +
    "  </div>\n" +
    "\n" +
    "  <table class=\"table table-scrollable\" ng-show=\"table && table != ''\">\n" +
    "    <!-- table and columns -->\n" +
    "    <tr>\n" +
    "      <th><div class=\"btn btn-sm btn-block\">Table <a>{{table}}</a></div></th>\n" +
    "      <th ng-repeat=\"column in columns\"><div class=\"btn btn-sm btn-block\">Column <a>{{column}}</a></div></th>\n" +
    "    </tr>\n" +
    "\n" +
    "    <!-- tags -->\n" +
    "    <tr>\n" +
    "      <td><input type=\"text\" class=\"table-input\" placeholder=\"{{table}}\" ng-model=\"tableTag[table]\" /></td>\n" +
    "      <td ng-repeat=\"column in columns\"><input type=\"text\" class=\"table-input\" placeholder=\"{{column}}\" ng-model=\"columnTags[column]\"/></td>\n" +
    "    </tr>\n" +
    "\n" +
    "    <!-- suggestions -->\n" +
    "    <tr>\n" +
    "      <td>\n" +
    "        <div class=\"list-group\">\n" +
    "          <a href=\"\" class=\"list-group-item\"\n" +
    "             ng-repeat=\"i in rdf.suggestions[table].table.recommend\" ng-click=\"selectClass(table, i)\" ng-class=\"{active: isSelectedClass(table, i)}\">\n" +
    "            <div rdf-badge\n" +
    "              uri=\"{{i.uri[0]}}\"\n" +
    "              label=\"{{i.label[0]}}\"\n" +
    "              comment=\"{{i.comment[0]}}\"\n" +
    "              definition=\"{{i.definition[0]}}\"\n" +
    "              local=\"{{i.localName[0]}}\"\n" +
    "              prefixed=\"{{i.prefixedName[0]}}\"\n" +
    "              definition=\"{{i.definition[0]}}\"\n" +
    "              vocab-uri=\"{{i['vocabulary.uri'][0]}}\"\n" +
    "              vocab-title=\"{{i['vocabulary.title'][0]}}\"\n" +
    "              vocab-descr=\"{{i['vocabulary.description'][0]}}\"\n" +
    "              score=\"{{i.score | scoreFilter}}\">\n" +
    "            </div>\n" +
    "          </a>\n" +
    "        </div>\n" +
    "      </td>\n" +
    "      <td ng-repeat=\"column in columns\">\n" +
    "        <div class=\"list-group\">\n" +
    "          <a href=\"\" class=\"list-group-item\" \n" +
    "             ng-repeat=\"i in getColumnSuggestions(table, column)\" ng-click=\"selectProperty(table, column, i)\" ng-class=\"{active: isSelectedProperty(table, column, i)}\">\n" +
    "            <div rdf-badge\n" +
    "              uri=\"{{i.uri[0]}}\"\n" +
    "              label=\"{{i.label[0]}}\"\n" +
    "              comment=\"{{i.comment[0]}}\"\n" +
    "              definition=\"{{i.definition[0]}}\"\n" +
    "              local=\"{{i.localName[0]}}\"\n" +
    "              prefixed=\"{{i.prefixedName[0]}}\"\n" +
    "              definition=\"{{i.definition[0]}}\"\n" +
    "              vocab-uri=\"{{i['vocabulary.uri'][0]}}\"\n" +
    "              vocab-title=\"{{i['vocabulary.title'][0]}}\"\n" +
    "              vocab-descr=\"{{i['vocabulary.description'][0]}}\"\n" +
    "              score=\"{{i.score | scoreFilter}}\">\n" +
    "            </div>\n" +
    "          </a>\n" +
    "        </div>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </table>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('partials/rdfbadge.html',
    "<div>\n" +
    "  {{prefixed}}\n" +
    "  <span class=\"score\">(score:&nbsp;{{score}})</span>\n" +
    "</div>\n"
  );


  $templateCache.put('partials/step.html',
    "<section id=\"{{name}}\">\n" +
    "  <div class=\"row\" ng-class=\"{treated: !isSelected() && isTreated()}\" ng-show=\"isSelected() || isTreated()\">\n" +
    "    <h3>{{heading}}</h3>\n" +
    "\n" +
    "    <fieldset ng-disabled=\"!isSelected()\">\n" +
    "      <p><div ng-transclude></div></p>\n" +
    "    </fieldset>\n" +
    "\n" +
    "    <div ng-show=\"isSelected()\" style=\"margin-top:2em\">\n" +
    "      <a href prev ng-show=\"!isFirst()\">&lt;&lt; Previous&nbsp;</a>\n" +
    "      <a href next ng-show=\"!isLast()\">Next &gt;&gt;</a>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- <hr /> -->\n" +
    "    <p style=\"margin-bottom:5em\"><p>\n" +
    "  </div>\n" +
    "</section>\n"
  );


  $templateCache.put('partials/wizard.html',
    "<div class=\"wizard\"> \n" +
    "  <div class=\"row\">\n" +
    "\n" +
    "    <div class=\"col-md-2\">\n" +
    "      <nav class=\"navigation affix\">\n" +
    "        <ul class=\"nav nav-list\">\n" +
    "          <li ng-class=\"{disabled: !(step.selected || step.treated), active: step.selected}\" ng-repeat=\"step in wizsteps\"><a href goto=\"{{step.name}}\">{{step.name}}</a></li>\n" +
    "        </ul>\n" +
    "      </nav>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-8\">\n" +
    "      <div class=\"steps\" ng-transclude></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-2\">\n" +
    "      <div class=\"affix\">\n" +
    "        <div ng-bind-html=\"sidetip.tooltip\"></div>\n" +
    "        <hr />\n" +
    "        <div ng-bind-html=\"sidetip.tmpl\"></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n"
  );

}]);
