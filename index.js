// index.js

//POST BUTTON AND FORM

// CUANTO DEL BOTÓN WALL-E  SE CLICKEA
document.getElementById("post-wall-e").onclick = function () {
  // Create an object with data to submit
  const characterInfo = {
    name: "WALL-E",
    occupation: "Waste Allocation Robot",
    weapon: "Head laser",
  };
  // Hace un  POST request
  axios
    .post("https://ih-crud-api.herokuapp.com/characters", characterInfo)
    .then((response) => {
      const { name, id } = response.data;
      //creamos el html que se metera en el div characters-list
      const newCharacterHtml = `
                 <li>
                   <h3> ${name} </h3>
                   <p> Id: ${id} </p>
                 </li>
               `;
      //lo metemos en el dom
      document.getElementById("characters-list").innerHTML += newCharacterHtml;
      console.log("post successfull and the response is: ", response);
    })
    .catch((error) => {
      console.log("Oh No! Error is: ", error);
    });
};

//CREAMOS UN FORM PARA AÑADIR DATOS PERSONALIZADOS Y HACER POST
//Recogemos los datos de los input
const theNames = document.getElementsByClassName("the-name");
const theOccupations = document.getElementsByClassName("the-occupation");
const theWeapons = document.getElementsByClassName("the-weapon");

document.getElementById("character-form").onsubmit = function (event) {
  //enviamos los datos del form pero primero ejecutamos el método preventDefault() para cortocircuitar la recarga de página
  event.preventDefault();
  //creamos el objeto con los datos de los input
  const characterInfo = {
    name: theNames[0].value,
    occupation: theOccupations[0].value,
    weapon: theWeapons[0].value,
  };

  //enviamos el objeto a la ruta
  axios
    .post("https://ih-crud-api.herokuapp.com/characters", characterInfo)
    .then((response) => {
      const { name, id } = response.data;
      //creamos el html que se metera en el div characters-list
      const newCharacterHtml = `
           <li>
             <h3> ${name} </h3>
             <p> Id: ${id} </p>
           </li>
           `;
      document.getElementById("characters-list").innerHTML += newCharacterHtml;
      // Limpiamos el formulario despues de enviar:
      document.getElementById("character-form").reset();
    })
    .catch((error) => {
      console.log("Error is: ", error);
    });
};

//------------------------------------------------------------------------------------------------------------
//PATCH / PUT

//Creamos un miniform para buscar por id y pedimos el objeto de esa id
document.getElementById("getButton").onclick = function (event) {
  //Cogemos el valor del input
  const theId = document.getElementById("theCharId").value;
  axios
    .get(`https://ih-crud-api.herokuapp.com/characters/${theId}`)
    .then((response) => {
      // Responde con el objeto con los datos completos de la id buscada

      // Esto oculta el form para crear un nuevo user cuando estamos actualizando uno
      document.getElementById("character-form").style.display = "none";
      document.getElementById("updateForm").style.display = "block";
      //Aquí precargamos los datos del id dentro del formulario
      theNames[1].value = response.data.name;
      theOccupations[1].value = response.data.occupation;
      theWeapons[1].value = response.data.weapon;
    })
    .catch((error) => {
      // En caso de error se muestra ese mensaje
      document.getElementById("updateForm").style.display = "none";
      if (error.response.status === 404) {
        const errorMessage = `There's no character with id: ${theId}. Try some other ID.`;
        const errDiv = document.createElement("div");
        errDiv.setAttribute("id", "error");
        errDiv.innerHTML = errorMessage;
        document.body.appendChild(errDiv);
      }
    });
};

//PETICIÓN PATCH
//Cuando hacemos click en enviar formulario  cogemos el id a modificar
document.getElementById("update-form").onsubmit = function (event) {
  //Cortocircuitamos la recarga de pagina
  event.preventDefault();
  //Cogemos el id a modificar
  const theId = document.getElementById("theCharId").value;
  //Creamos el objeto con los datos de los input modificados
  const updatedcharacterInfo = {
    name: theNames[1].value,
    occupation: theOccupations[1].value,
    weapon: theWeapons[1].value,
  };

  //Enviamos el objeto modificado apuntando al id que debe modificar
  axios
    .patch(`https://ih-crud-api.herokuapp.com/characters/${theId}`,updatedcharacterInfo)
    .then((response) => {
      console.log("update successful: ", response);
      //Volvemos a pintar los datos en la pantalla modificados con la respuesta del server
      document.getElementById("update-form").style.display = "none";
      const { name, id } = response.data;
      const updatedCharacterHtml = `
          <h2>Updated character with ID ${theId}: </h2>
          <li>
            <h3> ${name} </h3>
            <p> Id: ${id} </p>
          </li>
          `;
      document.getElementById("characters-list").innerHTML = "";
      document.getElementById("characters-list").innerHTML += updatedCharacterHtml;
    })
    .catch((error) => {
      console.log(error);
    });
};
//Esto solo cambia estilos
document.getElementById("add-char").onclick = function (event) {
  document.getElementById("character-form").style.display = "block";
};
//Esto solo cambia estilos
document.getElementById("update-char").onclick = function (event) {
  document.getElementById("update-form").style.display = "block";
};
