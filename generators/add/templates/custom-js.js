document.addEventListener('DOMContentLoaded', function(event) {
    /* Initialize Reveal */

    // More info https://github.com/hakimel/reveal.js#configuration
    Reveal.initialize({
        controls: true,
        progress: true,
        history: true,
        center: true,
        slideNumber: true,
        pdfMaxPagesPerSlide: 1,

        math: {
            config: 'TeX-MML-AM_HTMLorMML-full' // See http://docs.mathjax.org/en/latest/config-files.html
        },

        transition: 'slide', // none/fade/slide/convex/concave/zoom

        // More info https://github.com/hakimel/reveal.js#dependencies
        dependencies: [
            {
                src:
                    'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.6.0/lib/js/classList.js',
                condition: function() {
                    return !document.body.classList;
                }
            },
            {
                src:
                    'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.6.0/plugin/markdown/marked.js',
                condition: function() {
                    return !!document.querySelector('[data-markdown]');
                }
            },
            {
                src:
                    'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.6.0/plugin/markdown/markdown.min.js',
                condition: function() {
                    return !!document.querySelector('[data-markdown]');
                }
            },
            {
                src:
                    'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.6.0/plugin/math/math.min.js',
                async: true
            },
            {
                src:
                    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js',
                async: true,
                callback: function() {
                    hljs.initHighlightingOnLoad();
                }
            },
            {
                src:
                    'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.6.0/plugin/zoom-js/zoom.min.js',
                async: true
            },
            {
                src:
                    'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.6.0/plugin/print-pdf/print-pdf.min.js',
                async: true
            },
            { src: '/plugins/notes/notes.js', async: true }
        ]
    });

    /* Tweaks */

    if (Reveal.isLastSlide()) {
        document.querySelector(".reveal footer").style.display = "block";
    }

    Reveal.addEventListener('slidechanged', function(event) {
        if (Reveal.isLastSlide()) {
            document.querySelector('.reveal footer').style.display = 'block';
        } else {
            document.querySelector('.reveal footer').style.display = 'none';
        }
    });

    let elm = document.getElementById("page-url");
    let url = document.location.origin + document.location.pathname;
    elm.href = url;
    elm.innerText = url;

    /* Custom JS Below */

});
