document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const menuIcon = document.querySelector('.menu-icon');
    const navbar = document.querySelector('.navbar');
    
    menuIcon.addEventListener('click', function() {
        navbar.classList.toggle('show');
        const icon = menuIcon.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!menuIcon.contains(event.target) && 
            !navbar.contains(event.target)) {
            navbar.classList.remove('show');
            const icon = menuIcon.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });

    // Smooth scroll functionality
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href');
            const section = document.querySelector(sectionId);
            
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                history.pushState(null, null, sectionId);
            }
        });
    });

    // Update active menu item based on scroll position
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.navbar a');
    const aboutSection = document.querySelector('#about');
    const aboutElements = document.querySelectorAll('#about .text, #about .img');
    let isAboutVisible = false;

    function updateActiveMenuItem() {
        const scrollPosition = window.scrollY;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop - window.innerHeight/2 && 
                scrollPosition < sectionTop + sectionHeight - window.innerHeight/2) {
                navItems.forEach(item => item.classList.remove('active'));
                navItems[index].classList.add('active');
                history.replaceState(null, null, `#${section.id}`);
            }
        });
    }

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.75 &&
            rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) * 0.25
        );
    }

    function resetAnimation(element) {
        element.classList.remove('reveal');
        // Trigger reflow
        void element.offsetWidth;
    }

    function checkReveal() {
        const isAboutCurrentlyVisible = isElementInViewport(aboutSection);

        // If about section just became visible
        if (isAboutCurrentlyVisible && !isAboutVisible) {
            aboutElements.forEach((element, index) => {
                resetAnimation(element);
                setTimeout(() => {
                    element.classList.add('reveal');
                }, index * 100); // Stagger the animations
            });
        }
        // If about section just became hidden
        else if (!isAboutCurrentlyVisible && isAboutVisible) {
            aboutElements.forEach(element => {
                resetAnimation(element);
            });
        }

        isAboutVisible = isAboutCurrentlyVisible;
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 900) {
            navbar.classList.remove('show');
            const icon = menuIcon.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });

    // Initial check
    checkReveal();
    updateActiveMenuItem();

    // Combined scroll event listener
    window.addEventListener('scroll', function() {
        updateActiveMenuItem();
        checkReveal();
    });
});

function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    canvas.classList.add('confetti-active');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const numberOfPieces = 200;
    const colors = ['#DAA520', '#FFD700', '#ffffff', '#B8860B'];

    // Create confetti pieces
    for (let i = 0; i < numberOfPieces; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 4 + 1,
            d: Math.random() * numberOfPieces,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.floor(Math.random() * 10) - 10,
            opacity: 1,
            dx: Math.random() * 6 - 3,
            dy: Math.random() * 3 + 3
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pieces.forEach((p) => {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
            ctx.fill();

            p.x += p.dx;
            p.y += p.dy;
            
            // Reset opacity when it gets too low to keep particles visible
            if (p.opacity <= 0.1) {
                p.opacity = 1;
            } else {
                p.opacity -= 0.002;
            }
            
            if (p.y > canvas.height) p.y = 0;
            if (p.x > canvas.width) p.x = 0;
            if (p.x < 0) p.x = canvas.width;
        });

        requestAnimationFrame(animate);
    }

    // Start animation
    animate();
}

// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('#project-track');
    const images = track.getElementsByClassName('project-image-container');
    let isDown = false;
    let startX;
    let scrollLeft;

    // Convert HTMLCollection to Array for easier manipulation
    const imageArray = Array.from(images);
    
    // Initialize starting positions
    let prevPercentage = 0;
    let percentage = 0;

    // Mouse Down Event
    track.addEventListener('mousedown', (e) => {
        isDown = true;
        track.classList.add('active');
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
        
        // Stop any ongoing animation
        cancelAnimationFrame(track.animation);
    });

    // Mouse Leave & Mouse Up Events
    track.addEventListener('mouseleave', stopDragging);
    track.addEventListener('mouseup', stopDragging);

    function stopDragging() {
        isDown = false;
        track.classList.remove('active');
    }

    // Mouse Move Event
    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 2; // Adjust multiplier for speed
        
        // Calculate the percentage moved
        percentage = (walk / track.offsetWidth) * -100;
        nextPercentage = Math.max(Math.min(prevPercentage + percentage, 0), -100);
        
        // Apply transforms to track
        track.style.transform = `translate(${nextPercentage}%, -50%)`;
        
        // Move images in parallel
        imageArray.forEach(image => {
            image.style.objectPosition = `${100 + nextPercentage}% center`;
        });
    });

    // Handle touch events
    track.addEventListener('touchstart', (e) => {
        isDown = true;
        track.classList.add('active');
        startX = e.touches[0].pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
        
        cancelAnimationFrame(track.animation);
    });

    track.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        
        const x = e.touches[0].pageX - track.offsetLeft;
        const walk = (x - startX) * 2;
        
        percentage = (walk / track.offsetWidth) * -100;
        nextPercentage = Math.max(Math.min(prevPercentage + percentage, 0), -100);
        
        track.style.transform = `translate(${nextPercentage}%, -50%)`;
        
        imageArray.forEach(image => {
            image.style.objectPosition = `${100 + nextPercentage}% center`;
        });
    });

    track.addEventListener('touchend', () => {
        isDown = false;
        track.classList.remove('active');
        prevPercentage = nextPercentage;
    });

    // Necessary CSS styles
    track.style.transform = 'translate(0%, -50%)';
    track.style.transition = 'transform 0.3s ease-out';
    
    imageArray.forEach(image => {
        image.style.objectPosition = '100% center';
        image.style.transition = 'object-position 0.3s ease-out';
    });
});

// Function to handle intersection observer
const observeTimeline = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const timelineItems = entry.target.querySelectorAll('.timeline-item');
            
            if (entry.isIntersecting) {
                // Remove reset class when section comes into view
                timelineItems.forEach(item => {
                    item.classList.remove('reset-animation');
                });
            } else {
                // Add reset class when section is out of view
                timelineItems.forEach(item => {
                    item.classList.add('reset-animation');
                });
            }
        });
    }, { threshold: 0.2 }); // Adjust threshold as needed

    // Observe the timeline section
    const timelineSection = document.querySelector('#resume');
    if (timelineSection) {
        observer.observe(timelineSection);
    }
};

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', observeTimeline);


function setupTestimonials() {
    const testimonials = [
        {
            text: "I am pleased to recommend Kartik Nair for his exceptional performance on a recent capstone project. Throughout the project, Kartik demonstrated remarkable project management skills, consistently maintaining a well-organized approach to planning, prioritization, and timely delivery of deliverables.",
            author: "Muzi (Maggie) Song",
            role: "University of Sydney - Senior Manager - External Benchmarks"
        },
        {
            text: "As team leader, Kartik effectively managed a team of 8 engineers while also serving as the application development lead. His ability to put into practice knowledge gained from his university studies, particularly in front-end and back-end development, was instrumental to the project's success.",
            author: "Ivan Vivas",
            role: "Founder, Vivas Logistics"
        },
        {
            text: "Kartik can only be described as an exceptional character that stood out amongst so many of his peers. With Kartik's ability to immediately brighten a room full of people and great work ethic, he should sit at the top of any recruitment list.",
            author: "Michael Schwarz",
            role: "Senior Operations Manager"
        },
        {
            text: "Kartik did a great job during this challenging real-world project. As a Business Analyst, Kartik demonstrated exceptional analytical skills and a keen eye for detail.",
            author: "Johan Misquitta",
            role: "Co-Founder & Chief Technology Officer at Simplyai"
        },
        {
            text: "Kartik has a knack for tackling complex problems with ingenuity and precision. His contributions have streamlined our development processes and improve project efficiency. Moreover, Kartik's willingness to collaborate and support his team members has been exemplary.",
            author: "AdGrowth Solutions",
            role: "Founder & CEO"
        },
        {
            text: "Thank you Kartik for your excellent calibre of work for my Practera Stem project. You and the team put in excellent effort and presented some thorough research and recommendations for my business goals. I am very thankful for your work and I hope you enjoyed the experience.",
            author: "Teresa Mcluckie",
            role: "Founder and Director at Trace Foodsteps"
        }
    ];

    let currentIndex = 0;
    const textElement = document.querySelector('.testimonial-text');
    const authorNameElement = document.querySelector('.testimonial-author h4');
    const authorRoleElement = document.querySelector('.testimonial-author p');
    const indicatorsContainer = document.querySelector('.testimonial-indicators');

    // Create indicators
    testimonials.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => showTestimonial(index));
        indicatorsContainer.appendChild(indicator);
    });

    function showTestimonial(index) {
        const testimonial = testimonials[index];
        
        // Add fade out class
        textElement.classList.add('fade-out');
        authorNameElement.classList.add('fade-out');
        authorRoleElement.classList.add('fade-out');

        // Update indicators
        document.querySelectorAll('.indicator').forEach((ind, i) => {
            ind.classList.toggle('active', i === index);
        });

        // Update content after fade out
        setTimeout(() => {
            textElement.textContent = testimonial.text;
            authorNameElement.textContent = testimonial.author;
            authorRoleElement.textContent = testimonial.role;

            // Add fade in class
            textElement.classList.remove('fade-out');
            authorNameElement.classList.remove('fade-out');
            authorRoleElement.classList.remove('fade-out');
        }, 300);

        currentIndex = index;
    }

    // Show first testimonial
    showTestimonial(0);

    // Auto-advance testimonials
    setInterval(() => {
        showTestimonial((currentIndex + 1) % testimonials.length);
    }, 10000);
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', setupTestimonials);

