// reservation.js - Gestion de la page réservation
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de la date minimum (aujourd'hui)
    const dateInput = document.getElementById('reservation-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }

    // Gestion des étapes du formulaire
    const formSteps = document.querySelectorAll('.form-step');
    const processSteps = document.querySelectorAll('.process-step');
    let currentStep = 1;

    // Navigation entre les étapes
    document.querySelectorAll('.btn-next').forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = this.getAttribute('data-next');
            if (validateStep(currentStep)) {
                goToStep(nextStep);
            }
        });
    });

    document.querySelectorAll('.btn-prev').forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = this.getAttribute('data-prev');
            goToStep(prevStep);
        });
    });

    function goToStep(stepId) {
        // Masquer toutes les étapes
        formSteps.forEach(step => step.classList.remove('active'));
        processSteps.forEach(step => step.classList.remove('active'));
        
        // Afficher l'étape cible
        document.getElementById(stepId).classList.add('active');
        
        // Mettre à jour les indicateurs de processus
        const stepNumber = parseInt(stepId.replace('step', ''));
        processSteps[stepNumber - 1].classList.add('active');
        
        currentStep = stepNumber;
        
        // Mettre à jour le résumé à l'étape 3
        if (stepNumber === 3) {
            updateReservationSummary();
        }
        
        // Scroll vers le haut du formulaire
        document.querySelector('.reservation-form-section').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    // Validation des étapes
    function validateStep(step) {
        let isValid = true;
        
        switch(step) {
            case 1:
                isValid = validateStep1();
                break;
            case 2:
                isValid = validateStep2();
                break;
        }
        
        return isValid;
    }

    function validateStep1() {
        let isValid = true;
        const fields = ['reservation-date', 'reservation-time', 'guests'];
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const formGroup = field.closest('.form-group');
            
            if (!field.value) {
                showError(formGroup, 'Ce champ est obligatoire');
                isValid = false;
            } else {
                clearError(formGroup);
            }
        });
        
        return isValid;
    }

    function validateStep2() {
        let isValid = true;
        const fields = ['first-name', 'last-name', 'email', 'phone'];
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const formGroup = field.closest('.form-group');
            
            if (!field.value.trim()) {
                showError(formGroup, 'Ce champ est obligatoire');
                isValid = false;
            } else {
                clearError(formGroup);
                
                // Validation spécifique pour l'email
                if (fieldId === 'email' && field.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value)) {
                        showError(formGroup, 'Veuillez entrer un email valide');
                        isValid = false;
                    }
                }
                
                // Validation spécifique pour le téléphone
                if (fieldId === 'phone' && field.value.trim()) {
                    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
                    if (!phoneRegex.test(field.value.replace(/\s/g, ''))) {
                        showError(formGroup, 'Veuillez entrer un numéro de téléphone valide');
                        isValid = false;
                    }
                }
            }
        });
        
        return isValid;
    }

    function showError(formGroup, message) {
        formGroup.classList.add('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = message;
        }
    }

    function clearError(formGroup) {
        formGroup.classList.remove('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
    }

    // Mise à jour du résumé de réservation
    function updateReservationSummary() {
        const summaryData = {
            date: document.getElementById('reservation-date').value,
            time: document.getElementById('reservation-time').value,
            guests: document.getElementById('guests').value,
            occasion: document.getElementById('occasion').value,
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            requests: document.getElementById('special-requests').value
        };

        // Formatage de la date
        const dateObj = new Date(summaryData.date);
        const formattedDate = dateObj.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Mise à jour des éléments du résumé
        document.getElementById('summary-date').textContent = formattedDate;
        document.getElementById('summary-time').textContent = summaryData.time;
        document.getElementById('summary-guests').textContent = `${summaryData.guests} personne(s)`;
        document.getElementById('summary-occasion').textContent = getOccasionText(summaryData.occasion);
        document.getElementById('summary-name').textContent = `${summaryData.firstName} ${summaryData.lastName}`;
        document.getElementById('summary-contact').textContent = `${summaryData.email} | ${summaryData.phone}`;
        document.getElementById('summary-requests').textContent = summaryData.requests || 'Aucune';
    }

    function getOccasionText(occasion) {
        const occasions = {
            'none': 'Sans occasion particulière',
            'anniversary': 'Anniversaire de mariage',
            'birthday': 'Fête d\'anniversaire',
            'date': 'Rendez-vous',
            'business': 'Dîner d\'affaires',
            'family': 'Repas en famille',
            'celebration': 'Célébration',
            'other': 'Autre'
        };
        return occasions[occasion] || 'Non spécifiée';
    }

    // Soumission du formulaire
    const reservationForm = document.getElementById('reservationForm');
    const submitBtn = document.querySelector('.submit-btn');
    const formSuccess = document.getElementById('formSuccess');

    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateStep(3) && document.getElementById('terms').checked) {
                submitReservation();
            } else if (!document.getElementById('terms').checked) {
                const termsGroup = document.getElementById('terms').closest('.form-group');
                showError(termsGroup, 'Vous devez accepter les conditions générales');
            }
        });
    }

    function submitReservation() {
        // Simulation d'envoi
        submitBtn.classList.add('loading');
        
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            
            // Générer un numéro de réservation
            const reservationNumber = 'DC-' + new Date().getFullYear() + '-' + 
                Math.random().toString(36).substr(2, 6).toUpperCase();
            
            // Mettre à jour les détails de confirmation
            document.getElementById('reservation-number').textContent = reservationNumber;
            document.getElementById('confirmed-date').textContent = document.getElementById('summary-date').textContent;
            document.getElementById('confirmed-time').textContent = document.getElementById('summary-time').textContent;
            
            // Afficher le message de succès
            formSteps.forEach(step => step.style.display = 'none');
            formSuccess.style.display = 'block';
            
            // Scroll vers le message de succès
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 2000);
    }

    // Nouvelle réservation
    document.getElementById('newReservationBtn').addEventListener('click', function() {
        // Réinitialiser le formulaire
        reservationForm.reset();
        formSuccess.style.display = 'none';
        formSteps.forEach(step => step.style.display = 'block');
        goToStep('step1');
    });

    // Gestion des créneaux de disponibilité
    document.querySelectorAll('.slot.available').forEach(slot => {
        slot.addEventListener('click', function() {
            const time = this.textContent;
            document.getElementById('reservation-time').value = time;
            
            // Scroll vers le formulaire
            document.querySelector('.reservation-form-section').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            
            // Feedback visuel
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
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
    const animatedElements = document.querySelectorAll('.sidebar-card, .availability-card, .info-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Effets d'interaction pour les cartes de disponibilité
    const availabilityCards = document.querySelectorAll('.availability-card');
    availabilityCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Gestion des changements de date
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            // Ici vous pourriez appeler une API pour vérifier les disponibilités
            console.log('Date sélectionnée:', this.value);
        });
    }

    // Gestion des changements d'heure
    const timeSelect = document.getElementById('reservation-time');
    if (timeSelect) {
        timeSelect.addEventListener('change', function() {
            console.log('Heure sélectionnée:', this.value);
        });
    }
});