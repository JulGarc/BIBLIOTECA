
import {GrFormAdd} from 'react-icons/gr'
import { useState, useRef, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { validarVacio, validarNoNumeros } from '../utils/validadores'
import Swal from 'sweetalert2'
import { agregarLibro, cargarLibros, reservarLibro } from '../firebase'


export const Libros = ({usuario, onLogin}) => {
  
  const [libros, setLibros] = useState([])
  const [cargandoLibros, setCargandoLibros] = useState(false)

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargandoLibros(true)
    const respuesta = await cargarLibros();
    setLibros(respuesta)
    setCargandoLibros(false)
  };


  const onPrestarLibro = async(UUID) => {
    const respuestaSwal = await Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro que desea reservar este libro?',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      didRender: () => {
        const confirmButton = Swal.getConfirmButton();
        confirmButton.classList.remove('swal2-confirm');
        const cancelButton = Swal.getCancelButton();
        cancelButton.classList.remove('swal2-cancel');
      },
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger'
      }
    })
    if (respuestaSwal.isConfirmed){
      setCargandoLibros(true)
      const respuesta = await reservarLibro(usuario.UID, UUID)

      if (respuesta.success == true) {
        Swal.fire({
          icon: 'success',
          title: 'Genial!',
          text: respuesta.msg,
          confirmButtonText: 'Aceptar',
          didRender: () => {
            const confirmButton = Swal.getConfirmButton();
            confirmButton.classList.remove('swal2-confirm');
          },
          customClass: {
            confirmButton: 'btn btn-primary'
          }
        }).then((res) => {
          cargarDatos()
          onLogin(respuesta.usuario)
          
        })
      } else {
        setCargandoLibros(false)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: respuesta.msg,
          confirmButtonText: 'Aceptar',
          didRender: () => {
            const confirmButton = Swal.getConfirmButton();
            confirmButton.classList.remove('swal2-confirm');
          },
          customClass: {
            confirmButton: 'btn btn-primary'
          }
        })
      }
    }
  }


  return (
    <>
      <div className="container-fluid mt-4">
    <h2 className="text-center">Libros disponibles</h2>
      {(cargandoLibros == false)
        ?
        <div className="col-12 mt-3 d-flex flex-wrap gap-2 px-2 justify-content-center">

        {libros.map((libro, index) => {
          return (
            <div className="col-12 col-md-4 col-lg-3 col-xxl-2 my-2" key={index}>
              <div className="card w-100">
                <img src={libro.Portada} className="card-img-top" alt="Portada" style={{ height: "200px", objectFit: "cover" }} />
                <div className="card-body">
                  <h5 className="card-title" style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: 'nowrap'}}>{libro.Titulo}</h5>
                  <p className="card-text" style={{ maxHeight: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: 'nowrap' }}>{libro.Descripcion}</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item" style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: 'nowrap'}}><b>Autor: </b>{libro.Autor}</li>
                  <li className="list-group-item" style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: 'nowrap'}}><b>Año: </b>{libro.Año}</li>
                  <li className="list-group-item" style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: 'nowrap'}}><b>Disponible: </b>{(libro.Disponibilidad) ? 'SI' : 'NO'}</li>
                </ul>
                {(libro.Disponibilidad)
                  ?
                  <div className="card-body bg-dark prestamo" onClick={(e) => {onPrestarLibro(libro.UUID)}} >
                  <div className="d-flex col-12 justify-content-center align-items-center text-white">
                    SOLICITAR PRESTAMO
                  </div>
                </div>

                : 
                <div className="card-body bg-danger">
                <div className="d-flex col-12 justify-content-center align-items-center text-white">
                  AGOTADO
                </div>
              </div>
                }
              </div>
            </div>
          )
        })}

      </div>
      :
      <div className="col-12 d-flex justify-content-center mt-5">
      <div className="spinner-border text-info" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
      }
      
    </div>
   
    </>
  )
}
