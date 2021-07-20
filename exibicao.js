//Arquivo criado em .JS para visualização das matrizes
let inputs = document.querySelectorAll(" input[type=text]");

for(let input in inputs){
    if(!isNaN(input)){
        let elemento = inputs[input];
        let id = elemento.getAttribute("id");
        let valor = elemento.value;

        let multiplicador = elemento.getAttribute("multiplicador");
        if(multiplicador!=null){
            multiplicador = parseFloat(multiplicador).toExponential();
        }else{
            multiplicador=1;
        }

        let unidade = elemento.getAttribute("unidade");
        

        props[id]={"valor":valor, "unidade":unidade, status:"", travado:false, "multiplicador":multiplicador};

        
        label = document.getElementById(id).previousElementSibling;
        if(label!=null){
            label.addEventListener('dblclick', (event)=>{
                //let id = event.target.id;
                chavearTravado(id);
            });
        }
        
        elemento.addEventListener('dblclick', (event)=>{
            //let id = event.target.id;
            chavearTravado(id);
        });
        
        elemento.addEventListener('change', (event)=>{
            let valorNovo = event.target.value;
            if(!valorNovo.includes("/")){
                valorNovo = parseFloat(valorNovo);
            }
            if(isNaN(valorNovo)){
                valorNovo = event.target.value;
            }
            let id = event.target.id;
            let valorAntigo = props[id].valor;
            let statusAntigo = props[id].status;
            let travadoAntigo = props[id].travado;
            chavearTravado(id);
            props[id].valor=valorNovo;
            props[id].status="Digitado";
            props[id].travado=true;            
            
            //var status = (exibirResultadosMicroMecanica() );
            var status = (exibirResultadosMicroMecanica() || calcularMacroMecanicaLamina() || calcularMacroMecanicaLaminado());

            
            if (valorAntigo==="")  status = true ;
            if (status){
                //parabéns, já fez a alteração anteriormente
            }else{
                //desfazendo as alterações
                chavearTravado(id);
                props[id].valor=valorAntigo;
                props[id].status=statusAntigo;
                props[id].travado=travadoAntigo;    
                atualizarValorInput(id,valorAntigo);
            }

        });
    }
}

function travar(id){
    let elemento = document.getElementById(id);
    let label = elemento.previousElementSibling;
    
    props[id].travado=true;
    elemento.classList.add('travado');
    label.classList.add('labelTravado');
    elemento.setAttribute('readonly','true');
}

function chavearTravado(id){
    let elemento = document.getElementById(id);
    let label = elemento.previousElementSibling;
    let travado = props[id].travado;
        if (travado){
            props[id].travado=false;
            elemento.classList.remove('travado');
            label.classList.remove('labelTravado');
            elemento.removeAttribute('readonly');
        } else{
            travar(id);
        }
}

var resultadosMicroMecanica = document.getElementById("resultadosMicroMecanica");

function exibirResultadosMicroMecanica(){
    return calcularMicroMecanica();
    
    var pai = document.getElementById("resultadosMicroMecanica");
    pai.innerHTML="";
    var table = document.createElement("table");
    pai.appendChild(table);
    
    /*
    Object.keys(propriedades).forEach(key => {
        
        var tr = document.createElement("tr");
        table.appendChild(tr);
        
        var td = document.createElement("td");
        td.innerHTML=key;
        tr.appendChild(td);

        var td2 = document.createElement("td");

        td2.innerHTML=propriedades[key];
        tr.appendChild(td2);
    });
    */
}

function atualizarValorInput(item, valor){
    var tag = document.getElementById(item);
    tag.value = valor;

}

// function mudarFundoCalculado(item, flag){
//     var input = document.getElementById(item);
//     if(flag){
//         input.classList.add("calculado");
//     }else{
//         input.classList.remove("calculado");
//     }
// }

function postarValor (oque,onde){
    let pai = document.getElementById(onde);
    oque.forEach(conteudo => {
        let elemento = document.createElement("div");
        elemento.innerHTML=conteudo;
        pai.appendChild(elemento);
    });
   
}


/*
##################################
MACRO 
*/

