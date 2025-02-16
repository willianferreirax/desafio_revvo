let currentSlide = 0;

var slides = null;
var dots = null;

getSlidesElements();
generateDots();
getDotsElements();

function getSlidesElements(){
    slides = document.querySelectorAll(".slide");
}

function getDotsElements(){
    dots = document.querySelectorAll(".dot");
}

const prevSlideBtn = document.querySelector(".prev");

prevSlideBtn.addEventListener("click", () => changeSlide(-1));

const nextSlideBtn = document.querySelector(".next");

nextSlideBtn.addEventListener("click", () => changeSlide(1));

function generateDots(){

    const dotsContainer = document.querySelector(".dots-container");

    //clear dots
    dotsContainer.innerHTML = "";

    slides.forEach((_, index) => {
        const dot = document.createElement("span");
        dot.classList.add("dot");

        if (index === 0) dot.classList.add("active");
        
        dot.addEventListener("click", () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
}

function changeSlide(direction) {
    currentSlide += direction;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    
    showSlide(currentSlide);
    updateDots();
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
    updateDots();
}

function updateDots() {
    dots.forEach((dot) => dot.classList.remove("active"));
    dots[currentSlide].classList.add("active");
}

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.display = i === index ? "block" : "none";
    });
}

function nextSlide() {

    if(slides.length == 0) return;

    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
    updateDots();
}

setInterval(nextSlide, 3000);