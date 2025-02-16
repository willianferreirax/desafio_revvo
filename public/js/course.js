var courses = [];

const addCourseCard = document.querySelector(".add-course");

addCourseCard.addEventListener("click", () => {
    const modal = document.querySelector("#create_course_dialog");
    modal.showModal();
});

const addCourdBtn = document.querySelector("#create_course_modal_btn");

addCourdBtn.addEventListener("click", () => {
    const modal = document.querySelector("#create_course_dialog");
    modal.showModal();
});

const createCourseBtn = document.querySelector("#create_course_btn");

createCourseBtn.addEventListener("click", async (e) => {

    const courseName = document.querySelector("#course_name");
    const courseDescription = document.querySelector("#course_description");
    const courseImage = document.querySelector("#course_image");
    const courseLink = document.querySelector("#course_link");

    const courseSlideImage = document.querySelector("#course_slide_image");
    const courseShouldShowSlide = document.querySelector("#course_should_show_slide");

    if(!courseName.value || !courseDescription.value || !courseImage.files[0] || !courseLink.value){
        alert("Preencha todos os campos");
        return;
    }

    const courseNameValue = courseName.value;
    const courseDescriptionValue = courseDescription.value;
    const courseImageValue = courseImage.files[0];
    const courseLinkValue = courseLink.value;

    const courseSlideImageValue = courseSlideImage.files[0];
    const courseShouldShowSlideValue = courseShouldShowSlide.checked;

    const formData = new FormData();
    formData.append("name", courseNameValue);
    formData.append("description", courseDescriptionValue);
    formData.append("image", courseImageValue);
    formData.append("link", courseLinkValue);
    formData.append("slide_image", courseSlideImageValue);
    formData.append("should_show_slide", courseShouldShowSlideValue);

    const result = await saveCourse(formData);

    if(!result){
        return;
    }

    if(courseShouldShowSlideValue){
        addSlideToSlider({
            id: result,
            name: courseNameValue,
            description: courseDescriptionValue,
            slide_image: courseSlideImageValue,
            slide_link: courseLinkValue
        });

        getSlidesElements();
        generateDots();
        getDotsElements();
    }

    addCourseToGrid({
        id: result,
        name: courseNameValue,
        description: courseDescriptionValue,
        image: courseImageValue,
        slide_link: courseLinkValue,
        should_show_on_slider: courseShouldShowSlideValue
    }, true);
    
    //clear inputs
    courseName.value = "";
    courseDescription.value = "";
    courseImage.files[0] = null;
    courseLink.value = "";
    courseSlideImage.files[0] = null;
    courseShouldShowSlide.checked = false;

    const modal = document.querySelector("#create_course_dialog");
    modal.close();
});

const editCourseBtn = document.querySelector("#edit_course_btn");

