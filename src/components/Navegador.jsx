import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';

export const Navegador = ({usuario, onLogOut, isAdmin}) => {

  const navigate = useNavigate()

  const navegar = (ruta, replace) => {
    if (replace == true) {
      navigate(ruta, {
        replace: true
      })
    } else {
      navigate(ruta)
    }
  }
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>Biblioteca CUC</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">

          <Nav className="me-auto">
          {(!usuario) ? '' : <Nav.Link eventKey={1} onClick={(e) => {navegar('/libros', false)}}>Libros disponibles</Nav.Link>}
          {(!usuario) ? '' : <Nav.Link eventKey={2} onClick={(e) => {navegar('/prestamos', false)}}>Mis prestamos</Nav.Link>}
          {(isAdmin == true) ? <Nav.Link eventKey={5} onClick={(e) => {navegar('/administrador', false)}}>Panel Administrador</Nav.Link> : ''}
          </Nav>
          
          <Nav>
            {(!usuario) ? <Nav.Link eventKey={3} onClick={(e) => {navegar('/register', true)}}>Registrarse</Nav.Link> : ''}
            {(!usuario) ? <Nav.Link eventKey={4} onClick={(e) => {navegar('/login', true)}}>Iniciar sesión</Nav.Link> : ''}
            {(!usuario) ? '' : <Nav.Link eventKey={3} onClick={onLogOut}>Cerrar sesión</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
