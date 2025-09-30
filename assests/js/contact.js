// contact.js - Gestion de la page contact
document.addEventListener('DOMContentLoaded', function() {
    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.querySelector('.submit-btn');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitForm();
            }
        });
    }

    // Validation du formulaire
    function validateForm() {
        let isValid = true;
        const formGroups = contactForm.querySelectorAll('.form-group');
        
        // Réinitialiser les erreurs
        formGroups.forEach(group => {
            group.classList.remove('error');
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.textContent = '';
            }
        });

        // Validation des champs requis
        const requiredFields = contactForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            const formGroup = field.closest('.form-group');
            if (!field.value.trim()) {
                showError(formGroup, 'Ce champ est obligatoire');
                isValid = false;
            }
        });

        // Validation email
        const emailField = contactForm.querySelector('#email');
        if (emailField.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                showError(emailField.closest('.form-group'), 'Veuillez entrer un email valide');
                isValid = false;
            }
        }

        // Validation téléphone
        const phoneField = contactForm.querySelector('#phone');
        if (phoneField.value.trim()) {
            const phoneRegex = /^[0-9+\-\s()]{10,}$/;
            if (!phoneRegex.test(phoneField.value.replace(/\s/g, ''))) {
                showError(phoneField.closest('.form-group'), 'Veuillez entrer un numéro de téléphone valide');
                isValid = false;
            }
        }

        return isValid;
    }

    function showError(formGroup, message) {
        formGroup.classList.add('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = message;
        }
    }

    // Soumission du formulaire
    function submitForm() {
        // Simulation d'envoi
        submitBtn.classList.add('loading');
        
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            contactForm.reset();
            formSuccess.style.display = 'block';
            
            // Scroll vers le message de succès
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Masquer le message après 5 secondes
            setTimeout(() => {
                formSuccess.style.display = 'none';
            }, 5000);
        }, 2000);
    }

    // Gestion des FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Fermer tous les autres items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Ouvrir/fermer l'item actuel
            item.classList.toggle('active');
        });
    });

    // Animation des éléments au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    const animatedElements = document.querySelectorAll('.contact-card, .transport-option, .faq-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Effets d'interaction pour les cartes de contact
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.contact-icon');
            icon.style.transform = 'scale(1.2) rotate(10deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.contact-icon');
            icon.style.transform = 'scale(1) rotate(0)';
        });
    });

    // Gestion des liens de contact
    const contactLinks = document.querySelectorAll('.contact-link');
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('tel:')) {
                e.preventDefault();
                const phoneNumber = this.getAttribute('href').replace('tel:', '');
                if (confirm(`Voulez-vous appeler le ${phoneNumber} ?`)) {
                    window.location.href = this.getAttribute('href');
                }
            }
        });
    });

    // Auto-format du numéro de téléphone
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                value = value.match(new RegExp('.{1,2}', 'g')).join(' ');
            }
            
            e.target.value = value;
        });
    }

    // Affichage dynamique des champs selon le sujet
    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) {
        subjectSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            
            // Vous pouvez ajouter ici une logique pour afficher/masquer des champs
            // selon le sujet sélectionné
            if (selectedValue === 'reservation') {
                // Exemple: Afficher des champs supplémentaires pour la réservation
                console.log('Réservation sélectionnée - champs supplémentaires');
            }
        });
    }

    // Copie d'email au clic
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            const email = this.getAttribute('href').replace('mailto:', '');
            
            // Copie dans le clipboard
            navigator.clipboard.writeText(email).then(() => {
                const originalText = this.textContent;
                this.textContent = 'Email copié !';
                
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Erreur de copie:', err);
            });
        });
    }
});