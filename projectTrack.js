const track = document.getElementById("project-track");
const instruction = document.querySelector('.drag-instruction');

// Make instruction visible initially
if (instruction) {
    instruction.style.opacity = "1";
}

// Project repository links
const projectLinks = {
    'Project01.png': 'https://github.com/kartiknairgit/Hand_tracker01',
    'Project02.png': 'https://github.com/kartiknairgit/blackjack',
    'Project03.png': 'https://github.com/kartiknairgit/Graph-Traversal-VA-',
    'Project04.png': 'https://github.com/kartiknairgit/expense_tracker',
    'Project05.png': 'https://github.com/kartiknairgit/Unbeatable_TIKTAKTOE',
    'Project06.png': 'https://github.com/kartiknairgit/Hand_tracker',
    'Project07.png': 'https://linktr.ee/lazy_kartzie'
};

let isDragging = false;
let startX = 0;
let dragThreshold = 5;

const handleOnDown = e => {
    isDragging = false;
    startX = e.clientX;
    track.dataset.mouseDownAt = e.clientX;
}

const handleOnUp = e => {
    const deltaX = Math.abs(e.clientX - startX);
    
    // If it wasn't a drag, handle as a click
    if (!isDragging && deltaX < dragThreshold) {
        const container = e.target.closest('.project-image-container');
        if (container) {
            const img = container.querySelector('.project-image');
            const imageName = img.src.split('/').pop();
            const repoLink = projectLinks[imageName];
            if (repoLink) {
                window.open(repoLink, '_blank');
            }
        }
    }
    
    track.dataset.mouseDownAt = "0";  
    track.dataset.prevPercentage = track.dataset.percentage;
}

const handleOnMove = e => {
    if(track.dataset.mouseDownAt === "0") return;
    
    const deltaX = Math.abs(e.clientX - startX);
    if (deltaX > dragThreshold) {
        isDragging = true;
    }
    
    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
          maxDelta = window.innerWidth / 2;
    
    const percentage = (mouseDelta / maxDelta) * -100,
          nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
          nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);
    
    track.dataset.percentage = nextPercentage;
    
    track.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: 1200, fill: "forwards" });
    
    for(const image of track.getElementsByClassName("project-image")) {
        image.animate({
            objectPosition: `${100 + nextPercentage}% center`
        }, { duration: 1200, fill: "forwards" });
    }
}

// Add pointer cursor to containers
const containers = document.querySelectorAll('.project-image-container');
containers.forEach(container => {
    container.style.cursor = 'pointer';
});

// Enhanced instruction visibility handling
function handleInstructionVisibility() {
    const section = document.getElementById('services');
    
    if (!instruction || !section) return;

    // Show instruction immediately when section is loaded
    instruction.classList.add('show');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Reset animation
                instruction.classList.remove('show');
                void instruction.offsetWidth; // Force reflow
                instruction.classList.add('show');
            }
        });
    }, { threshold: 0.5 });

    observer.observe(section);
}

// Event listeners
window.onmousedown = e => handleOnDown(e);
window.ontouchstart = e => handleOnDown(e.touches[0]);
window.onmouseup = e => handleOnUp(e);
window.ontouchend = e => handleOnUp(e);
window.onmousemove = e => handleOnMove(e);
window.ontouchmove = e => handleOnMove(e.touches[0]);

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    handleInstructionVisibility();
    // Force show instruction
    if (instruction) {
        instruction.style.opacity = "1";
        instruction.classList.add('show');
    }
});