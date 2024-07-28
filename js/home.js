const series = document.getElementById("page-series");
const images = series.getElementsByClassName("page-image");
const headerImage = document.getElementById("header-image");
const header = document.getElementById("page-header");
const content = document.getElementById("content");

selectImage(0);
var slideShow = setInterval(selectImage, 8000);

for(const image of images) {
    image.onclick = e => {
        if(image.classList.contains("page-image-focus")) return;
        
        selectImage(parseInt(e.target.dataset.index));
    }
}

function selectImage(index = null) {
    var sliding = index == null;
    preIndex = parseInt(series.dataset.index);
    if(sliding) index = (preIndex >= images.length - 1 ? 0 : preIndex + 1);
    else clearInterval(slideShow);
    images[preIndex].classList.remove("page-image-focus");
    images[index].classList.add("page-image-focus");
    series.dataset.index = index;
    headerImage.src = images[index].src;
    focusImage();
}

function focusImage(e = null) {
    var position = 
        images[parseInt(series.dataset.index)].dataset.focus;
    if(e != null) {
        var headerRect = headerImage.getBoundingClientRect();
        if(e.clientY < headerRect.bottom && e.clientY > headerRect.top) {
            position = (e.clientY - headerRect.top) / headerRect.bottom * 100;
        }
    }
    headerImage.animate({
        objectPosition: `center ${position}%`
    }, { duration: 1200, fill: "forwards" });
}

window.onmousemove = e => {
    for(const image of images) {
        var rect = image.getBoundingClientRect();
        var shadowX = (rect.left + rect.width / 2 - e.clientX) / window.innerWidth;
        var shadowY = Math.max((rect.top + rect.height / 2 - e.clientY) / window.innerHeight / 2, 0);
        image.style.filter = `drop-shadow(black ${shadowX}rem ${shadowY}rem 5px)`;
    }
    focusImage(e);
}

window.onwheel = e => {
    const nextScroll = Math.min(parseInt(header.dataset.scroll) - e.deltaY, 0);
    if(nextScroll > window.innerHeight * -.7) {
        header.style.transform = `matrix(1, 0, 0, 1, 0, ${nextScroll})`;
        content.style.transform = `matrix(1, 0, 0, 1, 0, ${nextScroll})`;
        header.dataset.scroll = nextScroll;
    } else {
        content.style.transform = `matrix(1, 0, 0, 1, 0, ${window.innerHeight * -.7})`;
        const scrollPercent = parseInt(header.dataset.scroll) / window.innerHeight * -1 - .5,
            children = content.getElementsByClassName("content-section"),
            falseIndex = Math.floor(scrollPercent),
            index = falseIndex / (11 - parseInt(content.dataset.contentScrollSpeed));
        if(index < children.length - 1 || nextScroll > parseInt(header.dataset.scroll)) {
            header.style.transform = `matrix(1, 0, 0, 1, 0, ${nextScroll})`;
            header.dataset.scroll = nextScroll;
        }
        if(index % 1 != 0) return;
        for(let i = 0; i < children.length; i++) {
            if(i == index) {
                children[i].classList.add("visible");
                children[i].classList.remove("above");
                children[i].classList.remove("below");
            } else {
                children[i].classList.remove("visible");
                if(i == index - 1) {
                    children[i].classList.add("above");
                } else if(i == index + 1) {
                    children[i].classList.add("below");
                }
            }
        }
    }
}

var touchX = 0, touchY = 0;

window.ontouchstart = e => {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
}

window.ontouchmove = e => {
    e.deltaX = touchX - e.touches[0].clientX;
    e.deltaY = touchY - e.touches[0].clientY;

    window.onwheel(e);

    window.ontouchstart(e);
}
