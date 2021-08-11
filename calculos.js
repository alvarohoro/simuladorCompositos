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
    //Object.assign(props, {[item]:{'valor':valor, 'status':"Calculado"}});
    props[item].valor=valor;
    props[item].status="Calculado";
    let unidade = props[item].unidade;
    let multiplicador = props[item].multiplicador;
    switch (unidade) {
        case "%":
            atualizarValorInput(item,valor.toFixed(2));
            break;
        case "kg/m³":
            atualizarValorInput(item,valor.toFixed(0));
            break;
        default:
            if(Math.abs(valor)<10000 && Math.abs(valor)>0.01){
                atualizarValorInput(item,valor.toFixed(4));
        
            }else if(Math.abs(valor)<1e-15){
                atualizarValorInput(item,"≈ 0");

            }
            else{
                let valorEngenharia = math.format(parseFloat(valor),{notation:'engineering', precision:4});
                atualizarValorInput(item,valorEngenharia);
            }
            break;
    }
    
    //mudarFundoCalculado(item, true);
    travar(item);
    //chavearTravado(item);
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
        if(!props.vf.travado){
            armazenarEmProps("vf",100-vm-vv);
        }
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
        if(!props.vm.travado){
            armazenarEmProps("vm",100-vf-vv);
        } 
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
        if(!props.vv.travado){
            armazenarEmProps("vv",100-vf-vm);
        }
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
            vf/=100;
            vm/=100;
            let rhoC = (vf*rhof + vm*rhom);
            armazenarEmProps("rhoC",rhoC);
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
            let mf=vf*rhof/(vf*rhof+rhom*vm)*100;
            armazenarEmProps("mf",mf);
        //}
    }
    //return vf*rhof/(vf*rhof+rhom*vm); 
}

function calcular_mm (){
    let mf = props.mf.valor;
    
    if (naoNulos([mf])){
        //if(!props.rhoC.travado){
            let mm = 100-mf;
            armazenarEmProps("mm",mm);
        //}
    }
    //return 1-vf*rhof/(vf*rhof+rhom*(1-vf)); 
}

function calcular_Mf(){
    let mf = props.mf.valor;
    let Mc = props.Mc.valor;
    if (naoNulos([mf,Mc])){
        //if(!props.rhoC.travado){
            let Mf = mf*Mc/100;
            armazenarEmProps("Mf",Mf);
        //}
    }
}

function calcular_Mm(){
    let mm = props.mm.valor;
    let Mc = props.Mc.valor;

    let Mf = props.Mf.valor;
    if (naoNulos([mm,Mc])){
        //if(!props.rhoC.travado){
            let Mm = mm*Mc/100;
            armazenarEmProps("Mm",Mm);
        //}
    } else if(naoNulos([Mf, Mc])){
        let Mm = Mc-Mf;
        armazenarEmProps("Mm",Mm);
    }
}

function calcular_Vc(){
    let Mc = props.Mc.valor;
    let rhoC = props.rhoC.valor;

    let Vf = props.Vf.valor;
    let Vm = props.Vm.valor;
    let Vv = props.Vv.valor;

    let larg = props.larg.valor;
    let prof = props.prof.valor;
    let esp = props.esp.valor;

    let Vc="";

     if (naoNulos([larg, prof, esp])){
         Vc = larg*prof*esp;
        armazenarEmProps("Vc",Vc);
    }
    if (naoNulos([Mc,rhoC])){
        //if(!props.rhoC.travado){
            Vc=Mc/rhoC;
            armazenarEmProps("Vc",Vc);
           
            armazenarEmProps("larg",Vc/3);
            armazenarEmProps("prof",Vc/3);
            armazenarEmProps("esp",Vc/3);

            
        //}
    } else if(naoNulos([Vf,Vm,Vv])){
        Vc=Vf+Vm+Vv;
        armazenarEmProps("Vc",Vc);
        
        armazenarEmProps("larg",Vc/3);
        armazenarEmProps("prof",Vc/3);
        armazenarEmProps("esp",Vc/3);

    }
}

