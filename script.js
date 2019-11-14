eventActivities = [];
function find(elist) {
    $.each($(".hour"), function (key, h) {
        var value = $(h).text();
        if (elist.date === moment().format('dddd,MMMM Do')) {

            if (value == elist.time) {
                $("#tArea" + key).text(elist.eventDesc);
                return;
            }
        }
    });
}

function init() {
    $("#currentDay").text(moment().format('dddd,MMMM Do'));
    eventActivities = JSON.parse(localStorage.getItem("schedule"));
    console.log(eventActivities);
    if (eventActivities != null) {
        for (var i = 0; i < eventActivities.length; i++) {
            find(eventActivities[i]);
        }
    }
    update();
}

function update() {
    var hour = moment().format("hh a");
    var minute = moment().minutes();
    console.log(hour + "," + minute);
    $.each($(".hour"), function (key, h) {
        var value = $(h).text();

        if (moment(value, "hh a").isSame(moment(hour, "hh a"))) {
            $("#tArea" + key).css("background-color", "red");
            $("#tArea" + key).attr("disabled", false);
            $("#btn" + key).attr("disabled", false);
        }
        else if (moment(hour, "hh a").isAfter(moment(value, "hh a"))) {
            $("#tArea" + key).addClass("past");
            $("#tArea" + key).attr("disabled", true);
            $("#btn" + key).attr("disabled", true);
        }
        else if (moment(hour, "hh a").isBefore(moment(value, "hh a"))) {
            $("#tArea" + key).addClass("future");
            $("#tArea" + key).attr("disabled", false);
            $("#btn" + key).attr("disabled", false);
        }
    });
}

function storeLocal(event) {
    event.preventDefault();
    var events = {
        time: "",
        date: "",
        eventDesc: "",
    };

    function isPresent() {
        console.log("in ispresent");
        eventActivities = JSON.parse(localStorage.getItem("schedule"));
        if (eventActivities == null) {
            if (events.eventDesc !== "") {
                eventActivities = [];
                eventActivities.push(events);
            }

        }
        else {

            for (var i = 0; i < eventActivities.length; i++) {
                if (eventActivities[i].date === events.date) {
                    if (eventActivities[i].time == events.time) {
                        if (events.eventDesc == "") {
                            eventActivities.splice(i, 1);
                        }
                        else {
                            eventActivities[i].eventDesc = events.eventDesc;

                        }
                        return 0;
                    }
                }
            }
            return 1;
        }
    }

    var el = $(this).attr("id");

    var index = el.indexOf("n");
    var id = "";
    for (var i = (index + 1); i < el.length; i++) {
        id += el.charAt(i);
    }
    id = parseInt(id);

    events.eventDesc = $("textarea#tArea" + id).val();
    events.time = $("label[for='tArea" + id + "']").text();
    events.date = moment().format('dddd,MMMM Do');

    if (isPresent() > 0) {
        if (events.eventDesc !== "") {
            eventActivities.push(events);
        }
        else {
            return;
        }
    }

    if (eventActivities.length != 0) {
        localStorage.setItem("schedule", JSON.stringify(eventActivities));
    }
    else {
        localStorage.setItem("schedule", null);
    }

}

$(window).on('load', init);
$(".btn").on('click', storeLocal); 