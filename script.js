// Homiqa - Script principal
// Initialisation AOS pour les animations au scroll
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// Animations personnalisées
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
}

// Animation du header au scroll
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
}

// Smooth scrolling pour les liens de navigation
function smoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animation des cartes au hover
function animateCards() {
    const cards = document.querySelectorAll('.product-card, .advantage-card, .testimonial-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Animation des boutons
function animateButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');

    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Menu mobile
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
        });

        // Fermer le menu lors du clic sur un lien
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
            });
        });
    }
}

// Validation et soumission du formulaire
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('button[type="submit"]');

            // Validation (peut être simplifiée car le PHP revalide)
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const project = formData.get('project');
            const message = formData.get('message').trim();

            if (!name || !email || !project || !message) {
                showFormMessage("Veuillez remplir tous les champs obligatoires.", "error");
                return;
            }

            // Affiche un état de chargement
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = 'Envoi en cours...';
            submitButton.disabled = true;

            fetch('send_mail.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text()) // On récupère la réponse du PHP en texte brut
            .then(text => {
                // Les sections de débogage PHP peuvent interférer, on cherche le message final
                if (text.includes('Merci! Votre message a été envoyé.')) {
                    showFormMessage("Votre message a été envoyé avec succès ! Nous vous recontacterons bientôt.", "success");
                    contactForm.reset();
                } else {
                    // Affiche la réponse complète du serveur (y compris les erreurs PHP/SMTP) pour le débogage
                    showFormMessage("Une erreur est survenue. Détails : " + text, "error");
                    console.error("Server response:", text);
                }
            })
            .catch(error => {
                showFormMessage("Une erreur réseau est survenue. Veuillez réessayer.", "error");
                console.error("Fetch error:", error);
            })
            .finally(() => {
                // Restaure le bouton
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }
}

// Affichage des messages du formulaire
function showFormMessage(text, type) {
    const formMessage = document.getElementById('form-message');
    formMessage.textContent = text;
    formMessage.style.display = 'block';
    
    if (type === 'success') {
        formMessage.style.background = '#d1fae5';
        formMessage.style.color = '#065f46';
    } else {
        formMessage.style.background = '#fee2e2';
        formMessage.style.color = '#991b1b';
    }
}

// Amélioration des effets focus pour l'accessibilité
function initFormStyling() {
    const inputs = document.querySelectorAll('#contact-form input, #contact-form select, #contact-form textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#007BFF';
            this.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
        });

        input.addEventListener('blur', function() {
            this.style.borderColor = '#e2e8f0';
            this.style.boxShadow = 'none';
        });
    });
}

// Slider automatique avec animation fade
function initImageSlider() {
    const sliderItems = document.querySelectorAll('.slider-item');
    let currentSlide = 0;

    if (sliderItems.length > 1) {
        // Fonction pour changer de slide
        function nextSlide() {
            // Retirer la classe active du slide actuel
            sliderItems[currentSlide].classList.remove('active');
            
            // Passer au slide suivant (boucle infinie)
            currentSlide = (currentSlide + 1) % sliderItems.length;
            
            // Ajouter la classe active au nouveau slide
            sliderItems[currentSlide].classList.add('active');
        }

        // Démarrer l'animation automatique toutes les 2 secondes
        setInterval(nextSlide, 2000);
    }
}

// Carrousel du héro avec navigation
function initHeroCarousel() {
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroIndicators = document.querySelectorAll('.hero-indicator');
    let currentHeroSlide = 0;
    let heroInterval;

    if (heroSlides.length > 1) {
        // Fonction pour changer de slide du héro
        function goToHeroSlide(slideIndex) {
            // Retirer la classe active de tous les slides et indicateurs
            heroSlides[currentHeroSlide].classList.remove('active');
            heroIndicators[currentHeroSlide].classList.remove('active');
            
            // Mettre à jour l'index actuel
            currentHeroSlide = slideIndex;
            
            // Ajouter la classe active au nouveau slide et indicateur
            heroSlides[currentHeroSlide].classList.add('active');
            heroIndicators[currentHeroSlide].classList.add('active');
        }

        function nextHeroSlide() {
            const nextIndex = (currentHeroSlide + 1) % heroSlides.length;
            goToHeroSlide(nextIndex);
        }

        // Navigation par les indicateurs
        heroIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                clearInterval(heroInterval);
                goToHeroSlide(index);
                // Redémarrer l'animation automatique
                heroInterval = setInterval(nextHeroSlide, 3000);
            });
        });

        // Démarrer l'animation automatique toutes les 3 secondes
        heroInterval = setInterval(nextHeroSlide, 3000);
    }
}

// Event listeners principaux
window.addEventListener('scroll', () => {
    animateOnScroll();
    handleHeaderScroll();
});

window.addEventListener('load', () => {
    animateOnScroll();
    smoothScroll();
    animateCards();
    animateButtons();
    initMobileMenu();
    initContactForm();
    initFormStyling();
    initImageSlider();
    initHeroCarousel();
}); 