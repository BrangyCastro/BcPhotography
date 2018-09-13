// Obterner FECHA Y HORA ACTUAL
  var f = new Date();
  var meses = new Array ("en","febr","mzo","abr","my","jun","jul","ag",
  "sep","oct","nov","dic");
  var horaActual = f.getHours()+":"+f.getMinutes(); 
  var fechaActual = f.getDate() + "-" + (f.getMonth() +1) + "-" + f.getFullYear();

// Datos del Usuario

var nombre = "";
// Select DOM Items
const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
const menuNav = document.querySelector('.menu-nav');
const menuBranding = document.querySelector('.menu-branding');
const navItems = document.querySelectorAll('.nav-item');
const inicio = document.querySelector('#inicio');

// Set Initial State Of Menu
let showMenu = false;

$('.salirInicio').click(closeMenu);
$('.salirSobre').click(closeMenu);
$('.salirAlbum').click(closeMenu);
$('.salirContacto').click(closeMenu);

menuBtn.addEventListener('click', toggleMenu);

function toggleMenu() {
  if (!showMenu) {
    menuBtn.classList.add('close');
    menu.classList.add('show');
    menuNav.classList.add('show');
    menuBranding.classList.add('show');
    navItems.forEach(item => item.classList.add('show'));

    // Set Menu State
    showMenu = true;
  } else { 
    closeMenu();
    // Set Menu State
    showMenu = false;
  }
}

function closeMenu(){
  menuBtn.classList.remove('close');
    menu.classList.remove('show');
    menuNav.classList.remove('show');
    menuBranding.classList.remove('show');
    navItems.forEach(item => item.classList.remove('show'));
}

// Materialize
$(document).ready(function(){
    $('.modal').modal({
      inDuration: 300
    });
    $('.scrollspy').scrollSpy({
      scrollOffset: 0,
      activeClass: 'active'
    });
    $('.tabs').tabs();
    $('.materialboxed').materialbox();
    $('.fixed-action-btn').floatingActionButton();
    $(' textarea#mensaje ').characterCounter();
    $('.parallax').parallax();
});

  // Initialize Firebase
  var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: " ",
    messagingSenderId: " "
  };
  firebase.initializeApp(config);

  var db = firebase.firestore();
  var storage = firebase.storage();

  // CARGAR FUNCIONES DE INICIO
  $(document).ready(cargar);

  function cargar(){
    observador();
    cargarPortafolio();
  }

  //Ingreso de mensaje
//---------------------------------------
  function ingresarMensaje(){
      var nombre = $("#nombre").val();
      var correo = $("#email").val();
      var telefono = $("#telefono").val();
      var mensaje = $("#mensaje").val();

      if(nombre == "" || correo == "" || telefono == ""
            || mensaje == ""){
        M.toast({html: 'Porfavor ingrese todos los campos', classes: 'rounded red'});
      }else{
        db.collection("mensaje").add({
                nombre: nombre,
                correo: correo,
                telefono: telefono,
                mensaje: mensaje
            })
            .then(function(docRef){
                M.toast({html: 'Gracias por su comentario..!', classes: 'rounded light-green accent-4'});
                limpiarCampos();
            })
            .catch(function(error){
                console.error("Error adding document: ", error);
            });
      }
  }

  function limpiarCampos(){
    $("#nombre").val("");
    $("#email").val("");
    $("#telefono").val("");
    $("#mensaje").val("");
  }

  function valida(e){
    tecla = (document.all) ? e.keyCode : e.which;

    //Tecla de retroceso para borrar, siempre la permite
    if (tecla==8){
        return true;
    }
        
    // Patron de entrada, en este caso solo acepta numeros
    patron =/[0-9]/;
    tecla_final = String.fromCharCode(tecla);
    return patron.test(tecla_final);
}
//---------------------------------------

