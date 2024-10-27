const sql = require("better-sqlite3");
const db = sql("e-comerce.db");
const pkg = require("bcryptjs");
const { hash, compare } = pkg;
const uniqid = require("uniqid");
const { getCurrentDate } = require("../helpers/dateGenerator");
const { createJSONToken } = require("../util/auth");
const { isName, isPassword, isEmail } = require("../helpers/validate");
// require("../helpers/routeLock");
const { createAction, readAction } = require("../CRUD/actions");
let error = {};
const changeAccess = (isSIgnIn) => {
  allowAccess = true;
  setTimeout(() => {
    allowAccess = false;
  }, 5400000);
};
async function getUser(user) {
  const [userRet] = readAction("users", "email_address=?", [user.email]);
  if (user?.confUser) {
    return userRet;
  } else {
    if (!userRet) {
      error.message = "Could not find user";
      return error;
    } else {
      const isValid = await compare(user.password, userRet.password);
      if (isValid) {
        const authToken = createJSONToken(user.email_aditddress);
        userRet.token = authToken;
        return userRet;
      } else {
        error.message = "Wrong password";
        return error;
      }
    }
  }
}
async function newUser(user) {
  const conf = await getUser({
    email: user.email_address,
    password: user.password,
    confUser: "yes",
  });
  if (!conf) {
    const isOk = isDataOk(user);
    if (isOk) {
      return isOk;
    }
    user.password = await hash(user.password, 12);
    user.id = uniqid();
    user.created_at = getCurrentDate();
    changeAccess();
    createAction("users", user);
    const authToken = createJSONToken(user.email_address);
    user.token = authToken;
    return user;
  } else {
    error.message = "Email already registered";
    return error;
  }
}

function isDataOk(user) {
  if (
    user?.first_name &&
    user?.last_name &&
    !isName(user?.first_name + " " + user?.last_name)
  ) {
    error.message =
      "Name is not valid. Make sure to enter first and last name only";
    return error;
  } else if (user?.email_address && !isEmail(user?.email_address)) {
    error.message = "Email is not valid ";
    return error;
  } else if (user?.password && !isPassword(user?.password)) {
    error.message = "Password must contain at least eight characters";
    return error;
  } else {
    return false;
  }
}
exports.newUser = newUser;
exports.getUser = getUser;
exports.isDataOk = isDataOk;
