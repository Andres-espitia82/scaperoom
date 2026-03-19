let currentWall = 0;
const totalWalls = 2;
const room = document.getElementById('room');
let inventory = [];

// 1. OCULTAR LA LLAVE AL INICIAR
const frozenKeyElement = document.getElementById('frozen-key');
if (frozenKeyElement) {
    frozenKeyElement.style.display = 'none';
}

// Navegación de paredes
document.getElementById('nav-right').addEventListener('click', () => {
    currentWall = (currentWall + 1) % totalWalls;
    updateWall();
});

document.getElementById('nav-left').addEventListener('click', () => {
    currentWall = (currentWall - 1 + totalWalls) % totalWalls;
    updateWall();
});

function updateWall() {
    room.style.transform = `translateX(-${currentWall * 100}vw)`;
}

// Log interactivo 
function log(msg) {
    const logEl = document.getElementById('log-text');
    if (logEl) logEl.innerText = msg;
}

// Interacciones principales
document.querySelectorAll('.interactive').forEach(item => {
    item.addEventListener('click', (e) => {
        let targetId = e.target.id || e.target.parentElement.id || e.target.parentElement.parentElement.id;
        interact(targetId);
    });
});

function interact(itemName) {
    const overlay = document.getElementById('zoom-overlay');
    
    // Ocultar vistas internas
    const noteView = document.getElementById('note-view');
    const clockView = document.getElementById('clock-puzzle');
    const riddleView = document.getElementById('riddle-view');
    
    if (noteView) noteView.style.display = 'none';
    if (clockView) clockView.style.display = 'none';
    if (riddleView) riddleView.style.display = 'none';

    if (itemName === 'hidden-note') {
        log("Examinando: Nota antigua detrás del cuadro.");
        document.getElementById('zoom-title').innerText = "Nota antigua";
        document.getElementById('zoom-desc').innerText = "Encontrada tras el cuadro...";
        document.getElementById('note-content').innerText = "«El tiempo se detuvo cuando ella se fue. Las 3 en punto... para siempre.»";
        if (noteView) noteView.style.display = 'block';
        if (overlay) overlay.style.display = 'flex';
        
    } else if (itemName === 'vase-clue') {
        log("Examinando: Nota arrugada.");
        document.getElementById('zoom-title').innerText = "Nota arrugada";
        document.getElementById('zoom-desc').innerText = "La tinta está corrida, pero aún se puede leer...";
        document.getElementById('note-content').innerText = "«Para que la cerámica libere su llave, debes nombrar a la bestia que no tiene boca pero devora los bosques. Aquella que baila con luz, nace de una chispa y cuyo cadáver es un polvo gris...»";
        if (noteView) noteView.style.display = 'block';
        if (overlay) overlay.style.display = 'flex';
        
    } else if (itemName === 'grandfather-clock') {
        log("Examinando: Reloj de pie antiguo.");
        document.getElementById('zoom-title').innerText = "Reloj de pie";
        document.getElementById('zoom-desc').innerText = "Faltan las manecillas... parece que se pueden mover.";
        if (clockView) clockView.style.display = 'block';
        if (overlay) overlay.style.display = 'flex';
        
    } else if (itemName === 'vase') {
        log("Examinando: Jarrón de porcelana.");
        document.getElementById('zoom-title').innerText = "Jarrón de porcelana";
        document.getElementById('zoom-desc').innerText = "Tiene un mecanismo en la base con letras giratorias.";
        if (riddleView) riddleView.style.display = 'block';
        if (overlay) overlay.style.display = 'flex';
        
    } else if (itemName === 'frozen-key') {
        if (!inventory.includes('frozen-key')) {
            inventory.push('frozen-key');
            updateInventory();
            log("¡Has obtenido la Llave Congelada!");
            if (frozenKeyElement) frozenKeyElement.style.display = 'none';
        }
        
    } else if (itemName === 'exit-door') {
        if (inventory.includes('frozen-key')) {
            log("La Llave Congelada encaja perfectamente. ¡La puerta se abre!");
            document.getElementById('exit-door').classList.add('shifted-door');
            document.getElementById('exit-door').innerText = "🚪 Puerta Abierta (¡Escapaste!)";
        } else {
            log("La puerta está cerrada. Necesitas encontrar una llave.");
        }
    } 
    // Lógica de los cuadros
    else if (itemName === 'frame-round') {
        const cuadro = document.getElementById('frame-round');
        if (cuadro) {
            cuadro.classList.toggle('shifted');
            log("Has movido el cuadro misterioso... hay algo detrás.");
        }
    } else if (itemName === 'frame-center') {
        const cuadro = document.getElementById('frame-center');
        if (cuadro) {
            cuadro.classList.toggle('shifted');
            log("El cuadro se desliza con un chirrido...");
        }
    }
}

