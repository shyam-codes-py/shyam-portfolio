window.addEventListener('load', () => {
    
    // 1. FIX: GSAP Animations ko turant load karo, par start hone mein 3 sec ka 'delay' do
    if (typeof gsap !== "undefined") {
        const tl = gsap.timeline({ delay: 3 }); // 3 second baad aayenge buttons
        tl.from(".main-title", {y: 50, opacity: 0, duration: 1, ease: "power3.out"})
          .from(".subtitle", {y: 30, opacity: 0, duration: 0.8, ease: "power3.out"}, "-=0.6")
          .from(".hero-buttons .cyber-btn", {y: 20, opacity: 0, duration: 0.5, stagger: 0.2, ease: "power2.out"}, "-=0.4");
          
        // Scroll animations ko bhi bina timeout ke turant set kar do
        initGSAPScrollAnimations();
    }

    // 2. Tumhara baaki Boot sequence logic (System Online, Red to Green dot)
    setTimeout(() => {
        const sysDot = document.getElementById('sys-dot');
        if(sysDot) { sysDot.classList.remove('red'); sysDot.classList.add('green'); }
        
        const uiLoading = document.getElementById('ui-loading');
        if(uiLoading) {
            uiLoading.innerHTML = 'STATUS: <span style="color: var(--primary);">ONLINE</span>';
        }
        
        const statusText = document.getElementById('status-text');
        if(statusText) statusText.innerText = 'ACTIVE';

        const coreText = document.getElementById('core-text');
        if(coreText) coreText.style.opacity = '0';
        
        setTimeout(() => {
            if(coreText) coreText.style.display = 'none';
            const profileImg = document.getElementById('profile-img');
            if(profileImg) profileImg.classList.add('show');
        }, 500); 
        
    }, 2500); 

    setTimeout(typeEffect, 1000);
});

// 🚀 GSAP SCROLL REVEAL ARTIFACTS
function initGSAPScrollAnimations() {
    if (typeof gsap !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.utils.toArray(".section-title").forEach(title => {
            gsap.from(title, { scrollTrigger: { trigger: title, start: "top 85%" }, y: 40, opacity: 0, duration: 0.8, ease: "power3.out" });
        });

        gsap.from(".profile-img-circle", { scrollTrigger: { trigger: ".about-container", start: "top 80%" }, scale: 0.5, opacity: 0, duration: 1, ease: "back.out(1.5)" });
        gsap.from(".about-content", { scrollTrigger: { trigger: ".about-container", start: "top 80%" }, x: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2 });

        gsap.utils.toArray(".skills-grid, .projects-grid").forEach(grid => {
            gsap.from(grid.children, {
                scrollTrigger: { trigger: grid, start: "top 85%" },
                y: 50, opacity: 0, duration: 0.6, stagger: 0.2, ease: "power2.out",
                clearProps: "all" 
            });
        });

        gsap.from(".contact-container", { scrollTrigger: { trigger: "#contact", start: "top 80%" }, y: 50, opacity: 0, duration: 1, ease: "power3.out", clearProps: "all" });
        ScrollTrigger.refresh();
    }
}

// Typing Effect Logic
const textArray = ["Full Stack Developer", "Frontend Engineer", "Web Designer", "Tech Enthusiast"];
const typingElement = document.getElementById("typing-text");
let textArrayIndex = 0; let charIndex = 0;

function typeEffect() {
    if (typingElement && charIndex < textArray[textArrayIndex].length) {
        typingElement.textContent += textArray[textArrayIndex].charAt(charIndex); charIndex++; setTimeout(typeEffect, 100);
    } else { setTimeout(eraseEffect, 1500); }
}
function eraseEffect() {
    if (typingElement && charIndex > 0) {
        typingElement.textContent = textArray[textArrayIndex].substring(0, charIndex - 1); charIndex--; setTimeout(eraseEffect, 50);
    } else {
        textArrayIndex++; if (textArrayIndex >= textArray.length) { textArrayIndex = 0; } setTimeout(typeEffect, 500);
    }
}

// Skills Progress Bar Logic
const progressBars = document.querySelectorAll('.progress-bar');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target; bar.style.width = bar.getAttribute('data-percent'); skillsObserver.unobserve(bar); 
        }
    });
}, { threshold: 0.5 }); 
progressBars.forEach(bar => skillsObserver.observe(bar));

// Scroll Progress & Top Button
const scrollProgress = document.getElementById('scroll-progress');
const scrollTopBtn = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if(scrollProgress) scrollProgress.style.width = ((scrollTop / scrollHeight) * 100) + '%';
    if (scrollTopBtn) {
        if (pageYOffset > 300) scrollTopBtn.classList.add("show-btn"); else scrollTopBtn.classList.remove("show-btn");
    }
});
if(scrollTopBtn) { scrollTopBtn.addEventListener("click", () => { window.scrollTo({ top: 0, behavior: "smooth" }); }); }

// 3D Tilt Effect
const tiltCards = document.querySelectorAll('.skill-card, .project-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const rotateX = ((e.clientY - rect.top - (rect.height / 2)) / (rect.height / 2)) * -10; 
        const rotateY = ((e.clientX - rect.left - (rect.width / 2)) / (rect.width / 2)) * 10;  
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'none'; card.style.borderColor = 'var(--primary)'; 
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.transition = 'transform 0.5s ease, border-color 0.3s ease'; card.style.borderColor = 'var(--glass-border)';
    });
});

// Modal Logic (Now targeting perfectly structured buttons)
const modal = document.getElementById('project-modal');
const viewBtns = document.querySelectorAll('.view-btn');
const closeBtn = document.querySelector('.close-btn');
const modalTitle = document.getElementById('modal-title');
if(modal && modalTitle) {
    viewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            modalTitle.innerText = e.target.closest('.project-card').querySelector('h3').innerText;
            modal.classList.add('show-modal'); 
            document.body.style.overflow = 'hidden'; 
        });
    });
    const closeModal = () => { modal.classList.remove('show-modal'); document.body.style.overflow = ''; };
    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('show-modal')) closeModal(); });
}

// 🚀 CORE COLOR SWITCHER
const colorBtns = document.querySelectorAll('.color-btn');

colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');
        document.body.classList.remove('theme-blue', 'theme-green', 'theme-orange', 'theme-purple');
        document.body.classList.add(theme);
        localStorage.setItem('portfolioThemeColor', theme);
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('portfolioThemeColor');
    if (savedTheme) { 
        document.body.classList.remove('theme-blue');
        document.body.classList.add(savedTheme); 
    }
});

// Contact Form Web3Forms
const contactForm = document.getElementById('contact-form');
const successMsg = document.getElementById('success-msg');
if(contactForm && successMsg) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(contactForm);
        successMsg.innerText = "Sending Message..."; successMsg.style.color = "var(--text-muted)"; successMsg.classList.add('show-msg');
        fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
        .then(async (response) => {
            if (response.status == 200) { successMsg.innerText = "Message Sent Successfully!"; successMsg.style.color = "#00ffcc"; contactForm.reset(); } 
            else { successMsg.innerText = "Something went wrong!"; successMsg.style.color = "#ff3366"; }
        })
        .catch(() => { successMsg.innerText = "Network Error!"; successMsg.style.color = "#ff3366"; })
        .then(() => { setTimeout(() => { successMsg.classList.remove('show-msg'); }, 4000); });
    });
}