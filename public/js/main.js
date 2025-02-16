var courses = [];

const modalVisit = document.querySelector('#visit_dialog');

document.addEventListener("DOMContentLoaded", async () => {
    if (!localStorage.getItem("modal_shown")) {
        modalVisit.showModal();
        localStorage.setItem("modal_shown", "true");
    }

    courses = await getCourses();

    buildCourseGrid(courses);
});

document.querySelectorAll('.modal-close-btn').forEach((btn) => {
    btn.addEventListener('click', function() {

        const dialog = this.closest('dialog');
        if(dialog){
            dialog.close();
        }
    });
});