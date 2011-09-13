<!DOCTYPE HTML>
<head>
  <base href="http://vesq.org/canvas/" />

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
  
  <!-- CSS: implied media="all" -->
  <link rel="stylesheet" href="style.css?v=1" />

</head>

<body>
  <div id="container">
    <div id="maincontainer">
      <header>
        <h1><a href="http://vesq.org/canvas/">VesQ.org - canvas stuff</a></h1>
      </header>
      
      <div id="canvascontainer">
        <canvas id="maincanvas" width="640" height="480"></canvas>
      </div> <!-- close #canvascontainer -->
    </div> <!-- close #maincontainer -->
  </div> <!-- close #container -->

  <!-- JavaScript at the bottom for fast page loading -->
  
  <!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if necessary -->
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.6.3/jquery.min.js"></script>
  <!-- <script>window.jQuery || document.write("<script src='/js/libs/jquery-1.6.3.min.js'>\x3C/script>")</script> -->

  <script src="scripts.js"></script>
  
  <!-- mathiasbynens.be/notes/async-analytics-snippet -->
  <script>
    var _gaq=[["_setAccount","UA-23613883-1"],["_trackPageview"]];
    (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
    g.src=("https:"==location.protocol?"//ssl":"//www")+".google-analytics.com/ga.js";
    s.parentNode.insertBefore(g,s)}(document,"script"));
  </script>
</body>