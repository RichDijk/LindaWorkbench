import json
import urllib
from django.shortcuts import render
from linda_app.models import Vocabulary, VocabularyClass, VocabularyProperty
from query_designer.views import get_endpoint_from_dt_name, sparql_query_json

__author__ = 'dimitris'

from django.http import HttpResponse, Http404


# Get documentation about each keyword
def sparql_core_docs(request, keyword):
    keyword_docs = [('base', 'The BASE keyword defines the Base IRI used to resolve relative IRIs<br />The following fragments are some of the different ways to write the same IRI:<pre class="code">%3Chttp%3A%2F%2Fexample.org%2Fbook%2Fbook1%3E</pre><pre class="code">BASE%20%3Chttp%3A%2F%2Fexample.org%2Fbook%2F%3E%0A%3Cbook1%3E</pre><pre class="code">PREFIX%20book%3A%20%3Chttp%3A%2F%2Fexample.org%2Fbook%2F%3E%0Abook%3Abook1</pre>'),
                    ('prefix', 'The PREFIX keyword associates a prefix label with an IRI. A prefixed name is a prefix label and a local part, separated by a colon ":". A prefixed name is mapped to an IRI by concatenating the IRI associated with the prefix and the local part. The prefix label or the local part may be empty.'),
                    ('select', 'The SELECT form of results returns variables and their bindings directly. The syntax SELECT * is an abbreviation that selects all of the variables in a query.'),
                    ('ask', 'Applications can use the ASK form to test whether or not a query pattern has a solution. No information is returned about the possible query solutions, just whether or not a solution exists.<br /><pre class="code">PREFIX%20foaf%3A%20%20%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0AASK%20%20%7B%20%3Fx%20foaf%3Aname%20%20%22Alice%22%20%7D</pre>Response:<br /><pre class="code">yes|no</pre>'),
                    ('construct', '<p>The CONSTRUCT query form returns a single RDF graph specified by a graph template. The result is an RDF graph formed by taking each query solution in the solution sequence, substituting for the variables in the graph template, and combining the triples into a single RDF graph by set union.</p><p>If any such instantiation produces a triple containing an unbound variable or an illegal RDF construct, such as a literal in subject or predicate position, then that triple is not included in the output RDF graph. The graph template can contain triples with no variables (known as ground or explicit triples), and these also appear in the output RDF graph returned by the CONSTRUCT query form.</p><pre class="code">%40prefix%20%20foaf%3A%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%20.%0A_%3Aa%20%20%20%20foaf%3Aname%20%20%20%22Alice%22%20.%0A_%3Aa%20%20%20%20foaf%3Ambox%20%20%20%3Cmailto%3Aalice%40example.org%3E%20.</pre><pre class="code">PREFIX%20foaf%3A%20%20%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0APREFIX%20vcard%3A%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2Fvcard-rdf%2F3.0%23%3E%0ACONSTRUCT%20%20%20%7B%20%3Chttp%3A%2F%2Fexample.org%2Fperson%23Alice%3E%20vcard%3AFN%20%3Fname%20%7D%0AWHERE%20%20%20%20%20%20%20%7B%20%3Fx%20foaf%3Aname%20%3Fname%20%7D</pre>creates vcard properties from the FOAF information:<pre class="code">%40prefix%20vcard%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2Fvcard-rdf%2F3.0%23%3E%20.%0A%0A%3Chttp%3A%2F%2Fexample.org%2Fperson%23Alice%3E%20vcard%3AFN%20%22Alice%22%20.</pre>'),
                    ('describe', '<p>The DESCRIBE form returns a single result RDF graph containing RDF data about resources. This data is not prescribed by a SPARQL query, where the query client would need to know the structure of the RDF in the data source, but, instead, is determined by the SPARQL query processor. The query pattern is used to create a result set. The DESCRIBE form takes each of the resources identified in a solution, together with any resources directly named by IRI, and assembles a single RDF graph by taking a "description" which can come from any information available including the target RDF Dataset. The description is determined by the query service. The syntax DESCRIBE * is an abbreviation that describes all of the variables in a query.</p><p>The DESCRIBE clause itself can take IRIs to identify the resources. The simplest DESCRIBE query is just an IRI in the DESCRIBE clause:</p><pre class="code">DESCRIBE%20%3Chttp%3A%2F%2Fexample.org%2F%3E</pre><p>The resources to be described can also be taken from the bindings to a query variable in a result set. This enables description of resources whether they are identified by IRI or by blank node in the dataset:</p><pre class="code">PREFIX%20foaf%3A%20%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0ADESCRIBE%20%3Fx%0AWHERE%20%20%20%20%7B%20%3Fx%20foaf%3Ambox%20%3Cmailto%3Aalice%40org%3E%20%7D</pre>'),
                    ('where', '<p>The WHERE clause provides the basic graph pattern to match against the data graph. The basic graph pattern in the following example consists of a single triple pattern with a single variable (?title) in the object position.</p><p>Data:</p><pre class="code">%3Chttp%3A%2F%2Fexample.org%2Fbook%2Fbook1%3E%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2Ftitle%3E%20%22SPARQL%20Tutorial%22%20.</pre><p>Query:</p><pre class="code">SELECT%20%3Ftitle%0AWHERE%0A%7B%0A%20%20%3Chttp%3A%2F%2Fexample.org%2Fbook%2Fbook1%3E%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2Ftitle%3E%20%3Ftitle%20.%0A%7D%20%20%20%20</pre>'),
                    ('from', '<p>Each FROM clause contains an IRI that indicates a graph to be used to form the default graph. This does not put the graph in as a named graph.</p><p>In this example, the RDF Dataset contains a single default graph and no named graphs:</p><pre class="code">%23%20Default%20graph%20(stored%20at%20http%3A%2F%2Fexample.org%2Ffoaf%2FaliceFoaf)%0A%40prefix%20%20foaf%3A%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%20.%0A%0A_%3Aa%20%20foaf%3Aname%20%20%20%20%20%22Alice%22%20.%0A_%3Aa%20%20foaf%3Ambox%20%20%20%20%20%3Cmailto%3Aalice%40work.example%3E%20.</pre><pre class="code">PREFIX%20foaf%3A%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0ASELECT%20%20%3Fname%0AFROM%20%20%20%20%3Chttp%3A%2F%2Fexample.org%2Ffoaf%2FaliceFoaf%3E%0AWHERE%20%20%20%7B%20%3Fx%20foaf%3Aname%20%3Fname%20%7D</pre><p>If a query provides more than one FROM clause, providing more than one IRI to indicate the default graph, then the default graph is based on the RDF merge of the graphs obtained from representations of the resources identified by the given IRIs.</p>'),
                    ('reduced', '<p>While the DISTINCT modifier ensures that duplicate solutions are eliminated from the solution set, REDUCED simply permits them to be eliminated. The cardinality of any set of variable bindings in an REDUCED solution set is at least one and not more than the cardinality of the solution set with no DISTINCT or REDUCED modifier. For example, using this dataset</p><pre class="code">%40prefix%20%20foaf%3A%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%20.%0A%0A_%3Ax%20%20%20%20foaf%3Aname%20%20%20%22Alice%22%20.%0A_%3Ax%20%20%20%20foaf%3Ambox%20%20%20%3Cmailto%3Aalice%40example.com%3E%20.%0A%0A_%3Ay%20%20%20%20foaf%3Aname%20%20%20%22Alice%22%20.%0A_%3Ay%20%20%20%20foaf%3Ambox%20%20%20%3Cmailto%3Aasmith%40example.com%3E%20.%0A%0A_%3Az%20%20%20%20foaf%3Aname%20%20%20%22Alice%22%20.%0A_%3Az%20%20%20%20foaf%3Ambox%20%20%20%3Cmailto%3Aalice.smith%40example.com%3E%20.</pre><p>the query</p><pre class="code">PREFIX%20foaf%3A%20%20%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0ASELECT%20REDUCED%20%3Fname%20WHERE%20%7B%20%3Fx%20foaf%3Aname%20%3Fname%20%7D</pre><p>may have one, two or three solutions.</p>'),
                    ('distinct', '<p>The DISTINCT solution modifier eliminates duplicate solutions. Specifically, each solution that binds the same variables to the same RDF terms as another solution is eliminated from the solution set.</p>'),
                    ('named', '<p>A query can supply IRIs for the named graphs in the RDF Dataset using the FROM NAMED clause. Each IRI is used to provide one named graph in the RDF Dataset. Using the same IRI in two or more FROM NAMED clauses results in one named graph with that IRI appearing in the dataset.</p><p>Data:</p><pre class="code">%23%20Graph%3A%20http%3A%2F%2Fexample.org%2Fbob%0A%40prefix%20foaf%3A%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%20.%0A%0A_%3Aa%20foaf%3Aname%20%22Bob%22%20.%0A_%3Aa%20foaf%3Ambox%20%3Cmailto%3Abob%40oldcorp.example.org%3E%20.</pre><pre class="code">%23%20Graph%3A%20http%3A%2F%2Fexample.org%2Falice%0A%40prefix%20foaf%3A%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%20.%0A%0A_%3Aa%20foaf%3Aname%20%22Alice%22%20.%0A_%3Aa%20foaf%3Ambox%20%3Cmailto%3Aalice%40work.example%3E%20.</pre><p>Query:</p><pre class="code">...%0AFROM%20NAMED%20%3Chttp%3A%2F%2Fexample.org%2Falice%3E%0AFROM%20NAMED%20%3Chttp%3A%2F%2Fexample.org%2Fbob%3E%0A...</pre><p>The FROM NAMED syntax suggests that the IRI identifies the corresponding graph, but the relationship between an IRI and a graph in an RDF dataset is indirect. The IRI identifies a resource, and the resource is represented by a graph (or, more precisely: by a document that serializes a graph).</p>'),
                    ('order', '<p>The ORDER BY clause establishes the order of a solution sequence.</p><p>Following the ORDER BY clause is a sequence of order comparators, composed of an expression and an optional order modifier (either ASC() or DESC()). Each ordering comparator is either ascending (indicated by the ASC() modifier or by no modifier) or descending (indicated by the DESC() modifier).<pre class="code">PREFIX%20foaf%3A%20%20%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0A%0ASELECT%20%3Fname%0AWHERE%20%7B%20%3Fx%20foaf%3Aname%20%3Fname%20%7D%0AORDER%20BY%20%3Fname</pre><pre class="code">PREFIX%20%20%20%20%20%3A%20%20%20%20%3Chttp%3A%2F%2Fexample.org%2Fns%23%3E%0APREFIX%20foaf%3A%20%20%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0APREFIX%20xsd%3A%20%20%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0A%0ASELECT%20%3Fname%0AWHERE%20%7B%20%3Fx%20foaf%3Aname%20%3Fname%20%3B%20%3AempId%20%3Femp%20%7D%0AORDER%20BY%20DESC(%3Femp)</pre><pre class="code">PREFIX%20foaf%3A%20%20%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0A%0ASELECT%20%3Fname%0AWHERE%20%7B%20%3Fx%20foaf%3Aname%20%3Fname%20%3B%20%3AempId%20%3Femp%20%7D%0AORDER%20BY%20%3Fname%20DESC(%3Femp)</pre>'),
                    ('limit', '<p>The LIMIT clause puts an upper bound on the number of solutions returned. If the number of actual solutions is greater than the limit, then at most the limit number of solutions will be returned.</p><pre class="code">PREFIX%20foaf%3A%20%20%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0A%0ASELECT%20%3Fname%0AWHERE%20%7B%20%3Fx%20foaf%3Aname%20%3Fname%20%7D%0ALIMIT%2020</pre><p>A LIMIT of 0 would cause no results to be returned. A limit may not be negative.</p>'),
                    ('offset', '<p>OFFSET causes the solutions generated to start after the specified number of solutions. An OFFSET of zero has no effect.</p><p>Using LIMIT and OFFSET to select different subsets of the query solutions will not be useful unless the order is made predictable by using ORDER BY.</p><pre class="code">PREFIX%20foaf%3A%20%20%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0A%0ASELECT%20%20%3Fname%0AWHERE%20%20%20%7B%20%3Fx%20foaf%3Aname%20%3Fname%20%7D%0AORDER%20BY%20%3Fname%0ALIMIT%20%20%205%0AOFFSET%20%2010</pre>'),
                    ('filter', '<p>SPARQL FILTERs restrict the solutions of a graph pattern match according to a given expression. Specifically, FILTERs eliminate any solutions that, when substituted into the expression, either result in an effective boolean value of false or produce an error.</p><p>RDF literals may have a datatype IRI:</p><pre class="code">%40prefix%20a%3A%20%20%20%20%20%20%20%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F10%2Fannotation-ns%23%3E%20.%0A%40prefix%20dc%3A%20%20%20%20%20%20%20%20%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%3E%20.%0A%0A_%3Aa%20%20%20a%3Aannotates%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2FTR%2Frdf-sparql-query%2F%3E%20.%0A_%3Aa%20%20%20dc%3Adate%20%20%20%20%20%20%20%222004-12-31T19%3A00%3A00-05%3A00%22%20.%0A%0A_%3Ab%20%20%20a%3Aannotates%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2FTR%2Frdf-sparql-query%2F%3E%20.%0A_%3Ab%20%20%20dc%3Adate%20%20%20%20%20%20%20%222004-12-31T19%3A01%3A00-05%3A00%22%5E%5E%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23dateTime%3E%20.</pre><p>The object of the first dc:date triple has no type information. The second has the datatype xsd:dateTime.</p><p>SPARQL expressions are constructed according to the grammar and provide access to functions (named by IRI) and operator functions (invoked by keywords and symbols in the SPARQL grammar). SPARQL operators can be used to compare the values of typed literals:</p><pre class="code">PREFIX%20a%3A%20%20%20%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F10%2Fannotation-ns%23%3E%0APREFIX%20dc%3A%20%20%20%20%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%3E%0APREFIX%20xsd%3A%20%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0A%0ASELECT%20%3Fannot%0AWHERE%20%7B%20%3Fannot%20%20a%3Aannotates%20%20%3Chttp%3A%2F%2Fwww.w3.org%2FTR%2Frdf-sparql-query%2F%3E%20.%0A%20%20%20%20%20%20%20%20%3Fannot%20%20dc%3Adate%20%20%20%20%20%20%3Fdate%20.%0A%20%20%20%20%20%20%20%20FILTER%20(%20%3Fdate%20%3E%20%222005-01-01T00%3A00%3A00Z%22%5E%5Exsd%3AdateTime%20)%20%7D</pre><p>In addition, SPARQL provides the ability to invoke arbitrary functions, including a subset of the XPath casting functions, listed in section 11.5. These functions are invoked by name (an IRI) within a SPARQL query. For example:</p><pre class="code">...%20FILTER%20(%20xsd%3AdateTime(%3Fdate)%20%3C%20xsd%3AdateTime(%222005-01-01T00%3A00%3A00Z%22)%20)%20...</pre><p>The following typographical conventions are used in this section:</p><ul><li>XPath operators are labeled with the prefix <code>op:</code>. XPath operators have no namespace; <code>op:</code> is a labeling convention.</li><li>Operators introduced by this specification are indicated with the <span class="SPARQLoperator">SPARQLoperator class</span>.</li></ul>'),
                    ('optional', '<p>Constraints can be given in an optional graph pattern. For example:</p><p>Data:</p><pre class="code">%40prefix%20dc%3A%20%20%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%3E%20.%0A%40prefix%20%3A%20%20%20%20%20%3Chttp%3A%2F%2Fexample.org%2Fbook%2F%3E%20.%0A%40prefix%20ns%3A%20%20%20%3Chttp%3A%2F%2Fexample.org%2Fns%23%3E%20.%0A%0A%3Abook1%20%20dc%3Atitle%20%20%22SPARQL%20Tutorial%22%20.%0A%3Abook1%20%20ns%3Aprice%20%2042%20.%0A%3Abook2%20%20dc%3Atitle%20%20%22The%20Semantic%20Web%22%20.%0A%3Abook2%20%20ns%3Aprice%20%2023%20.</pre><p>Query:</p><pre class="code">PREFIX%20%20dc%3A%20%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%3E%0APREFIX%20%20ns%3A%20%20%3Chttp%3A%2F%2Fexample.org%2Fns%23%3E%0ASELECT%20%20%3Ftitle%20%3Fprice%0AWHERE%20%20%20%7B%20%3Fx%20dc%3Atitle%20%3Ftitle%20.%0A%20%20%20%20%20%20%20%20%20%20OPTIONAL%20%7B%20%3Fx%20ns%3Aprice%20%3Fprice%20.%20FILTER%20(%3Fprice%20%3C%2030)%20%7D%0A%20%20%20%20%20%20%20%20%7D</pre><p>Result:</p><table class="code"><tr><th>title</th><th>price</th></tr><tr><td>"SPARQL Tutorial"</td><td></td></tr><tr><td>"The Semantic Web"</td><td>23</td></tr></table><p>No price appears for the book with title "SPARQL Tutorial" because the optional graph pattern did not lead to a solution involving the variable "price".</p>'),
                    ('graph', ''),
                    ('by', '<p>Must be preceded by either tje ORDER or GROUP keyword.</p>'),
                    ('asc', '<p>Following the ORDER BY clause is a sequence of order comparators, composed of an expression and an optional order modifier (either ASC() or DESC()). Each ordering comparator is either ascending (indicated by the ASC() modifier or by no modifier) or descending (indicated by the DESC() modifier).</p>'),
                    ('desc', '<p>Following the ORDER BY clause is a sequence of order comparators, composed of an expression and an optional order modifier (either ASC() or DESC()). Each ordering comparator is either ascending (indicated by the ASC() modifier or by no modifier) or descending (indicated by the DESC() modifier).</p>'),
                    ('service', '<p>The evaluation of SERVICE is defined in terms of the SPARQL Results returned by a SPARQL Protocol execution of the nested graph pattern.</p><p>In the folowing section we introduce two examples showing the evaluation of SERVICE patterns in the SPARQL algebra:</p><p>Example: a SERVICE graph pattern in a series of joins:<pre class="code">...%20WHERE%20%7B%20%7B%20%3Fs%20%3Ap1%20%3Fv1%20%7D%20SERVICE%20%3Csrvc%3E%20%7B%3Fs%20%3Ap2%20%3Fv2%20%7D%20%7B%20%3Fs%20%3Ap3%20%3Fv2%20%7D%20%7D%0AJoin(%20Service(%20%3Csrvc%3E%2C%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20BGP(%20%3Fs%20%3Ap2%20%3Fv2%20)%2C%20false%20)%2C%0A%20%20%20%20%20%20BGP(%20%3Fs%20%3Ap3%20%3Fv2%20)%20)</pre><p>Example: a SERVICE SILENT graph pattern in a series of joins:</p><pre class="code">...%20WHERE%20%7B%20%7B%20%3Fs%20%3Ap1%20%3Fv1%20%7D%20SERVICE%20SILENT%20%3Csrvc%3E%20%7B%3Fs%20%3Ap2%20%3Fv2%20%7D%20%7B%20%3Fs%20%3Ap3%20%3Fv2%20%7D%20%7D%0AJoin(%20Service(%20%3Csrvc%3E%2C%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20BGP(%20%3Fs%20%3Ap2%20%3Fv2%20)%2C%20true%20)%2C%0A%20%20%20%20%20%20BGP(%20%3Fs%20%3Ap3%20%3Fv2%20)%20)</pre>'),
                    ('str', '<p>Returns the <code class="type lexicalForm">lexical form</code> of <code>ltrl</code> (a <span class="type literal">literal</span>); returns the codepoint representation of <code>rsrc</code> (an <span class="type IRI">IRI</span>). This is useful for examining parts of an IRI, for instance, the host-name.</p>'),
                    ('lang', '<p>Returns the <code class="type langTag">language tag</code> of <code>ltrl</code>, if it has one. It returns <code>""</code> if <code>ltrl</code> has no <code class="type langTag">language tag</code>. Note that the RDF data model does not include literals with an empty <code class="type langTag">language tag</code>.</p>'),
                    ('langmatches', '<p>Returns true if language-tag (first argument) matches language-range (second argument). A language-range of "*" matches any non-empty language-tag string.</p>'),
                    ('datatype', '<p>Returns the <code class="type datatypeIRI">datatype IRI</code> of <code>typedLit</code>; returns <code>xsd:string</code> if the parameter is a <span class="type simpleLiteral">simple literal</span>.</p>'),
                    ('bound', '<p>Returns <code>true</code> if <code>var</code> is bound to a value. Returns false otherwise. Variables with the value NaN or INF are considered bound.</p>'),
                    ('sameterm', '<p>Returns TRUE if term1 and term2 are the same RDF term.</p>'),
                    ('isiri', '<p>Returns <code>true</code> if <code>term</code> is an <span class="type IRI">IRI</span>. Returns <code>false</code> otherwise. <code class="operator" title="operator">isURI</code> is an alternate spelling for the <code class="operator" title="operator">isIRI</code> operator.</p>'),
                    ('isuri', '<p>Returns <code>true</code> if <code>term</code> is an <span class="type IRI">IRI</span>. Returns <code>false</code> otherwise. <code class="operator" title="operator">isIRI</code> is an alternate spelling for the <code class="operator" title="operator">isURI</code> operator.</p>'),
                    ('isblank', '<p>Returns <code>true</code> if <code>term</code> is a <span class="type bNode">blank node</span>. Returns <code>false</code> otherwise.</p>'),
                    ('isliteral', '<p>Returns <code>true</code> if <code>term</code> is a <span class="type literal">literal</span>. Returns <code>false</code> otherwise.</p>'),
                    ('union', '<p>SPARQL provides a means of combining graph patterns so that one of several alternative graph patterns may match. If more than one of the alternatives matches, all the possible pattern solutions are found.</p><p>Pattern alternatives are syntactically specified with the UNION keyword.</p><p>The UNION pattern combines graph patterns; each alternative possibility can contain more than one triple pattern.</p><p>Data:</p><pre class="code">%40prefix%20dc10%3A%20%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.0%2F%3E%20.%0A%40prefix%20dc11%3A%20%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%3E%20.%0A%0A_%3Aa%20%20dc10%3Atitle%20%20%20%20%20%22SPARQL%20Query%20Language%20Tutorial%22%20.%0A_%3Aa%20%20dc10%3Acreator%20%20%20%22Alice%22%20.%0A%0A_%3Ab%20%20dc11%3Atitle%20%20%20%20%20%22SPARQL%20Protocol%20Tutorial%22%20.%0A_%3Ab%20%20dc11%3Acreator%20%20%20%22Bob%22%20.%0A%0A_%3Ac%20%20dc10%3Atitle%20%20%20%20%20%22SPARQL%22%20.%0A_%3Ac%20%20dc11%3Atitle%20%20%20%20%20%22SPARQL%20(updated)%22%20.</pre><p>Query:</p><pre class="code">PREFIX%20dc10%3A%20%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.0%2F%3E%0APREFIX%20dc11%3A%20%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%3E%0A%0ASELECT%20%3Ftitle%0AWHERE%20%20%7B%20%7B%20%3Fbook%20dc10%3Atitle%20%20%3Ftitle%20%7D%20UNION%20%7B%20%3Fbook%20dc11%3Atitle%20%20%3Ftitle%20%7D%20%7D</pre><p>Result:</p><table class="code"><tbody><tr><th>title</th></tr><tr><td>"SPARQL Protocol Tutorial"</td></tr><tr><td>"SPARQL"</td></tr><tr><td>"SPARQL (updated)"</td></tr><tr><td>"SPARQL Query Language Tutorial"</td></tr></tbody></table>'),
                    ('a', '<p>The keyword "a" can be used as a predicate in a triple pattern and is an alternative for the IRI  <a href="http://www.w3.org/1999/02/22-rdf-syntax-ns#type" target="_blank">&lt;http://www.w3.org/1999/02/22-rdf-syntax-ns#type&gt;</a>. This keyword is case-sensitive.</p><pre class="code">%20%3Fx%20%20a%20%20%3AClass1%20.%0A%20%20%5B%20a%20%3AappClass%20%5D%20%3Ap%20%22v%22%20.</pre><p>is syntactic sugar for:</p><pre class="code">%20%3Fx%20%20%20%20rdf%3Atype%20%20%3AClass1%20.%0A%20%20_%3Ab0%20%20rdf%3Atype%20%20%3AappClass%20.%0A%20%20_%3Ab0%20%20%3Ap%20%20%20%20%20%20%20%20%22v%22%20.</pre>'),
                    ('count', '<p>Count is an aggregate function which counts the number of times a given expression has a bound, and non-error value within the aggregate group.</p>'),
                    ('number', ''),
                    ('sum', '<p>Sum is an aggregate function that will return the numeric value obtained by summing the values within the aggregate group. Type promotion happens as per the op:numeric-add function, applied transitively, (see definition below) so the value of SUM(?x), in an aggregate group where ?x has values 1 (integer), 2.0e0 (float), and 3.0 (decimal) will be 6.0 (float).</p>'),
                    ('min', '<p>Min is an aggregate function that returns the minimum value from a group respectively.It makes use of the ORDER BY ordering definition, to allow ordering over arbitrarily typed expressions.</p>'),
                    ('max', '<p>Max is an aggregate function that returns the maximum value from a group respectively.It makes use of the ORDER BY ordering definition, to allow ordering over arbitrarily typed expressions.</p>'),
                    ('avg', '<p>The Avg set function calculates the average value for an expression over a group. It is defined in terms of Sum and Count.</p>'),
                    ('minus', '<p>MINUS evaluates both its arguments, then calculates solutions in the left-hand side that are not compatible with the solutions on the right-hand side.</p><p>Data:</p><pre class="code">%40prefix%20%3A%20%20%20%20%20%20%20%3Chttp%3A%2F%2Fexample%2F%3E%20.%0A%40prefix%20foaf%3A%20%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%20.%0A%0A%3Aalice%20%20foaf%3AgivenName%20%22Alice%22%20%3B%0A%20%20%20%20%20%20%20%20foaf%3AfamilyName%20%22Smith%22%20.%0A%0A%3Abob%20%20%20%20foaf%3AgivenName%20%22Bob%22%20%3B%0A%20%20%20%20%20%20%20%20foaf%3AfamilyName%20%22Jones%22%20.%0A%0A%3Acarol%20%20foaf%3AgivenName%20%22Carol%22%20%3B%0A%20%20%20%20%20%20%20%20foaf%3AfamilyName%20%22Smith%22%20.</pre><p>Query:</p><pre class="code">PREFIX%20%3A%20%20%20%20%20%20%20%3Chttp%3A%2F%2Fexample%2F%3E%0APREFIX%20foaf%3A%20%20%20%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0A%0ASELECT%20DISTINCT%20%3Fs%0AWHERE%20%7B%0A%20%20%20%3Fs%20%3Fp%20%3Fo%20.%0A%20%20%20MINUS%20%7B%0A%20%20%20%20%20%20%3Fs%20foaf%3AgivenName%20%22Bob%22%20.%0A%20%20%20%7D%0A%7D</pre><p>Results:</p><table class="code"><tbody><tr><th>s</th></tr><tr><td>&lt;http://example/carol&gt;</td></tr><tr><td>&lt;http://example/alice&gt;</td></tr></tbody></table>'),
                    ('as', '<p>The value of an expression can be added to a solution mapping by binding a new variable to the value of the expression, which is an RDF term.  The variable can then be used in the query and also can be returned in results.</p><p>Three syntax forms allow this: the <a href="#assignment"><code>BIND</code> keyword</a>, <a href="#selectExpressions">expressions in the <code>SELECT</code> clause</a> and <a href="#groupby">expressions in the <code>GROUP BY</code> clause</a>. The assignment form is <code>(<i>expression</i> AS ?var)</code>. </p><p>If the evaluation of the expression produces an error, the variable remains unbound for that solution but the query evaluation continues.</p><p>Data can also be directly included in a query using <a href="#inline-data"><code>VALUES</code></a> for inline data.</p>')]

    for keyword_doc in keyword_docs:
        if keyword_doc[0] == keyword.lower():
            return HttpResponse(keyword_doc[1])

    return HttpResponse('No documentation found.')


