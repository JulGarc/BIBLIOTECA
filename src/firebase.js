import firebase from "firebase/app";
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/firestore'
import {v4 as uuidv4} from 'uuid'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCq_Wko4WFU4VUm0vZwnGSY8asL-m1PGs",
  authDomain: "bibliotecacuc-e9606.firebaseapp.com",
  projectId: "bibliotecacuc-e9606",
  storageBucket: "bibliotecacuc-e9606.appspot.com",
  messagingSenderId: "413010052897",
  appId: "1:413010052897:web:24cdbc836ea7a9e3786060"
};

// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);
const auth = fire.auth()
const database = fire.firestore()
const storage = fire.storage()
const ref = storage.ref()

const crearNuevoUsuario = async (email, password, nombres, apellidos) => {
  try {
    const credencial = await auth.createUserWithEmailAndPassword(email, password)
    // Signed in
    const usuario = credencial.user;

    await database.collection(`usuarios`).doc(usuario.uid).set({
      "Email": usuario.email,
      "UID": usuario.uid,
      "Nombres": nombres,
      "Apellidos": apellidos,
      "LibrosPrestados": []
    })

    return {
      "success": true,
      "msg": "Usuario creado correctamente!",
      "usuario": {
        "Email": usuario.email,
        "UID": usuario.uid,
        "Nombres": nombres,
        "Apellidos": apellidos,
        "LibrosPrestados": []
      }
    }

  } catch (error) {
    console.error({
      "errorCode": error.code,
      "errorMessage": error.message
    });
    return {
      "success": false,
      "msg": error.message,
    }
  }
}

const loguearUsuario = async(email, password) => {
  try {
    const credencial = await auth.signInWithEmailAndPassword(email, password)

    const usuario = credencial.user

    const query = await database.collection('usuarios').where('UID', '==', usuario.uid).get()

    let data

    query.forEach((doc)=> {
      data = doc.data()
    })

    return {
      "success": true,
      "msg": `BIENVENIDO ${data.Nombres} ${data.Apellidos}`,
      "usuario": data
    }

  } catch (error) {
    console.error({
      "errorCode": error.code,
      "errorMessage": error.message
    });
    return {
      "success": false,
      "msg": error.message,
    }
  }
}

const agregarLibro = async (titulo, descripcion, autor, year, portada) => {
  try {
    const UUID = uuidv4()
    var mountainsRef = ref.child(UUID);
    const snapshot = await mountainsRef.put(portada)
    // Obtener el enlace de descarga del archivo cargado
    const url = await snapshot.ref.getDownloadURL();

    await database.collection('libros').doc(UUID).set({
      "Titulo": titulo,
      "Descripcion": descripcion,
      "Autor": autor,
      "Año": year,
      "Disponibilidad": true,
      "Portada": url,
      "UUID": UUID
    })
    return {
      "success": true,
      "msg": "Libro creado correctamente"
    }
  } catch (error) {
    console.error({
      "errorCode": error.code,
      "errorMessage": error.message
    });
    return {
      "success": false,
      "msg": error.message,
    }
  }
}

const cargarLibros = async() => {
  try {
    const query = await database.collection('libros').where('Titulo', '!=', '').get()
    let libros = []
    query.forEach((doc) => {
      libros = [...libros, doc.data()]
    })

    return libros

  } catch (error) {
    console.error({
      "errorCode": error.code,
      "errorMessage": error.message
    });
    return {
      "success": false,
      "msg": error.message,
    }
  }
}