document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const delay = card.dataset.delay || 0;
                card.style.animation = `fadeInUp 1s ease forwards ${delay}s`;
                observer.unobserve(card);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.charity-card').forEach(card => {
        observer.observe(card);
    });
});

function copyEmail(e) {
    e.preventDefault();
    const email = "kartik.n.1101@gmail.com";
    
    // Create notification elements
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #2c3e50;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    `;

    // Add check icon
    const icon = document.createElement('i');
    icon.className = 'fas fa-check-circle';
    icon.style.cssText = `
        color: #2ecc71;
        font-size: 20px;
    `;

    // Add text content
    const text = document.createElement('div');
    text.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 4px;">Copied!</div>
        <div style="font-size: 14px; opacity: 0.9;">${email}</div>
    `;

    // Assemble notification
    notification.appendChild(icon);
    notification.appendChild(text);
    document.body.appendChild(notification);

    // Copy email to clipboard
    navigator.clipboard.writeText(email).then(() => {
        // Animate notification in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        // Animate notification out
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            
            // Remove notification from DOM after animation
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }).catch(err => {
        notification.style.backgroundColor = '#e74c3c';
        icon.className = 'fas fa-exclamation-circle';
        icon.style.color = '#fff';
        text.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 4px;">Error</div>
            <div style="font-size: 14px; opacity: 0.9;">Failed to copy email address</div>
        `;
        console.error('Failed to copy: ', err);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.download-slider');
    const button = document.querySelector('.slider-button');
    const sliderText = document.querySelector('.slider-text');
    const sliderBg = document.querySelector('.slider-bg');
    let isDragging = false;
    let startX, buttonLeft;

    const maxMove = slider.offsetWidth - button.offsetWidth - 10;

    function startDragging(e) {
        isDragging = true;
        startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
        buttonLeft = button.offsetLeft;
        button.classList.add('active');
    }

    function stopDragging() {
        if (!isDragging) return;
        isDragging = false;
        button.classList.remove('active');

        if (button.offsetLeft >= maxMove * 0.9) {
            // Successful slide
            button.style.left = `${maxMove}px`;
            sliderBg.style.width = '100%';
            sliderText.style.opacity = '0';
            // Trigger CV download
            const link = document.createElement('a');
            link.href = 'Kartik_Nair_CV.pdf';
            link.download = 'Kartik-Nair-CV.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Reset after download
            setTimeout(() => {
                button.style.left = '5px';
                sliderBg.style.width = '0';
                sliderText.style.opacity = '1';
            }, 1000);
        } else {
            // Reset position
            button.style.left = '5px';
            sliderBg.style.width = '0';
        }
    }

    function drag(e) {
        if (!isDragging) return;

        e.preventDefault();
        const x = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
        const walk = x - startX;
        let newLeft = buttonLeft + walk;

        // Constrain movement
        newLeft = Math.max(5, Math.min(newLeft, maxMove));
        
        button.style.left = `${newLeft}px`;
        sliderBg.style.width = `${(newLeft / maxMove) * 100}%`;
    }

    // Mouse Events
    button.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);

    // Touch Events
    button.addEventListener('touchstart', startDragging);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', stopDragging);
});

