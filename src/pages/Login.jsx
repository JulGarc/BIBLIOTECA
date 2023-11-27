import { useState } from "react"
import { validarCorreo, validarPassword } from "../utils/validadores"
import {loguearUsuario} from '../firebase'
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'

export const Login = ({onLogin}) => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailValido, setEmailValido] = useState(false)
  const [passwordValida, setPasswordValida] = useState(false)
  const [cargando, setCargando] = useState(false)

  const onChangeEmail = (e) => {
    const value = e.target.value
    setEmailValido(validarCorreo(e.target, value))
    setEmail(value)
  }

  const onChangePassword = (e) => {
    const value = e.target.value
    setPasswordValida(validarPassword(e.target, value))
    setPassword(value)
  }

  const navigate = useNavigate()

  const onSubmit = async(e) => {
    e.preventDefault()
    if (emailValido && passwordValida) {
      setCargando(true)
      const respuesta = await loguearUsuario(email, password)
      setCargando(false)
      if (respuesta.success == true) {

        // GUARDA EL USUARIO EN LOCALSTORAGE
        onLogin(respuesta.usuario)


        Swal.fire({
          icon: 'success',
          title: 'Genial',
          text: respuesta.msg,
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
          navigate('/register', {
            replace: true
          })
        })
      } else {
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
              <h1 className="text-center">Iniciar sesión</h1>
            </div>
            {(cargando == false)
              ? <form className="col-12" onSubmit={onSubmit}>
              <div className="mb-3 col-12 mt-3">
                <label htmlFor="email">Correo electrónico</label>
                <input type="email" autoComplete="off" onChange={onChangeEmail} name="email" id="email" className="form-control" placeholder="Ingrese su correo electrónico"/>
                <div className="invalid-feedback">
                  Debes ingresar un correo electrónico válido
                </div>
              </div>
              <div className="mb-3 col-12">
                <label htmlFor="password">Contraseña</label>
                <input type="password" autoComplete="off" name="password" onChange={onChangePassword} id="password" className="form-control" placeholder="Ingrese su contraseña"/>
                <div className="invalid-feedback">
                  La contraseña debe tener más de 6 dígitos
                </div>
              </div>
              <button type="submit" className="col-12 btn btn-dark mt-3">Acceder</button>
              <button type="button" className="col-12 btn btn-info mt-3" onClick={() => {navigate('/register',{replace: true})}}>¿No tienes cuenta?</button>
            </form>
              : 
              <div className="col-12 d-flex justify-content-center mt-5">
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
