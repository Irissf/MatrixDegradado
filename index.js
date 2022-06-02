//tutorial
//https://www.youtube.com/watch?v=f5ZswIE_SgY&t=57s

const canvas = document.getElementById('canvas1');
console.log(canvas);

//para poder cambiar la configuración del canvas y todos sus metodos de dibujo integrados
const context = canvas.getContext('2d');

//establecemos el ancho y alto
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/**Se encargará de crear y dibujar objetos de símbolos individuales 
que componen el efecto de lluvia*/
class Symbol {
    constructor(x, y , fontSize, canvasHeight){
        this.characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.text = '';
        this.canvasHeight = canvasHeight;
    }
    draw(context){
        //cogemos un caracter aleatorio
        this.text = this.characters.charAt(Math.floor(Math.random()*this.characters.length))
        context.fillText(this.text, this.x*this.fontSize, this.y*this.fontSize);

        //Math.random()>0.98 para generar el delay
        if(this.y*this.fontSize > this.canvasHeight && Math.random()>0.98){
            this.y = 0; //reposicionamos
        }else{
            this.y += 1;
        }
    }
}

/**
 * Será el envoltorio principal para todo efecto de lluvia, aqui ponemos las funcionalidades
 * para crear actualizaciones y dibujar todos los símbolos
 */
class Effect {
    constructor(canvasWidht, canvasHeight){
        this.canvasWidht = canvasWidht;
        this.canvasHeight = canvasHeight;
        this.fontSize = 20;
        this.columns = this.canvasWidht/this.fontSize;
        this.symbols = [];
        this.#initialize();//inicializamos desde aqui
        console.log(this,this.symbols);
    }

    //abstracción
    #initialize(){
        for (let index = 0; index < this.columns; index++) {
            this.symbols[index] = new Symbol(index, 0,this.fontSize ,this.canvasHeight); //llenamos la matriz con caracteres
        }
    }

    //para el responsive
    resize(width, height){
        this.canvasWidht = width;
        this.canvasHeight = height;
        this.columns = this.canvasWidht/ this.fontSize;
        this.symbols = [];
        this.#initialize();
    }
}


//para relentizar el movimiento, a menos fotogramas por segundo
let lastTime = 0;
const fps = 40;
const nextFrame = 1000/fps;
let timer = 0;

//para el degradado
let gradient = context.createLinearGradient(0,0, 0, canvas.height);
gradient.addColorStop(0,'#ff7800');
gradient.addColorStop(.25, '#ff009b');
gradient.addColorStop(.50, '#b700ff');
gradient.addColorStop(.75, '#f771e1');
gradient.addColorStop(1, '#ad71ff');

const effect = new Effect(canvas.width, canvas.height);

//se ejecutará 60 veces por segundo por defecto
function animate(timesStamp) {
    //cambiar el tiempo por segundo
    const deltaTime = timesStamp - lastTime;
    lastTime = timesStamp;

    if(timer > nextFrame){
        //un recuadro negro transparente para ocultar las letras anteriores
        context.fillStyle = 'rgba(0,0,0,0.05)';
        context.textAlign = 'center'; //por la alineación de los caracteres japoneses
        context.fillRect(0,0,canvas.width,canvas.height);

        context.fillStyle = gradient;//"#0aff0a";
        context.font = effect.fontSize + 'px monospace';
        effect.symbols.forEach(symbol => symbol.draw(context));

        timer = 0
    }else{
        timer += deltaTime;
    }

   
    requestAnimationFrame(animate);
}
animate(0);

//responsive
window.addEventListener('resize', function(){
    canvas.width = this.window.innerWidth;
    canvas.height = this.window.innerHeight;
    effect.resize(canvas.width, canvas.height);
});