function ocultarExibir(elem){
    let elemento = document.getElementById(elem);
    if(elemento.classList.contains("esconder")){
        elemento.classList.remove("esconder");
    }else{
        elemento.classList.add("esconder");
    }
    //elemento.style.overflow = "hidden";
    /*
    if(elemento.style.height == "0px"){
        elemento.style.height = "auto";
        elemento.scrollIntoView();
        window.scrollBy(0,-60);

    }else{
        elemento.style.height = "0";
    }
    */
}

function exibirCalculosMacros(lamina, ordem, elementoPai){
    //limparElemento(elementoPai);

    var pai = document.getElementById(elementoPai);

    var angulo = lamina[0];
    var lamina2 = Object.keys(lamina[1]).map((key) => [key, lamina[1][key]])

    var div = document.createElement("div");
    div.id=`matrizesCamada${ordem}`;
    div.classList.add("lamina");
    var titulo = document.createElement("h3");
    if(ordem=="LAMINADO"){
        titulo.innerHTML = `Dados do laminado:`;
    }else{
        titulo.innerHTML = `Dados da lâmina ${ordem} de ${angulo} graus:`;
    }
    pai.appendChild(div);
    div.appendChild(titulo);
    var dadosDaLamina = lamina2;

    for(i=0;i<dadosDaLamina.length;i++){
        let nomeMatrizAnterior = dadosDaLamina[i][0];
        let nomeMatriz = nomeMatrizAnterior[0]+"<sub>";
        for (let index = 1; index < nomeMatrizAnterior.length; index++) {
            const letra = nomeMatrizAnterior[index];
            nomeMatriz=nomeMatriz+letra;
        }
        nomeMatriz=nomeMatriz+"</sub>";
        let matriz = dadosDaLamina[i][1];
        let unidade = "Pa";
        if(nomeMatriz.includes("ε") || nomeMatriz=="T"){
            unidade="u.a.";
        } else if (nomeMatriz.startsWith("S")){
            unidade="Pa<sup>-1</sup>";
        } 
        imprimirMatriz(matriz,nomeMatriz,div.id,unidade);
    }
    //console.log("Acabou a exibição.");
}

function imprimirMatriz(matriz, nome, elemento, unidade){
    let divPai = document.getElementById(elemento);
    //div.innerHTML="";
    let div = document.createElement("div");
    divPai.appendChild(div);
    let nomeDaMatriz = document.createElement("span");
    nomeDaMatriz.innerHTML = "[" + nome + "] = ";
    div.appendChild(nomeDaMatriz);

    let tabela = document.createElement("table");
    tabela.classList.add("matrix")
    div.appendChild(tabela);
    matriz.forEach(linha => {
        let tr = document.createElement("tr");
        tabela.appendChild(tr);
        linha.forEach(coluna => {
            let td = document.createElement("td");
            tr.appendChild(td);
            td.innerHTML=coluna.toExponential(3);
        })
    });
    let unidadeDaMatriz = document.createElement("span");
    unidadeDaMatriz.innerHTML=unidade;
    div.appendChild(unidadeDaMatriz);
}

