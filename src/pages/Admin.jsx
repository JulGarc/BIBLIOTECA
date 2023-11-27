import { GrFormAdd } from "react-icons/gr";
import { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { validarVacio, validarNoNumeros } from "../utils/validadores";
import { BiPencil, BiTrash } from "react-icons/bi"
import Swal from "sweetalert2";
import {
  agregarLibro,
  cargarLibros,
  actualizarLibro,
  eliminarLibro,
} from "../firebase";

export const Admin = ({ usuario, onLogin, isAdmin}) => {
  const ref = useRef();
  const [show, setShow] = useState(false);

  const handleClose = () => {
    limpiarFormulario();
    setShow(false);
    setSave(true)
  };

  const handleShow = () => setShow(true);
  const [titulo, setTitulo] = useState("");
  const [tituloValido, setTituloValido] = useState(false);
  const [descripción, setDescripcion] = useState("");
  const [descripcionValida, setDescripcionValida] = useState(false);
  const [autor, setAutor] = useState("");
  const [autorValido, setAutorValido] = useState(false);
  const [year, setYear] = useState("");
  const [yearValido, setYearValido] = useState(false);
  const [portada, setPortada] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const [idLibro, setIdLibro] = useState("");

  const onChangeTitulo = (e) => {
    const value = e.target.value;
    setTituloValido(validarVacio(e.target, value));
    setTitulo(value);
  };

  const onChangeDescripcion = (e) => {
    const value = e.target.value;
    setDescripcionValida(validarVacio(e.target, value));
    setDescripcion(value);
  };

  const onChangeAutor = (e) => {
    const value = e.target.value;
    setAutorValido(validarNoNumeros(e.target, value));
    setAutor(value);
  };

  const onChangeYear = (e) => {
    const value = e.target.value;
    setYearValido(validarVacio(e.target, value));
    setYear(value);
  };

  const onChangePortada = (e) => {
    const file = e.target.files[0];
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "La portada debe pesar menos de 5Mb",
        confirmButtonText: "Aceptar",
        didRender: () => {
          const confirmButton = Swal.getConfirmButton();
          confirmButton.classList.remove("swal2-confirm");
        },
        customClass: {
          confirmButton: "btn btn-primary",
        },
      });
      e.target.value = "";
    } else if (!allowedImageTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "La portada debe ser una imagen",
        confirmButtonText: "Aceptar",
        didRender: () => {
          const confirmButton = Swal.getConfirmButton();
          confirmButton.classList.remove("swal2-confirm");
        },
        customClass: {
          confirmButton: "btn btn-primary",
        },
      });
      e.target.value = "";
    } else {
      setPortada(file);
    }
  };

  const limpiarFormulario = () => {
    setTitulo("");
    setAutorValido(false);
    setDescripcion("");
    setDescripcionValida(false);
    setAutor("");
    setDescripcionValida(false);
    setYear("");
    setYearValido(false);
    setSave(true);
  };

  const eliminarLib = async (idLibro) => {
    const respuesta = await eliminarLibro(idLibro);

    const respuestaSwal = await Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro que desea eliminar este libro?',
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
          handleClose();
          cargarDatos();
          
        })
      } else {
        cargarDatos();
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





  const onSubmit = async (e) => {
    e.preventDefault();

    if (save) {
      console.log("guardar");
      if (
        tituloValido &&
        descripcionValida &&
        autorValido &&
        yearValido &&
        portada
      ) {
        setSubiendo(true);
        const respuesta = await agregarLibro(
          titulo,
          descripción,
          autor,
          year,
          portada
        );
        setSubiendo(false);

        if (respuesta.success == true) {
          Swal.fire({
            icon: "success",
            title: "Genial!",
            text: respuesta.msg,
            confirmButtonText: "Aceptar",
            didRender: () => {
              const confirmButton = Swal.getConfirmButton();
              confirmButton.classList.remove("swal2-confirm");
            },
            customClass: {
              confirmButton: "btn btn-primary",
            },
          }).then((respuesta) => {
            handleClose();
            cargarDatos();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: respuesta.msg,
            confirmButtonText: "Aceptar",
            didRender: () => {
              const confirmButton = Swal.getConfirmButton();
              confirmButton.classList.remove("swal2-confirm");
            },
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "El formulario tiene algunos errores",
          confirmButtonText: "Aceptar",
          didRender: () => {
            const confirmButton = Swal.getConfirmButton();
            confirmButton.classList.remove("swal2-confirm");
          },
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      }
    } else {
      console.log("actualizar");
      if (tituloValido && descripcionValida && autorValido && yearValido) {
        setSubiendo(true);
        const respuesta = await actualizarLibro(
          idLibro,
          titulo,
          descripción,
          autor,
          year,
          portada
        );
        setSubiendo(false);

        if (respuesta.success == true) {
          Swal.fire({
            icon: "success",
            title: "Genial!",
            text: respuesta.msg,
            confirmButtonText: "Aceptar",
            didRender: () => {
              const confirmButton = Swal.getConfirmButton();
              confirmButton.classList.remove("swal2-confirm");
            },
            customClass: {
              confirmButton: "btn btn-primary",
            },
          }).then((respuesta) => {
            handleClose();
            cargarDatos();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: respuesta.msg,
            confirmButtonText: "Aceptar",
            didRender: () => {
              const confirmButton = Swal.getConfirmButton();
              confirmButton.classList.remove("swal2-confirm");
            },
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "El formulario tiene algunos errores",
          confirmButtonText: "Aceptar",
          didRender: () => {
            const confirmButton = Swal.getConfirmButton();
            confirmButton.classList.remove("swal2-confirm");
          },
          customClass: {
            confirmButton: "btn btn-primary",
          },
        });
      }
    }
  };

  const [save, setSave] = useState(true);

  const [cargandoLibros, setCargandoLibros] = useState(false);
  const [libros, setLibros] = useState([]);
  useEffect(() => {
    cargarDatos();
    setSave(true);
  }, []);

  const cargarDatos = async () => {
    setCargandoLibros(true);
    const respuesta = await cargarLibros();
    setLibros(respuesta);
    setCargandoLibros(false);
  };

  const editarLibro = async (idLibro, titulo, autor, año, desc) => {
    setIdLibro(idLibro);
    setAutor(autor);
    setTitulo(titulo);
    setYear(año);
    setDescripcion(desc);
    setSave(false);
    handleShow();
    setAutorValido(true);
    setTituloValido(true);
    setYearValido(true);
    setDescripcionValida(true);
    setYearValido(true);
  };

  return (
    <>
      <div className="container-fluid mt-4">
        <h2 className="text-center">Panel Administrador</h2>

        {cargandoLibros == false ? (
          <div className="row-lg mt-5">
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr className="text-center">
                    <th scope="col">Titulo</th>
                    <th scope="col">Autor</th>
                    <th scope="col">Año</th>
                    <th scope="col">Descripcion</th>
                    <th scope="col">Portada</th>
                    <th scope="col">Disponibilidad</th>
                    <th scope="col">Editar</th>
                    <th scope="col">Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {libros.map((libro, index) => (
                    <tr className="text-center" key={index}>
                      <td>{libro.Titulo}</td>
                      <td>{libro.Autor}</td>
                      <td>{libro.Año}</td>
                      <td>{libro.Descripcion}</td>
                      <td>
                        {" "}
                        <img
                          style={{ width: "100px", minHeight: "150px" }}
                          src={libro.Portada}
                          alt="Error al cargar la portada"
                        />
                      </td>
                      <td>
                        {libro.Disponibilidad ? "Disponible" : "No disponible"}
                      </td>

                      <td>
                        <Button
                          variant="success"
                          className="d-flex justify-content-center align-items-center mx-auto"
                          onClick={() =>
                            editarLibro(
                              libro.UUID,
                              libro.Titulo,
                              libro.Autor,
                              libro.Año,
                              libro.Descripcion,
                              libro.Disponibilidad
                            )
                          }
                        >
                          <BiPencil size={20}/>
                        </Button>
                      </td>

                      <td>
                        <Button
                          variant="danger"
                          className="d-flex justify-content-center align-items-center mx-auto"
                          onClick={() => eliminarLib(libro.UUID)}
                        >
                          <BiTrash size={20}/>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="col-12 d-flex justify-content-center mt-5">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{save ? "Agregar libro" : "Editar libro"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {subiendo == false ? (
              <form onSubmit={onSubmit}>
                <div className="mb-3 col-12 mt-3">
                  <input
                    style={{ display: "none" }}
                    disabled
                    type="text"
                    name="idLibro"
                    id="idLibro"
                  />

                  <label htmlFor="titulo">Título</label>
                  <input
                    type="text"
                    onChange={onChangeTitulo}
                    value={titulo}
                    name="titulo"
                    id="titulo"
                    className="form-control"
                    placeholder="Ingrese el título del libro"
                  />
                  <div className="invalid-feedback">
                    Debes ingresar un título válido
                  </div>
                </div>

                <div className="mb-3 col-12 mt-3">
                  <label htmlFor="descripcion">Descripción</label>
                  <input
                    type="text"
                    onChange={onChangeDescripcion}
                    value={descripción}
                    name="descripcion"
                    id="descripcion"
                    className="form-control"
                    placeholder="Ingrese la descripcion del libro"
                  />
                  <div className="invalid-feedback">
                    Debes ingresar una descripción válida
                  </div>
                </div>

                <div className="mb-3 col-12 mt-3">
                  <label htmlFor="titulo">Autor</label>
                  <input
                    type="text"
                    onChange={onChangeAutor}
                    value={autor}
                    name="autor"
                    id="autor"
                    className="form-control"
                    placeholder="Ingrese el Autor del libro"
                  />
                  <div className="invalid-feedback">
                    Debes ingresar un autor válido
                  </div>
                </div>

                <div className="mb-3 col-12 mt-3">
                  <label htmlFor="titulo">Año de publicación</label>
                  <input
                    type="text"
                    onChange={onChangeYear}
                    value={year}
                    name="year"
                    id="year"
                    className="form-control"
                    placeholder="Ingrese el Año de publicación del libro"
                  />
                  <div className="invalid-feedback">
                    Debes ingresar un año de publicación válido
                  </div>
                </div>

                <div className="mb-3 col-12 mt-3">
                  <label htmlFor="titulo">Portada del libro</label>
                  <input
                    type="file"
                    className="form-control"
                    name="portada"
                    id="portada"
                    onChange={onChangePortada}
                  />
                </div>

                <button type="submit" className="d-none" ref={ref}></button>
              </form>
            ) : (
              <>
                <div className="col-12 d-flex justify-content-center my-5">
                  <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <>
              {subiendo == false ? (
                <>
                  <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      ref.current.click();
                    }}
                  >
                    {save ? "Agregar" : "Actualizar"}
                  </Button>
                </>
              ) : (
                ""
              )}
            </>
          </Modal.Footer>
        </Modal>

        {isAdmin ? (
          <div className="agregar-libro" onClick={handleShow}>
            <GrFormAdd size={30} />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};