function closeZoom() {
    const overlay = document.getElementById('zoom-overlay');
    if (overlay) overlay.style.display = 'none';
}

function updateInventory() {
    const slots = document.querySelectorAll('.slot');
    slots.forEach(slot => {
        slot.innerHTML = ''; 
        slot.classList.remove('active');
    }); 
    
    inventory.forEach((item, index) => {
        if (index < slots.length) {
            if (item === 'frozen-key') {
                slots[index].innerHTML = '🗝️';
                slots[index].classList.add('active');
            } else if (item === 'engranaje') {
                slots[index].innerHTML = '⚙️';
                slots[index].classList.add('active');
            }
        }
    });
}

function checkRiddle() {
    const inputEl = document.getElementById('riddle-input');
    if (!inputEl) return;
    
    const answer = inputEl.value.trim().toUpperCase();
    if (answer === 'FUEGO' || answer === 'CENIZA' || answer === 'CENIZAS') {
        log("Escuchas un 'clic' dentro del jarrón. ¡La llave ha caído al suelo!");
        closeZoom();
        if (frozenKeyElement) frozenKeyElement.style.display = 'flex'; // Mostrar la llave
    } else {
        log("No ocurre nada. Esa no es la respuesta correcta.");
        inputEl.value = "";
    }
}

let rotationHour = 0;
let rotationMin = 0;
let clockSolved = false;

function rotateHand(type) {
    if (type === 'hour') {
        rotationHour += 30;
        document.getElementById('hour-hand').style.transform = `translateX(-50%) rotate(${rotationHour}deg)`;
    } else if (type === 'min') {
        rotationMin += 30;
        if (rotationMin >= 360) rotationMin = 0; 
        document.getElementById('min-hand').style.transform = `translateX(-50%) rotate(${rotationMin}deg)`;
    }
    
    log(`Has movido la manecilla de las ${type === 'hour' ? 'horas' : 'minutos'}.`);

    let hDeg = rotationHour % 360;
    
    if (!clockSolved && hDeg === 90 && rotationMin === 0) {
        clockSolved = true;
        log("¡CLAC! El compartimento del reloj se abre. Has obtenido un ENGRANAJE.");
        inventory.push('engranaje');
        updateInventory();
        setTimeout(closeZoom, 1500); 
    }
}

function crearBrillitos() {
    const container = document.querySelector('.dust-container');
    if (!container) return;
    
    for (let i = 0; i < 35; i++) {
        let polvo = document.createElement('div');
        polvo.classList.add('dust');
        
        polvo.style.left = Math.random() * 100 + '%';
        polvo.style.top = Math.random() * 100 + '%';
        polvo.style.animationDuration = (Math.random() * 8 + 4) + 's';
        polvo.style.animationDelay = (Math.random() * 5) + 's';
        
        let size = Math.random() * 2 + 2; 
        polvo.style.width = size + 'px';
        polvo.style.height = size + 'px';
        
        container.appendChild(polvo);
    }
}

document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    document.querySelectorAll('.eye').forEach(eye => {
        const rect = eye.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;
        
        const deltaX = mouseX - eyeCenterX;
        const deltaY = mouseY - eyeCenterY;
        const angle = Math.atan2(deltaY, deltaX);
        
        const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 20, 6); 
        
        const pupilX = Math.cos(angle) * distance;
        const pupilY = Math.sin(angle) * distance;
        
        const pupil = eye.querySelector('.pupil');
        if (pupil) {
            pupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
        }
    });
});

crearBrillitos();