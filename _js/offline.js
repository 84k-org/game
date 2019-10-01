//if(location.href.indexOf("file:///")!=-1)
if($("#tohome") &&
    (location.href.substr(0,8)== "file:///" ||
    location.href.substr(0,16)=="http://localhost"))

    $("#tohome").attr("href", "../index.html");

else
{
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-145873777-1', 'auto');
    ga('send', 'pageview');
}
//else console.log("GA"+location.search.substr(1).indexOf("test"));

// https://developers.google.com/analytics/devguides/collection/analyticsjs/