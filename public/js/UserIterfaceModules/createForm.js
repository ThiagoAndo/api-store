import { handleHTTP } from "/js/UserIterfaceModules/HTTP.js";
import { cart } from "/js/UserIterfaceModules/variables.js";
let url = null;
let form = null;
export async function createForm(id, inp, btnText, hasUrl = false) {
  form = document.querySelector("#" + id);
  url = hasUrl;
  let content = null;
  content = `
       ${inp
         .map((i) => {
           return `<div class="form-floating mb-3">
                     <input type=${i} class="form-control" id=${i} name=${i} 
                      placeholder=${tidyHolder(i)} required >
                      <label for=${i}>${tidyHolder(i)}</label>
                  </div>`;
         })
         .join("")}
          <button class="w-100 btn btn-lg btn-primary" type="submit">${btnText}</button>
          <hr class="my-4">
          <div class=log${id}>`;
  form.addEventListener("submit", handleEvent);
  form.innerHTML = content;
}
function handleEvent(e) {
  e.preventDefault();
  formData(form);
}
function formData(form) {
  const isOrder = form.getAttribute("value");
  //Expecting images from products
  let myObj = {
    images: [],
  };
  const arr = [];
  const formData = new FormData(form);
  const obj = Object.fromEntries(formData);
  // Identifing data of forma new product and  mounting the request object
  if (obj?.image_1) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (!key.includes("image")) {
          myObj[key] = obj[key];
        } else {
          myObj.images.push(obj[key]);
        }
      }
    }
    // Identifing data from form add item to cart and  mounting the request object
  } else if (obj?.product_id && obj?.quantity) {
    const { user_id } = obj;
    const { name, price, product_id, quantity } = obj;
    myObj = { user_id, item: { name, price, id: product_id, quantity } };
    // Identifing data from form delete item from cart and update item quantity
  } else if (obj?.item_id) {
    const { user_id } = obj;
    const { item_id } = obj;
    const { quantity } = obj;
    quantity
      ? (myObj = {
          cart: {
            user_id,
            item_id,
            quantity,
          },
        })
      : (myObj = {
          cart: {
            user_id,
            item_id,
          },
        });
    // Identifing data from form complete order and mounting the request object
  } else if (isOrder && Object.keys(obj).length > 1) {
    const len = Object.keys(obj).length;
    if (len === 3) {
      myObj = { id: "guest", ...Object.fromEntries(formData), ...cart };
    } else {
      myObj = { ...Object.fromEntries(formData) };
    }
  } else {
    myObj = obj;
  }
  if (url) {
    let route = null;
    // Mounting the cart purchased dynamic routes
    if (Object.keys(obj).length > 1) {
      route =
        Object.keys(obj)[0] +
        "=" +
        Object.values(obj)[0].trim() +
        "&" +
        Object.keys(obj)[1] +
        "=" +
        Object.values(obj)[1].trim();
    } else {
      // Mounting others dynamic routes
      const [key] = Object.keys(obj);
      route = obj[key];
    }
    //calling function for dynamic routes
    handleHTTP(null, url + route.trim(), true);
  } else {
    for (const key in myObj) {
      if (obj.hasOwnProperty(key)) {
        if (key.includes("image")) {
          myObj.images.forEach((img, i) => {
            myObj.images[i] = img.trim();
          });
        } else {
          myObj[key] = myObj[key].trim();
        }
      }
    }
    handleHTTP(myObj, undefined, true);
  }
}
export function tidyHolder(i) {
  return i.includes("_")
    ? i.split("_")[0].slice(0, 1).toUpperCase() +
        i.split("_")[0].slice(1, i.split("_")[0].length) +
        " " +
        i.split("_")[1]
    : i.slice(0, 1).toUpperCase() + i.slice(1, i.length);
}
