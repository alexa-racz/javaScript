//Elemek
const gombObj = document.querySelector("#gomb");
const jatekosObj = document.querySelector("#jatekos");
const kincsObj = document.querySelector("#kincs");
const kezdesObj = document.querySelector("#kezdes");
const canvas1 = document.querySelector("#vaszon1");
const ctx1 = canvas1.getContext('2d');
const canvas2 = document.querySelector("#vaszon2");
const ctx2 = canvas2.getContext('2d');
const leirasObj = document.querySelector("#leiras");
const szabalyzatObj = document.querySelector("#szabalyzat");
const adatokObj = document.querySelector("#jatekosAdatok");

//Konstansok
const MERET = (canvas1.width - 40) / 7;
const KINCSEK = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

//Állapottér
let kincsSzam;
let jatekosSzam;
let vege;
let aktualisJatekos = 0;
let kattintasSzam = 0;
class Elem {
    constructor(x, y, fajta, jatekos, irany, kincs) {
        this.x = x;
        this.y = y;
        this.fajta = fajta;
        this.jatekos = jatekos;
        this.irany = irany;
        this.kincs = kincs;
        this.kep = new Image();
    }

    rotate() {
        this.irany++;
        this.irany = this.irany % 4;
    }

    center() {
        let x = this.x + MERET / 2;
        let y = this.y + MERET / 2;
        return {x, y}
    }

    setFajta(f) {
        this.fajta = f;
    }

    setIrany(i) {
        this.irany = i;
    }

    drawE() {
        //kep(this);
        let kep = this.kep;
        let x = this.x;
        let y = this.y;
        this.kep.onload = function() {
            ctx1.drawImage(kep, x, y, MERET, MERET);
        };
    }

    drawTreasure() {
        ctx2.clearRect(this.x, this.y, MERET, MERET);
        if (this.kincs != null) {
            ctx2.fillStyle = "black";
            ctx2.textAlign = "center";
            ctx2.font = "20px Georgia";
            ctx2.fillText(this.kincs, this.center().x, this.center().y);
        }
    }

    ajtok() {
        let ajtok = [];
        switch (this.fajta) {
            case "T":
                for (let i = 0; i < 3; i++) {
                    ajtok.push((i + this.irany) % 4);
                }
                break;
            case "I":
                if (this.irany % 2 == 0) {
                    ajtok = [0, 2];
                }
                else {
                    ajtok = [1, 3];
                }
                break;
            case "L":
                for (let i = 0; i < 2; i++) {
                    ajtok.push((i + this.irany) % 4);
                }
                break;
        }
        return ajtok;
    }
}

class Jatekos {
    constructor(sorszam, kincsek) {
        this.sorszam = sorszam;
        this.teljesitett = 0;
        this.kincsek = kincsek;
        this.keresettKincs = this.kincsek.pop();
        let szinek = ["red", "blue", "green", "orange"];
        this.szin = szinek[sorszam - 1];
        this.startMezo = sarkok[sorszam - 1];
        this.mezo = this.startMezo;
    }

    drawStartingPoint() {
        ctx2.fillStyle = this.szin;
        ctx2.fillRect(this.startMezo.center().x - 10, this.startMezo.center().y - 10, 20, 20);
    }

    drawMarker() {
        ctx2.fillStyle = this.szin;
        ctx2.beginPath();
        ctx2.arc(this.mezo.center().x, this.mezo.center().y, 10, 0, 2 * Math.PI);
        ctx2.stroke(); 
    }
}

//fix elemek létrehozása
let sarkok = [];
let fixElemek = [];
let jatekosok = [];
let nyilak = [];
for (let i = 0; i < 7; i += 2) {
    for (let j = 0; j < 7; j += 2) {
        let fix = new Elem(20 + j * MERET, 20 + i * MERET, "T", [], 1, null);
        fixElemek.push(fix);
    }
}

