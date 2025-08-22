// Detectar y aplicar el tema guardado
document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme');
    const themeText = document.querySelector('.theme-text');
    
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
            themeText.textContent = 'Modo oscuro';
        } else {
            themeText.textContent = 'Modo claro';
        }
    } else {
        // Si no hay tema guardado, usar las preferencias del sistema
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            toggleSwitch.checked = true;
            themeText.textContent = 'Modo oscuro';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeText.textContent = 'Modo claro';
        }
    }

    // Cambiar tema cuando se activa/desactiva el interruptor
    toggleSwitch.addEventListener('change', switchTheme, false);
    
    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeText.textContent = 'Modo oscuro';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeText.textContent = 'Modo claro';
        }    
    }
    
    // Escuchar cambios en las preferencias del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (!localStorage.getItem('theme')) {
            if (event.matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
                toggleSwitch.checked = true;
                themeText.textContent = 'Modo oscuro';
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                toggleSwitch.checked = false;
                themeText.textContent = 'Modo claro';
            }
        }
    });
});

// Código de la calculadora
document.getElementById('priceCalculator').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Mostrar loader
    document.querySelector('.loader').style.display = 'block';
    document.getElementById('resultContainer').classList.remove('show');
    
    // Obtener los valores ingresados por el usuario
    const articlePrice = parseFloat(document.getElementById('articlePrice').value);
    const shippingCost = parseFloat(document.getElementById('shippingCost').value);

    // Calcular el total en dólares con impuesto del 8.4%
    const taxRate = 1.084;
    const totalInDollars = (articlePrice) * (taxRate) + shippingCost;

    // Obtener el tipo de cambio actual de USD a MXN (usando una API)
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
        .then(response => response.json())
        .then(data => {
            const exchangeRate = data.rates.MXN;

            // Mostrar el tipo de cambio actual
            document.getElementById('exchangeRate').textContent = `1 USD = ${exchangeRate.toFixed(2)} MXN`;

            // Convertir el total a pesos mexicanos
            const totalInPesos = totalInDollars * exchangeRate;
            document.getElementById('precioInPesos').textContent = `$${totalInPesos.toFixed(2)} MXN`;

            // Añadir comisión fija de 350 pesos
            const totalWithFixedCommission = totalInPesos + 350;
            document.getElementById('precioMartha').textContent = `$${totalWithFixedCommission.toFixed(2)} MXN`;

            // Añadir comisión del 35%
            const finalTotal = totalWithFixedCommission * 1.35;

            // Ganancia del 35%
            const ganancia = finalTotal - totalWithFixedCommission;
            document.getElementById('ganancia').textContent = `$${ganancia.toFixed(2)} MXN`;

            // Mostrar el resultado al usuario
            document.getElementById('totalPrice').textContent = `Total del artículo: $${finalTotal.toFixed(2)} MXN`;
            
            // Ocultar loader y mostrar resultados con animación
            setTimeout(function() {
                document.querySelector('.loader').style.display = 'none';
                document.getElementById('resultContainer').classList.add('show');
            }, 500);
        })
        .catch(error => {
            console.error('Error al obtener el tipo de cambio:', error);
            document.getElementById('exchangeRate').textContent = 'Error al obtener tipo de cambio';
            document.getElementById('totalPrice').textContent = 'Error al calcular el precio. Inténtalo de nuevo.';
            
            // Ocultar loader en caso de error
            document.querySelector('.loader').style.display = 'none';
            document.getElementById('resultContainer').classList.add('show');
        });
});