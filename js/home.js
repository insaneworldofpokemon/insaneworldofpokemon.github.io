const series = document.getElementById("page-series");
const headerImage = document.getElementById("header-image");
const header = document.getElementById("page-header");
const content = document.getElementById("content");

selectImage(0);

for(const image of series.getElementsByClassName("page-image")) {
    image.onclick = e => {
        if(image.classList.contains("page-image-focus")) return;
        
        selectImage(parseInt(e.target.dataset.index));
    }
}

function selectImage(index) {
    const images = series.getElementsByClassName("page-image");
    images[parseInt(series.dataset.index)].classList.remove("page-image-focus");
    images[index].classList.add("page-image-focus");
    series.dataset.index = index;
    headerImage.src = images[index].src;
}

window.onmousemove = e => {
    for(const image of series.getElementsByClassName("page-image")) {
        var rect = image.getBoundingClientRect();
        var shadowX = (rect.left + rect.width / 2 - e.clientX) / window.innerWidth;
        var shadowY = Math.max((rect.top + rect.height / 2 - e.clientY) / window.innerHeight / 2, 0);
        image.style.filter = `drop-shadow(black ${shadowX}rem ${shadowY}rem 5px)`;
    }
}

window.onwheel = e => {
    const nextScroll = Math.min(parseInt(header.dataset.scroll) - e.deltaY, 0);
    if(nextScroll > window.innerHeight * -.7) {
        header.style.transform = `matrix(1, 0, 0, 1, 0, ${nextScroll})`;
        content.style.transform = `matrix(1, 0, 0, 1, 0, ${nextScroll})`;
        header.dataset.scroll = nextScroll;
    } else {
        content.style.transform = `matrix(1, 0, 0, 1, 0, ${window.innerHeight * -.7})`;
        const opacityPercent = parseInt(header.dataset.scroll) / window.innerHeight * -1 - .5,
            children = content.getElementsByClassName("content-section"),
            falseIndex = Math.floor(opacityPercent),
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