fixElemek[0].setFajta("L");
sarkok.push(fixElemek[0]);
fixElemek[3].setFajta("L");
fixElemek[3].setIrany(2);
sarkok.push(fixElemek[3]);
fixElemek[4].setIrany(0);
fixElemek[5].setIrany(0);
fixElemek[7].setIrany(2);
fixElemek[8].setIrany(0);
fixElemek[9].setIrany(3);
fixElemek[10].setIrany(2);
fixElemek[11].setIrany(2);
fixElemek[12].setFajta("L");
fixElemek[12].setIrany(0);
sarkok.push(fixElemek[12]);
fixElemek[13].setIrany(3);
fixElemek[14].setIrany(3);
fixElemek[15].setFajta("L");
fixElemek[15].setIrany(3);
sarkok.push(fixElemek[15]);

//többi elem
let elemek = [];
for (let i = 0; i < 13; i++) {
    let elem = new Elem(0, 0, "I", [], 0, null);
    elemek.push(elem);
}
for (let i = 0; i < 15; i++) {
    let elem = new Elem(0, 0, "L", [], 0, null);
    elemek.push(elem);
}
for (let i = 0; i < 6; i++) {
    let elem = new Elem(0, 0, "T", [], 0, null);
    elemek.push(elem);
}

//tábla létrehozása
let fixIndex = 0;
let matrix = generateMatrix(7, 7);
for (let i = 0; i < 7; i += 2) {
    for (let j = 0; j < 7; j += 2) {
        matrix[i][j] = fixElemek[fixIndex++];
    }
    for (let j = 1; j < 6; j += 2) {
        let rand = veletlenEgesz(0, elemek.length - 1);
        let elem = elemek[rand];
        elemek.splice(rand, 1);
        elem.setIrany(veletlenEgesz(0, 3));
        elem.x = 20 + j * MERET;
        elem.y = 20 + i * MERET;
        matrix[i][j] = elem;
    }
}
for (let i = 1; i < 6; i += 2) {
    for (let j = 0; j < 7; j++) {
        let rand = veletlenEgesz(0, elemek.length - 1);
        let elem = elemek[rand];
        elemek.splice(rand, 1);
        elem.setIrany(veletlenEgesz(0, 3));
        elem.x = 20 + j * MERET;
        elem.y = 20 + i * MERET;
        matrix[i][j] = elem;
    }
}

//kimaradt elem
let kimaradt = elemek.pop();
kep(kimaradt);
let kimaradtKep = kimaradt.kep.src;

//kincsek kiosztása mezőkre
KINCSEK.forEach(x => {
    let elem = kincsek();
    elem.kincs = x;
})

//nyilak
for (let i = 1; i < 7; i += 2) {
    nyilak.push(
    {
        x: (i + 0.5) * MERET + 10,
        y: 0,
        sor: null,
        oszlop: i,
        irany: "+",
    },
    {
        x: (i + 0.5) * MERET + 10,
        y: canvas1.height - 20,
        sor: null,
        oszlop: i,
        irany: "-",
    },
    {
        x: 0,
        y: (i + 0.5) * MERET + 10,
        sor: i,
        oszlop: null,
        irany: "+",
    },
    {
        x: canvas1.width - 20,
        y: (i + 0.5) * MERET + 10,
        sor: i,
        oszlop: null,
        irany: "-",
    });
}

//Eseménykezelés
gombObj.addEventListener("click", start);
leirasObj.addEventListener("click", megjelenit);
jatekosObj.addEventListener("change", setMax);
adatokObj.addEventListener("click", forgatas);
canvas2.addEventListener("click", kattintas)

//Kirajzolás

//Játékciklus
let elozoIdo = performance.now();
jatekciklus();

