const init = () => {

  // dom elements
  const menu = document.getElementById('menu')
  const filter = document.getElementById('filter')
  const list = document.getElementById('list')
  const payment = document.getElementById('payment')
  const cart = document.getElementById('cart')

  // stateful variables
  let isLoading = true
  let inEditMode = false
  let items = []
  let cartItems = []
  let itemFormData = {
    name: '',
    price: 0,
    itemId: ''
  }
  let ccFormData = {
    name: '',
    ccNumber: '',
    exp: '',
    cvv: ''
  }
  let selectedItem = {
    id: '',
    name: '',
    price: 0
  }

  // initial fetch
  fetchItems()

  // LIST
  //<---- render list ---->
  function renderList(data) {

    const itemsList = data.map(i => (
      `<tr>
        <td>${i.id}</td>
        <td>${i.name}</td>
        <td>${i.price}</td>
        <td>
          <button type="button" class="list-button add" id="${i.id}" name="add">Add 🛒</button>
        </td>
      </tr>`
    ))
    cart
    const listHtml =
      `<table>
      <thead>
        <tr>
          <th>ID</th>
           <th>NAME</th>
            <th>$</th>
              <th>Add to Cart</th>
        </tr>
      </thead>
      <tbody>
        ${itemsList.join('')}
      </tbody>
    </table>`



    list.innerHTML = listHtml

    list.querySelectorAll('.list-button.add').forEach(btn => (
      btn.addEventListener('click', handleAddToCartClick)
    ))
  }


  //<---- list handler functions ---->

  function handleAddToCartClick(e) {
    const { id, name } = e.target
    const itemObj = items.find(item => (
      item.id === id
    ))

    if (name === 'add') {
      const newItemToAdd = {
        name: itemObj.name,
        price: itemObj.price,
        itemId: itemObj.id
      }
      itemFormData = newItemToAdd
      addToCart(newItemToAdd)
    }
  }


  // CART
  //<---- render cart ---->
  function renderCart(cItems) {
    menu.textContent = cItems.length

    const cartItemsList = cItems.map(cItem => (
      `<tr id="${cItem.id}">
        <td>${cItem.id}</td>
        <td>${cItem.name}</td>
        <td>${cItem.price}</td>
         <td>${cItem.itemId}</td>
        <td>
          <button type="button" class="list-button remove" id="${cItem.id}" name= "remove" >Remove</button>
        </td>
      </tr>`
    ))

    const cartItemsPriceTotal = cartItems.reduce((accum, cartItem) => cartItem.price + accum, 0)

    const uniqueCardItemNames = new Set(cartItems.map(cartItem => cartItem.name))
    const cartTableData = [...uniqueCardItemNames].map(uItem => {

      const quantity = cartItems.filter(cItem => cItem.name === uItem).length
      const totals = cartItems.filter(cItem => cItem.name === uItem)
        .reduce((count, it) => it.price + count, 0).toFixed(2)
      const cartTableRow =
        `<tr>
          <td>${uItem}</td>
            <td>${quantity}</td>
              <td>${totals}</td>

        </tr>`
      return cartTableRow
    })




    const cartHtml =
      `
      <h1>My Cart: ${cartItems.length + " items"} (total: $${cartItemsPriceTotal.toFixed(2)})</h1>
          <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>#</th>
          </tr>
        </thead>
        <tbody>
          ${cartTableData.join('')}
        </tbody>
      </table>
      <table id="myCart">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>$</th>
            <th>Item Id</th>
            <th>𝕏</th>
          </tr>
        </thead>
        <tbody>
          ${cartItemsList.join('')}
        </tbody>
      </table>`

    cart.innerHTML = cartHtml

    cart.querySelectorAll('.remove').forEach(btn => {
      btn.addEventListener('click', handleRemoveClick)
    })

  }

  //<---cart handler functions --->
  function handleRemoveClick(e) {
    const { id, name } = e.target
    if (name === 'remove') {
      const itemToRemove = cartItems.find(i => (
        i.id === id
      ))
      const updatedCart = cartItems.filter(j => (
        j.id !== itemToRemove.id
      ))
      removeItem(updatedCart, id)
    }
  }

  function renderPayment() {
    const paymentHtml =
      `<form id="form">
        <input type="text" class="form-input" name="name" placeholder="Cardholder name..." />
         <input type="text" class="form-input" name="ccNumber" placeholder="Card #..." />
        <input type="date" class="form-input" name="exp"  />
          <input type="text" class="form-input" name="cvv" placeholder="CVV..." /><br>
          <button type="submit" class="form-input button" name="submit">🛒 Checkout</button>
          <button type="button" class="form-input button" name="cancel">Cancel</button>
      </form>`

    payment.innerHTML = paymentHtml

    payment.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener("input", handleFormInput)
    })

  }

  // payment handler functions
  function handleFormInput(e) {
    const { name, value } = e.target
    ccFormData = {
      ...ccFormData,
      [name]: value
    }
    const paymentForm = ccFormData
    console.log(paymentForm)
  }




  // async CRUD
  //<----- fetch items ---->
  async function fetchItems() {
    try {
      const r = await fetch(`http://localhost:3000/items`)
      if (!r.ok) {
        throw new Error('GET: bad fetch populating item list')
      }
      const data = await r.json()
      items = data
      renderList(data)
      fetchCart()
      renderPayment()
    } catch (error) { console.error(error) }
  }

  //<----- fetch cart contents ---->
  async function fetchCart() {
    try {
      const r = await fetch(`http://localhost:3000/cartItems`)
      if (!r.ok) {
        throw new Error('GET: bad fetch populating cart')
      }
      const data = await r.json()
      cartItems = data
      renderCart(data)
    } catch (error) { console.error(error) }
  }

  //<----- add items to cart ---->
  async function addToCart(itemToAdd) {
    try {
      const r = await fetch(`http://localhost:3000/cartItems`, {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(itemToAdd)
      })
      if (!r.ok) {
        throw new Error('POST: bad fetch while adding item to cart')
      }
      const newItem = await r.json()
      const updatedCart = [...cartItems, newItem]
      cartItems = updatedCart
      renderCart(updatedCart)
      fetchItems()
    } catch (error) { console.error(error) }
  }


  //<----- delete item from cart  ---->
  async function removeItem(list, itemId) {
    try {
      const r = await fetch(`http://localhost:3000/cartItems/${itemId}`, {
        method: 'DELETE'
      })
      if (!r.ok) {
        throw new Error('DELETE: bad fetch while removing item from cart')
      }
      await fetchItems()
    } catch (error) { console.error(error) }
  }
}

window.addEventListener('DOMContentLoaded', init)

