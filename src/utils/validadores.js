const validarVacio = (target, value) => {
    if (value == '') {
      target.classList.add('is-invalid')
      target.classList.remove('is-valid')
      return false

    } else {
      target.classList.remove('is-invalid')
      target.classList.add('is-valid')
      return true
    }
}

const validarNoNumeros = (target, value) => {
  const newValue = value.replace(/\d/g, ''); // Reemplazar números por ""

  if (newValue === '') {
    target.classList.add('is-invalid');
    target.classList.remove('is-valid');
    return false;
  } else {
    target.value = newValue.toUpperCase(); // Convertir a mayúsculas
    target.classList.remove('is-invalid');
    target.classList.add('is-valid');
    return true;
  }
};

const validarCorreo = (target, value) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar el correo electrónico
  if (value == '') {
    target.classList.add('is-invalid');
    target.classList.remove('is-valid');
    return false
  } else if (!regex.test(value)) {
    target.classList.add('is-invalid');
    target.classList.remove('is-valid');
    return false
  } else {
    target.classList.remove('is-invalid');
    target.classList.add('is-valid');
    return true
  }

}

const validarPassword = (target, value) => {
  if (value.length < 6) {
    target.classList.add('is-invalid')
    target.classList.remove('is-valid')
    return false
  } else {
    target.classList.remove('is-invalid')
    target.classList.add('is-valid')
    return true
  }
}



export {validarVacio, validarCorreo, validarPassword, validarNoNumeros}
