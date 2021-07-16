//Arquivo criado em .JS para organização de todos os cálculos.

//MICROMECÂNICA
//Determinação por normas como ASTM D792, D3171


//Os volumes dados com "V" maiúsculo representam o volume em si.
//Os volumes dados com "v" minúsculo representam as frações volumétricas.
var props = {};
var propriedadesCalculadas = {};
var estadoAlterado=false;

var teste = [];
function armazenarEmProps(item, valor){
    Object.assign(props, {[item]:{'valor':valor, 'status':"Calculado"}});
    atualizarValorInput(item,valor.toExponential(4));
    mudarFundoCalculado(item, true);
    chavearTravado(item);
    estadoAlterado=true;    
}
//#region  MICRO-MECANICA


function naoNulos(propriedades){
    var status = true;
    propriedades.forEach(prop => {
        if (prop===""){
            status = false;
        }
    });
    return status;
}

function calcular_vf(){
    let vm = props.vm.valor;
    let vv = props.vv.valor;

    let Vc = props.Vc.valor;
    let Vf = props.Vf.valor;

    if (naoNulos([vm,vv])){
        //if(!props.vf.travado){
            armazenarEmProps("vf",100-vm-vv);
        //}
    } else if (naoNulos([Vc,Vf])){
        armazenarEmProps("vf", Vf/Vc*100);
    }
}

function calcular_vm(){
    let vf = props.vf.valor;
    let vv = props.vv.valor;

    
    let Vc = props.Vc.valor;
    let Vm = props.Vm.valor;
    if (naoNulos([vf,vv])){
        //if(!props.vm.travado){
            armazenarEmProps("vm",100-vf-vv);
        //} 
    } else if(naoNulos([Vc,Vm])){
        armazenarEmProps("vm", Vm/Vc*100);

    }
}

function calcular_vv(){
    let vf = props.vf.valor;
    let vm = props.vm.valor;

    let Vc = props.Vc.valor;
    let Vv = props.Vv.valor;
    if (naoNulos([vf,vm])){
        //if(!props.vv.travado){
            armazenarEmProps("vv",100-vf-vm);
        //}
    } else if (naoNulos([Vc,Vv])){
        armazenarEmProps("Vv", Vv/Vc*100);
    }
}

function calcular_rhoC(){
    let vf = props.vf.valor;
    let vm = props.vm.valor;
    let rhof = props.rhof.valor;
    let rhom = props.rhom.valor;
    if (naoNulos([vf,vm,rhof,rhom])){
        //if(!props.rhoC.travado){
            armazenarEmProps("rhoC",(vf*rhof + vm*rhom)/100);
        //}
    }
}

function calcular_mf (){
    let vf = props.vf.valor;
    let vm = props.vm.valor;
    let rhof = props.rhof.valor;
    let rhom = props.rhom.valor;
    if (naoNulos([vf,vm,rhof,rhom])){
        //if(!props.rhoC.travado){
            armazenarEmProps("mf",vf*rhof/(vf*rhof+rhom*vm)*100);
        //}
    }
    //return vf*rhof/(vf*rhof+rhom*vm); 
}

function calcular_mm (){
    let mf = props.mf.valor;
    
    if (naoNulos([mf])){
        //if(!props.rhoC.travado){
            armazenarEmProps("mm",100-mf);
        //}
    }
    //return 1-vf*rhof/(vf*rhof+rhom*(1-vf)); 
}

function calcular_Mf(){
    let mf = props.mf.valor;
    let Mc = props.Mc.valor;
    if (naoNulos([mf,Mc])){
        //if(!props.rhoC.travado){
            armazenarEmProps("Mf",mf*Mc/100);
        //}
    }
}

function calcular_Mm(){
    let mm = props.mm.valor;
    let Mc = props.Mc.valor;

    let Mf = props.Mf.valor;
    if (naoNulos([mm,Mc])){
        //if(!props.rhoC.travado){
            armazenarEmProps("Mm",mm*Mc/100);
        //}
    } else if(naoNulos([Mf, Mc])){
        armazenarEmProps("Mm",Mc-Mf);
    }
}

