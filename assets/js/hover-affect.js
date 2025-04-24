const holder = document.getElementById('static-image-hover-holder');
const staticImage = document.getElementById('static-image-content');
const aboutContent = document.getElementById('about-page-content');
const smallImageContainers = document.querySelectorAll('.small-image-container');


if (holder && aboutContent) {
    const holderHeight = holder.offsetHeight;
    const aboutContentTop = aboutContent.offsetTop;
    const aboutContentHeight = aboutContent.offsetHeight;
    const topOffset = 20;
    const rightOffset = 20;

    function updateStickyPosition() {
        const scrollY = window.scrollY;
        const contentTop = aboutContentTop;
        const contentBottom = aboutContentTop + aboutContentHeight;

        if (window.innerWidth < 768) { //check for mobile
            holder.style.position = 'static';
            holder.style.top = 'auto';
            holder.style.right = 'auto';
            holder.style.bottom = 'auto';
        }
        else if (scrollY < contentTop - topOffset) {
            // Above the about content
            holder.style.position = 'absolute';
            holder.style.top = `${topOffset}px`;
            holder.style.right = `${rightOffset}px`;
            holder.style.bottom = 'auto';
        } else if (scrollY > contentBottom - holderHeight - topOffset) {
            // At or below the point where the bottom of the holder should align with the bottom of the content
            holder.style.position = 'absolute';
            holder.style.top = `auto`;
            holder.style.right = `${rightOffset}px`;
            holder.style.bottom = `${topOffset}px`;
        } else {
            // Within the about content's scroll range - smooth following
            holder.style.position = 'absolute';
            let holderTop = scrollY - contentTop + topOffset;

            // Ensure the holder stays within the vertical bounds of the content
            holderTop = Math.max(topOffset, Math.min(holderTop, contentBottom - holderHeight - topOffset));

            holder.style.top = `${holderTop}px`;
            holder.style.right = `${rightOffset}px`;
            holder.style.bottom = 'auto';
        }
    }

    function handleMouseOver(event) {
       if (window.innerWidth >= 768) { //check for mobile
            const imageSrc = event.target.parentElement.getAttribute('data-image');
            if (imageSrc && holder) {
                staticImage.src = imageSrc;
                staticImage.style.display = 'block';
                holder.style.backgroundColor = 'transparent';
            }
        }


    }

    function handleMouseOut() {
        if (holder) {
            staticImage.style.display = 'none';
            holder.style.backgroundColor = '#ccc';
        }

    }

    smallImageContainers.forEach(container => {
        container.addEventListener('mouseover', handleMouseOver);
        container.addEventListener('mouseout', handleMouseOut);
    });

    window.addEventListener('scroll', updateStickyPosition);
    updateStickyPosition();
}
