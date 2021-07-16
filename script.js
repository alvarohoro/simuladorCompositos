import json from './propriedades.json'; //(with path)

var prop1 = json;
var ctx = function(){};
var anguloAnterior = 0;
var vf=0;
var vm=0;
var ef=0;
var em=0;
var E1=0;
var E2=0;
var n=0;
var qsi=0;
var E2TSAIHILL=0;
var max=200;


var propriedades = 
    [{tipo:"Fibra",
    material:"Carbono",
    densidade: 1.8,
    moduloYoung: 230e9,
    tensaoUltima: 2067e6,
    moduloEspecifico: 0.1278,
    tensaoEspecifica: 1.148}];


window.onload = function(){
    var canvas = document.getElementById('tutorial');
    ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0,0,200,200);
    ctx.transform (1, 0.5, 0, 1, 0, 0)

};

function selecionado(tipo){
    if(tipo=='F'){
        laminado(90);
    }else if(tipo=='P'){
        desenharParticulado();
    }
    
}

function calcular(){ //RECEBE VF E CALCULA VM
    vf = document.getElementById("Vf").value/100;
    vm = Math.round((1-vf)*100 * 100) / 100/100;
    document.getElementById("Vm").innerText=vm*100;

    //alert("WOW!");
}

function calcular2(){ //RECEBE VF,VM,EF,EM E CALCULA E1,E2
    var ef1 = document.getElementById("Ef1").value;
    var ef2 = document.getElementById("Ef2").value;
    var em = document.getElementById("Em").value;
    var gf = document.getElementById("Gf").value;
    var gm = document.getElementById("Gm").value;
    E1 = em*vm+ef1*vf;
    //E2 = Math.round((ef*em/(vf*em+vm*ef)) * 100) / 100;
    E2 = 1/(vf/ef2+vm/em);
    var G12 = 1/(vf/gf + vm/gm);
    document.getElementById("E1").innerText=Math.round(E1 * 100) / 100;
    document.getElementById("E2").innerText=Math.round(E2 * 100) / 100;
    document.getElementById("G12").innerText=Math.round(G12 * 100) / 100;

    //alert("WOW!");
}

function calcular3(){ //Recebe VM, VM, POISONF, POISONM, E1, E2 e calcula POISON12 E POISON21
    var poisonf = document.getElementById("Poisonf").value;
    var poisonm = document.getElementById("Poisonm").value;
    var poison12 =Math.round((poisonm*vm+poisonf*vf) * 100) / 100;
    var poison21 =Math.round((poison12*E1/E2) * 100) / 100;
    document.getElementById("Poison12").innerText=poison12;
    document.getElementById("Poison21").innerText=poison21;

    //alert("WOW!");
}


function calcular4(){ //RECEBE VF,VM,EF,EM, QSI E CALCULA E2
    qsi = document.getElementById("Qsi").value;

    n = ((ef/em)-1)/((ef/em)-qsi);
    E2TSAIHILL = ((1+qsi*n*vf)/(1-n*vf))*em;
    document.getElementById("E2TSAIHILL").innerText=E2TSAIHILL;

    //alert("WOW!");
}

function limpar(){
    ctx.clearRect(0,0,max,max);
    ctx.fillStyle =  '#f0f0f0';
    ctx.fillRect(-max,-max,max*2,max*2);

}

function desenharParticulado(){
    //vf = 50;
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0,0,200,200);
    var min = 0;
    var max = 200;
    //return Math.floor(Math.random() * (max - min)) + min;
    var listaPontos = [];
    for (var i = 0; i<100; i++){
        x=max/100*i;

        //x= Math.floor(Math.random() * (max - min)) + min;
        var listaY = [];
        for(var j=0; j<vf*max; j++){
            y= Math.floor(Math.random() * max);

            while(listaY.includes(y)){
                y= Math.floor(Math.random() * max);
            }

            if(listaY.includes(y)){
                console.log("Existe y na lista para: i="+i+" e j="+j);
            }
            listaY.push(y);


            
                        listaPontos.push([x,y]);
        }
    }
    for(var i=0;i<(max*max);i++){
        ctx.fillStyle = 'black';
        lado=max/100;
        ctx.fillRect(listaPontos[i][0],listaPontos[i][1],lado,lado);

    }
    ctx.strokeStyle = "black";

    ctx.stroke();        

}

function laminado(angulo){
    limpar();
    ctx.beginPath();
    ctx.translate(max/2,max/2);//Translate para max/2 que o centro de [0,0] passe para o centro da figura
    ctx.rotate((Math.PI/180)*angulo);
    ctx.translate(-max/2,-max/2); //Translaciona de novo para [0,0]

    for(i=0;i<25;i++){
        ctx.moveTo(20*(i-10),-max*2);
        ctx.lineTo(20*(i-10),max*2);
        ctx.lineWidth=10;
    }
    ctx.closePath();

    ctx.translate(max/2,max/2); //Translate para max/2 que o centro de [0,0] passe para o centro da figura
    ctx.rotate((Math.PI/180)*-angulo);
    ctx.translate(-max/2,-max/2); //Translaciona de novo para [0,0]

    ctx.strokeStyle = "black";
    ctx.stroke();
    anguloAnterior=angulo;

    
    }

function mudarAngulo(){
    var angulo = document.getElementById("inputAnguloRange").value;
    document.getElementById("inputAnguloText").value = angulo;
    laminado(angulo);
}

    