function calcular_Vc(){
    let Mc = props.Mc.valor;
    let rhoC = props.rhoC.valor;

    let larg = props.larg.valor;
    let prof = props.prof.valor;
    let esp = props.esp.valor;

     if (naoNulos([larg, prof, esp])){
        armazenarEmProps("Vc",larg*prof*esp);
    }
     else if (naoNulos([Mc,rhoC])){
        //if(!props.rhoC.travado){
            armazenarEmProps("Vc",Mc/rhoC);
        //}
    } 
}

function calcular_Vf(){
    let Vc = props.Vc.valor;
    let vf = props.vf.valor;

    let rhof = props.rhof.valor;
    let Mf = props.Mf.valor;
    if(naoNulos([rhof,Mf])){
        armazenarEmProps("Vf", Mf/rhof);
    } else if (naoNulos([Vc, vf])){
        //if(!props.rhoC.travado){
            armazenarEmProps("Vf",Vc*vf);
        //}
    } 
}

function calcular_Vm(){
    let Vc = props.Vc.valor;
    let vm = props.vm.valor;

    let rhom = props.rhom.valor;
    let Mm = props.Mm.valor;
    if(naoNulos([rhom,Mm])){
        armazenarEmProps("Vm", Mm/rhom);
    }
    else if (naoNulos([Vc, vm])){
        //if(!props.rhoC.travado){
            armazenarEmProps("Vm",Vc*vm);
        //}
    } 
}

function calcular_Vv(){
    let Vc = props.Vc.valor;
    let Vf = props.Vf.valor;
    let Vm = props.Vm.valor;

    if(naoNulos([Vc,Vf,Vm])){
        armazenarEmProps("Vv", Vc-Vf-Vm);
    }
}

function calcular_E1(){
    let Em = props.Em.valor;
    let vm = props.vm.valor;
    let Ef = props.Ef.valor;
    let vf = props.vf.valor;

    if(naoNulos([Em,vm,Ef,vf])){
        armazenarEmProps("E1", Em*(vm/100)+Ef*(vf/100));
    }   
}

function calcular_E2(){
    let Em = props.Em.valor;
    let vm = props.vm.valor;
    let Ef = props.Ef.valor;
    let vf = props.vf.valor;
    let Ef2 = props.Ef2.valor;

    if(naoNulos([Em,vm,Ef,vf,Ef2])){
        armazenarEmProps("E2", 1/((vf/100)/Ef2 + (vm/100)/Em));

    }
    else if(naoNulos([Em,vm,Ef,vf])){
        armazenarEmProps("E2", Em*Ef/((vf/100)*Em+(vm/100)*Ef));
    }   

}

function calcular_Ff(){
    let Ef = props.Ef.valor;
    let vf = props.vf.valor;
    if(naoNulos([Ef,vf])){
        armazenarEmProps("Ff", Ef*(vf/100));
    }
}

function calcular_Fm(){
    let Em = props.Em.valor;
    let vm = props.vm.valor;
    if(naoNulos([Em,vm])){
        armazenarEmProps("Fm", Em*(vm/100));
    }
}

function calcular_Fc(){
    let E1 = props.E1.valor;
    if(naoNulos([E1])){
        armazenarEmProps("Fc", E1);
    }
}

function calcular_Ff_Fc(){
    let Ff = props.Ff.valor;
    let Fc = props.Fc.valor;
    if(naoNulos([Ff,Fc])){
        armazenarEmProps("Ff_Fc", Ff/Fc);
    }
}

function calcular_Fm_Fc(){
    let Fm = props.Fm.valor;
    let Fc = props.Fc.valor;
    if(naoNulos([Fm,Fc])){
        armazenarEmProps("Fm_Fc", Fm/Fc);
    }
}

function calcular_nu12(){
    let nuf = props.nuf.valor;
    let vf = props.vf.valor;
    let num = props.num.valor;
    let vm = props.vm.valor;
    if(naoNulos([nuf,vf,num,vm])){
        armazenarEmProps("nu12", nuf*(vf/100)+num*(vm/100));
    }
}

function calcular_nu21(){
    let nu12 = props.nu12.valor;
    let E2 = props.E2.valor;
    let E1 = props.E1.valor;
    if(naoNulos([nu12,E2,E1])){
        armazenarEmProps("nu21", nu12*E2/E1);
    }
}