const reservarLibro = async(usuarioUID, libroUUID) => {
  
  try {
      const libroRef = database.collection('libros').doc(libroUUID);
      const libroDoc = await libroRef.get();
      let libro = libroDoc.data();
  
      if (!libro.Disponibilidad) {
        return {
          "success": false,
          "msg": "El libro no está disponible"
        };
      }
  
      const usuarioRef = database.collection('usuarios').doc(usuarioUID);
      const usuarioDoc = await usuarioRef.get();
      let usuario = usuarioDoc.data();
  
      await libroRef.update({ "Disponibilidad": false });
      const libroDoc2 = await libroRef.get();
      libro = libroDoc2.data();

      await usuarioRef.update({ "LibrosPrestados": [...usuario.LibrosPrestados, libro] });
    
      const usuarioDoc2 = await usuarioRef.get();
      usuario = usuarioDoc2.data();

      return {
        "success": true,
        "msg": "Libro prestado correctamente",
        "usuario": usuario
      };


  } catch (error) {
    console.error({
      "errorCode": error.code,
      "errorMessage": error.message
    });
    return {
      "success": false,
      "msg": error.message
    };
  }
}

const cargarPrestamos = async(UID) => {
  try {
    const query = await database.collection('usuarios').doc(UID).get()
    const usuario = query.data()

    return usuario.LibrosPrestados

  } catch (error) {
    console.error({
      "errorCode": error.code,
      "errorMessage": error.message
    });
    return {
      "success": false,
      "msg": error.message,
    }
  }
}

const devolverLibro = async(usuarioUID, libroUUID) => {
  
  try {
      const libroRef = database.collection('libros').doc(libroUUID);
      const libroDoc = await libroRef.get();
      let libro = libroDoc.data();
  
      if (libro.Disponibilidad) {
        return {
          "success": false,
          "msg": "El libro ya fue devuelto"
        };
      }
  
      const usuarioRef = database.collection('usuarios').doc(usuarioUID);
      const usuarioDoc = await usuarioRef.get();
      let usuario = usuarioDoc.data();
  
      await libroRef.update({ "Disponibilidad": true });
      const libroDoc2 = await libroRef.get();
      libro = libroDoc2.data();

      const librosEnPrestamo = usuario.LibrosPrestados.filter((libro) => (libro.UUID != libroUUID)) 
      
      await usuarioRef.update({ "LibrosPrestados": librosEnPrestamo});
    
      const usuarioDoc2 = await usuarioRef.get();
      usuario = usuarioDoc2.data();

      return {
        "success": true,
        "msg": "Libro devuelto correctamente",
        "usuario": usuario
      };


  } catch (error) {
    console.error({
      "errorCode": error.code,
      "errorMessage": error.message
    });
    return {
      "success": false,
      "msg": error.message
    };
  }
}

const actualizarLibro = async (UUID,titulo, descripcion, autor, year, portada) => {
  try {

    if(portada != null){
      var mountainsRef = ref.child(UUID);
      const snapshot = await mountainsRef.put(portada)
      // Obtener el enlace de descarga del archivo cargado
      const url = await snapshot.ref.getDownloadURL();

      await database.collection('libros').doc(UUID).update({
        "Titulo": titulo,
        "Descripcion": descripcion,
        "Autor": autor,
        "Año": year,
        "Disponibilidad": true,
        "Portada": url,
      })
    }else{
        await database.collection('libros').doc(UUID).update({
          "Titulo": titulo,
          "Descripcion": descripcion,
          "Autor": autor,
          "Año": year,
          "Disponibilidad": true
        })
    }

    


    return {
      "success": true,
      "msg": "Libro actualizado correctamente"
    }
  } catch (error) {
    console.error({
      "errorCode": error.code,
      "errorMessage": error.message
    });
    return {
      "success": false,
      "msg": error.message,
    }
  }
}

const eliminarLibro = async (UUID) => {
  try {
    const refImg = ref.child(UUID);
    await refImg.delete()

    await database.collection('libros').doc(UUID).delete();

    return {
      "success": true,
      "msg": "Libro eliminado correctamente"
    }
  } catch (error) {
    console.error({
      "errorCode": error.code,
      "errorMessage": error.message
    });
    return {
      "success": false,
      "msg": error.message,
    }
  }
}

export {fire, auth, crearNuevoUsuario, loguearUsuario, agregarLibro, cargarLibros, reservarLibro, cargarPrestamos, devolverLibro, actualizarLibro, eliminarLibro}