
$(function () {
    //Header
    let menu = document.querySelector('#menu-btn');
    let navbar = document.querySelector('.navbar');

    menu.addEventListener('click', () => {
        menu.classList.toggle('fa-times');
        navbar.classList.toggle('active');
    });

    //Swipersjs
    let swiperOptions = {
        spaceBetween: 20,
        grabCursor: true,
        loop: true,
        speed: 500,
        autoplay: {
            delay: 2000,
        },
        effect: 'coverflow',
        coverflowEffect: {
            rotate: 30,
            slideShadows: true,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            540: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    };
    let swiper1 = new Swiper(".services-slider", swiperOptions);
    let swiper2 = new Swiper(".doctors-slider", swiperOptions);
    let swiper3 = new Swiper(".review-slider", swiperOptions);

    //Wow.js and animate.css
    new WOW({
        boxClass: 'wow',          // класс, который будет искаться для анимации
        animateClass: 'animate__animated', // класс анимации из animate.css
    }).init();
});