function calcular_Vf(){
    let Vc = props.Vc.valor;
    let vf = props.vf.valor;

    let rhof = props.rhof.valor;
    let Mf = props.Mf.valor;
    if(naoNulos([rhof,Mf])){
        let Vf = Mf/rhof
        armazenarEmProps("Vf", Vf);
    } else if (naoNulos([Vc, vf])){
        vf/=100;
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

    let Vf = props.Vf.valor;
    let vf = props.vf.valor;
    if(naoNulos([rhom,Mm])){
        armazenarEmProps("Vm", Mm/rhom);
    }
    else if (naoNulos([Vc, vm])){
        //if(!props.rhoC.travado){
            vm/=100;
            armazenarEmProps("Vm",Vc*vm);
        //}
    } else if(naoNulos([Vf,vf,vm])){
        //vm/=100;
        armazenarEmProps("Vm",Vf*vm/vf);

    }
}

function calcular_Vv(){
    let Vc = props.Vc.valor;
    let Vf = props.Vf.valor;
    let Vm = props.Vm.valor;

    let vf = props.vf.valor;
    let vv = props.vv.valor;
    if(naoNulos([Vc,Vf,Vm])){
        armazenarEmProps("Vv", Vc-Vf-Vm);
    }else if(naoNulos([Vc,vv])){
        armazenarEmProps("Vv",Vc*vv);

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
        armazenarEmProps("Ff_Fc", Ff/Fc*100);
    }
}

function calcular_Fm_Fc(){
    let Fm = props.Fm.valor;
    let Fc = props.Fc.valor;
    if(naoNulos([Fm,Fc])){
        armazenarEmProps("Fm_Fc", Fm/Fc*100);
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
    for(i=0; i<2; i++){
        verificarSomas();
        function verificarSomas(){
            let statusSomas=true;
            let Vc = props.Vc.valor;
            let Vf = props.Vf.valor;
            let Vm = props.Vm.valor;
            let Vv = props.Vv.valor;
            if(naoNulos([Vc])){
                if (naoNulos([Vf])){
                    if(Vf>Vc){
                        statusSomas=false;
                    }
                }
                if(naoNulos([Vm])){
                    if(Vm>Vc){
                        statusSomas=false;
                    }
                }
                if(naoNulos([Vv])){
                    if(Vv>Vc){
                        statusSomas=false;
                    }
                }
            }
        
            if(statusSomas){        
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
                calcularTensaoUltima();
                //calcularDefUlt();
                calcularResistenciaCompressiva();   
            }
        }
    }
    return estadoAlterado;
}


//#endregion

//#region CALCULO DE FALHAS DE LAMINAS UNIDIRECIONAIS

function determinandoTensoesMaximas(matrizesLamina){
    limparElemento("resultadosFalha");

    let sigma1TultF = props.sigma1TultF.valor;
    let sigma1CultF = props.sigma1CultF.valor;

    let sigma2TultF = props.sigma2TultF.valor;
    let sigma2CultF = props.sigma2CultF.valor;

    let tau12UltF = props.tau12UltF.valor;

    let sigma1 = matrizesLamina[1].σ12[0][0];
    let sigma2 = matrizesLamina[1].σ12[1][0];
    let tau12 = matrizesLamina[1].σ12[2][0];

    let sigmaX = document.getElementById("sigmaX").value;
    let sigmaY = document.getElementById("sigmaY").value;
    let tauXY = document.getElementById("tauXY").value;
    if(sigmaX.endsWith("S") && sigmaY.endsWith("S") && tauXY.endsWith("S")){
        if(naoNulos([sigma1TultF,sigma1CultF,sigma2TultF,sigma2CultF,tau12UltF,sigma1,sigma2,tau12])){
            let resposta = [];

            sigma1TultF *= 1e6;
            sigma1CultF *= 1e6;
            sigma2TultF *= 1e6;
            sigma2CultF *= 1e6;
            tau12UltF *= 1e6;
            sigma1 *= 1e0;
            sigma2 *= 1e0;
            tau12 *= 1e0;
        
            let sigma1TultF2 = sigma1TultF/sigma1;
            let sigma1CultF2 = -sigma1CultF/sigma1;
            let maiorSigma1Ult = math.max(sigma1TultF2,sigma1CultF2);

            let sigma2TultF2 = sigma2TultF/sigma2;
            let sigma2CultF2 = -sigma2CultF/sigma2;
            let maiorSigma2Ult =  math.max(sigma2TultF2,sigma2CultF2);

            let tau12UltF2Menos = -tau12UltF/tau12;
            let tau12UltF2Mais = tau12UltF/tau12;
            let maiorTau12Ult = math.max(tau12UltF2Menos,tau12UltF2Mais);

            
            //Esse seria o valor de S. No exemplo onde sigmaX = 2S, sigmaY = -3S...
            let menorValor = math.min(maiorSigma1Ult,maiorSigma2Ult,maiorTau12Ult);
            tensaoS1 = menorValor;
            resposta.push(`S = ${menorValor.toFixed(3)} (Teoria de falha da máxima tensão)`);
            //RESPOSTA SOBRE QUAL É O VALOR MÁXIMO DAS TENSÕES EM X E Y
            tensoesMaximasParaFalha1 = math.multiply(menorValor,matrizesLamina[1].σxy);

            ////////////////////////////////////////////////
            //TSAI-HILL:
            let tsaiHill = (1/((sigma1/sigma1TultF)**2 - (sigma1*sigma2/sigma1TultF**2) + (sigma2/sigma2TultF)**2 + (tau12/tau12UltF)**2))**(1/2);
            //tensaoS2 = tsaiHill;
            //tensoesMaximasParaFalha2 = math.multiply(tsaiHill,matrizesLamina[1].σxy);
            resposta.push(`S = ${tsaiHill.toFixed(3)} (Teoria de falha de Tsai-Hill)`);
            
            ////////////////////////////////////////////////
            //TSAI-HILL MODIFICADO:

            let X1="";
            let X2="";
            let Y ="";
            
            (sigma1>0) && (X1=sigma1TultF);
            (sigma1<0) && (X1=sigma1CultF);
            
            (sigma2>0) && (X2=sigma1TultF);
            (sigma2<0) && (X2=sigma1CultF);
            
            (sigma2>0) && (Y=sigma2TultF);
            (sigma2<0) && (Y=sigma2CultF);

            let S = tau12UltF;
            let tsaiHillModificada = (1/((sigma1/X1)**2 - ((sigma1/X2)*(sigma2/X2)) + (sigma2/Y)**2 + (tau12/S)**2))**(1/2);
            //tensoesMaximasParaFalha3 = math.multiply(tsaiHillModificada,matrizesLamina[1].σxy);
            resposta.push(`S = ${tsaiHillModificada.toFixed(3)} (Teoria de falha de Tsai-Hill Modificada)`);

        
            ////////////////////////////////////////////////
            //TSAI-WU:
            //FALTA IMPLEMENTAR... VAI TER BÁSKARA?

            //-b+(b**2-4*a*c)**(1/2)/2*a
            //-b-(b**2-4*a*c)**(1/2)/2*a


            let H1 = 1/sigma1TultF - 1/sigma1CultF;
            let H11 = 1/(sigma1TultF*sigma1CultF);
            let H2 = 1/sigma2TultF - 1/sigma2CultF;
            let H22 = 1/(sigma2TultF*sigma2CultF);
            let H6=0;
            let H66 = 1/tau12UltF**2;

            let H12TH = -1/(2*sigma1TultF**2); //H12 de Tsai-Hill
            let H12H = -1/(2*sigma1TultF*sigma1CultF); //H12 de Hoffman
            let H12MH = -1/2*(1/(sigma1TultF*sigma1CultF*sigma2TultF*sigma2CultF))**(1/2); //H12 de Mises-Hencky
            //                                      B                                                      A                                    C=-1
            //                      (VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV)  (VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV)
            let tsaiWu_H12TsaiHill = H1*sigma1 + H2*sigma2 + H6*tau12 + H11*sigma1**2 + H22*sigma2**2 + H66*tau12**2 + 2*H12TH*sigma1*sigma2;
            let termoB = (H1*sigma1 + H2*sigma2 + H6*tau12);
            let termoA = (H12) => (H11*sigma1**2 + H22*sigma2**2 + H66*tau12**2 + 2*H12*sigma1*sigma2);
            let termoC = -1;

            let raizPositivaH12TH = -termoB+(termoB**2-4*termoA(H12TH)*termoC)**(1/2)/(2*termoA(H12TH));
            let raizPositivaH12H = -termoB+(termoB**2-4*termoA(H12H)*termoC)**(1/2)/(2*termoA(H12H));
            let raizPositivaH12MH = -termoB+(termoB**2-4*termoA(H12MH)*termoC)**(1/2)/(2*termoA(H12MH));

            resposta.push(`S = ${raizPositivaH12TH.toFixed(3)} (Teoria de falha de Tsai-Wu com H<sub>12</sub> de Tsai-Hill)`);
            resposta.push(`S = ${raizPositivaH12H.toFixed(3)} (Teoria de falha de Tsai-Wu com H<sub>12</sub> pelo critério de Hoffman)`);
            resposta.push(`S = ${raizPositivaH12MH.toFixed(3)} (Teoria de falha de Tsai-Wu com H<sub>12</sub> pelo critério de Mises-Hencky (padrão))`);

            postarValor(resposta,"resultadosFalha");

            let termoAH12TH =termoA(H12TH) ;
            let termoBH12H =termoA(H12H) ;
            let termoCH12MH =termoA(H12MH) ;

            let raizNegativaH12TH = -termoB-(termoB**2-4*termoA(H12TH)*termoC)**(1/2)/(2*termoA(H12TH));
            let raizNegativaH12H = -termoB-(termoB**2-4*termoA(H12H)*termoC)**(1/2)/(2*termoA(H12H));
            let raizNegativaH12MH = -termoB-(termoB**2-4*termoA(H12MH)*termoC)**(1/2)/(2*termoA(H12MH));

            
            let ABC=123;

            


            }
    } else{ //Ou seja não se deseja descobrir o valor da tensão "S", mas sim se as tensões aplicadas falham ou não o compósito

        teoriaFalhaMaximaTensao();

        function teoriaFalhaMaximaTensao(){
            if(naoNulos([sigma1TultF,sigma1CultF,tau12UltF])){
                sigma1TultF*=1e6;
                sigma1CultF*=1e6;
                sigma2TultF*=1e6;
                sigma2CultF*=1e6;
                tau12UltF*=1e6;
    
                let resposta = [];
                
                if(sigma1 > sigma1TultF||sigma1 < -sigma1CultF||sigma2 > sigma2TultF||sigma2 < -sigma2CultF||tau12 > tau12UltF||tau12 < -tau12UltF){
                    (resposta.push(`<h4 style="color:red">FALHA PELO MÉTODO DA MÁXIMA TENSÃO!</h4><br> `));
                } else{
                    (resposta.push(`<h4 style="color:green">NÃO FALHA PELO MÉTODO DA MÁXIMA TENSÃO!</h4> <br>`));

                }
                //if(sigma1 > sigma1TultF || sigma1<sigma1CultF){
                    (sigma1 > sigma1TultF) && (resposta.push(`σ<sub>1</sub> > (σ<span class="supsub"><sup>T</sup><sub>1</sub></span>)<sub>ult</sub>  `));
                    (sigma1 < -sigma1CultF) && (resposta.push(`σ<sub>1</sub> < (σ<span class="supsub"><sup>C</sup><sub>1</sub></span>)<sub>ult</sub>  `));
                //}
                //if(sigma2 > sigma2TultF || sigma2<sigma2CultF){
                    (sigma2 > sigma2TultF) && (resposta.push(`σ<sub>2</sub> > (σ<span class="supsub"><sup>T</sup><sub>2</sub></span>)<sub>ult</sub>  `));
                    (sigma2 < -sigma2CultF) && (resposta.push(`σ<sub>2</sub> < (σ<span class="supsub"><sup>C</sup><sub>2</sub></span>)<sub>ult</sub>  `));            
                //}
                //if(tau12 > tau12UltF || tau12<-tau12UltF){
    
                    (tau12 > tau12UltF) && (resposta.push(`τ<sub>12</sub> > (τ<sub>12</sub>)<sub>ult</sub>`));
                    (tau12 < -tau12UltF) && (resposta.push(`τ<sub>12</sub> < -(τ<sub>12</sub>)<sub>ult</sub>`));            
                //}
    
                postarValor(resposta,"resultadosFalha");
            }
            

         
                
        }
    }

   





}



function teoriaFalhaMaximaDeformacao(){
    if(epsilon1 > epsilon1Tult || epsilon1<epsilon1Cult){
        //FALHOU!
    }
    if(epsilon2 > epsilon2Tult || epsilon2<epsilon2Cult){
        //FALHOU!
    }
    if(gama12 > gama12Ult || gama12<-gama12Ult){
        //FALHOU!
    }
}

function teoriaFalhaTsaiHill(){
    

    let tsaiHill = (sigma1/sigma1Tult)**2 - (sigma1*sigma2/sigma1Tult**2) + (sigma2/sigma2Tult)**2 + (tau12/tau12Ult)**2;
    if(tsaiHill>=1){
        //FALHOU!
    }

}

function teoriaFalhaModificadaTsaiHill(){
    let X1="";
    let X2="";
    let Y ="";
    
    (sigma1>0) && (X1=sigma1Tult);
    (sigma1<0) && (X1=sigma1Cult);
    
    (sigma2>0) && (X2=sigma1Tult);
    (sigma2<0) && (X2=sigma1Cult);
    
    (sigma2>0) && (Y=sigma2Tult);
    (sigma2<0) && (Y=sigma2Cult);

    let S = tau12Ult;

    let tsaiHillModificada = (sigma1/X1)**2 - ((sigma1/X2)*(sigma2/X2)) + (sigma2/Y)**2 + (tau12/S)**2;

    if(tsaiHillModificada >=1 ){
        //FALHOU
    }
}

function teoriaFalhaTsaiWu(){
    let H1 = 1/sigma1Tult - 1/sigma1Cult;
    let H11 = 1/(sigma1Tult*sigma1Cult);
    let H2 = 1/sigma2Tult - 1/sigma2Cult;
    let H22 = 1/(sigma2Tult*sigma2Cult);
    let H6=0;
    let H66 = 1/tau12Ult**2;

    let H12TH = -1/(2*sigma1Tult**2);
    let H12H = -1/(2*sigma1Tult*sigma1Cult);
    let H12MH = -1/2*(1/(sigma1Tult*sigma1Cult*sigma2Tult*sigma2Cult))**(1/2);

    let tsaiWu_H12TsaiHill = H1*sigma1 + H2*sigma2 + H6*tau12 + H11*sigma1**2 + H22*sigma2**2 + H66*tau12**2 + 2*H12TH*sigma1*sigma2;

    let tsaiWu_H12Hoffman = H1*sigma1 + H2*sigma2 + H6*tau12 + H11*sigma1**2 + H22*sigma2**2 + H66*tau12**2 + 2*H12H*sigma1*sigma2;
    
    let tsaiWu_H12MisesHencky = H1*sigma1 + H2*sigma2 + H6*tau12 + H11*sigma1**2 + H22*sigma2**2 + H66*tau12**2 + 2*H12MH*sigma1*sigma2;

    if(tsaiWu_H12TsaiHill>=1){
        //Falhou por Tsai Wu com H12 seguindo a teoria de Tsai-Hill
    }
    if(tsaiWu_H12Hoffman>=1){
        //Falhou por Tsai Wu com H12 seguindo o critério de Hoffman
    }
    if(tsaiWu_H12MisesHencky>=1){
        //Falhou por Tsai Wu com H12 seguindo o critério de Mises-Hencky
    }
    
}




//#endregion

//#region CALCULO DE RESISTENCIAS ULTIMAS
function calcularResistenciaCompressiva(){
    let vf = props.vf.valor;
    (naoNulos([vf])) && (vf=vf/100);

    let vm = props.vm.valor;
    (naoNulos([vm])) && (vm=vm/100);

    let d_s = (4*(vf)/Math.PI)**(1/2);

    let sigmaMult = props.sigmaMTult.valor;
    (naoNulos([sigmaMult])) && (sigmaMult=sigmaMult*1e6);

    let sigmaMCult = props.sigmaMCult.valor;
    (naoNulos([sigmaMCult])) && (sigmaMCult=sigmaMCult*1e6);

    let Em = props.Em.valor;
    (naoNulos([Em])) && (Em=Em*1e9);

    let Ef = props.Ef.valor;
    (naoNulos([Ef])) && (Ef=Ef*1e9);

    let E1 = props.E1.valor;
    (naoNulos([E1])) && (E1=E1*1e9);

    let E2 = props.E2.valor;
    (naoNulos([E2])) && (E2=E2*1e9);

    let nu12 = props.nu12.valor;
    let Gm = props.Gm.valor;
    (naoNulos([Gm])) && (Gm=Gm*1e9);

    let G12 = props.G12.valor;
    (naoNulos([G12])) && (G12=G12*1e9);

    let Gf = props.Gf.valor; 
    (naoNulos([Gf])) && (Gf=Gf*1e9);

    //(naoNulos([G12])) && (G12=g12*1e9);

    let tauFult = props.tauFult.valor;
    (naoNulos([tauFult])) && (tauFult=tauFult*1e6);

    let tauMult = props.tauMult.valor;
    (naoNulos([tauMult])) && (tauMult=tauMult*1e6);


    let epsilonMult = "";
    let menorEpsilon2Tult = "";
    let S1C="";
    let S2C="";
    let epsilonC_m="";



    if(naoNulos([sigmaMult,Em])){
        //sigmaMult=sigmaMult*1e6;
        //Em=Em*1e9;
        epsilonMult = sigmaMult/Em; // RESULTADO (em)ult=0.2117*10^-1
        armazenarEmProps("epsilonMult",epsilonMult);
    };

    if(naoNulos([epsilonMult, d_s, Em,Ef,vf])){
        //vf=vf/100;
        //Ef=Ef*1e9;
        //Em=Em*1e9;
        let epsilon2Tult = [epsilonMult*(d_s*(Em/Ef-1)+1),epsilonMult*(1-vf**(1/3))];
        
        menorEpsilon2Tult = math.min(epsilon2Tult);
        armazenarEmProps("menorEpsilonTransvUlt",menorEpsilon2Tult);
    }
    
    let sigma1Cult="";
    if(naoNulos([E1,menorEpsilon2Tult,nu12])){
        //E1=E1*1e9;

         sigma1Cult= E1*menorEpsilon2Tult/nu12; //RESULTADO SIGMA1CULT
    }

    if(naoNulos([vf,Em,Ef])){
        //vf=vf/100;
        //Ef=Ef*1e9;
        //Em=Em*1e9;
        S1C = 2*(vf+(1-vf)*Em/Ef)*(vf*Em*Ef/(3*(1-vf)))**(1/2); //resultado S1C
    }

    if(naoNulos([sigma1Cult,S1C])){
        armazenarEmProps("modo1",math.min(sigma1Cult,S1C)*1e-6);
    }
    
    if(naoNulos([Gm,Vf])){
        //vf=vf/100;
        //Gm=Gm*1e9;
        S2C = Gm/(1-vf);
        armazenarEmProps("modo2",S2C*1e-6);
    }
    /*
    if(naoNulos([S1C,S2C])){
        let menorTensao1Cult = math.min([S1C,S2C]); 
    }
    */
    if(naoNulos([tauFult,vf,tauMult,vm])){
        //vf=vf/100;
        //vm=vm/100;
        //tauFult=tauFult*1e9;
        //tauMult=tauMult*1e9;
        let sigma1Cult_2 = 2*(tauFult*vf+tauMult*vm); // Resultado levemente diferente do exemplo usado no livro, mas os calculos indicam estar corretos.
        armazenarEmProps("modo3",sigma1Cult_2*1e-6);
    }

    if(naoNulos([sigmaMCult,Em])){
        //Em=Em*1e9;
        epsilonC_m=sigmaMCult/Em;
        armazenarEmProps("epsilonMC",epsilonC_m);

    }

    if(naoNulos([d_s,Em,Ef,E2,epsilonC_m])){
        //Em=Em*1e9;
        //Ef=Ef*1e9;

        let epsilon2C = (d_s*Em/Ef + (1-d_s))*epsilonC_m;
        let sigma2Cult=E2*epsilon2C;
        armazenarEmProps("sigma2Cult",sigma2Cult*1e-6);
    }

    //let tau12Ult = G12*gama12Ult;
    if(naoNulos([G12,d_s,Gm,Gf,tauMult])){
        //Gm=Gm*1e9;
        //Gf=Gf*1e9;

        let gama12Ult = tauMult/Gm;
        let tau12Ult = G12*(d_s*Gm/Gf+(1-d_s))*gama12Ult; 
        armazenarEmProps("tau12ult", tau12Ult*1e-6);
    };
      
  



}

function calcularTensaoUltima(){
    let Ef = props.Ef.valor;
    let sigmaFult = props.sigmaFTult.valor;
    let Em = props.Em.valor;
    let sigmaMult = props.sigmaMTult.valor;
    let vf = props.vf.valor;

    if (naoNulos([Ef,sigmaFult,Em,sigmaMult, vf])){
        //Ef=Ef*1e9;
        //sigmaFult=sigmaFult*1e9;
        //Em=Em*1e9;
        //sigmaMult=sigmaMult*1e9;
        //vf=vf/100;
        vf/=100;
        let epsilonFult = sigmaFult/Ef;
        let epsilonMult = sigmaMult/Em;
        let sigma1Tult = sigmaFult*vf + epsilonFult*Em*(1-vf);
        armazenarEmProps("sigma1Tult",sigma1Tult);
    }

    let E2 = props.E2.valor;
    let menorEpsilonTransvUlt = props.menorEpsilonTransvUlt.valor;
    if(naoNulos([E2,menorEpsilonTransvUlt])){
        let sigma2Tult = E2*menorEpsilonTransvUlt*1e3;
        armazenarEmProps("sigma2Tult",sigma2Tult);
    }


}
/*
function calcularDefUlt(){
    let vf = props.vf.valor;
    let sigmaMult = props.sigmaMTult.valor;
    let Em = props.Em.valor;
    if(naoNulos([vf,sigmaMult,Em])){
        vf=vf/100;
        //let d_s = (4*vf/Math.PI)**(1/2);
        sigmaMult=sigmaMult*1e6;
        Em=Em*1e9;
        let epsilonMult = sigmaMult/Em;
        armazenarEmProps("sigma1Tult",sigma1Tult);

    }
} 
*/
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
            var matrizesLamina = calcularMatrizesLaminado(sigmaX,sigmaY,tauXY, "MPa", angulo,E1,E2,nu12,G12, "GPa");
            limparElemento("lamina");
            exibirCalculosMacros(matrizesLamina,"","lamina");
            determinandoTensoesMaximas(matrizesLamina);

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
    let espessuraLamina = props.espessura.valor*1e-3;

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
                objetoABD[1]["εxySuperior:"+angulo]=exyk;
                

                let exykComUltimoTermoDivPor2 = [exyk[0], exyk[1], [exyk[2]/2]];
                //console.log("εxykComUltimoTermoDivPor2");
                //console.log(exykComUltimoTermoDivPor2);

                let e12k = math.multiply(dadosLaminado[l][1].T,exykComUltimoTermoDivPor2);
                e12k = [e12k[0], e12k[1],[2*e12k[2]]];
                objetoABD[1]["ε12Superior:"+angulo]=e12k;
                //console.log("ε12k");
                //console.log(e12k);
                
                let tensoesGlobaisxyk = math.multiply(dadosLaminado[l][1].Qxy,exyk);
                objetoABD[1]["σXySuperior:"+angulo]=tensoesGlobaisxyk;

                let tensoesLocaisxyk = math.multiply(dadosLaminado[l][1].T,tensoesGlobaisxyk);
                objetoABD[1]["σ12Superior:"+angulo]=tensoesLocaisxyk;

            }

        }


        exibirCalculosMacros(objetoABD,"LAMINADO","laminado");


    };
    
    
    estadoAlterado=true;
    return estadoAlterado;
}


function valorEngenharia(unidade){
    switch(unidade){
        case "GPa": return 1e9;
        case "MPa": return 1e6;
        case "kPa": return 1e3;
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
