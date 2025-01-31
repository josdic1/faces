

const init = () => {


   //dom elements
   const app = document.getElementById("app")
   const btnMenu = document.getElementById("btn-menu")
   const faceForm = document.getElementById("face-form")
   const faceItem = document.getElementById("face-item")
   const faceList = document.getElementById("face-list")

   //stateful vars
   let inEditMode = false

   let faces = []

   let formData = {
      name: '',
      mood: ''
   }

   //fetch faceItems
   async function fetchFaces() {
      try {
         const r = await fetch(`http://localhost:3000/faceItems`)
         if (!r.ok) {
            throw new Error('fetch error')
         }
         const data = await r.json()
         renderList(data)
         renderForm()
         faces = data
      } catch (error) { console.error(error) }
   }
   fetchFaces()

   //render faces list data
   const renderList = (listData) => {
      const list = listData.map(item => (
         `      <tr id="${item.id}">
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.mood}</td>
            <td>
               <button type='button' id='edit'> Edit  </button>
              </td>
              <td>
               <button type='button' id='del'> Del  </button>
            </td>
         </tr>`
      ))



      //build face list and inject data
      faceList.innerHTML = `<table>
            <thead>
               <tr>
               <th> ID </th>
                  <th> Name </th>
                  <th> Mood </th>
                  <th> Edit </th>
                  <th> Del </th>
               </tr>
            </thead>
            <tbody>
               ${list.join('')}
            </tbody>
         </table>`;
   }

   //build form element
   const renderForm = () => {
      const formHtml =
         `<label for='nameInput'> Name </label>
         <input type='text' name='name' id='nameInput' placeholder='Enter new name...' />
         <label for='moodInput'> Mood </label>
         <input type='text' name='mood' id='moodInput' placeholder='Enter new mood...' />
         <button type='submit' name='submit' id='btnSubmit'>Create</button>
         <button type='button' name='clear' id='btnClear'>Clear</button>`
      faceForm.innerHTML = formHtml
   }

   //form event listeners for inputs
   faceForm.addEventListener('input', function (e) {
      e.preventDefault()
      const inputs = faceForm.getElementsByTagName('input')
      for (let input of inputs) {
         const { name, value } = input
         formData = {
            ...formData,
            [name]: value
         }
      }
   })

   //event listener clear button
   faceForm.addEventListener('click', function (e) {
      const { name } = e.target
      name === 'clear' ? clearForm() : ''
   })

   // clear form reusable
   function clearForm() {
      const nameField = document.getElementById('nameInput')
      const moodField = document.getElementById('moodInput')
      nameField.value = ''
      moodField.value = ''
   }

   // submit button event listener
   faceForm.addEventListener('submit', function (e) {
      e.preventDefault()
      const payload = {
         name: formData.name.toLowerCase(),
         mood: formData.mood.toLowerCase()
      }
      if (inEditMode) {
         console.log('form submit in editmode')
      } else {
         createClick(payload)
         clearForm()
      }
   })

   // create new face POST
   async function createClick(payload) {
      try {
         const r = await fetch(`http://localhost:3000/faceItems`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
         })
         if (!r.ok) {
            throw new Error('bad response')
         }
         const data = await r.json()
         const updatedList = [...faces, data]
         renderList(updatedList)

      } catch (error) { console.error(error) }
   }

   // update face PATCH
   async function updateClick() {
      try {

      } catch (error) { console.error(error) }
   }

   // delete face PATCH
   async function updateClick() {
      try {

      } catch (error) { console.error(error) }
   }







}
window.addEventListener("DOMContentLoaded", init)

