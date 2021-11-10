
function Timer(time){
    var countDownDate = new Date(time).getTime();

    var now = new Date().getTime();

    var distance = countDownDate - now;

    if (distance < 0) {
        //clearInterval(x);
        const count = {expired: true}
        return count;
    }

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const count = {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds : seconds,
        expired: false
    }
    
    return count

}


export default Timer;