<?php
require_once '../app/models/Course.php';
require_once '../app/config/DbConnection.php';
require_once '../app/responses/DefaultResponse.php';
require_once '../app/dto/CourseDTO.php';

class CourseController
{
    private $course;

    public function __construct()
    {
        $pdo = DbConnection::getConnection();
        $this->course = new Course($pdo);
    }

    public function index()
    {
        $courses = $this->course->getAll();
        return DefaultResponse::json(true, "Courses retrieved successfully", $courses);
    }

    public function store($data)
    {

        if (!isset($data['name']) || empty($data['name'])) {
            return DefaultResponse::json(false, "Name is required");
        }

        if (!isset($data['description']) || empty($data['description'])) {
            return DefaultResponse::json(false, "Description is required");
        }

        if (!isset($data['link']) || empty($data['link'])) {
            return DefaultResponse::json(false, "Link is required");
        }

        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {

            return DefaultResponse::json(false, "Course image is required");
        }

        if(isset($data['should_show_slide']) && $data['should_show_slide'] === 'true') {
            if (!isset($_FILES['slide_image']) || $_FILES['slide_image']['error'] !== UPLOAD_ERR_OK) {
                return DefaultResponse::json(false, "Slide image is required if slide is to be shown");
            }
        }

        if (isset($_FILES['slide_image']) && $_FILES['slide_image']['error'] !== UPLOAD_ERR_OK) {
            return DefaultResponse::json(false, "Error uploading slide image");
        }

        if(isset($_FILES['slide_image']) && $_FILES['slide_image']['error'] === UPLOAD_ERR_OK) {
            
            try{
                $slideImageName = $this->handleFile($_FILES['slide_image']);
            } catch (Exception $e) {
                return DefaultResponse::json(false, $e->getMessage());
            }

        }

        try {
            $fileName = $this->handleFile($_FILES['image']);
        } catch (Exception $e) {
            return DefaultResponse::json(false, $e->getMessage());
        }

        try {
            $created = $this->course->create(
                new CourseDTO(
                    $data['name'],
                    $data['description'],
                    $data['link'],
                    $fileName,
                    isset($slideImageName) ? $slideImageName : null,
                    isset($data['should_show_slide']) && $data['should_show_slide'] == 'true' ? 1 : 0
                )
            );
        } catch (Exception $e) {
            return DefaultResponse::json(false, "Failed to create course" . $e->getMessage());
        }

        if (!$created) {
            return DefaultResponse::json(false, "Failed to create course");
        }

        return DefaultResponse::json(true, "Course created successfully", ['id' => $created]);
    }

    public function edit($id, $data)
    {

        try {
            $courseData = $this->course->findById($id);
        }
        catch (Throwable $e) {
            return DefaultResponse::json(false, "Failed to retrieve course");
        }

        if (!$courseData) {
            return DefaultResponse::json(false, "Course not found", [], 404);
        }

        $courseDto = CourseDTO::fromArray([
            'name' => $courseData['name'],
            'description' => $courseData['description'],
            'link' => $courseData['slide_link'],
            'image_url' => $courseData['img_url'],
            'slide_url' => $courseData['slide_img_url'],
            'should_show_slide' => $courseData['should_show_on_slider']
        ]);

        if (isset($data['name'])) {
            if (empty($data['name'])) {
                return DefaultResponse::json(false, "Name is required");
            }

            $courseDto->name = $data['name'];
        }

        if (isset($data['description'])) {

            if (empty($data['description'])) {
                return DefaultResponse::json(false, "Description is required");
            }

            $courseDto->description = $data['description'];
        }

        if (isset($data['link'])) {

            if (empty($data['link'])) {
                return DefaultResponse::json(false, "Link is required");
            }

            $courseDto->link = $data['link'];
        }

        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            try {
                $fileName = $this->handleFile($_FILES['image']);
                $courseDto->image_url = $fileName;
            } catch (Exception $e) {
                return DefaultResponse::json(false, $e->getMessage());
            }
        }

        if(isset($data['should_show_slide']) && $data['should_show_slide'] === 'true' && !$courseData['slide_img_url']) {
            if (!isset($_FILES['slide_image']) || $_FILES['slide_image']['error'] !== UPLOAD_ERR_OK) {
                return DefaultResponse::json(false, "Slide image is required if slide is to be shown", $courseData);
            }
        }

        if (isset($_FILES['slide_image']) && $_FILES['slide_image']['error'] === UPLOAD_ERR_OK) {
            try {
                $slideImageName = $this->handleFile($_FILES['slide_image']);
                $courseDto->slide_url = $slideImageName;
                $courseDto->should_show_slide = 1;
            } catch (Exception $e) {
                return DefaultResponse::json(false, $e->getMessage());
            }
        }

        if (isset($data['should_show_slide'])) {
            $courseDto->should_show_slide = $data['should_show_slide'] == 'true' ? 1 : 0;
        }

        $course = $this->course->update($id, $courseDto);

        if (!$course) {
            return DefaultResponse::json(false, "Failed to update course");
        }

        return DefaultResponse::json(true, "Course updated successfully");
    }

    public function show($id)
    {
        $course = $this->course->findById($id);

        if (!$course) {
            return DefaultResponse::json(false, "Course not found", [], 404);
        }

        return DefaultResponse::json(true, "Course retrieved successfully", $course);
    }

    public function destroy($id)
    {

        $model = $this->course->findById($id);

        if (!$model) {
            return DefaultResponse::json(false, "Course not found", [], 404);
        }

        $deleted = $this->course->delete($id);

        if (!$deleted) {
            return DefaultResponse::json(false, "Failed to delete course");
        }

        // delete image
        $imagePath = __DIR__ . "/../../public/" . $model['img_url'];

        if (file_exists($imagePath)){
            unlink($imagePath);
        }

        if($model['slide_img_url']) {
            $slideImagePath = __DIR__ . "/../../public/" . $model['slide_img_url'];

            if (file_exists($slideImagePath)){
                unlink($slideImagePath);
            }
        }

        return DefaultResponse::json(true, "Course deleted successfully");
    }

    private function handleFile($file){
        $fileSize = $file['size'];
        $fileType = $file['type'];

        if ($fileSize > 10000000) {
            throw new Exception("File size must be less than 10MB");
        }

        if (!in_array($fileType, ['image/jpeg', 'image/png'])) {
            throw new Exception("File type must be jpeg or png");
        }

        $fileTmpPath = $file['tmp_name'];

        $destinationDir = __DIR__ . "/../../public/images/";

        if (!is_dir($destinationDir)) {
            mkdir($destinationDir, 0777, true);
        }

        $fileName = $file['name'];

        $fileName = uniqid() . $fileName;

        $destination = $destinationDir . $fileName;

        try {
            $file = move_uploaded_file($fileTmpPath, $destination);

            if (!$file) {
                throw new Exception("Failed to upload file");
            }
        } catch (Exception $e) {
            throw new Exception("Failed to upload file");
        }

        return 'images/' . $fileName;
    }
}
