var courses = [];

const addCourseButton = document.querySelector(".add-course");

addCourseButton.addEventListener("click", () => {
    const modal = document.querySelector("#create_course_dialog");
    modal.showModal();
});

const createCourseBtn = document.querySelector("#create_course_btn");

createCourseBtn.addEventListener("click", async (e) => {

    const courseName = document.querySelector("#course_name");
    const courseDescription = document.querySelector("#course_description");
    const courseImage = document.querySelector("#course_image");
    const courseLink = document.querySelector("#course_link");

    if(!courseName.value || !courseDescription.value || !courseImage.files[0] || !courseLink.value){
        alert("Preencha todos os campos");
        return;
    }

    const courseNameValue = courseName.value;
    const courseDescriptionValue = courseDescription.value;
    const courseImageValue = courseImage.files[0];
    const courseLinkValue = courseLink.value;

    const formData = new FormData();
    formData.append("name", courseNameValue);
    formData.append("description", courseDescriptionValue);
    formData.append("image", courseImageValue);
    formData.append("link", courseLinkValue);

    const result = await saveCourse(formData);

    if(!result){
        return;
    }

    addCourseToGrid({
        id: result,
        name: courseNameValue,
        description: courseDescriptionValue,
        image: courseImageValue,
        link: courseLinkValue
    }, true);
    
    //clear inputs
    courseName.value = "";
    courseDescription.value = "";
    courseImage.files[0] = null;
    courseLink.value = "";

    const modal = document.querySelector("#create_course_dialog");
    modal.close();
});

const editCourseBtn = document.querySelector("#edit_course_btn");

editCourseBtn.addEventListener("click", async (e) => {
    
    const courseName = document.querySelector("#edit_course_name");
    const courseDescription = document.querySelector("#edit_course_description");
    const courseLink = document.querySelector("#edit_course_link");
    const courseImage = document.querySelector("#edit_course_image");

    if(!courseName.value || !courseDescription.value || !courseLink.value){
        alert("Preencha todos os campos");
        return;
    }

    const courseNameValue = courseName.value;
    const courseDescriptionValue = courseDescription.value;
    const courseLinkValue = courseLink.value;
    const courseImageValue = courseImage.files[0];

    const formData = new FormData();
    formData.append("name", courseNameValue);
    formData.append("description", courseDescriptionValue);
    formData.append("link", courseLinkValue);

    if(courseImageValue){
        formData.append("image", courseImageValue);
    }

    const id = e.currentTarget.dataset.id;

    const card = document.querySelector(`.card[data-id="${id}"]`);

    const result = await editCourse(id, formData);

    if(!result){
        return;
    }

    updateCardOnGrid(card, {
        name: courseNameValue,
        description: courseDescriptionValue,
        link: courseLinkValue,
        image: courseImageValue
    });

    const modal = document.querySelector("#edit_course_dialog");
    modal.close();
});

async function saveCourse(course){
    
    try {

        const response = await fetch("http://localhost:8080/courses", {
            method: "POST",
            body: course
        }); 
    
        if(!response.ok){
            alert("Erro ao salvar curso");
            return false;
        }

        const data = await response.json();

        if(!data.success){
            alert(data.message);
            return false;
        }

        return data.data.id;
    }
    catch (error) {
        console.error(error);
        return false;
    }


}

async function getCourses(){
    try {
        const response = await fetch("http://localhost:8080/courses");

        if(!response.ok){
            alert("Erro ao buscar cursos");
            return false;
        }

        const data = await response.json();

        if(!data.success){
            alert(data.message);
            return false;
        }

        return data.data;

    } catch (error) {
        console.error(error);
        return false;
    }
}

async function editCourse(id, course){

    try {
        course.append("_method", "PUT");

        const response = await fetch(`http://localhost:8080/courses/${id}`, {
            method: "POST",
            body: course
        });

        if(!response.ok){
            alert("Erro ao editar curso");
            return false;
        }

        const data = await response.json();

        if(!data.success){
            alert(data.message);
            return false;
        }

        return true

    } catch (error) {
        console.error(error);
        return false;
    }
}