function estadoPlano(){
    let tensao1e = document.getElementById("tensao1e");
    let tensao1d = document.getElementById("tensao1d");
    
    let tensao2s = document.getElementById("tensao2s");
    let tensao2i = document.getElementById("tensao2i");

    let tensao12e = document.getElementById("tensao12e");
    let tensao12d = document.getElementById("tensao12d");
    let tensao12s = document.getElementById("tensao12s");
    let tensao12i = document.getElementById("tensao12i");

    
    let valorTensao1 = document.getElementById("valorTensao1");
    let valorTensao2 = document.getElementById("valorTensao2");
    let valorTensao12 = document.getElementById("valorTensao12");
    let sigmaX = props.sigmaX.valor;
    let sigmaY = props.sigmaY.valor;
    let tauXY = props.tauXY.valor;

    if(naoNulos([sigmaX])){
        valorTensao1.innerText=sigmaX + " " + props.sigmaX.unidade;
    }
    if(naoNulos([sigmaY])){
        valorTensao2.innerText=sigmaY + " " + props.sigmaY.unidade;
    }
    if(naoNulos([tauXY])){
        valorTensao12.innerText=tauXY + " " + props.tauXY.unidade;
    }


    if(sigmaX>0){
        tracao1();
    } else if(sigmaX<0){
        compressao1();
    } else if(sigmaX==0){
        nulo1();
    }

    if(sigmaY>0){
        tracao2();
    } else if(sigmaY<0){
        compressao2();
    } else if(sigmaY==0){
        nulo2();
    }

    if(tauXY>0){
        cisalhamentoPos12();
    } else if(tauXY<0){
        cisalhamentoNeg12();
    } else if(tauXY==0){
        nulo12();
    }
    //console.log([tensao1e, tensao1d, tensao2s, tensao2i, tensao12e, tensao12d, tensao12s, tensao12i]);

    function compressao1(){
        tensao1e.classList.remove("icono-arrow2-normal-eixoX-left");
        tensao1e.classList.add("icono-arrow2-normal-eixoX-right");
       
        tensao1d.classList.remove("icono-arrow2-normal-eixoX-right");
        tensao1d.classList.add("icono-arrow2-normal-eixoX-left");
    }

    function tracao1(){
        tensao1d.classList.remove("icono-arrow2-normal-eixoX-left");
        tensao1d.classList.add("icono-arrow2-normal-eixoX-right");
       
        tensao1e.classList.remove("icono-arrow2-normal-eixoX-right");
        tensao1e.classList.add("icono-arrow2-normal-eixoX-left");
    }

    function nulo1(){
        tensao1d.classList.remove("icono-arrow2-normal-eixoX-left");
        tensao1d.classList.remove("icono-arrow2-normal-eixoX-right");
       
        tensao1e.classList.remove("icono-arrow2-normal-eixoX-right");
        tensao1e.classList.remove("icono-arrow2-normal-eixoX-left");
    }

    function compressao2(){
        tensao2s.classList.remove("icono-arrow2-normal-eixoY-up");
        tensao2s.classList.add("icono-arrow2-normal-eixoY-down");
       
        tensao2i.classList.remove("icono-arrow2-normal-eixoY-down");
        tensao2i.classList.add("icono-arrow2-normal-eixoY-up");
    }

    function tracao2(){
        tensao2i.classList.remove("icono-arrow2-normal-eixoY-up");
        tensao2i.classList.add("icono-arrow2-normal-eixoY-down");
       
        tensao2s.classList.remove("icono-arrow2-normal-eixoY-down");
        tensao2s.classList.add("icono-arrow2-normal-eixoY-up");
    }
    function nulo2(){
        tensao2i.classList.remove("icono-arrow2-normal-eixoY-up");
        tensao2i.classList.remove("icono-arrow2-normal-eixoY-down");
       
        tensao2s.classList.remove("icono-arrow2-normal-eixoY-down");
        tensao2s.classList.remove("icono-arrow2-normal-eixoY-up");
    }

    function cisalhamentoPos12(){
        tensao12s.classList.remove("icono-arrow2-left");
        tensao12s.classList.add("icono-arrow2-right");

        tensao12i.classList.remove("icono-arrow2-right");
        tensao12i.classList.add("icono-arrow2-left");

        tensao12e.classList.remove("icono-arrow2-up");
        tensao12e.classList.add("icono-arrow2-down");

        tensao12d.classList.remove("icono-arrow2-down");
        tensao12d.classList.add("icono-arrow2-up");
       
    }

    function cisalhamentoNeg12(){
        tensao12s.classList.remove("icono-arrow2-right");
        tensao12s.classList.add("icono-arrow2-left");

        tensao12i.classList.remove("icono-arrow2-left");
        tensao12i.classList.add("icono-arrow2-right");

        tensao12e.classList.remove("icono-arrow2-down");
        tensao12e.classList.add("icono-arrow2-up");

        tensao12d.classList.remove("icono-arrow2-up");
        tensao12d.classList.add("icono-arrow2-down");
       
    }

    function nulo12(){
        tensao12s.classList.remove("icono-arrow2-right");
        tensao12s.classList.remove("icono-arrow2-left");

        tensao12i.classList.remove("icono-arrow2-left");
        tensao12i.classList.remove("icono-arrow2-right");

        tensao12e.classList.remove("icono-arrow2-down");
        tensao12e.classList.remove("icono-arrow2-up");

        tensao12d.classList.remove("icono-arrow2-up");
        tensao12d.classList.remove("icono-arrow2-down");
       
    }
    

    //let theta = props.theta.valor;
    let angulo = props.angulo.valor;
    if(naoNulos([angulo])){
        document.documentElement.style.setProperty('--angulo', angulo+'deg');
    }




}

