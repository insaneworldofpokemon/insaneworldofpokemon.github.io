const series = document.getElementById("page-series");
const headerImage = document.getElementById("header-image");

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