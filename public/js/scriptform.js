//Comprobación de horas libres según el día

document.querySelector("#date").onchange=()=>{
  document.querySelector("#hour").value=""
  showHours()
}

document.onload=()=>{
  showHours()
}

function showHours(){
  fetch(`/citas/horaslibres/${myInput.value}`)
    .then(res=>res.json())
    .then(hours=>{
      let divHours = document.querySelector(".hours")
      while(divHours.firstChild)
        divHours.firstChild.remove()
      hours.forEach(hour=>{
        let p = document.createElement("p")
        p.textContent=hour
        p.onclick=()=>document.querySelector("#hour").value=hour
        divHours.appendChild(p)
        })
    }
  )
}

