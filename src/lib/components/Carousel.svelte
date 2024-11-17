<script>
    let currentIndex = 0;
    let images = [
        "/assets/img/example/img1.jpeg",
        "/assets/img/example/img2.jpeg",
        "/assets/img/example/img3.jpeg",
        "/assets/img/example/img4.jpeg",
        "/assets/img/example/img5.jpeg",
        "/assets/img/example/img6.jpeg",
        "/assets/img/example/img7.jpeg",
        "/assets/img/example/img8.jpeg",
        "/assets/img/example/img9.png",
    ];

    function next() {
        currentIndex = (currentIndex + 1) % images.length;
    }

    function prev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
    }
</script>

<div class="flex w-full h-[60vh] relative overflow-clip">
    <img src={images[currentIndex]} alt="Carousel" class="rounded-2xl h-full w-full object-cover"/>
    <div class="absolute w-full h-full overflow-hidden flex justify-between items-center gap-4 p-4">
        <button onclick={prev}>
            <img src="/assets/svg/arrow.svg" alt="Previous" class="w-8"/>
        </button>
        <button onclick={next}>
            <img src="/assets/svg/arrow.svg" alt="Next" class="w-8 scale-x-[-1]"/>
        </button>
    </div>
</div>