document.addEventListener('DOMContentLoaded', function() {
    const charityUrls = {
        'RSPCA Australia': 'https://rspcaguardianangel.com.au/ga-donate?utm_source=Navigation&utm_medium=NSW_Website&utm_campaign=GA24O&utm_content=Top_Nav_Btn&utm_term=hero_puppy#donation-form',
        'World Vision Australia': 'https://www.worldvision.com.au/give/donate/make-a-general-donation',
        'Australian Red Cross': 'https://www.redcross.org.au/donate/',
        'Starlight Children\'s Foundation': 'https://starlight.org.au/donate/',
        'National Seniors Australia': 'https://nationalseniors.com.au/get-involved/donate#make-a-donation'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const delay = card.dataset.delay || 0;
                card.style.animation = `fadeInUp 1s ease forwards ${delay}s`;
                observer.unobserve(card);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.charity-card').forEach(card => {
        // Add intersection observer
        observer.observe(card);
        
        // Add click functionality
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const charityName = card.querySelector('.charity-name').textContent;
            if (charityUrls[charityName]) {
                window.open(charityUrls[charityName], '_blank');
            }
        });
    });
});

function handleResponsiveness() {
    const isMobile = window.innerWidth <= 768;
    
    // Project Track Containers
    const track = document.querySelector('#project-track');
    if (track) {
        if (isMobile) {
            track.style.gap = '2vmin';
            const images = track.querySelectorAll('.project-image-container');
            images.forEach(img => {
                img.style.width = '80vmin';
                img.style.height = '112vmin';
            });
        } else {
            // Reset to original sizes for desktop
            track.style.gap = '4vmin';
            const images = track.querySelectorAll('.project-image-container');
            images.forEach(img => {
                img.style.width = '40vmin';
                img.style.height = '56vmin';
            });
        }
    }

    // Charity Cards
    const charityCards = document.querySelectorAll('.charity-card');
    charityCards.forEach(card => {
        if (isMobile) {
            card.style.width = '90%';
        } else {
            card.style.width = '350px'; // Original size
        }
    });

    // Navigation handling
    const navbar = document.querySelector('.navbar');
    if (window.innerWidth > 900 && navbar) {
        navbar.classList.remove('show');
        const menuIcon = document.querySelector('.menu-icon i');
        if (menuIcon) {
            menuIcon.className = 'fa fa-bars';
        }
    }
}

function handleResponsiveness() {
    const isMobile = window.innerWidth <= 768;
    
    // Project Track Containers
    const track = document.querySelector('#project-track');
    if (track) {
        if (isMobile) {
            track.style.gap = '2vmin';
            const images = track.querySelectorAll('.project-image-container');
            images.forEach(img => {
                img.style.width = '80vmin';
                img.style.height = '112vmin';
            });
        } else {
            // Reset to original sizes for desktop
            track.style.gap = '4vmin';
            const images = track.querySelectorAll('.project-image-container');
            images.forEach(img => {
                img.style.width = '40vmin';
                img.style.height = '56vmin';
            });
        }
    }

    // Charity Cards
    const charityCards = document.querySelectorAll('.charity-card');
    charityCards.forEach(card => {
        if (isMobile) {
            card.style.width = '90%';
        } else {
            card.style.width = '350px'; // Original size
        }
    });

    // Navigation handling
    const navbar = document.querySelector('.navbar');
    if (window.innerWidth > 900 && navbar) {
        navbar.classList.remove('show');
        const menuIcon = document.querySelector('.menu-icon i');
        if (menuIcon) {
            menuIcon.className = 'fa fa-bars';
        }
    }
}

// Call handleResponsiveness on page load, resize, and orientation change
document.addEventListener('DOMContentLoaded', handleResponsiveness);
window.addEventListener('resize', debounce(handleResponsiveness, 250));
window.addEventListener('orientationchange', handleResponsiveness);

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}