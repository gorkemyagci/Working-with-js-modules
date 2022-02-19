// Storage Controller

const StorageController = (function (){
    
})()

// Product Controller

const ProductController = (function (){
    const Product = function(id,name,price){
      this.id = id;
      this.name = name;
      this.price = price;
    }

    const data = {
        products : [],
        selectedProduct : null,
        totalPrice : 0
    }
    return {
        getProducts : function(){
            return data.products;
        },
        getData : function(){
            return data;
        },
        getSelectedProduct : function(){
            return data.selectedProduct;
        },
        setCurrentProduct : function(product){
           data.selectedProduct = product;
        },
        addProduct : function(name,price){
            let id;
            if(data.products.length>0){
                id = data.products[data.products.length-1].id+1
            }else{
                id = 0;
            }

            const newProduct = new Product(id,name,price);
            data.products.push(newProduct);
            return newProduct;

        },
        getTotal : function(){
            let total = 0;
            data.products.forEach(function(item){
                total+= item.price;
            })
            data.totalPrice = total;
            return data.totalPrice;
        },
        getProductById : function(id){
            let product = null;

            data.products.forEach(prd => {
                if(id == prd.id){
                    product = prd;
                }
            })

            return product;
        },
        updatedProduct : function(name,price){
          let product = null;
          data.products.forEach(prd => {
              if(prd.id == data.selectedProduct.id){
                  prd.name = name;
                  prd.price = parseFloat(price);
                  product = prd;
              }

          })
          return product;
        },
        deleteSelectedProduct : function(product){
           data.products.forEach(function(prd,index){
               if(prd.id == product.id){
                   data.products.splice(index,1)
               }
           })
           }
    }
})()

// UI Controller

const UIController = (function (){
    const Selectors = {
        productsList : '#item-list',
        productName : '#productName',
        updateBtn : '#updateBtn',
        deleteBtn : '#deleteBtn',
        productListItems : '#item-list tr',
        namePrd : '#namePrd',
        pricePrd : '#pricePrd',
        cancelBtn : '.cancelBtn',
        productPrice : '#productPrice',
        addBtn : '#addBtn',
        productCard : '#productCard',
        totalTl : '#total-tl',
        totalDolar : '#total-dolar'
    }
    return{
        createProductList : function(products){
        let html='';
 
        products.forEach(prd => {
            html+=
            `
         <tr>
            <td id="tr">${prd.id}</td>
            <td id="namePrd">${prd.name}</td>
            <td id="pricePrd">${prd.price} $</td>
            <td class="text-right" style="text-align: right;">
                <i class="far fa-edit edit-product"></i>
            </td>
        </tr>
    
            `
        });

        document.querySelector(Selectors.productsList).innerHTML = html;
        },
        getSelectors : function(){
            return Selectors;
        },
        addProduct : function(prd){
            document.querySelector(Selectors.productCard).style.display = 'block';
            var item = 
            `
         <tr id="tr">
            <td>${prd.id}</td>
            <td>${prd.name}</td>
            <td>${prd.price} $</td>
            <td class="text-right" style="text-align: right;">
             <i class="far fa-edit edit-product"></i>
            </td>
        </tr>
            
            `

            document.querySelector(Selectors.productsList).innerHTML += item;
        },
        updateProduct : function(prd){
         let updatedItem = null;
         let items = document.querySelectorAll(Selectors.productListItems);
         items.forEach(function(item){
             if(item.classList.contains('bg-warning')){
                item.children[1].textContent = document.querySelector(Selectors.productName).value;
                item.children[2].textContent = document.querySelector(Selectors.productPrice).value;

             }
         });
         return updatedItem;
        },
        clearInputs : function(){
        document.querySelector('#productName').value='';
        document.querySelector('#productPrice').value='';
        },
        hide : function(){
            document.querySelector(Selectors.productCard).style.display = 'none';
        },
        showTotal : function(total){
            document.querySelector(Selectors.totalDolar).innerHTML = total;
            document.querySelector(Selectors.totalTl).innerHTML = total*13.5;
        },
        deleteProduct : function(){
         let items = document.querySelectorAll(Selectors.productListItems);
         items.forEach(function(item){
             if(item.classList.contains('bg-warning')){
                 item.remove();
                 UIController.clearInputs();
             }
         })
        },
        addProductToForm : function(){
          const product = ProductController.getSelectedProduct();
          document.querySelector(Selectors.productName).value = product.name;
          document.querySelector(Selectors.productPrice).value = product.price;
        },
        addingState : function(){
        UIController.clearInputs();
        document.querySelector(Selectors.addBtn).style.display = 'inline-block';
        document.querySelector(Selectors.updateBtn).style.display = 'none';
        document.querySelector(Selectors.deleteBtn).style.display = 'none';
        document.querySelector(Selectors.cancelBtn).style.display = 'none';
        },
        editState : function(tr){
            const parent = tr.parentNode;
            for(let i=0;i<parent.children.length;i++){
                parent.children[i].classList.remove('bg-warning');
            }
            tr.classList.add('bg-warning');
            document.querySelector(Selectors.addBtn).style.display = 'none';
            document.querySelector(Selectors.updateBtn).style.display = 'inline-block';
            document.querySelector(Selectors.deleteBtn).style.display = 'inline-block';
            document.querySelector(Selectors.cancelBtn).style.display = 'inline-block';
        }
    }
})()

