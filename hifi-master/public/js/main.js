// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
         results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
   }
   
   function sletItem(event) {
      if (confirm('Er du sikker?')) {
         let id = (isNaN(event.target.dataset['id']) ? 0 : event.target.dataset['id']);
   
         let headers = new Headers();
         headers.append('Content-Type', 'application/json');
   
         let init = {
            method: 'delete',
            headers: headers,
            mode: 'cors',
            cache: 'default'
         };
         let request = new Request(`http://localhost:1337/products/${id}`, init);
   
         fetch(request)
            .then(response => {
               if (response.status == 204) {
                  window.location.replace(`adm.html`);
               } else {
                  throw new Error('Produkt blev ikke slettet');
               }
            }).catch(err => {
               console.log(err);
            });
      }
   }
   
   document.addEventListener("DOMContentLoaded", event => {
   
      if (getParameterByName('action') == "edit") {
         let productId = (getParameterByName('id') != null ? getParameterByName('id') : 0);
   
         fetch(`http://localhost:1337/products/${productId}`)
            .then((response) => {
               if (response.ok) {
                  return response.json();
               }
            })
            .then((json) => {
   
               let price = json[0].product_price;
               price = price.replace('.', ',');
   
               document.querySelector('#productForm').innerHTML = `
                  <h2>Rediger produkt</h2>
                  <label>Produkt navn</label>
                  <input type="text" name="productName" id="productName" value="${json[0].product_name}">
                  <br>
                  <label>Produkt beskrivelse</label>
                  <input type="text" name="productDescription" id="productDescription" value="${json[0].product_description}">
                  <br>
                  <label>Produkt pris</label>
                  <input type="text" name="productPrice" id="productPrice" value="${price}">
                  <br>
                  <label>Produkt kategori</label>
                  <input type="text" name="productKategori" id="productKategori" value="${json[0].product_kategori}">
                  <br>
                  <label>Produkt producent</label>
                  <input type="text" name="productProducent" id="productProducent" value="${json[0].product_producent}">
                  <br>
      
                  <button class="gem">Gem</button>
                  <a href="adm.html" class="button">Annuller</a> <span id="productsFormError" class="error"></span>
                  <hr>`;
   
               let productFormButton = document.querySelector("#productForm button");
   
               productFormButton.addEventListener('click', function (event) {
                  let name = document.querySelector('#productName').value;
                  let description = document.querySelector('#productDescription').value;
                  let price = document.querySelector('#productPrice').value;
                  let kategori = document.querySelector('#productKategori').value;
                  let producent = document.querySelector('#productProducent').value;
                  let id = (getParameterByName('id') != null ? getParameterByName('id') : 0);
   
                  price = price.replace(',', '.');
   
                  if (id != 0 && name != '' && description != '' && !isNaN(price) && id > 0) {
                     document.querySelector('#productsFormError').innerHTML = "";
                     let url = `http://localhost:1337/products/${id}`;
                     let headers = new Headers();
                     headers.append('Content-Type', 'application/json');
   
                     let init = {
                        method: 'put',
                        headers: headers,
                        body: JSON.stringify({
                           id: id,
                           name: name,
                           description: description,
                           price: price,
                           kategori: kategori,
                           producent: producent
                        }),
                        cache: 'no-cache',
                        cors: 'cors'
                     };
                     let request = new Request(url, init);
   
                     fetch(request)
                        .then(response => {
   
                           if (response.status == 200) {
                              window.location.replace(`adm.html`);
                           } else {
                              throw new Error('Produkt blev ikke opdateret')
                           }
                        }).catch(err => {
                           console.log(err);
                        });
   
                  } else {
                     document.querySelector('#productsFormError').innerHTML = "Udfyld venligst alle felter korrekt";
                  }
               });
            })
            .catch((err) => {
               console.log(err);
            });
   
      } else {
         document.querySelector('#productForm').innerHTML = `
            <h2>Opret nyt produkt</h2>
            <label>Produkt navn</label>
            <input type="text" name="productName" id="productName" value="">
            <br>
            <label>Produkt beskrivelse</label>
            <input type="text" name="productDescription" id="productDescription" value="">
            <br>
            <label>Produkt pris</label>
            <input type="text" name="productPrice" id="productPrice" value="">
            <br>
            <label>Produkt kategori</label>
            <input type="text" name="productKategori" id="productKategori" value="">
            <br>
            <label>Produkt Producent</label>
            <input type="text" name="productProducent" id="productProducent" value="">
            <br>
            
            
            <button class="gem">Gem</button>
            <a href="adm.html" class="button">Annuller</a> <span id="productsFormError" class="error"></span>
            <hr>`;
   
   
         let productFormButton = document.querySelector("#productForm button");
         productFormButton.addEventListener('click', function (event) {
            let name = document.querySelector('#productName').value;
            let description = document.querySelector('#productDescription').value;
            let price = document.querySelector('#productPrice').value;
            let kategori = document.querySelector('#productKategori').value;
            let producent = document.querySelector('#productProducent').value;            
   
            price = price.replace(',', '.');
   
            if (name != '' && description != '' && !isNaN(price)) {
               document.querySelector('#productsFormError').innerHTML = "";
               let url = `http://localhost:1337/products/`;
               let headers = new Headers();
               headers.append('Content-Type', 'application/json');
   
               let init = {
                  method: 'post',
                  headers: headers,
                  body: JSON.stringify({
                     name: name,
                     description: description,
                     price: price,
                     kategori: kategori,
                     producent: producent
                  }),
                  cache: 'no-cache'
               };
               let request = new Request(url, init);
   
               fetch(request)
                  .then(response => {
                     if (response.status == 200) {
                        window.location.replace(`adm.html`);
                     } else {
                        throw new Error('Produkt blev ikke oprettet');
                     }
                  })
                  .catch(err => {
                     console.log(err);
                  });
            } else {
               document.querySelector('#productsFormError').innerHTML = "Udfyld venligst alle felter korrekt";
            }
   
         });
      }
   
      fetch('http://localhost:1337/products')
      .then((response) => {
         if (response.ok) {
            return response.json();
         }
      })
      .then((json) => {
         let list = `
            <div>`;

         for (let i = 0; i < json.length; i++) {
            let price = json[i].product_price;
            price = price.replace('.', ',');
            list += `
            <div class="produkt1">
            <h2>${json[i].product_name}</h2>
            <p>${json[i].product_description}</p>
            <p>${json[i].product_kategori}</p> 
            <a href="?action=edit&id=${json[i].product_id}" class="button edit">ret</a>
            <a href="#" class="button delete" data-id="${json[i].product_id}">slet</a>
         </div>
                     `;
         }

         list += `</div>`;

         document.querySelector('#productsList').innerHTML = list;

         let deleteButtons = document.querySelectorAll('#productsList a.delete');
         deleteButtons.forEach((button) => {
            button.addEventListener('click', sletItem);
         })
      })
      .catch((err) => {
         console.log(err);
      })
   });