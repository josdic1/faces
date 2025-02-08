const init = () => {

  // dom elements
  const navbar = document.getElementById('navbar')
  const filter = document.getElementById('filter')
  const list = document.getElementById('list')
  const transaction = document.getElementById('transaction')
  const cart = document.getElementById('cart')

  // stateful variables
  let items = []

  let selectedItem = {
    id: '',
    name: '',
    price: 0
  }

  let cartItems = []
  let transactions = []

  let itemFormObj = {
    name: '',
    price: 0,
    itemId: ''
  }

  let ccFormObj = {
    name: '',
    ccNumber: '',
    exp: '',
    cvv: ''
  }

  // initial fetch
  fetchItems()

  const jsonData = [
    { id: 1, name: "Alice", age: 25 },
    { id: 2, name: "Bob", age: 30 },
    { id: 3, name: "Charlie", age: 35 },
  ];

  const createTable = (data) => {
    let headerHtml;
    let bodyHtml;

    const headers = Object.keys(data[0])
    headerHtml = headers.map(header => (
      `<th>${header}</th>`
    ))

    const listItemCount = data.length
    let i;
    for (i = 0; i = listItemCount; i++) {
      data.map(item => (

      ))
    }

    const tableHtml = `<thead>
        <tr>
        ${headerHtml.join('')}
        </tr>
      </thead>
       <tbody>

    </tbody>
      `

    transaction.innerHTML = tableHtml
    console.log("listItemCount: ", listItemCount)
    console.log("bodyHtml: ", bodyHtml)
  }



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
      itemFormObj = newItemToAdd
      addToCart(newItemToAdd)
    }
  }


  // CART
  //<---- render cart ---->


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

  //<----- add transaction ---->
  async function addTransaction(obj) {
    try {
      const r = await fetch(`http://localhost:3000/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(obj)
      })
      if (!r.ok) {
        throw new Error('POST: bad fetch while adding transaction')
      }
      const newTransaction = await r.json()
      const updatedTransactions = [...transactions, newTransaction]
      transactions = updatedTransactions
      await fetchItems()
    } catch (error) { console.error(error) }
  }
}

window.addEventListener('DOMContentLoaded', init)

