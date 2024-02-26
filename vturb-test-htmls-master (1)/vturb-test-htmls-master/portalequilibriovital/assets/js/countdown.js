// if (localStorage.getItem("total_seconds")) {
//     var total_seconds = localStorage.getItem("total_seconds");
// } else {
var total_seconds = 1200 * 3;
// }

var countdown = {
    hours: parseInt(total_seconds / 3600),
    minutes: parseInt(total_seconds / 60 % 60),
    seconds: parseInt(total_seconds % 60)
}
function countDownTimer() {
    for (digit in countdown) {
        if (countdown[digit] < 10) {
            countdown[digit] = "0" + countdown[digit];
        }
        tags = document.getElementsByClassName(digit);
        for (i = 0; i < tags.length; i++) {
            tags[i].innerHTML = countdown[digit];
        }
    }

    if (total_seconds > 0) {
        total_seconds = total_seconds - 1;
        countdown["hours"] = parseInt(total_seconds / 3600);
        countdown["minutes"] = parseInt(total_seconds / 60 % 60);
        countdown["seconds"] = parseInt(total_seconds % 60);
        localStorage.setItem("total_seconds", total_seconds)
    } else {
        clearInterval(timer);
    }
}
timer = setInterval(countDownTimer, 1000);