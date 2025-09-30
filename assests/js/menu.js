// menu.js - Gestion de la page menu
document.addEventListener('DOMContentLoaded', function() {
    // Navigation entre catégories
    const categoryTabs = document.querySelectorAll('.category-tab');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetCategory = this.getAttribute('data-category');
            
            // Retirer la classe active de tous les tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            // Ajouter la classe active au tab cliqué
            this.classList.add('active');
            
            // Masquer toutes les catégories
            menuCategories.forEach(category => {
                category.classList.remove('active');
            });
            
            // Afficher la catégorie cible
            const targetElement = document.getElementById(targetCategory);
            if (targetElement) {
                targetElement.classList.add('active');
                
                // Scroll vers la catégorie (smooth)
                setTimeout(() => {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
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
    
    // Observer les éléments du menu
    const menuItems = document.querySelectorAll('.menu-item, .side-item, .drink-item, .offer-card');
    menuItems.forEach(item => {
        observer.observe(item);
    });
    
    // Sticky categories navigation
    const categoriesNav = document.querySelector('.menu-categories');
    if (categoriesNav) {
        const initialOffset = categoriesNav.offsetTop;
        
        window.addEventListener('scroll', function() {
            if (window.scrollY >= initialOffset) {
                categoriesNav.style.background = 'rgba(255, 255, 255, 0.95)';
                categoriesNav.style.backdropFilter = 'blur(10px)';
                categoriesNav.style.borderBottom = '2px solid var(--border-light)';
            } else {
                categoriesNav.style.background = 'var(--white)';
                categoriesNav.style.backdropFilter = 'none';
            }
        });
    }
    
    // Gestion des badges spéciaux
    function updateSpecialBadges() {
        const specialItems = document.querySelectorAll('.menu-item');
        specialItems.forEach(item => {
            const badges = item.querySelectorAll('.item-badge');
            badges.forEach(badge => {
                // Ajouter des styles supplémentaires selon le type de badge
                if (badge.textContent.includes('Nouveau')) {
                    badge.style.background = 'var(--primary-red)';
                } else if (badge.textContent.includes('Spécialité')) {
                    badge.style.background = 'var(--accent-brown)';
                }
            });
        });
    }
    
    // Filtrage des éléments (fonctionnalité avancée)
    function setupMenuFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const menuItems = document.querySelectorAll('.menu-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Retirer active de tous les boutons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Activer le bouton cliqué
                this.classList.add('active');
                
                // Filtrer les éléments
                menuItems.forEach(item => {
                    if (filter === 'all') {
                        item.style.display = 'block';
                    } else {
                        const tags = item.querySelectorAll('.tag');
                        let hasTag = false;
                        
                        tags.forEach(tag => {
                            if (tag.classList.contains(`tag-${filter}`)) {
                                hasTag = true;
                            }
                        });
                        
                        item.style.display = hasTag ? 'block' : 'none';
                    }
                });
            });
        });
    }
    
    // Initialisation des fonctions
    updateSpecialBadges();
    // setupMenuFilters(); // Décommentez si vous ajoutez des boutons de filtre
    
    // Gestion du téléchargement du menu PDF
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const format = this.classList.contains('pdf') ? 'PDF' : 'Image';
            alert(`Téléchargement du menu en format ${format} commencé!`);
            // Ici vous ajouteriez la logique de téléchargement réelle
        });
    });
    
    // Animation des prix au hover
    const priceElements = document.querySelectorAll('.item-price, .new-price');
    priceElements.forEach(price => {
        price.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        price.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Système de favoris (exemple)
    function setupFavorites() {
        const favoriteButtons = document.querySelectorAll('.favorite-btn');
        favoriteButtons.forEach(button => {
            button.addEventListener('click', function() {
                this.classList.toggle('active');
                const itemName = this.closest('.menu-item').querySelector('h3').textContent;
                
                if (this.classList.contains('active')) {
                    console.log(`Ajouté aux favoris: ${itemName}`);
                } else {
                    console.log(`Retiré des favoris: ${itemName}`);
                }
            });
        });
    }
    
    // Ajouter des boutons favoris si nécessaire
    // setupFavorites();
});