// INICIAR SESION CON GOOGLE
//---------------------------------------
function ingresoGoogle(){
  if(!firebase.auth().currentUser){
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().signInWithPopup(provider)
        .then(function(result){
            $('.modal').modal('close');
        })
        .catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            var errorEmail = error.email;
            var credential = error.credential;

            if(errorCode === 'auth/account-exists-with-different-credential'){
                alert("es el mismo usario");
            }
        });
  }else{
    firebase.auth().signOut();
  }
}
// INICIAR SESION CON FACEBOOK
//---------------------------------------
function ingresoFacebook(){
      if(!firebase.auth().currentUser){
        var provider = new firebase.auth.FacebookAuthProvider();
        provider.addScope('public_profile');
        firebase.auth().signInWithPopup(provider)
        .then(function(result){
          $('.modal').modal('close');
        })
        .catch(function(error){
          var errorCode = error.code;
          var errorMessage = error.message;
          var errorEmail = error.email;
          var credential = error.credential;

          if(errorCode === 'auth/account-exists-with-different-credential'){
              alert("es el mismo usario");
          }
        });
    }else{
       if(confirm("Desea cerrar..")){
          firebase.auth().signOut();
       }else{
           alert("aqui te quedas");
       }
        
    }
}
// OBSERVAR QUEIN ESTA CONECTADO
//---------------------------------------
function observador(){
  var sesion = document.getElementById('menu-branding');

    firebase.auth().onAuthStateChanged(function(user){
        sesion.innerHTML = "";
        $("#uid").val("");
        $("#perfil").val("");
      if(user){
        nombre = user.displayName;
        $('#login').hide();
        $("#uid").val(user.uid);
        $("#perfil").val(user.photoURL);
          sesion.innerHTML = `
                <div class="col s2 l12">
                    <img src="${user.photoURL}" alt="" class="portrait circle">
                </div>
                <div class="col s10 l12 black-text">
                    <h5 class="displayName">${user.displayName}</h5>
                    <h5 class="displayEmail">${user.email}</h5>
                </div>
                <div class="col s12 l12 black-text">
                    <button class="btn red" onclick="cerrarSesion()">
                        Cerrar
                    </button>
                </div>
          `
      }else{
        $('#login').show();
        sesion.innerHTML = `
          <div class="col l12 s2">
                    <img src="./img/icono1.png" alt="" class="portrait circle">
          </div>     
          `;
      }
    });
}

function cerrarSesion(){
  firebase.auth().signOut()
  .then(function(){
      console.log("saliendo.....");
      $("#login").removeClass("hide");
      $("#loginMenu").removeClass("hide");
  })
  .catch(function(error){
      console.log(error);
  });
}

function cargarPortafolio(){
  var lista = document.getElementById('listarAlbum');
  firebase.auth().onAuthStateChanged(function(user){
      lista.innerHTML = "";
      if(!user){         
              lista.innerHTML = `
                   <h4>Porfavor Iniciar sesion para ver el portafolio</h4>   
                   <a class="black-text waves-effect waves-light btn modal-trigger amber accent-4" href="#modal1"><i class="material-icons black-text left">person</i>Login</a>
              `
      }else{
            db.collection("portafolio").onSnapshot((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                  lista.innerHTML += `
                          <div class="col s12 m4">
                              <div class="card">
                              <div class="card-image">
                                  <img src="${doc.data().url}">
                                  <span class="card-title">${doc.id}</span>
                              </div>
                              <div class="card-action">
                                  <a onclick=listarFotos("${doc.id}")>Ver...</a>
                              </div>
                              </div>
                          </div>
                  `
              });
          });  
      }
  });
}

