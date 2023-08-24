const btnConvertir=document.getElementById('bottonCovertir');
const textError= document.getElementById('error');
let arrayModenaValores=[];
let canvaChart;

async function getMoneda(){
  try{
    const res = await fetch("https://mindicador.cl/api");
    const data = await res.json();
    
    return data;
  }
  catch (error){
    textError.innerHTML='Se produjo un error, en la consola más información';  
    console.log('Se produjo el error a leer la api : ' + error.message);
  }
}

async function arrayMoneda() {
  try{
  const json = await getMoneda();
  let arrayMonedas=[];
    
  for (let clave in json){
    if (json[clave].unidad_medida=='Pesos'){
      arrayMonedas.push({codigo:json[clave].codigo, moneda:json[clave].nombre, conversion:json[clave].valor })
    }
  }

  arrayModenaValores=[...arrayMonedas]
  return arrayMonedas
  }
  catch (e){
    textError.innerHTML='Se produjo un error, en la consola más información';  
    console.log('Se produjo el error : ' + e.message);
 }
}

async function cargaSelect(){
  try{
  const arrayMonedas = await arrayMoneda();

  arrayMonedas.map((elemento)=>{
    let opt = document.createElement("option");
    opt.value =elemento.conversion ; 
    opt.innerHTML = elemento.moneda;
    selectMoneda.append(opt);
  }) 

  return arrayMonedas
  }  
  catch (e){
    textError.innerHTML='Se produjo un error, en la consola más información';  
    console.log('Se produjo el error : ' + e.message);
  }
}

async function datosGrafico(modena){
  try{
    const url= `https://mindicador.cl/api/${modena}` ;
    const res = await fetch(url);
    const valorMoneda = await res.json();
    let labels=[];
    let data=[];

    valorMoneda.serie.slice(0,10).map((elemento) => {
        labels.push( elemento.fecha.split('T')[0]);
        data.push(Number(elemento.valor))
    });

    const datasets = [
      {
      label: "Valor",
      borderColor: "rgb(255, 99, 132)",
      data,
      }
    ];

    return { labels, datasets };
  }
  catch (e){  
    textError.innerHTML='Se produjo un error, en la consola más información';
    console.log('Se produjo el error a leer la API : ' + e.message);
  }
}

async function renderGrafica(moneda) {
  const data = await datosGrafico(moneda);
  const myChart = document.getElementById("myChart");
  const config = {
    type: "line",
    data
  };

  if (canvaChart) {
    canvaChart.destroy(); 
  }      
  
  canvaChart= new Chart(myChart, config);      
}

btnConvertir.addEventListener("click", () => {
  const inputPeso = Number(document.getElementById('inputPeso').value);
  const selectMoneda = Number(document.getElementById('selectMoneda').value);
  const selectMonedaName=document.getElementById('selectMoneda')
  const selectMonedaText = selectMonedaName.options[selectMonedaName.selectedIndex].text;
  const textValor= document.getElementById('textValor');
 
  
  
  const index = arrayModenaValores.findIndex((ele) => ele.moneda == selectMonedaText)
  const codigoMoneda=arrayModenaValores[index].codigo;

  if (inputPeso ==0){
    alert('Debe de ingresar un monto');
    textValor.innerHTML='';
    return
  }
  if (inputPeso <0){
    alert('Debe de ingresar un valor positivos');
    textValor.innerHTML='';
    return
  }

  textValor.innerHTML= `Resultado: ${Number(inputPeso/selectMoneda).toFixed(2)}`;
  renderGrafica(codigoMoneda);
  }
);

cargaSelect();