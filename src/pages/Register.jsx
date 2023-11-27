import { useState } from "react"
import { validarCorreo, validarPassword, validarNoNumeros } from "../utils/validadores"
import {crearNuevoUsuario} from "../firebase"
import Swal from 'sweetalert2'
import {Navigate, useNavigate} from 'react-router-dom'

export const Register = ({onLogin}) => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nombres, setNombres] = useState("")
  const [apellidos, setApellidos] = useState("")
  const [emailValido, setEmailValido] = useState(false)
  const [passwordValida, setPasswordValida] = useState(false)
  const [nombresValidos, setNombresValidos] = useState(false)
  const [apellidosValidos, setApellidosValidos] = useState(false)
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  const onChangeEmail = (e) => {
    const value = e.target.value
    setEmailValido(validarCorreo(e.target, value))
    setEmail(value.toLowerCase())
  }

  const onChangePassword = (e) => {
    const value = e.target.value
    setPasswordValida(validarPassword(e.target, value))
    setPassword(value)
  }

  const onChangeNombres = (e) => {
    const value = e.target.value
    setNombresValidos(validarNoNumeros(e.target, value))
    setNombres(value.toUpperCase())
  }

  const onChangeApellidos = (e) => {
    const value = e.target.value
    setApellidosValidos(validarNoNumeros(e.target, value))
    setApellidos(value.toUpperCase())
  }

  const onSubmit = async(e) => {
    e.preventDefault()
    if (emailValido && passwordValida && nombresValidos && apellidosValidos) {
      setCargando(true)
      const respuesta = await crearNuevoUsuario(email, password, nombres, apellidos)
      setCargando(false)
      if (respuesta.success == true) {

        // GUARDA EL USUARIO EN LOCALSTORAGE
        onLogin(respuesta.usuario)


        Swal.fire({
          icon: 'success',
          title: 'Genial',
          text: 'Usuario registrado correctamente!',
          confirmButtonText: 'Aceptar',
          timer: 1200,
          didRender: () => {
            const confirmButton = Swal.getConfirmButton();
            confirmButton.classList.remove('swal2-confirm');
          },
          customClass: {
            confirmButton: 'btn btn-primary'
          }
          // LUEGO DEL MENSAJE SE REDIRECCIONA
        }).then((response) => {
          navigate('/login', {
            replace: true
          })
        })
      } else {
        console.log(respuesta);
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
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El formulario tiene algunos errores',
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

  return (
    <>
      <div className="container mt-5 d-flex justify-content-center align-items-center flex-column">
        <div className="col-12 col-lg-6 mt-5">
          <div className="row">
            <div className="col-12">
              <h1 className="text-center">Registrarse</h1>
            </div>
            {(cargando == false)
              ? <form className="col-12" onSubmit={onSubmit}>
              <div className="mb-3 col-12 mt-3">
                <label htmlFor="email">Correo electrónico</label>
                <input type="email" autoComplete="off" value={email} onChange={onChangeEmail} name="email" id="email" className="form-control" placeholder="Ingrese su correo electrónico"/>
                <div className="invalid-feedback">
                  Debes ingresar un correo electrónico válido
                </div>
              </div>
              <div className="mb-3 col-12">
                <label htmlFor="password">Contraseña</label>
                <input type="password" autoComplete="off" value={password} name="password" onChange={onChangePassword} id="password" className="form-control" placeholder="Ingrese su contraseña"/>
                <div className="invalid-feedback">
                  La contraseña debe tener más de 6 dígitos
                </div>
              </div>
              <div className="mb-3 col-12">
                <label htmlFor="nombres">Nombres</label>
                <input type="text" autoComplete="off" value={nombres} name="nombres" onChange={onChangeNombres} id="nombres" className="form-control" placeholder="Ingrese sus nombres"/>
                <div className="invalid-feedback">
                  debes ingresar unos nombres válidos
                </div>
              </div>
              <div className="mb-3 col-12">
                <label htmlFor="apellidos">Apellidos</label>
                <input type="text" autoComplete="off" name="apellidos" value={apellidos} onChange={onChangeApellidos} id="apellidos" className="form-control" placeholder="Ingrese sus apellidos"/>
                <div className="invalid-feedback">
                  debes ingresar unos apellidos válidos
                </div>
              </div>
              <button type="submit" className="col-12 btn btn-dark mt-3">Registrarse</button>
              <button type="button" className="col-12 btn btn-info mt-3" onClick={() => {navigate('/login',{replace: true})}}>¿Ya tienes una cuenta?</button>
            </form>

            : <div className="col-12 d-flex justify-content-center mt-5">
                <div className="spinner-border text-info" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
            </div>
            }
            
          </div>
        </div>
      </div>
    </>
  )
}