function listarFotos(ubicacion){
  var lista = document.getElementById('swiper-wrapper');
  $("#albumInicio").addClass("hide");
  $("#fotos").removeClass("hide");
  $("#flotante").removeClass("hide");
  lista.innerHTML = "";
  db.collection("portafolio").doc(ubicacion).collection(ubicacion).orderBy("fecha","desc").onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          lista.innerHTML += `
      <div class="swiper-slide">
             <div class="col s12 m12 l12">
                     <div class="card">
                           <div class="card-image">
                               <img src="${doc.data().url}" class="responsive-img" alt="${doc.data().nombre}">            
                           </div>
                           <div class="card-content">
                              <span class="card-title">${doc.data().nombre}
                              <a><i class="material-icons right black-text waves-effect waves-light modal-trigger" href="#modalComentario" 
                              onclick=listarComentarios("${doc.id}")>comment</i></a>                                            
                        </div>
                    </div>
                </div>
          </div>
          `
      });
  });    
}

var fotoId = "";

function listarComentarios(id){
    var listaComentario = document.getElementById('comments-list');
    fotoId = id; 
    db.collection("comentario").orderBy("fecha","desc").onSnapshot((querySnapshot) => {
            listaComentario.innerHTML = "";
            querySnapshot.forEach((doc) => {
              hora = fechaHoras(doc.data().hora,doc.data().fecha);
              if(doc.data().fid == id){
                listaComentario.innerHTML += `
                <li>
                    <div class="comment-main-level">
                      <!-- Avatar -->
                      <div class="comment-avatar"><img src="${doc.data().foto}" alt=""></div>
                      <!-- Contenedor del Comentario -->
                      <div class="comment-box">
                        <div class="comment-head">
                          <h6 class="comment-name text-amber">${doc.data().nombre}</h6>
                          <span>${hora}</span>
                        </div>
                        <div class="comment-content ">
                         ${doc.data().comentario}
                        </div>
                      </div>
                    </div>
                 </li>
                `
              }           
            });    
    });
}

function comentario(){
    var comentario = $("#textarea").val();
    var uid = $("#uid").val();
    var foto = $("#perfil").val();
    db.collection("comentario").add({
        comentario: comentario,
        fid: fotoId,
        foto: foto,
        uid: uid,
        hora: horaActual,
        fecha: fechaActual,
        nombre: nombre
    }).then(function(docRef){
        $("#textarea").val("");
      M.toast({html: 'Gracias por tu comentario..!', classes: 'rounded light-green accent-4'});
  })
  .catch(function(error){
      console.error("Error adding document: ", error);
  });
}

function regresar(){
    $("#albumInicio").removeClass("hide");
    $("#flotante").addClass("hide");
    $("#fotos").addClass("hide");
}

  var swiper = new Swiper('.swiper-container', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 40,
      stretch: 0,
      depth: 500,
      modifier: 5,
      slideShadows : true,
    },
    pagination: {
      el: '.swiper-pagination',
    }
  });

  function fechaHoras(horaInicio, fecha){
    var inicio = horaInicio;

     if(fecha != fechaActual){
       fechaComentario = fecha + " a las " + horaInicio;
       return(fechaComentario);
     }else{

        finMinutos = f.getMinutes();
        finHoras = f.getHours(); 

        inicioMinutos = parseInt(inicio.substr(3,2));
        inicioHoras = parseInt(inicio.substr(0,2));

        transcurridoMinutos = finMinutos - inicioMinutos;
        transcurridoHoras = finHoras - inicioHoras;

        if (transcurridoMinutos < 0) {
          transcurridoHoras--;
          transcurridoMinutos = 60 + transcurridoMinutos;
        }
        
        horas = transcurridoHoras.toString();
        minutos = transcurridoMinutos.toString();
        
        if (horas.length < 2) {
          horas = "0"+horas;
        }

        if (horas.length < 2) {
          horas = "0"+horas;
        }

        if(horas != 0){
            resultado = "hace " + horas + ":" + minutos + " horas";
            console.log(resultado);
            return(resultado);
        }else{
          resultado = "hace " + minutos + " minutos";
          return(resultado);
        }
     }


  }
  