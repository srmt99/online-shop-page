class Slider {
    constructor({
        sliderSelector = '#slider',
        sliderContainerSelector = '.slider-container',
        previousSelector = '#previous',
        nextSelector = '#next',
        transitionTime = 10000,
    } = {}) {
        this.slider = document.querySelector(sliderSelector);
        this.slides = document.querySelectorAll(`${sliderContainerSelector} img`).length;
        this.sliderContainer = document.querySelector(sliderContainerSelector);
        this.previousBtn = document.querySelector(previousSelector);
        this.nextBtn = document.querySelector(nextSelector);
        this.slideSize = this.slider.offsetWidth;
        this.currentSlide = 0;
        this.setEventListeners();
        this.setAutoPlay(transitionTime);
    }

    moveSlides() {
        this.sliderContainer.style.transform = `translateX(${this.currentSlide * this.slideSize}px)`;
    };

    nextSlide() {
        this.currentSlide = this.currentSlide <= 0 ? this.slides - 1 : this.currentSlide - 1;
        this.moveSlides();
    };

    previousSlide() {
        this.currentSlide = this.currentSlide >= this.slides - 1 ? 0 : this.currentSlide + 1;
        this.moveSlides();
    };

    setEventListeners() {
        this.nextBtn.addEventListener('click', this.nextSlide.bind(this));
        this.previousBtn.addEventListener('click', this.previousSlide.bind(this));
    }

    setAutoPlay(transitionTime) {
        setInterval(this.nextSlide.bind(this), transitionTime);
    }
}

new Slider();
/*
let bgNum = 0

function sliderBackgroundChange() {
    const images = [
        'url(images/Tools.png)',
        'url(images/SchoolClipart.png)',
        'url(images/Bags.png)',
    ]

    bgNum = (bgNum + 1) % images.length
    console.log(bgNum)
    const currentBg = images[bgNum]
    document.getElementById('hero-slider').style.backgroundImage = currentBg
};

function setSliderHeight() {
    var heroHeigth = document.getElementById('hero-content').height
    console.log("Hi")
    console.log(heroHeigth)
    document.getElementsByClassName('slider').height = heroHeigth
};

window.onload = function() {
    setSliderHeight();
};
*/