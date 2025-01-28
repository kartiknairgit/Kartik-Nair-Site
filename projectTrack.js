const track = document.getElementById("project-track");
const handleOnDown = e => track.dataset.mouseDownAt = e.clientX;
const handleOnUp = () => {
  track.dataset.mouseDownAt = "0";  
  track.dataset.prevPercentage = track.dataset.percentage;
}
const handleOnMove = e => {
  if(track.dataset.mouseDownAt === "0") return;
  
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

window.onmousedown = e => handleOnDown(e);
window.ontouchstart = e => handleOnDown(e.touches[0]);
window.onmouseup = e => handleOnUp(e);
window.ontouchend = e => handleOnUp(e);
window.onmousemove = e => handleOnMove(e);
window.ontouchmove = e => handleOnMove(e.touches[0]);


// Add this to your existing code
function handleInstructionVisibility() {
    const section = document.getElementById('services');
    const instruction = document.querySelector('.drag-instruction');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                instruction.classList.remove('show');
                // Force reflow
                void instruction.offsetWidth;
                instruction.classList.add('show');
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of section is visible

    observer.observe(section);
}

// Add this to your DOMContentLoaded event or at the end of your file
document.addEventListener('DOMContentLoaded', handleInstructionVisibility);