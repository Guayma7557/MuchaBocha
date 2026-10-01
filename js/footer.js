// Interacciones compartidas del pie de página.
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.footer-news form').forEach((form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            form.reset();
            const button = form.querySelector('button[type="submit"]');
            if (!button) return;
            const icon = document.createElement('i');
            icon.className = 'fas fa-check';
            button.replaceChildren(icon, document.createTextNode(' ¡Listo!'));
        });
    });
});
