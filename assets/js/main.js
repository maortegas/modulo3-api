const selectMoneda=document.getElementById('selectMoneda');

async function getMoneda(){
    const res = await fetch("https://mindicador.cl/api");
    const data = await res.json();
    
    return data;
}

async function arrayMoneda() {
    const json = await getMoneda();
    const arrayMonedas=[];
    
    for (let clave in json){
      if (json[clave].unidad_medida=='Pesos'){
          arrayMonedas.push({moneda:json[clave].codigo, conversion:json[clave].valor })
      }
    }
  return arrayMonedas
}

async function cargaSelect(){
    const arrayMonedas = await arrayMoneda();
    arrayMonedas.map((elemento)=>{
      let opt = document.createElement("option");
      opt.value =elemento.conversion ; 
      opt.innerHTML = elemento.moneda;
      selectMoneda.append(opt);
    }) 
 return
 }

cargaSelect();

