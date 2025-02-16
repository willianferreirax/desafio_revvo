<?php

class CourseDTO
{
    public string $name;
    public string $description;
    public string $link;
    public string $image_url;

    public function __construct(string $name, string $description, string $link, string $image_url)
    {
        $this->name = $name;
        $this->description = $description;
        $this->link = $link;
        $this->image_url = $image_url;
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
            'link' => $this->link,
            'image_url' => $this->image_url
        ];
    }

    /**
     * Create a CourseDTO from an array
     *
     * @param array {name, description, link}
     * @return CourseDTO
     */
    public static function fromArray(array $data): CourseDTO
    {
        return new CourseDTO(
            $data['name'],
            $data['description'],
            $data['link'],
            $data['image_url']
        );
    }
}
