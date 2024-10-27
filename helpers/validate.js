function isEmailValid(email) {
  let match = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.match(match)) {
    return true;
  } else {
    return false;
  }
}
function isNameValid(name) {
  let regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
  if (regName.test(name)) {
    return true;
  } else {
    return false;
  }
}
function isPasswordValid(password) {
  if (password.trim().length >= 8) {
    return true;
  } else {
    return false;
  }
}
function isCorret(exp, obj) {
  const values = Object.values(obj).map((val) => {
    if (val || val === 0 || val?.length > 2) {
      return true;
    } else {
      return false;
    }
  });
  if (values.length === exp && values.indexOf(false) === -1) {
    return true;
  } else {
    return false;
  }
}
exports.isName = isNameValid;
exports.isPassword = isPasswordValid;
exports.isEmail = isEmailValid;
exports.isCorret = isCorret;