function calcular_Gm(){
    let Em = props.Em.valor;
    let num = props.num.valor;

    if(naoNulos([Em,num])){
        armazenarEmProps("Gm", Em/(2*(1+num)));
    }
}

function calcular_Gf(){
    let Ef = props.Ef.valor;
    let nuf = props.nuf.valor;

    let Ef2 = props.Ef2.valor;
    
    if (naoNulos([Ef2])){
        //fazer nada, pq EF2 é diferente de zero
    } else if(naoNulos([Ef,nuf])){
        armazenarEmProps("Gf", Ef/(2*(1+nuf)));
    }
}

function calcular_G12(){
    let Gm = props.Gm.valor;
    let Gf = props.Gf.valor;
    let vf = props.vf.valor;
    let vm = props.vm.valor;
    
    if(naoNulos([Gm,Gf,vf,vm])){
        armazenarEmProps("G12", Gm*Gf/(Gm*(vf/100)+Gf*(vm/100)));
    }
}

function calcular_etaCisalhamento(){
    let Gm = props.Gm.valor;
    let Gf = props.Gf.valor;
    let fatorReforco = props.fatorReforco.valor;
    
    if(naoNulos([Gm,Gf,fatorReforco])){
        armazenarEmProps("etaCisalhamento", (Gf/Gm-1)/(Gf/Gm+fatorReforco));
    }
}

function calcular_G12HT(){
    let Gm = props.Gm.valor;
    let fatorReforco = props.fatorReforco.valor;
    let etaCisalhamento = props.etaCisalhamento.valor;
    let vf = props.vf.valor;

    if(naoNulos([Gm,fatorReforco,etaCisalhamento,vf])){
        armazenarEmProps("G12HT", Gm*(1+fatorReforco*etaCisalhamento*(vf/100))/(1-etaCisalhamento*(vf/100)));
    }
}

function calcular_etaE(){
    let Ef = props.Ef.valor;
    let Em = props.Em.valor;
    let fatorReforco = props.fatorReforco.valor;
    
    if(naoNulos([Ef,Em,fatorReforco])){
        armazenarEmProps("etaE", (Ef/Em-1)/(Ef/Em+fatorReforco));
    }
}

function calcular_E2HT(){
    let Em = props.Em.valor;
    let fatorReforco = props.fatorReforco.valor;
    let etaE = props.etaE.valor;
    let vf = props.vf.valor;

    if(naoNulos([Em,fatorReforco,etaE,vf])){
        armazenarEmProps("E2HT", Em*(1+fatorReforco*etaE*(vf/100))/(1-etaE*(vf/100)));
    }
}

