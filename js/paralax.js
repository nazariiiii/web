window.onload = () => {
    window.addEventListener('scroll', () => {
        const scroll = window.pageYOffset;
        const p = document.querySelector('.about p');
        document.querySelectorAll('.video img').forEach(img => {
            const speed = img.dataset.speed;
            img.style.transform = `translateX(${scroll * speed}px)`;
        });
        let translateX = Math.max(scroll * -1.7, -1400)
        document.querySelector('.text').style.transform = `translateY(${scroll*0.40}px)`
        document.querySelector('.text h1').style.transform = `translateX(${scroll*0.40}px)`
        document.querySelector('.text p').style.transform = `translateX(${scroll*-0.40}px)`
        p.style.transform = `translateX(${translateX}px)`;




    });
};