# Get vocabulary from namespace uri
def get_voc_from_uri(v_uri_enc):
    v_uri = urllib.parse.unquote(v_uri_enc)
    v = Vocabulary.objects.get(preferredNamespaceUri=v_uri)
    if not v:
        return None
    return v


# Get info about a vocabulary
def vocabulary_docs(request):
    q = request.GET.get('q', None)
    if not q:
        raise Http404

    v = get_voc_from_uri(q)
    if not v:
        return HttpResponse('Vocabulary not found')

    return render(request, "builder_advanced/docs/vocabulary.html", {"vocabulary": v})


# Docs for classes in vocabularies
def vocabulary_class_docs(request, vocabulary):
    q = request.GET.get('q', None)
    if not q:
        raise Http404

    # get class
    c_uri = urllib.parse.unquote(q)
    c = VocabularyClass.objects.get(uri=c_uri)
    if not c:
        raise Http404

    return render(request, "builder_advanced/docs/class.html", {"class": c})


# Docs for properties in vocabularies
def vocabulary_property_docs(request, vocabulary):
    q = request.GET.get('q', None)
    if not q:
        raise Http404

    # get class
    p_uri = urllib.parse.unquote(q)
    p = VocabularyProperty.objects.get(uri=p_uri)
    if not p:
        raise Http404

    return render(request, "builder_advanced/docs/property.html", {"property": p})