function calcularMicroMecanica(){
    estadoAlterado=false;
    calcular_vf();
    calcular_vm();
    calcular_vv();
    calcular_rhoC();
    calcular_mf();
    calcular_mm();
    calcular_Mf();
    calcular_Mm();
    calcular_Vc();
    calcular_Vf();
    calcular_Vm();
    calcular_Vv();
    calcular_E1();
    calcular_E2();
    calcular_Ff();
    calcular_Fm();
    calcular_Fc();
    calcular_Ff_Fc();
    calcular_Fm_Fc();
    calcular_nu12();
    calcular_nu21();
    calcular_Gm();
    calcular_Gf();
    calcular_G12();
    calcular_etaCisalhamento();
    calcular_G12HT();
    calcular_etaE();
    calcular_E2HT();




    calcular_vf();
    calcular_vm();
    calcular_vv();
    calcular_rhoC();
    calcular_mf();
    calcular_mm();
    calcular_Mf();
    calcular_Mm();
    calcular_Vc();
    calcular_Vf();
    calcular_Vm();
    calcular_Vv();
    calcular_E1();
    calcular_E2();
    calcular_Ff();
    calcular_Fc();
    calcular_Ff_Fc();
    calcular_nu12();
    calcular_nu21();
    calcular_Gm();
    calcular_Gf();
    calcular_G12();
    calcular_etaCisalhamento();
    calcular_G12HT();
    calcular_etaE();
    calcular_E2HT();

    /*
    propriedades = {
        "&rho;<sub>c</sub> &nbsp;&nbsp;&nbsp;&nbsp;    [kg/m³]":props.rhoC.valor, 
        "m<sub>f</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [%]":(props.mf.valor*100).toFixed(3), 
        "m<sub>m</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [%]":(props.mm.valor*100).toFixed(3), 
        "v<sub>f</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [%]":(props.vf.valor*100).toFixed(3), 
        "v<sub>m</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [%]":(props.vm.valor*100).toFixed(3), 
        "v<sub>v</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [%]":(props.vv.valor*100).toFixed(3), 
        "V<sub>c</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [m³]":props.Vc.valor.toExponential(3), 
        "V<sub>f</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [m³]":props.Vf.valor.toExponential(3), 
        "V<sub>m</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [m³]":props.Vm.valor.toExponential(3), 
        "V<sub>v</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [m³]":(parseFloat(props.Vv.valor)).toExponential(3), 
        "M<sub>f</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [kg]":props.Mf.valor.toFixed(3), 
        "M<sub>m</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [kg]":props.Mm.valor.toFixed(3),
        "E<sub>1</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [GPa]":props.E1.valor.toFixed(3),
        "E<sub>2</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [GPa]":props.E2.valor.toFixed(3),
        "E<sub>2</sub> Halpin-Tsai &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [GPa]":props.E2HT.valor.toFixed(3),
        "&nu;<sub>12</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [GPa]":props.nu12.valor.toFixed(3),
        "&nu;<sub>21</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [GPa]":props.nu21.valor.toFixed(3),
        "G<sub>12</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [GPa]":props.G12.valor.toFixed(3),
        "G<sub>12</sub> Halpin-Tsai &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [GPa]":props.G12HT.valor.toFixed(3),
        "F<sub>F</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [GPa]":props.Ff.valor.toFixed(3),
        "F<sub>C</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [GPa]":props.Fc.valor.toFixed(3),
        "F<sub>F</sub>/F<sub>c</sub> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [GPa]":props.Ff_Fc.valor.toFixed(3)
    };
    */

    return estadoAlterado;
}


//#endregion



function calcularMacroMecanicaLamina(){
    estadoPlano();
    let sigmaX = props.sigmaX.valor;
    let sigmaY = props.sigmaY.valor;
    let tauXY = props.tauXY.valor;
    let angulo = props.angulo.valor;
    
    let E1 = props.E1Macro.valor;
    let E2 = props.E2Macro.valor;
    let nu12 = props.nu12Macro.valor;
    let G12 = props.G12Macro.valor;
    
    if(naoNulos([sigmaX,sigmaY,tauXY,E1,E2,nu12,G12])){
            matrizes = calcularMatrizesLaminado(sigmaX,sigmaY,tauXY, "MPa", angulo,E1,E2,nu12,G12, "GPa");
            limparElemento("lamina");
            exibirCalculosMacros(matrizes,"","lamina");
    }
}

