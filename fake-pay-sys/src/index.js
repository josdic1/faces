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
    price: 0
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
    console.log(id, name)
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
         <td>#</td>
        <td>
          <button type="button" class="list-button remove" id="${cItem.id}" name="remove">Remove</button>
        </td>
      </tr>`
    ))

    const cartHtml =
      `
      <h1>My Cart (${cartItems.length + " items"})</h1>
      <table id="myCart">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>$</th>
            <th>Quantity</th>
            <th>𝕏</th>
            
          </tr>
        </thead>
        <tbody>
          ${cartItemsList.join('')}
        </tbody>
      </table>`

    cart.innerHTML = cartHtml
  }

  function renderPayment() {
    const paymentHtml =
      `<form id="form">
        <input type="text" class="form-input" id="name" placeholder="Cardholder name..." />
         <input type="text" class="form-input" id="ccNumber" placeholder="Card #..." />
        <input type="date" class="form-input" id="exp"  />
          <input type="text" class="form-input" id="cvv"  /><br>
          <button type="submit" class="form-input button" id="submit">🛒 Checkout</button>
          <button type="button" class="form-input button" id="cancel">Cancel</button>
      </form>`

    payment.innerHTML = paymentHtml

    payment.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener("input", handleFormInput)
    })

  }

  // payment handler functions
  function handleFormInpute) {

  }




  // async CRUD
  async function fetchItems() {
    try {
      const r = await fetch(`http://localhost:3000/items`)
      if (!r.ok) {
        throw new Error('GET: bad fetch')
      }
      const data = await r.json()
      items = data
      renderList(data)
      fetchCart()
      renderPayment()
    } catch (error) { console.error(error) }
  }

  async function fetchCart() {
    try {
      const r = await fetch(`http://localhost:3000/cartItems`)
      if (!r.ok) {
        throw new Error('GET: bad fetch')
      }
      const data = await r.json()
      cartItems = data
      renderCart(data)
    } catch (error) { console.error(error) }
  }


}

window.addEventListener('DOMContentLoaded', init)

