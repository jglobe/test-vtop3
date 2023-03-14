const signInForm = document.getElementById('signInForm')

signInForm.addEventListener('submit', event => {
  event.preventDefault();

  const formData = new FormData(signInForm);
  const validated = validateSignIn(formData);
  validated.success ? sendData(signInForm, formData) : returnErrors(signInForm, validated.errors);

});

function validateSignIn(formData) {
  let result = {success: true, errors: []};

  const NAMES = {
    FIRST_NAME: 'firstName',
    LAST_NAME: 'lastName',
    NATIONALITY: 'nationality',
    EMAIL: 'email',
    BD_DAY: 'day',
    BD_MONTH: 'month',
    BD_YEAR: 'year',
    GENDER: 'gender',
    PASSWORD: 'password',
    CONFIRM_PASSWORD: 'confirmPassword',
  }

  const VALUES = {
    FIRST_NAME: formData.get(NAMES.FIRST_NAME),
    LAST_NAME: formData.get(NAMES.LAST_NAME),
    NATIONALITY: formData.get(NAMES.NATIONALITY),
    EMAIL: formData.get(NAMES.EMAIL),
    BD_DAY: formData.get(NAMES.BD_DAY),
    BD_MONTH: formData.get(NAMES.BD_MONTH),
    BD_YEAR: formData.get(NAMES.BD_YEAR),
    GENDER: formData.get(NAMES.GENDER),
    PASSWORD: formData.get(NAMES.PASSWORD),
    CONFIRM_PASSWORD: formData.get(NAMES.CONFIRM_PASSWORD),
  }

  if(VALUES.FIRST_NAME) {
    let message;
    let hasError = false
    if(VALUES.FIRST_NAME.length < 4) {
      message = 'need more than 4 char'
      result.success = false;
      hasError = true;
    }
    hasError ? result.errors.push({ name:NAMES.FIRST_NAME, message }): null;

  } else {
    let message = 'can\'t be empty';
    result.errors.push({ name:NAMES.FIRST_NAME, message });
    result.success = false;
  }

  if(VALUES.LAST_NAME) {
    let message;
    let hasError = false
    if(VALUES.LAST_NAME.length < 4) {
      message = 'need more than 4 char'
      result.success = false;
      hasError = true;
    }
    hasError ? result.errors.push({ name:NAMES.LAST_NAME, message }): null;
  } else {
    let message = 'can\'t be empty';
    result.errors.push({ name:NAMES.LAST_NAME, message });
    result.success = false;
  }

  if(VALUES.EMAIL) {
    let message;
    let hasError = false;
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!VALUES.EMAIL.match(mailformat)) {
      message = 'example@mail.com'
      result.success = false;
      hasError = true;
    }
    hasError ? result.errors.push({ name:NAMES.EMAIL, message }): null;

  } else {
    let message = 'can\'t be empty';
    result.errors.push({ name:NAMES.EMAIL, message });
    result.success = false;
  }

  if(VALUES.PASSWORD) {
    let message;
    let hasError = false;
    const regex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/);
    if(VALUES.PASSWORD.length < 8) {
      message = 'needs 8 and more symbols'
      result.success = false;
      hasError = true;
    } else if (!regex.test(VALUES.PASSWORD)){
      message = 'uppercase, lowercase & number'
      result.success = false;
      hasError = true;
    }
    hasError ? result.errors.push({ name:NAMES.PASSWORD, message }): null;
  } else {
    let message = 'can\'t be empty';
    result.errors.push({ name:NAMES.PASSWORD, message });
    result.success = false;
  }

  if(VALUES.CONFIRM_PASSWORD) {
    let message;
    let hasError = false
    if(VALUES.CONFIRM_PASSWORD !== VALUES.PASSWORD) {
      message = 'passwords not equal'
      result.success = false;
      hasError = true;
    }
    hasError ? result.errors.push({ name:NAMES.CONFIRM_PASSWORD, message }): null;
  } else {
    let message = 'can\'t be empty';
    result.errors.push({ name:NAMES.CONFIRM_PASSWORD, message });
    result.success = false;
  }
  return result
}

function sendData(form, formData) {
  const xhr = new XMLHttpRequest();
  xhr.open('get', '/scripts/server-ok.json');
  xhr.onload = () => {
    if (xhr.status !== 200) {
      console.error(`Error! status:${xhr.status}, message:'${xhr.statusText}'`);
      return;
    }
    showResult(form, xhr.response);
  };

  xhr.send();
}

function showResult(form, result) {
  const data = JSON.parse(result);
  form.remove()
  document.getElementById('signInSubmit').remove();
  document.getElementById('signInInfo').classList.add('info_error');
  document.getElementById('signInQuestion').innerHTML = data.message;
  document.getElementById('signInDescription').innerHTML = data.description;
}

function returnErrors(form, errors) {
  form.querySelectorAll('.input__input').forEach((e) => {
    e.classList.remove('input__input_error');
    e.nextSibling.nextSibling.innerHTML = ''
  })

  for (let {name, message} of errors) {
    document.getElementsByName(name).forEach((e) => {
      e.classList.add('input__input_error');
      e.nextSibling.nextSibling.innerHTML = message
    })
  }

  const button = document.querySelector('.action_submit');
  button.classList.add('action_submit_shake');
  setTimeout(() => {
    button.classList.remove('action_submit_shake');
  }, 1000);
}