function limparElemento(elemento){
    document.getElementById(elemento).innerHTML="";
}

function desenharLaminas(){
    let div = document.getElementById("desenhoLaminas");
    let angulos = props.angulos.valor.split("/").map(Number);
    limparElemento("desenhoLaminas");
    for(a=0; a<angulos.length; a++){
        let angulo = angulos[a]
        let quadrado = document.createElement("div");
        quadrado.classList.add("laminaQuadrado");
        quadrado.setAttribute("style",`--angulo:${angulo}deg`);
        let graus = document.createElement("span");
        let espessura = props.espessura.valor;
        if(naoNulos([espessura])){
            graus.innerHTML=`${angulo}º &nbsp; ${-espessura*angulos.length/2+espessura*a}mm`;

        }else{
            graus.innerHTML=`${angulo}º`;

        }
        quadrado.appendChild(graus);
        div.appendChild(quadrado);
        if(a<angulos.length-1){
            gerarElementoEixos(quadrado,true,false);
        }else{
            quadrado.setAttribute("style",`--angulo:${angulo}deg; margin-bottom:10px;`)
            gerarElementoEixos(quadrado,true,true);
        }


    }
    /*
    angulos.forEach(element => {
        let quadrado = document.createElement("div");
        quadrado.classList.add("laminaQuadrado");
        quadrado.setAttribute("style",`--angulo:${element}deg`);
        div.appendChild(quadrado);

    });
    */
}


function gerarElementoEixos(elemento,bool12,boolXY){
    pai=elemento;
        
    if(bool12){

        let eixo12 = document.createElement("div");
        pai.appendChild(eixo12);
        eixo12.classList.add("eixo12");
        
        let eixo122 = document.createElement("div");
        eixo122.classList.add("eixo12-2");
        let setaCima = document.createElement("div");
        setaCima.innerHTML = "&#129061;";
        let span2 = document.createElement("span");
        span2.innerText="2";
        eixo122.appendChild(setaCima);
        eixo122.appendChild(span2);
    
        let eixo121 = document.createElement("div");
        eixo121.classList.add("eixo12-1");
        let setaDireita = document.createElement("div");
        setaDireita.innerHTML="&#129062;";
        let span1 = document.createElement("span");
        span1.innerText="1";
        eixo121.appendChild(setaDireita);
        eixo121.appendChild(span1);
    
        eixo12.appendChild(eixo122);
        eixo12.appendChild(eixo121);
    }

    if(boolXY){

        let eixoXY = document.createElement("div");
        pai.appendChild(eixoXY);
        eixoXY.classList.add("eixoXY");
        
        let eixoXYY = document.createElement("div");
        eixoXYY.classList.add("eixoXY-Y");
        let setaCima = document.createElement("div");
        setaCima.innerHTML = "&#129061;";
        let spanY = document.createElement("span");
        spanY.innerText="Y";
        eixoXYY.appendChild(setaCima);
        eixoXYY.appendChild(spanY);
    
        let eixoXYX = document.createElement("div");
        eixoXYX.classList.add("eixoXY-X");
        let setaDireita = document.createElement("div");
        setaDireita.innerHTML="&#129062;";
        let spanX = document.createElement("span");
        spanX.innerText="X";
        eixoXYX.appendChild(setaDireita);
        eixoXYX.appendChild(spanX);
    
        eixoXY.appendChild(eixoXYY);
        eixoXY.appendChild(eixoXYX);
    }
}