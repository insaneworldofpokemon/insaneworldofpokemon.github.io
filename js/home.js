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

// Reminder: Add lower bounds
window.onwheel = e => {
    header.dataset.scroll = Math.min(parseInt(header.dataset.scroll) - e.deltaY, 0);
    header.style.transform = `matrix(1, 0, 0, 1, 0, ${header.dataset.scroll})`;
    if(header.dataset.scroll > window.innerHeight * -.7) {
        content.style.transform = `matrix(1, 0, 0, 1, 0, ${header.dataset.scroll})`;
    } else {
        content.style.transform = `matrix(1, 0, 0, 1, 0, ${window.innerHeight * -.7})`;
        const opacityPercent = parseInt(header.dataset.scroll) / window.innerHeight * -1 - .5,
            children = content.getElementsByClassName("content-section"),
            falseIndex = Math.floor(opacityPercent),
            index = falseIndex / (11 - parseInt(content.dataset.contentScrollSpeed));
        if(index % 1 != 0) return;
        for(let i = 0; i < children.length; i++) {
            if(i == index) {
                children[i].classList.add("visible");
            } else {
                children[i].classList.remove("visible");
            }
        }
    }
}