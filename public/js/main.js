var courses = [];

const modalVisit = document.querySelector('#visit_dialog');

document.addEventListener("DOMContentLoaded", async () => {
    if (!localStorage.getItem("modal_shown")) {
        modalVisit.showModal();
        localStorage.setItem("modal_shown", "true");
    }

    courses = await getCourses();

    buildCourseGrid(courses);

    buildSlider(courses.filter(course => course.should_show_on_slider === 1));
});

document.querySelectorAll('.modal-close-btn').forEach((btn) => {
    btn.addEventListener('click', function() {

        const dialog = this.closest('dialog');
        if(dialog){
            dialog.close();
        }
    });
});