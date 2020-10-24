const db = firebase.firestore();

const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks-container");

let editStatus = false;
let id = '';

/**
 * @param {string} primernombre 
 * @param {string} segundonombre
 * @param {string} email
 * @param {string} direccion
 * 
 */
const saveTask = (primernombre, segundonombre, email, direccion) =>
  db.collection("Administrador").doc().set({
    primernombre,
    segundonombre,
    email,
    direccion,
  });

const getTasks = () => db.collection("Administrador").get();

const onGetTasks = (callback) => db.collection("Administrador").onSnapshot(callback);

const deleteTask = (id) => db.collection("Administrador").doc(id).delete();

const getTask = (id) => db.collection("Administrador").doc(id).get();

const updateTask = (id, updatedTask) => db.collection('Administrador').doc(id).update(updatedTask);

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTasks((querySnapshot) => {
    tasksContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const Administrador = doc.data();

      tasksContainer.innerHTML += `<div class="container mt-5"> <div class="card card-body mb-5 border-primary">
    <h6><b>Primer Nombre:</b> ${Administrador.primernombre}</h6>
    <h6><b>Segundo Nombre:</b> ${Administrador.segundonombre}</h6>
    <h6><b>Email:</b> ${Administrador.email}</h6>
    <h6><b>Direccion:</b> ${Administrador.direccion}</h6>
    <div>
      <button class="btn btn-primary btn-delete" data-id="${doc.id}">
        🗑 Delete
      </button>
      <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
        🖉 Edit
      </button>
    </div>
  </div>
  </div>`;
    });

    const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        console.log(e.target.dataset.id);
        try {
          await deleteTask(e.target.dataset.id);
        } catch (error) {
          console.log(error);
        }
      })
    );

    const btnsEdit = tasksContainer.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await getTask(e.target.dataset.id);
          const Administrador = doc.data();
          taskForm["primernombre"].value = Administrador.primernombre;
          taskForm["segundonombre"].value = Administrador.segundonombre;
          taskForm["email"].value = Administrador.email;
          taskForm["direccion"].value = Administrador.direccion;


          editStatus = true;
          id = doc.id;
          taskForm["btn-task-form"].innerText = "Update";

        } catch (error) {
          console.log(error);
        }
      });
    });
  });
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const primernombre = taskForm["primernombre"];
  const segundonombre = taskForm["segundonombre"];
  const email = taskForm["email"];
  const direccion = taskForm["direccion"];



  try {
    if (!editStatus) {
      await saveTask(primernombre.value, segundonombre.value, email.value, direccion.value);
    } else {
      await updateTask(id, {
        primernombre: primernombre.value,
        segundonombre: segundonombre.value,
        email: email.value,
        direccion: direccion.value,

      })

      editStatus = false;
      id = '';
      taskForm['btn-task-form'].innerText = 'Save';
    }

    taskForm.reset();
    primernombre.focus();
  } catch (error) {
    
  }
});
