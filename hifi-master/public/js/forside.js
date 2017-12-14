fetch('http://localhost:1337/random')
.then((response) => {
   if (response.ok) {
      return response.json();
   }
})
.then((json) => {
    let list = '<div>'

   for (let i = 0; i < json.length; i++) {
      let price = json[i].product_price;
      price = price.replace('.', ',');
      list += `
         <div class="produkt">
            <h2>${json[i].product_name}</h2>
            <p>${json[i].product_description}</p>
            <p>${json[i].product_kategori}</p> 
            <div><img src="images/${json[i].product_image}"></div> 
         </div>`;
   }

   list += `</div`;

   document.querySelector('#productsList').innerHTML = list;
})
.catch((err) => {
   console.log(err);
})