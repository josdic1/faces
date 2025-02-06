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
  let formData = {
    name: '',
    price: 0
  }
  let selectedItem = {
    id: '',
    name: '',
    price: 0
  }

  // initial fetch
  fetchItems()

  // render functions
  function renderList(data) {

    const itemsList = data.map(i => (
      `<tr>
        <td>${i.id}</td>
        <td>${i.name}</td>
        <td>${i.price}</td>
        <td>
          <button type="button" class="list-button" id="${i.id}" name="add">Add 🛒</button>
        </td>
      </tr>`
    ))

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
        ${itemsList}
      </tbody>
    </table>`

    list.innerHTML = listHtml
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
    } catch (error) { console.error(error) }
  }

}

window.addEventListener('DOMContentLoaded', init)