def active_classes(request, dt_name):
    dt_name = urllib.parse.unquote(dt_name)

    # get class
    q = request.GET.get('q', None)
    if not q:
        raise Http404
    q = urllib.parse.unquote(q)

    # try to locate in the repository first
    c_from_db = VocabularyClass.objects.filter(uri=q)
    if c_from_db:
        return render(request, "builder_advanced/docs/class.html", {"class": c_from_db[0]})

    # get endpoint
    endpoint = get_endpoint_from_dt_name(dt_name)
    if not endpoint:
        raise Http404

    property_limit = 10
    query = 'SELECT DISTINCT ?property WHERE { ?x a <' + q + '>. ?x ?property ?y .} limit ' + str(property_limit)

    # get json result
    result = sparql_query_json(endpoint, query)

    # check for errors
    if result.status_code >= 400:
        return HttpResponse(result.content, status=result.status_code)

    # create the class object
    res = json.loads(result.content.decode('utf-8'))

    properties = []
    bindings = res['results']['bindings']
    for b in bindings:
        properties.append(b['property']['value'])
    class_object = {"uri": q, "properties": properties}

    # return class template
    options = {"class": class_object, "from_json": True, "property_limit": property_limit}
    return render(request, "builder_advanced/docs/class.html", options)


def active_properties(request, dt_name):
    dt_name = urllib.parse.unquote(dt_name)

    # get class
    q = request.GET.get('q', None)
    if not q:
        raise Http404
    q = urllib.parse.unquote(q)

    # try to locate in the repository first
    p_from_db = VocabularyProperty.objects.filter(uri=q)
    if p_from_db:
        return render(request, "builder_advanced/docs/property.html", {"property": p_from_db[0]})

    # get endpoint
    endpoint = get_endpoint_from_dt_name(dt_name)
    if not endpoint:
        raise Http404

    query = 'SELECT ?domain ?range WHERE { ?a <' + q + '> ?b . ?a a ?domain . optional{?b a ?range .} } limit 1'

    # get json result
    result = sparql_query_json(endpoint, query)

    # check for errors
    if result.status_code >= 400:
        return HttpResponse(result.content, status=result.status_code)

    # create the class object
    res = json.loads(result.content.decode('utf-8'))

    if len(res['results']['bindings']) == 0:
        return HttpResponse('<p>Docs not found.</p>')

    b = res['results']['bindings'][0]
    if 'range' in b:
        p_range = b['range']['value']
    else:
        p_range = 'http://www.w3.org/2000/01/rdf-schema#Literal'
    property_object = {"uri": q, "domain": b['domain']['value'], "range": p_range}

    # return class template
    return render(request, "builder_advanced/docs/property.html", {"property": property_object, "from_json": True})