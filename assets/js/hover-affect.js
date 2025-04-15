const holder = document.getElementById('static-image-hover-holder');
const lastCard = document.querySelector('.info-row:last-child');
const smallRectangles = document.querySelectorAll('.small-rectangle');

function updateStickyPosition() {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const scrollY = window.scrollY;
    const holderHeight = holder.offsetHeight;
    const lastCardBottom = lastCard.offsetTop + lastCard.offsetHeight;

    // Calculate the point where the holder should start floating to the bottom
    const floatBottomThreshold = sectionTop + sectionHeight - holderHeight;

    if (scrollY <= sectionTop) {
        // When the section is above the viewport, position it absolutely at the top
        holder.className = '';
        holder.style.position = 'absolute';
        holder.style.top = '20px';
        holder.style.bottom = 'auto';
    } else if (scrollY > sectionTop && scrollY < floatBottomThreshold) {
        // When the section is in the viewport, make it sticky
        holder.className = 'sticky';
        holder.style.position = 'fixed';
        holder.style.top = '20px';
        holder.style.bottom = 'auto';
    } else if (scrollY >= floatBottomThreshold && scrollY < lastCardBottom - holderHeight) {
        // When the user scrolls past the floatBottomThreshold, but before the last card's bottom
        holder.className = 'float-bottom';
        holder.style.position = 'absolute';
        holder.style.bottom = '20px';
        holder.style.top = 'auto';
    }
    else {
        holder.className = 'sticky-bottom';
        holder.style.position = 'absolute';
        holder.style.top = lastCardBottom - holderHeight - 20;
        holder.style.bottom = 'auto';
    }
}

function handleMouseOver(event) {
    const color = event.target.getAttribute('data-color');
    holder.style.backgroundColor = color;
}

function handleMouseOut() {
    holder.style.backgroundColor = '#ccc'; // Or any default color
}

smallRectangles.forEach(rect => {
    rect.addEventListener('mouseover', handleMouseOver);
    rect.addEventListener('mouseout', handleMouseOut);
});


window.addEventListener('scroll', updateStickyPosition);
updateStickyPosition();