// App Controller



const AppController = (function (productCtrl,UICtrl){

    const UISelectors = UIController.getSelectors();

    const loadEventListeners = function(){
      document.querySelector(UISelectors.addBtn).addEventListener('click',function(e){

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;
    
        if(productName!=='' && productPrice!==''){
            const newProduct = productCtrl.addProduct(productName,parseFloat(productPrice));
            UIController.addProduct(newProduct);
            UIController.clearInputs();
           const total = productCtrl.getTotal();
           UICtrl.showTotal(total);

        }
        
        e.preventDefault();
      })
      document.querySelector(UISelectors.productsList).addEventListener('click',function(e){
          if(e.target.classList.contains('edit-product')){
          const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
          const product = productCtrl.getProductById(id);
          productCtrl.setCurrentProduct(product);
          UICtrl.addProductToForm();
          UICtrl.editState(e.target.parentNode.parentNode);
          }
          e.preventDefault();
      })

    document.querySelector(UISelectors.updateBtn).addEventListener('click',function(e){
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;
        if(productName !=='' && productPrice!==''){
            // edit product informations
            const updatedProduct = productCtrl.updatedProduct(productName,productPrice);

            let item = UIController.updateProduct(updatedProduct);

            const total = productCtrl.getTotal();
            UICtrl.showTotal(total);
            UICtrl.addingState();
            console.log(item)
            const products = document.querySelectorAll('#tr');
            for(let i=0;i<products.length;i++){
                if(products[i].classList.contains('bg-warning')){
                    products[i].classList.remove('bg-warning');
                }
            }
        }
        e.preventDefault();
    });

    document.querySelector(UISelectors.deleteBtn).addEventListener('click',function(e){

        const selectedProduct = productCtrl.getSelectedProduct();

        UICtrl.deleteProduct();

        productCtrl.deleteSelectedProduct(selectedProduct);

        const total = productCtrl.getTotal();

        UICtrl.showTotal(total);

        UICtrl.addingState();

        e.preventDefault();
    })

    document.querySelector(UISelectors.cancelBtn).addEventListener('click',function(e){
        UIController.addingState();
       const products = document.querySelectorAll('#tr');
       for(let i=0;i<products.length;i++){
           if(products[i].classList.contains('bg-warning')){
               products[i].classList.remove('bg-warning');
           }
       }
       console.log(products)
        e.preventDefault();
    })

    }
    
    
 return{
     init : function(){
         console.log("Starting app..")

         UICtrl.addingState();

         const products = productCtrl.getProducts();
         if(products.length==0){
             UICtrl.hide();
         }else{
            UICtrl.createProductList(products);
         }
         loadEventListeners();
     }
 } 
})(ProductController,UIController)


const wifi = document.getElementById('wifi');

window.addEventListener('online',() => {
    wifi.style.display = 'none'
});

window.addEventListener('offline',() =>{
    wifi.style.display = 'block';
})
AppController.init();