async function deleteCourse(id){
    try {
        const response = await fetch(`http://localhost:8080/courses/${id}`, {
            method: "DELETE"
        });

        if(!response.ok){
            alert("Erro ao deletar curso");
            return false;
        }

        const data = await response.json();

        if(!data.success){
            alert(data.message);
            return false;
        }

        return true;

    } catch (error) {
        console.error(error);
        return false;
    }
}

function buildCourseGrid(courses){
    const cardGrid = document.querySelector(".card-grid");

    courses.forEach(course => {
        const card = document.createElement("div");

        card.classList.add("card");

        const img = document.createElement("img");
        img.src = course.img_url;

        card.innerHTML = `
            <div class="card-content">
                <h3>
                    ${course.name}
                </h3>

                <p class="card-text">
                    ${course.description}
                </p>
                
                <button class="card-btn">
                    Ver curso
                </button>
            </div>
        `;

        card.prepend(img);

        card.dataset.id = course.id;
        card.dataset.name = course.name;
        card.dataset.description = course.description;
        card.dataset.link = course.slide_link;        

        addCardEditEventListener(card);

        const lastCard = cardGrid.children[cardGrid.children.length - 1];
        cardGrid.insertBefore(card, lastCard);
    });
}

function addCourseToGrid(course, addRibbon = false){

    const cardGrid = document.querySelector(".card-grid");

    const card = document.createElement("div");

    card.classList.add("card");

    const img = document.createElement("img");
    img.src = URL.createObjectURL(course.image);

    card.innerHTML = `
        <div class="card-content">
            <h3>
                ${course.name}
            </h3>

            <p class="card-text">
                ${course.description}
            </p>
            
            <button class="card-btn">
                Ver curso
            </button>
        </div>
    `;

    card.prepend(img);

    card.dataset.id = course.id;
    card.dataset.name = course.name;
    card.dataset.description = course.description;
    card.dataset.link = course.slide_link;  

    if(addRibbon){
        const ribbon = document.createElement("span");
        ribbon.classList.add("ribbon");
        ribbon.textContent = "Novo";

        card.prepend(ribbon);
    }

    addCardEditEventListener(card);

    const lastCard = cardGrid.children[cardGrid.children.length - 1];
    cardGrid.insertBefore(card, lastCard);
}

function addCardEditEventListener(card){
    card.addEventListener("click", (e) => {

        console.log(card);

        const modal = document.querySelector("#edit_course_dialog");

        const courseName = document.querySelector("#edit_course_name");
        const courseDescription = document.querySelector("#edit_course_description");
        const courseLink = document.querySelector("#edit_course_link");

        const deleteCourseBtn = document.querySelector("#delete_course_btn");
        deleteCourseBtn.dataset.id = card.dataset.id;

        const editCourseBtn = document.querySelector("#edit_course_btn");
        editCourseBtn.dataset.id = card.dataset.id;

        courseName.value = card.dataset.name;
        courseDescription.value = card.dataset.description;
        courseLink.value = card.dataset.link;

        modal.showModal();
    });
}

function removeCardFromGrid(card){
    card.remove();
}

function updateCardOnGrid(card, course){

    card.dataset.name = course.name;
    card.dataset.description = course.description;
    card.dataset.link = course.link;

    //update image
    if(course.image){
        const img = card.querySelector("img");
        img.src = URL.createObjectURL(course.image);
    }

    card.querySelector("h3").textContent = course.name;
    card.querySelector(".card-text").textContent = course.description;
}

document.querySelector("#delete_course_btn").addEventListener("click", async (e) => {
    const id = e.currentTarget.dataset.id;

    const result = await deleteCourse(id);

    if(!result){
        return;
    }

    const card = document.querySelector(`.card[data-id="${id}"]`);

    removeCardFromGrid(card);

    const modal = document.querySelector("#edit_course_dialog");
    modal.close();
});
