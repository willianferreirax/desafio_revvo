let currentSlide = 0;

const slides = document.querySelectorAll(".slide");

generateDots();

const dots = document.querySelectorAll(".dot");

const prevSlideBtn = document.querySelector(".prev");

prevSlideBtn.addEventListener("click", () => changeSlide(-1));

const nextSlideBtn = document.querySelector(".next");

nextSlideBtn.addEventListener("click", () => changeSlide(1));

function generateDots(){

    const dotsContainer = document.querySelector(".dots-container");

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
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
    updateDots();
}

setInterval(nextSlide, 3000);