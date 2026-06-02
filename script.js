const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;
const centerX = width / 2;
const centerY = height / 2;

// --- VARIABLES PARA EL RELOJ ---
let animacionReloj = null;
let offsetTiempo = 0; // Guarda la diferencia en milisegundos entre la hora real y la manual

// Variables opcionales para mover figuras
let posicionX = 0;
let posicionY = 0;

// Detiene el reloj 
function detenerReloj() {
    if (animacionReloj) {
        cancelAnimationFrame(animacionReloj);
        animacionReloj = null;
    }
}

// --- dibujo ---

function clearCanvas() {
    detenerReloj();
    ctx.clearRect(0, 0, width, height);
}

function drawPoint(x, y, radius = 3, color = 'black') {
    detenerReloj();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawLine(x1, y1, x2, y2, color = 'blue', lineWidth = 2) {
    detenerReloj();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

function drawRectangle(x, y, w, h, color = 'black') {
    detenerReloj();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, radius, color = 'black') {
    detenerReloj();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawTriangle(x1, y1, x2, y2, x3, y3, fillColor = null, strokeColor = 'black', lineWidth = 2) {
    detenerReloj();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();

    if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }
}

function drawPolygon(points, fillColor = null, strokeColor = 'black', lineWidth = 2) {
    detenerReloj();
    if (points.length < 3) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.closePath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();

    if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }
}

function drawText(text, x, y, color = 'black', font = '20px Arial') {
    detenerReloj();
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(text, x, y);
}

function drawImage(x, y, w, h) {
    detenerReloj();
    const img = new Image();
    img.src = './images/imagen1.jpg'; // Verifica que la ruta sea correcta
    img.onload = () => {
        ctx.drawImage(img, x, y, w, h);
    };
}

// --- Reloj  ---

function aplicarHoraManualCuadrado() {
    const h = parseInt(document.getElementById('inputH').value) || 0;
    const m = parseInt(document.getElementById('inputM').value) || 0;
    const s = parseInt(document.getElementById('inputS').value) || 0;

    const ahora = new Date();
    const fechaDeseada = new Date();
    fechaDeseada.setHours(h, m, s);

    offsetTiempo = fechaDeseada.getTime() - ahora.getTime();

    detenerReloj();
    animarRelojCuadradoFrame();
}

function drawRelojCuadrado() {
    detenerReloj();
    offsetTiempo = 0; // Mostrar hora real
    document.getElementById('inputH').value = '';
    document.getElementById('inputM').value = '';
    document.getElementById('inputS').value = '';
    animarRelojCuadradoFrame();
}

function animarRelojCuadradoFrame() {
    ctx.clearRect(0, 0, width, height);

    const now = new Date(new Date().getTime() + offsetTiempo);
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    const size = Math.min(width, height) * 0.7;
    const x = centerX - size / 2;
    const y = centerY - size / 2;

    // Fondo cuadrado del reloj
    ctx.fillStyle = 'rgba(245, 245, 245, 1)';
    ctx.fillRect(x, y, size, size);

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#333';
    ctx.strokeRect(x, y, size, size);

    // Números del 1 al 12
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 24px Arial';

    const radioNumeros = size * 0.38;

    for (let i = 1; i <= 12; i++) {
        const angle = (i * Math.PI / 6) - Math.PI / 2;
        const numX = centerX + Math.cos(angle) * radioNumeros;
        const numY = centerY + Math.sin(angle) * radioNumeros;
        ctx.fillText(i.toString(), numX, numY);
    }

    // Marcas opcionales del reloj
    for (let i = 0; i < 60; i++) {
        const angle = (i * Math.PI / 30) - Math.PI / 2;
        const outerX = centerX + Math.cos(angle) * (size * 0.43);
        const outerY = centerY + Math.sin(angle) * (size * 0.43);

        const innerLength = i % 5 === 0 ? size * 0.035 : size * 0.02;
        const innerX = centerX + Math.cos(angle) * ((size * 0.43) - innerLength);
        const innerY = centerY + Math.sin(angle) * ((size * 0.43) - innerLength);

        ctx.beginPath();
        ctx.moveTo(innerX, innerY);
        ctx.lineTo(outerX, outerY);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = i % 5 === 0 ? 2 : 1;
        ctx.stroke();
    }

    // Punto central
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();

    // manecillas
    function dibujarManecilla(angle, length, handWidth, color) {
        const xHand = centerX + Math.cos(angle) * length;
        const yHand = centerY + Math.sin(angle) * length;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(xHand, yHand);
        ctx.strokeStyle = color;
        ctx.lineWidth = handWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
    }

    // Calcular ángulos
    const secondAngle = (seconds * Math.PI / 30) - Math.PI / 2;
    const minuteAngle = ((minutes + seconds / 60) * Math.PI / 30) - Math.PI / 2;
    const hourAngle = ((hours % 12 + minutes / 60) * Math.PI / 6) - Math.PI / 2;

    // Dibujar manecillas
    dibujarManecilla(hourAngle, size * 0.20, 6, 'black');
    dibujarManecilla(minuteAngle, size * 0.28, 4, 'blue');
    dibujarManecilla(secondAngle, size * 0.34, 2, 'red');

    animacionReloj = requestAnimationFrame(animarRelojCuadradoFrame);
}