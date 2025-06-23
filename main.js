gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const allQuotes = document.querySelectorAll('.quote');
    const splits = [];

    function cleanParagraph(paragraph) {
        // Fully reset previous structure
        const wraps = paragraph.querySelectorAll('.single-line-wrap');
        wraps.forEach(wrapper => {
            while (wrapper.firstChild) {
                wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
            }
            wrapper.remove();
        });

        // Also remove any leftover 'single-line' classes
        paragraph.querySelectorAll('.single-line').forEach(line => {
            line.classList.remove('single-line');
        });
    }

    function splitAllQuotes() {
        // Revert old splits
        splits.forEach(split => split.revert());
        splits.length = 0;

        allQuotes.forEach((paragraph, index) => {
            cleanParagraph(paragraph); // Clean DOM first

            const split = new SplitType(paragraph, {
                types: 'lines',
                lineClass: 'single-line'
            });

            splits.push(split);

            split.lines.forEach(line => {
                const wrapper = document.createElement('div');
                wrapper.classList.add('single-line-wrap');
                line.parentNode.insertBefore(wrapper, line);
                wrapper.appendChild(line);
            });

            gsap.set(paragraph, { visibility: "visible" });

            gsap.to(split.lines, {
                duration: 0.6,
                ease: "circ.out",
                y: 0,
                opacity: 1,
                stagger: 0.02,
                delay: index * 0.4
            });
        });
    }

    // Wait for all fonts to load before splitting
    if (document.fonts) {
        document.fonts.ready.then(() => {
            splitAllQuotes();
        });
    } else {
        // Fallback
        setTimeout(() => {
            splitAllQuotes();
        }, 100);
    }
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            splitAllQuotes({ animate: false }); // skip animation
        }, 200);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".main-navwrap");
    let lastScroll = window.pageYOffset;

    // Reset nav position on page load
    gsap.set(nav, { yPercent: 0 });

    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > 50) {
            // Scrolling down → hide nav
            gsap.to(nav, { yPercent: -100, duration: 0.3, ease: "power2.out" });
        } else if (currentScroll < lastScroll) {
            // Scrolling up → show nav
            gsap.to(nav, { yPercent: 0, duration: 0.3, ease: "power2.out" });
        }

        lastScroll = currentScroll;
    });
});

  