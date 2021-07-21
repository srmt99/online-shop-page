/**
 * creating Slider class for writing JavaScript codes for the slider
*/
class Slider {
    constructor({
        heroSlider = '#slider',
        imageContainer = '.slider-container',
        prev = '#previous',
        next = '#next',
        sliderIntervalTime = 10000,
    } = {}) {
        this.slider = document.querySelector(heroSlider);
        this.slides = document.querySelectorAll(`${imageContainer} img`).length;
        this.sliderContainer = document.querySelector(imageContainer);
        this.previousBtn = document.querySelector(prev);
        this.nextBtn = document.querySelector(next);
        this.slideSize = this.slider.offsetWidth;
        this.currentSlide = 0;
        this.setEventListeners();
        this.autoPlay(sliderIntervalTime);
    }

    /**
     * Move the slides one by slide
     */
    moveSlides() {
        this.sliderContainer.style.transform = `translateX(${this.currentSlide * this.slideSize}px)`;
    };

    /**
     * Move the slider to the next slide
     */
    nextSlide() {
        this.currentSlide = this.currentSlide <= 0 ? this.slides - 1 : this.currentSlide - 1;
        this.moveSlides();
    };

    /**
     * Move the slider to the previous slide
     */
    previousSlide() {
        this.currentSlide = this.currentSlide >= this.slides - 1 ? 0 : this.currentSlide + 1;
        this.moveSlides();
    };

    /**
     * Adding event listeners to the sldier control buttons
     */
    setEventListeners() {
        this.nextBtn.addEventListener('click', this.nextSlide.bind(this));
        this.previousBtn.addEventListener('click', this.previousSlide.bind(this));
    }

    /**
     * Setting the interval between slides on autoplay
     * @param {} sliderIntervalTime 
     */
    autoPlay(sliderIntervalTime) {
        setInterval(this.nextSlide.bind(this), sliderIntervalTime);
    }
}

new Slider();