function jatekciklus() {
    while (!vege) {
        let mostaniIdo = performance.now();
        let dt = (mostaniIdo - elozoIdo) / 1000;
        elozoIdo = mostaniIdo;
        // if (kattintasSzam % 2 == 0) {
        //     alert(jatekosok[aktualisJatekos].sorszam + ". játékos következik!");
        update(aktualisJatekos, dt);
        // }
        // else {
        //     lepes(aktualisJatekos)
        // }
        aktualisJatekos++;
        // if (aktualisJatekos > jatekosSzam) {
        //     aktualisJatekos = aktualisJatekos % jatekosSzam;
        // } 
        draw();
        requestAnimationFrame(jatekciklus);
    }
}

//Állapottér változtatása
function update(aktualisJatekos, dt) {
    // elem forgatása
    //lepes(aktualisJatekos);
    // Oszlopok mozgása:

    vege = aktualisJatekos.teljesitett == kincsSzam;
}

//Segédfüggvények

function start() {
    jatekosObj.disabled = true;
    kincsObj.disabled = true;
    gombObj.disabled = true;
    kezdesObj.toggleAttribute("hidden");

    jatekosSzam = jatekosObj.value;
    kincsSzam = kincsObj.value;

    for (let i = 0; i < jatekosSzam; i++) {
        let kincsek = [];
        for (let j = 0; j < kincsSzam; j++) {
            let rand = veletlenEgesz(0, KINCSEK.length - 1);
            kincsek[j] = KINCSEK[rand];
            KINCSEK.splice(rand, 1);
        }
        let jatekos = new Jatekos(i + 1, kincsek);
        jatekosok[i] = jatekos;
    }
    draw();
    
    const k = `<img src="${kimaradtKep}"></img>`;
    const s = jatekosok.map(x => 
        `<td id="${x.szin}">
            <p>Játékos sorszám: ${x.sorszam}</p>
            <p>Megtalált kincsek: ${x.teljesitett}/${kincsSzam}</p>
            <p>Keresett kincs: ${x.keresettKincs}</p>
        </td>
        <td id=${(aktualisJatekos == x.sorszam) ? "kimaradt" : ""}>${(aktualisJatekos == x.sorszam) ? k : ""}</td>`);
    for (let i = 0; i < jatekosSzam; i++) {
        let tsor = document.createElement("tr");
        tsor.innerHTML = s[i];
        adatokObj.appendChild(tsor);
    }
    //jatekciklus();
    //adatokObj.childNodes.item(aktualisJatekos).childNodes.item(1).innerHTML = k;
    //console.log(adatokObj.childNodes.item(aktualisJatekos).childNodes.item(1));
}

//játékszabály megjelenítése
function megjelenit() {
    szabalyzatObj.toggleAttribute("hidden");
    canvas1.toggleAttribute("hidden");
    canvas2.toggleAttribute("hidden");
    adatokObj.toggleAttribute("hidden");
}

function draw() {
    ctx1.fillStyle = "#222266";
    ctx1.fillRect(0, 0, canvas1.width, canvas1.height);
    
    fixElemek.map(x => x.drawE());

    matrix.map(x => x.forEach(y => {
        kep(y);
        y.drawE();
        y.drawTreasure();      
    }));
    jatekosok.forEach(x => {
        x.drawStartingPoint();
        x.drawMarker();
    });

    ctx1.fillStyle = "yellow"
    nyilak.forEach(n => {
        ctx1.fillRect(n.x, n.y, 20, 20);
    })
}

//kincsek maximális száma a játékosok függvényében
function setMax() {
    let max = 24/jatekosObj.value;
    kincsObj.setAttribute("max", max);
    kincsObj.value = Math.min(kincsObj.value, max);
}

