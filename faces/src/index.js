

const init = () => {


   //DOM elements
   const btnMenu = document.getElementById("btn-menu")
   const faceForm = document.getElementById("face-form")
   const faceItem = document.getElementById("face-item")
   const faceList = document.getElementById("face-list")

   // Stateful Variables
   let inEditMode = false
   let faces = []
   let formData = { name: '', mood: '' }
   let selectedFace = { id: '', name: '', mood: '' }



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
         renderItem()
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
               <button type='button' name='edit' id='edit-${item.id}'>Edit</button>
              </td>
              <td>
               <button type='button' name='del' id='del-${item.id}'>Del</button>
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


   //list button event listener
   faceList.addEventListener('click', function (e) {
      const { id } = e.target
      const btn = id.slice(0, 3)
      const thisId = id.split('-')[1]
      const payload = faces.find(face => face.id === thisId)
      if (btn === 'edi') {
         inEditMode = true
         populateForm(payload)
         renderItem(payload.mood)
         selectedFace = {
            ...payload
         }
         formData = {
            name: payload.name || '',
            mood: payload.mood || ''
         }
      } else {
         if (btn === 'del') {
            deleteClick(payload)
         }
      }
   })

   //render current mood emohi based off selected item

   function renderItem(mood) {
      switch (mood) {
         case 'happy':
            return faceItem.textContent = '🙂';
         case 'sad':
            return faceItem.textContent = '😔';
         case 'angry':
            return faceItem.textContent = '😠';
         default:
            return faceItem.textContent = '⌛'
      }
   }


   // creates object and routes it to POST/PATCH
   const populateForm = (face) => {
      const nameField = document.getElementById('nameInput')
      const moodField = document.getElementById('moodInput')
      nameField.value = face.name
      moodField.value = face.mood
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
      const { name, value } = e.target
      formData = {
         ...formData,
         [name]: value
      }
   })


   //event listener clear button
   faceForm.addEventListener('click', function (e) {
      const { name } = e.target
      name === 'clear' ? clearForm() : ''
   })

   // clear form reusable
   function clearForm() {
      inEditMode = false
      const nameField = document.getElementById('nameInput')
      const moodField = document.getElementById('moodInput')
      nameField.value = ''
      moodField.value = ''
      formData = {
         name: '',
         mood: ''
      }

      selectedFace = {
         id: '',
         name: '',
         mood: ''
      }
      renderItem()
   }


   // submit button event listener
   faceForm.addEventListener('submit', function (e) {
      e.preventDefault()
      const nameField = document.getElementById('nameInput')
      const moodField = document.getElementById('moodInput')
      if (inEditMode) {
         const payload = {
            ...selectedFace,
            name: nameField.value === selectedFace.name ? selectedFace.name.toLowerCase() : nameField.value.toLowerCase(),
            mood: moodField.value === selectedFace.mood ? selectedFace.mood.toLowerCase() : moodField.value.toLowerCase()
         }
         updateClick(payload)
         clearForm()
      } else {
         const payload = {
            ...formData
         }
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
         fetchFaces(updatedList)

      } catch (error) { console.error(error) }
   }

   // update face PATCH
   async function updateClick(objToUpdate) {

      try {
         const r = await fetch(`http://localhost:3000/faceItems/${objToUpdate.id}`, {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(objToUpdate)
         })
         if (!r.ok) {
            throw new Error('error')
         }
         const data = await r.json()
         const updatedList = faces.map(face => face.id === data.id ? data : face)
         fetchFaces(updatedList)

      } catch (error) { console.error(error) }
   }

   // delete face PATCH
   async function deleteClick(objToDelete) {
      const updatedList = faces.filter(face => face.id !== objToDelete.id)
      try {
         const r = await fetch(`http://localhost:3000/faceItems/${objToDelete.id}`, {
            method: 'DELETE'
         })
         if (!r.ok) {
            throw new Error('error')
         }
         const updatedList = faces.filter(face => face.id !== objToDelete.id)
         renderItem()
         renderList(updatedList)
         faces = updatedList
      } catch (error) { console.error(error) }
   }







}
window.addEventListener("DOMContentLoaded", init)

