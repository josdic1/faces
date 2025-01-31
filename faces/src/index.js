import greet from "./helper"

const init = () => {

   console.log(greet("Josh"))
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
         console.log(data)
      } catch (error) { console.error(error) }
   }
   fetchFaces()



}
window.addEventListener("DOMContentLoaded", init)

