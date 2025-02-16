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

        try {
            $fileName = $this->handleFile($_FILES);
        } catch (Exception $e) {
            return DefaultResponse::json(false, $e->getMessage());
        }

        try {
            $created = $this->course->create(
                new CourseDTO(
                    $data['name'],
                    $data['description'],
                    $data['link'],
                    $fileName
                )
            );
        } catch (Exception $e) {
            return DefaultResponse::json(false, "Failed to create course");
        }

        if (!$created) {
            return DefaultResponse::json(false, "Failed to create course");
        }

        return DefaultResponse::json(true, "Course created successfully");
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

        $courseDto = CourseDTO::fromArray($courseData);

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
                $fileName = $this->handleFile($_FILES);
                $courseDto->image_url = $fileName;
            } catch (Exception $e) {
                return DefaultResponse::json(false, $e->getMessage());
            }
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
        if ($this->course->exists($id) === false) {
            return DefaultResponse::json(false, "Course not found", [], 404);
        }

        $deleted = $this->course->delete($id);

        if (!$deleted) {
            return DefaultResponse::json(false, "Failed to delete course");
        }

        return DefaultResponse::json(true, "Course deleted successfully");
    }

    private function handleFile($file){
        $fileSize = $file['image']['size'];
        $fileType = $file['image']['type'];

        if ($fileSize > 10000000) {
            throw new Exception("File size must be less than 10MB");
        }

        if (!in_array($fileType, ['image/jpeg', 'image/png'])) {
            throw new Exception("File type must be jpeg or png");
        }

        $fileTmpPath = $file['image']['tmp_name'];

        $destinationDir = __DIR__ . "/../../public/images/";

        if (!is_dir($destinationDir)) {
            mkdir($destinationDir, 0777, true);
        }

        $fileName = $file['image']['name'];

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

        return $fileName;
    }
}
