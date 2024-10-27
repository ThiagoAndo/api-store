let print = null;
let style = null;
import { loadSpining } from "/js/UserIterfaceModules/HTTP.js";
export function logResp(data, endpoint) {
  setTimeout(() => {
    loadSpining.hide();
  }, 500);
  if (data?.message) style = "text-warning";
  else style = "text-primary";
  if (endpoint.startsWith("user")) {
    getEntries("user", data);
  }
  if (endpoint.startsWith("add")) {
    getEntries("add", data);
  }
  if (endpoint.startsWith("products")) {
    print = document.querySelector(".logproducts");
    print.innerHTML = null;
    const { products } = data;
    const { images } = data;
    let entries = null;
    let arr = [];
    if (products) {
      products.map((p) => {
        p.images = images.filter((i) => i.item_id === p.id);
        return p;
      });
      products.slice(0, 4).forEach((p, i) => {
        if (p?.images) {
          p.images.forEach((i) => {
            const entries = Object.entries(i);
            arr.push(entries[1]);
          });
        }
        entries = Object.entries(p);
        printIt([entries.slice(0, 10), arr], i);
      });
    } else if (data?.message) {
      const entries = Object.entries(data);
      printIt([entries], 0);
    } else {
      data.forEach((p, i) => {
        const [entries] = Object.entries(p);
        arr.push(entries);
      });
      printIt([arr], 0);
    }
  }
  if (endpoint.startsWith("cart")) {
    print = document.querySelector(".logcart");
    print.innerHTML = null;
    const { items } = data;
    if (items) {
      items.forEach((p, i) => {
        const entries = Object.entries(p);
        printIt([entries], i);
      });
    } else {
      const entries = Object.entries(data);
      printIt([entries], 0);
    }
  }
  if (endpoint.startsWith("order")) {
    print = document.querySelector(".logorder");
    print.innerHTML = null;
    if (data?.length >= 1) {
      data.forEach((p, i) => {
        const entries = Object.entries(p);
        printIt([entries], i);
      });
    } else {
      const entries = Object.entries(data);
      printIt([entries], 0);
    }
  }
  if (endpoint.startsWith("notOk")) {
    style = "text-danger";
    print = document.querySelector(`.log${endpoint.split("/")[1]}`);
    print.innerHTML = null;
    const entries = Object.entries(data);
    printIt([entries], 0);
  }
}
function getEntries(log, data) {
  print = document.querySelector(`.log${log}`);
  print.innerHTML = null;
  const entries = Object.entries(data);
  printIt([entries], 0);
}
function printIt(entries, i) {
  print.innerHTML += ` <table class="table table-sm">
   <thead>
     <h2 class="fs-6 mb-2 ${i != 0 ? "text-muted" : ""}">   ${
    i === 0 ? " API response" : "# " + (i + 1)
  }</h2>
      <tr>
      <th class="text-body-secondary" scope="col">#</th>
      <th class="text-body-secondary" style="min-width: 100px"=scope="col">Object key</th>
      <th class="text-body-secondary" scope="col">Object value</th>
    </tr>
  </thead>
       <tbody>
       ${taBleRows(entries[0])}
       ${entries.length > 1 ? taBleRows(entries[1]) : ""}
       </tbody>
   </table>`;
}
function taBleRows(entries) {
  return entries
    .map((e, i) => {
      return ` <tr>
                  <th class=${style} scope="row">${i + 1}</th>
                  <td> <span class=${style} > ${e[0]}:</span></td>
                  <td class= "ml-20 text-break ${style}"> ${e[1]}</td>
              </tr>`;
    })
    .join("");
}
