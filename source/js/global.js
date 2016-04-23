var $ = require('jquery');

(function() {
    var test = [1,2,3,4,5,6,8];

    var sum = test.reduce( (a,b) => a + b );

    $('h1').css({
        'color': '#ff0000'
    }).text(sum);
})();