//véletlen szám generátor - zárt intervallum
function veletlenEgesz(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

//mátrix létrehozása
function generateMatrix(n, m) {
    const matrix = [];
    for(let i = 0; i<n; i++) {
        const row = [];    
        for(let j = 0; j<m; j++) {
            let elem = new Elem(0, 0, "T", [], 1, null);
            row.push(elem);    
        }
        matrix.push(row);
    }
    return matrix;
}

//
function xyCoord(elem) {
    const x = matrix.findIndex(x => x.includes(elem));
    const y = matrix.map(x => x.findIndex(y => y === elem)).find(z => z !== -1);
    return {x, y};
}

//
function isSarokElem(x, y) {
    return (x == 0 && y == 0) || (x == 0 && y == 6) || (x == 6 && y == 0) || (x == 6 && y == 6);
}

//hely keresés egy kincsnek
function kincsek() {
    let randX = veletlenEgesz(0, 6);
    let randY = veletlenEgesz(0, 6);
    let elem = matrix[randX][randY];
    if (isSarokElem(randX, randY) || elem.kincs != null) {
        elem = kincsek();
    }
    return elem;
}

function kep(elem) {
    elem.kep = new Image();
    let src;
    if (elem.fajta == "L") {
        switch(elem.irany) {
            case 0:
                src = "kanyar0.jpg";
                break;
            case 1:
                src = "kanyar1.jpg";
                break;
            case 2:
                src = "kanyar2.jpg";
                break;
            case 3:
                src = "kanyar3.jpg";
                break;
        }
    }
    else if (elem.fajta == "I") {
        switch(elem.irany) {
            case 0:
                src = "egyenes0.jpg"
                break;
            case 1:
                src = "egyenes1.jpg"
                break;
            case 2:
                src = "egyenes0.jpg"
                break;
            case 3:
                src = "egyenes1.jpg"
                break;
        }
    }
    else if (elem.fajta == "T") {
        switch(elem.irany) {
            case 0:
                src = "harmas0.jpg";
                break;
            case 1:
                src = "harmas1.jpg";
                break;
            case 2:
                src = "harmas2.jpg";
                break;
            case 3:
                src = "harmas3.jpg";
                break;
        }
    }
    elem.kep.src = src;
    //return src;
}

function forgatas(event) {
    if (!event.target.matches("img")) {
        return;
    }
    kimaradt.rotate();
    kep(kimaradt);
    const k = `<img src="${kimaradt.kep.src}"></img>`;
    //adatokObj.childNodes.item(aktualisJatekos).childNodes.item(1).innerHTML = k;
    document.querySelector("#kimaradt").innerHTML = k;    
    //console.log(adatokObj.childNodes.item(aktualisJatekos).childNodes.item(1).innerHTML); 
}

function pozicio(elem, x, y) {
    let widht = 20;
    let height = 20;
    if (matrix.includes(elem)) {
        widht = MERET;
        height = MERET;
    }
    return (((elem.x < x) && (elem.x + widht) > x)) && ((elem.y < y) && (elem.y + height) > y);
    //return (20 < x && 117 > x) && (20 < y && 117 > y);
}

function kattintas(e) {
    kattintasSzam++;
    if (kattintasSzam % 2 === 0 && matrix.flat(1).some(x => pozicio(x, e.layerX, e.layerY))) {
        let elem = matrix.flat(1).find(x => pozicio(x, e.layerX, e.layerY));
        
    }
    else if (kattintasSzam % 2 === 1 && nyilak.some(x => pozicio(x, e.layerX, e.layerY))) {
        let nyil = nyilak.find(x => pozicio(x, e.layerX, e.layerY));
        if (nyil.oszlop == null) {
            if (nyil.irany == "+") {
                let sor = []
                kimaradt.x = matrix[nyil.sor][0].x;
                kimaradt.y = matrix[nyil.sor][0].y;
                sor.push(kimaradt);
                for (let i = 0; i < 6; i++) {
                    matrix[nyil.sor][i].x += MERET;
                    sor.push(matrix[nyil.sor][i]);
                }
                console.log(sor)
                kimaradt = matrix[nyil.sor][6];
                matrix[nyil.sor] = sor;
            }
            else {
                let sor = []
                kimaradt.x = matrix[nyil.sor][6].x;
                kimaradt.y = matrix[nyil.sor][6].y;
                for (let i = 1; i < 7; i++) {
                    matrix[nyil.sor][i].x -= MERET;
                    sor.push(matrix[nyil.sor][i]);
                }
                sor.push(kimaradt);
                kimaradt = matrix[nyil.sor][0];
                matrix[nyil.sor] = sor;
            }
        }
        else if (nyil.sor == null) {
            if (nyil.irany == "+") {
                let oszlop = []
                kimaradt.x = matrix[0][nyil.oszlop].x;
                kimaradt.y = matrix[0][nyil.oszlop].y;
                oszlop.push(kimaradt);
                kimaradt = matrix[6][nyil.oszlop];
                for (let i = 0; i < 6; i++) {
                    matrix[i][nyil.oszlop].y += MERET;
                    oszlop.push(matrix[i][nyil.oszlop]);
                }
                console.log(oszlop)
                for (let i = 0; i < 7; i++) {
                    matrix[i][nyil.oszlop] = oszlop.shift();
                }
            }
            else {
                let oszlop = []
                kimaradt.x = matrix[6][nyil.oszlop].x;
                kimaradt.y = matrix[6][nyil.oszlop].y;
                for (let i = 1; i < 7; i++) {
                    matrix[i][nyil.oszlop].y -= MERET;
                    console.log(i, matrix[i][nyil.oszlop].y)
                    oszlop.push(matrix[i][nyil.oszlop]);
                }
                oszlop.push(kimaradt);
                console.log(oszlop)
                kimaradt = matrix[0][nyil.oszlop];
                for (let i = 0; i < 7; i++) {
                    matrix[i][nyil.oszlop] = oszlop.shift();
                    console.log(matrix[i][nyil.oszlop])
                }
            }
        }
    }
    const k = `<img src="${kimaradt.kep.src}"></img>`;
    document.querySelector("#kimaradt").innerHTML = k;
    draw();
}

function elerhetoMezok(elem) {
    let elerheto = [];
    let x = xyCoord(elem).x;
    let y = xyCoord(elem).y;
    let currentCell = matrix[x][y];
    let queue = [currentCell];
    while (queue.length > 0) {
        let next = queue.shift();  
        let x = xyCoord(next).x;
        let y = xyCoord(next).y; 
        elerheto.push(next);  
        //console.log("--------------------")
        //console.log(next)   
        kozvetlenKapcsolat(next, x - 1, y, 0, queue, elerheto);
        kozvetlenKapcsolat(next, x, y + 1, 1, queue, elerheto);
        kozvetlenKapcsolat(next, x + 1, y, 2, queue, elerheto);
        kozvetlenKapcsolat(next, x, y - 1, 3, queue, elerheto);
    }
    return elerheto;
}

function lepes(aktualisJatekos) {
    //console.log(jatekosok[aktualisJatekos].mezo)
    let elerheto = elerhetoMezok(jatekosok[aktualisJatekos].mezo);
    elerheto.forEach(e => {
        ctx2.fillStyle = "rgba(192, 57, 47, 0.521)";
        ctx2.fillRect(e.x, e.y, MERET, MERET);
    })
}

function atjarhato(egyik, masik, pozicio) {
    let a1 = egyik.ajtok();
    let a2 = masik.ajtok();
    switch (pozicio) {
        case 0:
            return a1.includes(0) && a2.includes(2);
        case 1:
            return a1.includes(1) && a2.includes(3);
        case 2:
            return a1.includes(2) && a2.includes(0);
        case 3:
            return a1.includes(3) && a2.includes(1);
    }
}

function kozvetlenKapcsolat(cella, i, j, pozicio, queue, elerheto) {
    if (i >= 0 && i < 7 && j >= 0 && j < 7) {
        let vizsgalt = matrix[i][j];
        if (atjarhato(cella, vizsgalt, pozicio) && !queue.includes(vizsgalt) && !elerheto.includes(vizsgalt)) {
            //console.log(vizsgalt);
            queue.push(vizsgalt);
        }
    }
}