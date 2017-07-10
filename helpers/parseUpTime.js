/**
 * Created by Kronenberg on 05.07.2017.
 */
// JAAAAAACCKKK SPARRROOOOW
exports.dayTimeFormat = function(seconds){
    function pad(s) { return (s < 10 ? '0' : '') + s; }
    var hours = Math.floor(seconds / (60*60));
    var minutes = Math.floor(seconds % (60*60) / 60);
    var seconds = Math.floor(seconds % 60);

    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}