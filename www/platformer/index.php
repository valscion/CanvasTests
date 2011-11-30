<!DOCTYPE HTML>
<head>
  <base href="http://vesq.org/canvas/platformer/" />

  <title>VesQ.org - canvas stuff</title>
  <meta name="description" content="Vesa &quot;VesQ&quot; Laakson kotisivut." />
  <meta name="author" content="Vesa &quot;VesQ&quot; Laakso" />
  
  <!-- Link to humans.txt -->
  <link type="text/plain" rel="author" href="http://vesq.org/humans.txt" />

  <!-- Mobile viewport optimized: j.mp/bplateviewport -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Place favicon.ico & apple-touch-icon.png in the root of your domain and delete these references -->
  <link rel="shortcut icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  
<style>
/**
 * HTML5 ? Boilerplate
 *
 * style.css contains a reset, font normalization and some base styles.
 *
 * Credit is left where credit is due.
 * Much inspiration was taken from these projects:
 * - yui.yahooapis.com/2.8.1/build/base/base.css
 * - camendesign.com/design/
 * - praegnanz.de/weblog/htmlcssjs-kickstart
 */


/**
 * html5doctor.com Reset Stylesheet (Eric Meyer's Reset Reloaded + HTML5 baseline)
 * v1.6.1 2010-09-17 | Authors: Eric Meyer & Richard Clark
 * html5doctor.com/html-5-reset-stylesheet/
 */

html, body, div, span, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
abbr, address, cite, code, del, dfn, em, img, ins, kbd, q, samp,
small, strong, sub, sup, var, b, i, dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, figcaption, figure,
footer, header, hgroup, menu, nav, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}

article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
  display: block;
}

blockquote, q { quotes: none; }

blockquote:before, blockquote:after,
q:before, q:after { content: ""; content: none; }

ins { background-color: #ff9; color: #000; text-decoration: none; }

mark { background-color: #ff9; color: #000; font-style: italic; font-weight: bold; }

del { text-decoration: line-through; }

abbr[title], dfn[title] { border-bottom: 1px dotted; cursor: help; }

table { border-collapse: collapse; border-spacing: 0; }

hr { display: block; height: 1px; border: 0; border-top: 1px solid #ccc; margin: 1em 0; padding: 0; }

input, select { vertical-align: middle; }


/**
 * Font normalization inspired by YUI Library's fonts.css: developer.yahoo.com/yui/
 */

body { font:13px/1.231 sans-serif; }
select, input, textarea, button { font:99% sans-serif; }

/* Normalize monospace sizing:
   en.wikipedia.org/wiki/MediaWiki_talk:Common.css/Archive_11#Teletype_style_fix_for_Chrome */
pre, code, kbd, samp { font-family: monospace, sans-serif; }


/**
 * Minimal base styles.
 */

/* Always disable scrollbar in non-IE */
html { overflow-y: hidden; }

/* Accessible focus treatment: people.opera.com/patrickl/experiments/keyboard/test */
a:hover, a:active { outline: none; }

ul, ol { margin-left: 2em; }
ol { list-style-type: decimal; }

/* Remove margins for navigation lists */
nav ul, nav li { margin: 0; list-style:none; list-style-image: none; }

small { font-size: 85%; }
strong, th { font-weight: bold; }

td { vertical-align: top; }

/* Set sub, sup without affecting line-height: gist.github.com/413930 */
sub, sup { font-size: 75%; line-height: 0; position: relative; }
sup { top: -0.5em; }
sub { bottom: -0.25em; }

pre {
  /* www.pathf.com/blogs/2008/05/formatting-quoted-code-in-blog-posts-css21-white-space-pre-wrap/ */
  white-space: pre; white-space: pre-wrap; word-wrap: break-word;
  padding: 15px;
}

textarea { overflow: auto; } /* www.sitepoint.com/blogs/2010/08/20/ie-remove-textarea-scrollbars/ */

.ie6 legend, .ie7 legend { margin-left: -7px; } 

/* Align checkboxes, radios, text inputs with their label by: Thierry Koblentz tjkdesign.com/ez-css/css/base.css  */
input[type="radio"] { vertical-align: text-bottom; }
input[type="checkbox"] { vertical-align: bottom; }

/* Hand cursor on clickable input elements */
label, input[type="button"], input[type="submit"], input[type="image"], button { cursor: pointer; }

/* Webkit browsers add a 2px margin outside the chrome of form elements */
button, input, select, textarea { margin: 0; }

/* Colors for form validity */
input:valid, textarea:valid   {  }
input:invalid, textarea:invalid {
   border-radius: 1px; -moz-box-shadow: 0px 0px 5px red; -webkit-box-shadow: 0px 0px 5px red; box-shadow: 0px 0px 5px red;
}

/* These selection declarations have to be separate
   No text-shadow: twitter.com/miketaylr/status/12228805301
   Also: hot pink! 
::-moz-selection{ background: #FF5E99; color:#fff; text-shadow: none; }
::selection { background:#FF5E99; color:#fff; text-shadow: none; }
*/

/* j.mp/webkit-tap-highlight-color */
a:link { -webkit-tap-highlight-color: #FF5E99; }

/* Make buttons play nice in IE:
   www.viget.com/inspire/styling-the-button-element-in-internet-explorer/ */
button { width: auto; overflow: visible; }



/**
 * Primary styles
 *
 * Author: Vesa "VesQ" Laakso
 */

body {
  background-color: black;
}

#container {
  width: 800px;
  margin-left: auto;
  margin-right: auto;
}

#maincontainer {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

header {
  height: 80px;
  vertical-align: bottom;
  width: 100%;
  border-bottom: 1px solid #777;
}

header h1 {
  width: 500px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  padding-top: 20px;
  font-size: 3em;
}

header a, header a:hover, header a:visited, header a:active, header a:link {
  color: #eee;
  text-decoration: none;
}

#canvascontainer {
  width: 0px;
  height: 0px;
  border: 1px solid #777;
  box-shadow: 0 0 10px 5px #eee;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
}
</style>

</head>

<body>
  <div id="container">
    <div id="maincontainer">
      <header>
        <h1><a href="http://vesq.org/canvas/">VesQ.org - canvas stuff</a></h1>
      </header>
      
      <div id="canvascontainer">
        <!-- create canvas here with javascript -->
      </div> <!-- close #canvascontainer -->
    </div> <!-- close #maincontainer -->
  </div> <!-- close #container -->

  <!-- JavaScript at the bottom for fast page loading -->
  
  <!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if necessary -->
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
  <script>window.jQuery || document.write("<script src='../libs/jquery-1.6.4.min.js'>\x3C/script>")</script>

  <!-- Kinetic 2d, http://www.kineticjs.com/ -->
  <script src="../libs/kinetic2d-v1.0.2.js"></script>
  
  <script src="scripts.js?trick=<?=filemtime('scripts.js')?>"></script>
  
  <!-- mathiasbynens.be/notes/async-analytics-snippet -->
  <script>
    var _gaq=[["_setAccount","UA-23613883-1"],["_trackPageview"]];
    (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
    g.src=("https:"==location.protocol?"//ssl":"//www")+".google-analytics.com/ga.js";
    s.parentNode.insertBefore(g,s)}(document,"script"));
  </script>
</body>