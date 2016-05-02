var ParticiBrol = {

    userID: -1,
    voteCount: 0,
    voteDisplay: null,
    firing: false,

    fire: function() {
        if(ParticiBrol.firing)
            ParticiBrol.stop();
        ParticiBrol.voteCount = 0;
        var username = $("#name").val();
        ParticiBrol.fetchUserID(username);
        setTimeout(function() {
            var option = $("#option").val();
            if(ParticiBrol.userID == -1)
                return;
            //FIRE THE CANNONS
            ParticiBrol.firing = true;
            ParticiBrol.shoot(username, ParticiBrol.userID, option);
        }, 1000);
    },

    shoot: function(username, userID, option) {
        var rand = Math.floor((Math.random() * 100000) + 1);
        var url = "http://www."+ username +".participoll.com/wp-content/themes/participoll/alternativeCall.php?action=run_ajax&fn=log_response&userID=" + userID + "&participantID=" + rand + "&response=" + option;
        $.post(url, function(data) {
            if (data != "OK")
                ParticiBrol.firing = false;
            else {
                ParticiBrol.voteCount++;
                ParticiBrol.voteDisplay.text(ParticiBrol.voteCount);
                if(ParticiBrol.firing) {
                    setTimeout(function() {
                        ParticiBrol.shoot(username, userID, option);
                    }, 1);
                }
            }
        });
    },

    stop: function() {
        //STOP THE CANNONS
        if(ParticiBrol.firing)
            ParticiBrol.firing = false;
    },

    fetchUserID: function(username) {
        var url = 'http://'+ username +'.participoll.com/';
        var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + url + '" and xpath="/html/head/script"') + '&format=json';
        $.getJSON(yql, function(data){
            var script = data['query']['results']['script'][1];
            ParticiBrol.userID = script.split("userID = ")[1].split(";")[0];
        });
    },

    init: function() {
        ParticiBrol.voteDisplay = $("#votecount");
        $("#fire").on('click', ParticiBrol.fire);
        $("#stop").on('click', ParticiBrol.stop);
    }

};

$(document).on('ready', function() {
    ParticiBrol.init();
});