editCourseBtn.addEventListener("click", async (e) => {
    
    const courseName = document.querySelector("#edit_course_name");
    const courseDescription = document.querySelector("#edit_course_description");
    const courseLink = document.querySelector("#edit_course_link");
    const courseImage = document.querySelector("#edit_course_image");
    
    const courseSlideImage = document.querySelector("#edit_course_slide_image");
    const courseShouldShowSlide = document.querySelector("#edit_course_should_show_slide");

    if(!courseName.value || !courseDescription.value || !courseLink.value){
        alert("Preencha todos os campos");
        return;
    }

    const courseNameValue = courseName.value;
    const courseDescriptionValue = courseDescription.value;
    const courseLinkValue = courseLink.value;
    const courseImageValue = courseImage.files[0];

    const courseSlideImageValue = courseSlideImage.files[0];
    const courseShouldShowSlideValue = courseShouldShowSlide.checked;

    const formData = new FormData();
    formData.append("name", courseNameValue);
    formData.append("description", courseDescriptionValue);
    formData.append("link", courseLinkValue);
    formData.append("should_show_slide", courseShouldShowSlideValue);

    if(courseImageValue){
        formData.append("image", courseImageValue);
    }

    if(courseSlideImageValue){
        formData.append("slide_image", courseSlideImageValue);
    }

    const id = e.currentTarget.dataset.id;

    const card = document.querySelector(`.card[data-id="${id}"]`);

    const result = await editCourse(id, formData);

    if(!result){
        return;
    }

    if(courseShouldShowSlideValue){
        const slide = document.querySelector(`.slide[data-id="${id}"]`);

        if(!slide){
            addSlideToSlider({
                id: id,
                name: courseNameValue,
                description: courseDescriptionValue,
                slide_image: courseSlideImageValue 
                    ? courseSlideImageValue 
                    : 
                        card.dataset.slide_image ? 
                            card.dataset.slide_image : null,
                slide_link: courseLinkValue
            });
        }
        else{
            updateSlideOnSlider(slide, {
                name: courseNameValue,
                description: courseDescriptionValue,
                image: courseSlideImageValue,
                link: courseLinkValue
            });
        }

    }
    else{
        const slide = document.querySelector(`.slide[data-id="${id}"]`);

        if(slide){
            removeSlideFromSlider(slide);
        }
    }

    getSlidesElements();
    generateDots();
    getDotsElements();

    updateCardOnGrid(card, {
        name: courseNameValue,
        description: courseDescriptionValue,
        link: courseLinkValue,
        image: courseImageValue,
        should_show_on_slider: courseShouldShowSlideValue
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
                
                <a class="card-btn" href="${course.slide_link}" onclick="event.stopPropagation();" target="_blank">
                    Ver curso
                </a>
            </div>
        `;

        card.prepend(img);

        card.dataset.id = course.id;
        card.dataset.name = course.name;
        card.dataset.description = course.description;
        card.dataset.link = course.slide_link;
        card.dataset.shouldShowSlide = course.should_show_on_slider;
        card.dataset.slide_image = course.slide_img_url;
        card.dataset.image = course.img_url;

        addCardEditEventListener(card);

        const lastCard = cardGrid.children[cardGrid.children.length - 1];
        cardGrid.insertBefore(card, lastCard);
    });
}

function buildSlider(courses){
    const slider = document.querySelector(".slider");

    courses.forEach(course => {
        const slide = document.createElement("div");
        slide.classList.add("slide");

        const img = document.createElement("img");
        img.src = course.slide_img_url;
        img.classList.add("slide-img");

        slide.innerHTML = `
            <div class="text-box">
                <h2 class="slide-title">${course.name}</h2>
                <p class="slide-text">
                    ${course.description}
                </p>

                <a class="slide-btn" href="${course.slide_link}">Ver curso</a>
            </div>

        `;
        slide.prepend(img);

        slide.dataset.id = course.id;
        slide.dataset.name = course.name;
        slide.dataset.description = course.description;
        slide.dataset.link = course.slide_link;

        slider.appendChild(slide);
    });

    getSlidesElements();
    generateDots();
    getDotsElements();
}

function addSlideToSlider(course){
    
    const slider = document.querySelector(".slider");

    const slide = document.createElement("div");
    slide.classList.add("slide");

    const img = document.createElement("img");

    if(typeof course.slide_image === 'string'){

        img.src = course.slide_image;
    }
    else{
        img.src = URL.createObjectURL(course.slide_image);
        
    }

    slide.innerHTML = `
        <div class="text-box">
            <h2 class="slide-title">${course.name}</h2>
            <p class="slide-text">
                ${course.description}
            </p>

            <a class="slide-btn" href="${course.slide_link}">Ver curso</a>
        </div>
    `;

    slide.prepend(img);

    slide.dataset.id = course.id;
    slide.dataset.name = course.name;
    slide.dataset.description = course.description;
    slide.dataset.link = course.slide_link;

    slider.appendChild(slide);
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
            
            <a class="card-btn" href="${course.link}" onclick="event.stopPropagation();" target="_blank">
                Ver curso
            </a>
        </div>
    `;

    card.prepend(img);

    card.dataset.id = course.id;
    card.dataset.name = course.name;
    card.dataset.description = course.description;
    card.dataset.link = course.slide_link;
    card.dataset.shouldShowSlide = course.should_show_on_slider ? "1" : "0";

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

        const modal = document.querySelector("#edit_course_dialog");

        const courseName = document.querySelector("#edit_course_name");
        const courseDescription = document.querySelector("#edit_course_description");
        const courseLink = document.querySelector("#edit_course_link");
        const courseShouldShowSlide = document.querySelector("#edit_course_should_show_slide");

        const deleteCourseBtn = document.querySelector("#delete_course_btn");
        deleteCourseBtn.dataset.id = card.dataset.id;

        const editCourseBtn = document.querySelector("#edit_course_btn");
        editCourseBtn.dataset.id = card.dataset.id;

        courseShouldShowSlide.checked = card.dataset.shouldShowSlide === "1";

        courseName.value = card.dataset.name;
        courseDescription.value = card.dataset.description;
        courseLink.value = card.dataset.link;

        modal.showModal();
    });
}

function removeCardFromGrid(card){
    card.remove();
}

function removeSlideFromSlider(slide){
    slide.remove();
}

function updateSlideOnSlider(slide, course){
    
    slide.dataset.name = course.name;
    slide.dataset.description = course.description;
    slide.dataset.link = course.link;

    //update image
    if(course.image){
        const img = slide.querySelector("img");
        img.src = URL.createObjectURL(course.image);
    }

    slide.querySelector(".slide-title").textContent = course.name;
    slide.querySelector(".slide-text").textContent = course.description;
}

function updateCardOnGrid(card, course){

    card.dataset.name = course.name;
    card.dataset.description = course.description;
    card.dataset.link = course.link;
    card.dataset.shouldShowSlide = course.should_show_on_slider;

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

    const slide = document.querySelector(`.slide[data-id="${id}"]`);

    if(slide){
        removeSlideFromSlider(slide);

        getSlidesElements();
        generateDots();
        getDotsElements();
    }

    const modal = document.querySelector("#edit_course_dialog");
    modal.close();
});
