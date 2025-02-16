<?php
require_once '../app/dto/CourseDTO.php';

class Course
{
    private \PDO $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function getAll()
    {
        $stmt = $this->pdo->query("SELECT * FROM courses");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create(CourseDTO $courseDTO)
    {
        $stmt = $this->pdo->prepare("
            INSERT INTO courses 
                (name, description, slide_link, img_url, slide_img_url, should_show_on_slider) 
            VALUES 
                (?, ?, ?, ?, ?, ?)
        ");
        
        $result = $stmt->execute([
            $courseDTO->name,
            $courseDTO->description,
            $courseDTO->link,
            $courseDTO->image_url,
            $courseDTO->slide_url,
            $courseDTO->should_show_slide
        ]);

        if (!$result) {
            return false;
        }

        return $this->pdo->lastInsertId();
    }

    public function update($id, CourseDTO $courseDTO)
    {
        $stmt = $this->pdo->prepare("
            UPDATE 
                courses 
            SET 
                name = ?, 
                description = ?,
                slide_link = ?,
                img_url = ?,
                slide_img_url = ?,
                should_show_on_slider = ?
            WHERE id = ?
        ");
        return $stmt->execute([
            $courseDTO->name,
            $courseDTO->description,
            $courseDTO->link,
            $courseDTO->image_url,
            $courseDTO->slide_url,
            $courseDTO->should_show_slide,
            $id
        ]);
    }

    public function findById($id)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM courses WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function exists($id)
    {
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM courses WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetchColumn() > 0;
    }

    public function delete($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM courses WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