function calcularMacroMecanicaLaminado(){

    let E1 = props.E1MacroLaminado.valor;
    let E2 = props.E2MacroLaminado.valor;
    let nu12 = props.nu12MacroLaminado.valor;
    let G12 = props.G12MacroLaminado.valor;

    let laminas=[];
    let angulos = props.angulos.valor.split("/").map(Number);
    desenharLaminas();
    let espessuraLamina = props.espessura.valor*10e-3;

    if(angulos.length!=0 && naoNulos([espessuraLamina])){
        let espessuraTotal = espessuraLamina*angulos.length;
        let referenciaSuperior = espessuraTotal/2; 
        let referenciaInferior = -referenciaSuperior;
        for(i=0; i<angulos.length; i++){
            let anguloLocal = angulos[i];
            //let valorSuperior = referenciaSuperior-(espessuraLamina*i);
            //let valorInferior = referenciaSuperior-(espessuraLamina*(i+1));
            let valorSuperior = referenciaInferior+(espessuraLamina*i);
            let valorInferior = referenciaInferior+(espessuraLamina*(i+1));
            let objetoLocal = {"angulo":anguloLocal, "valorSuperior":valorSuperior, "valorInferior":valorInferior};
            laminas.push(objetoLocal);
        }
        //console.log(laminas);
    }

    let A = 0;
    let B = 0;
    let D = 0;
    let dadosLaminado=[];
    if(naoNulos([sigmaX,sigmaY,tauXY,E1,E2,nu12,G12])){
        //let angulo = props.theta.valor;
        limparElemento("laminado");

        for(l=0; l<laminas.length;l++){
            let lamina = laminas[l];
            let valorSuperior = lamina.valorSuperior;
            let valorInferior = lamina.valorInferior;
            let angulo = lamina.angulo;
            matrizes = calcularMatrizesLaminado("","","", "MPa", angulo,E1,E2,nu12,G12, "GPa");
            dadosLaminado.push(matrizes);
            A = math.add(A,math.multiply(matrizes[1].Qxy,(valorInferior-valorSuperior)));
            B = math.add(B,math.multiply(matrizes[1].Qxy,(valorInferior**2-valorSuperior**2)/2));
            D = math.add(D,math.multiply(matrizes[1].Qxy,(valorInferior**3-valorSuperior**3)/3));
            exibirCalculosMacros(matrizes,l,"laminado");
        }
        teste=dadosLaminado;
        
        var objetoABD = ["",{"A":A,"B":B,"D":D}];


        let ABBD = math.concat(math.concat(A,B),math.concat(B,D),0);

        let Nx = props.Nx.valor*1;
        let Ny = props.Ny.valor*1;
        let Nxy = props.Nxy.valor*1;
        let Mx = props.Mx.valor*1;
        let My = props.My.valor*1;
        let Mxy = props.Mxy.valor*1;

        let N = [[Nx],[Ny],[Nxy]];
        let M = [[Mx],[My],[Mxy]];
        let NM = math.concat(N,M,0);

        /*let ex0 = props.ex0.valor*1;
        let ey0 = props.ey0.valor*1;
        let es0 = props.es0.valor*1;
        let kx = props.kx.valor*1;
        let ky = props.ky.valor*1;
        let ks = props.ks.valor*1;*/

        let e0 = []; //[[ex0],[ey0],[es0]];
        let k = [];//[[kx],[ky],[ks]];
        let EK = math.concat(e0,k,0);

        if(Nx || Ny || Nxy || Mx || My || Mxy){
            let def0 = math.multiply(math.inv(ABBD),NM);
            e0 = def0.slice(0,3);
            k = def0.slice(3,6);
            var objetoABD = ["",{"A":A,"B":B,"D":D,"e0":e0,"k":k}];

            for(l=0; l<laminas.length;l++){
                let lamina = laminas[l];
                let valorSuperior = lamina.valorSuperior;
                let valorInferior = lamina.valorInferior;
                let angulo = lamina.angulo;

                let exyk = math.add(e0,math.multiply(valorSuperior,k));
                objetoABD[1]["exySuperior:"+angulo]=exyk;
                

                let exykComUltimoTermoDivPor2 = [exyk[0], exyk[1], [exyk[2]/2]];
                console.log("exykComUltimoTermoDivPor2");
                console.log(exykComUltimoTermoDivPor2);

                let e12k = math.multiply(dadosLaminado[l][1].T,exykComUltimoTermoDivPor2);
                e12k = [e12k[0], e12k[1],[2*e12k[2]]];
                objetoABD[1]["e12Superior:"+angulo]=e12k;
                console.log("e12k");
                console.log(e12k);
                
                let tensoesGlobaisxyk = math.multiply(dadosLaminado[l][1].Qxy,exyk);
                objetoABD[1]["sigmaXySuperior:"+angulo]=tensoesGlobaisxyk;

                let tensoesLocaisxyk = math.multiply(dadosLaminado[l][1].T,tensoesGlobaisxyk);
                objetoABD[1]["sigma12Superior:"+angulo]=tensoesLocaisxyk;

            }

        }


        exibirCalculosMacros(objetoABD,"LAMINADO","laminado");


    };
    
    
    estadoAlterado=true;
    return estadoAlterado;
}


function valorEngenharia(unidade){
    switch(unidade){
        case "GPa": return 10e9;
        case "MPa": return 10e6;
        case "kPa": return 10e3;
    }
}



