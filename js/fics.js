const track = document.getElementById("image-track");
var touchX = 0, touchY = 0;

window.onmousedown = e => {
    track.dataset.mouseDownAt = e.clientX;
}

window.onmouseup = () => {
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
}

window.onmousemove = e => {
    if(track.dataset.mouseDownAt === "0") return;

    const mouseDelta = e.clientX - parseFloat(track.dataset.mouseDownAt),
        maxDelta = window.innerWidth / 2;

    const percentage = (mouseDelta / maxDelta) * 100,
        nextPercentage = Math.min(Math.max(parseFloat(track.dataset.prevPercentage) + percentage, -100), 0);;

    track.dataset.percentage = nextPercentage;

    scrollImages(nextPercentage);
}

window.onwheel = e => {
    if(track.dataset.mouseDownAt != "0") return;

    const percentage = parseFloat(e.deltaY) / ("mobileSize" in e ? e.mobileSize : window.innerHeight);

    const nextPercentage = Math.min(Math.max(parseFloat(track.dataset.prevPercentage) - percentage * 50, -100), 0);
    track.dataset.prevPercentage = nextPercentage.toString();

    scrollImages(nextPercentage);
}

window.ontouchstart = e => {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
}

window.ontouchmove = e => {
    e.deltaY = (touchX - e.touches[0].clientX);
    e.deltaX = (touchY - e.touches[0].clientY);
    e.mobileSize = window.innerWidth;

    window.onwheel(e);

    window.ontouchstart(e);
}

function scrollImages(nextPercentage) {
    track.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: 1200, fill: "forwards" });

    for(const image of track.getElementsByClassName("track-image")) {
        image.animate({
            objectPosition: `${nextPercentage + 100}% center`
        }, { duration: 1200, fill: "forwards" });
    }
}