function calcularMatrizesLaminado(sigmaX, sigmaY, tauXY, unidadesTensoes, angulo, E1, E2, nu12, G12, unidadesElasticidade){

    //#region - ########## TRANSFORMA EM UNIDADES "UNITÁRIAS" ##########
    sigmaX = sigmaX*valorEngenharia(unidadesTensoes);
    sigmaY = sigmaY*valorEngenharia(unidadesTensoes);
    tauXY  = tauXY*valorEngenharia(unidadesTensoes);

    E1 = E1*valorEngenharia(unidadesElasticidade);
    E2 = E2*valorEngenharia(unidadesElasticidade);
    G12 = G12*valorEngenharia(unidadesElasticidade);
    //#endregion

    //#region - ########## MATRIZ DE FLEXIBILIDADE - [S]12 ##########
    let S11 = 1/E1;
    let S12 = -nu12/E1;
    let S21 = S12;
    let S22 = 1/E2;
    let S66 = 1/G12;
    let S = math.matrix([[S11,S12,0],[S21,S22,0],[0,0,S66]])._data;
    //#endregion

    //#region - ########## MATRIZ DE RIGIDEZ - [Q]12 ##########
    let Q = math.inv(S);
    //#endregion


    //#region - ########### MATRIZ DE TRANSFORMAÇÃO - [T] ##########
    let c = Math.cos(Math.PI/180*angulo);
    let s = Math.sin(Math.PI/180*angulo);
    let T = math.matrix([[c**2,s**2,2*c*s],[s**2,c**2,-2*c*s],[-c*s,c*s,c**2-s**2]])._data;
    //#endregion

        
    //#region - ########### MATRIZ FLEXIBILIDADE TRANSFORMADA (para o ângulo analisado) - [S]xy ##########
    let ScomS66divPor2 = math.matrix([[S11,S12,0],[S21,S22,0],[0,0,S66/2]])._data;
    let S_xyComUltimaLinhaDivididaPor2= math.multiply(math.multiply(math.inv(T),ScomS66divPor2),T);
    let S_xy=[S_xyComUltimaLinhaDivididaPor2[0],S_xyComUltimaLinhaDivididaPor2[1],math.multiply(2,S_xyComUltimaLinhaDivididaPor2[2])];
    //#endregion

    //#region - ########### MATRIZ DE RIGIDEZ TRANSFORMADA (para o ângulo analisado) - [Q]xy ##########
    let Q_xy = math.inv(S_xy);
    //#endregion

    let objeto = [];
    if(sigmaX || sigmaY || tauXY){
        //#region - ########## TENSOR DE TENSÕES - [σ]xy ###########
        let tensoes = math.matrix([[sigmaX],[sigmaY],[tauXY]])._data;
        //#endregion

        //#region - ########## TENSOR DE TENSÕES na direção das fibras - [σ]12 ###########
        let tensoes_12 = math.multiply(T,tensoes);
        //#endregion

        //#region - ########## MATRIZ DE DEFORMAÇÕES (para o ângulo analisado) - [ε]xy ##########
        let deformacoes_xy = math.multiply(S_xy,tensoes);
        //#endregion    

        //#region - ########## MATRIZ DE DEFORMAÇÕES no sentido das fibras - [ε]12 ##########
        let deformacoes_xyComGamaXyDivPor2 = [deformacoes_xy[[0]],deformacoes_xy[[1]],math.multiply(1/2,deformacoes_xy[[2]])];
        let deformacoes = math.multiply(T,deformacoes_xyComGamaXyDivPor2);
        deformacoes = [deformacoes[0],deformacoes[1],math.multiply(2,deformacoes[2])];
        //#endregion

        objeto = [ angulo, {
            "S12":S,
            "Sxy": S_xy,
            "Q12":Q,
            "Qxy":Q_xy,
            "σ12":tensoes_12,
            "σxy":tensoes,
            "ε12":deformacoes,
            "εxy":deformacoes_xy,
            "T":T
            }
        ]
    } else {
        objeto = [ angulo, {
            "S12":S,
            "Sxy": S_xy,
            "Q12":Q,
            "Qxy":Q_xy,
            "T":T
            }
        ]
    }
    
    let nu21 = parseFloat(nu12/E1*E2);

    return objeto;

    
}