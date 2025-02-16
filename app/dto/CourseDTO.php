<?php

class CourseDTO
{
    public string $name;
    public string $description;
    public string $link;
    public string $image_url;
    public ?string $slide_url;
    public ?int $should_show_slide;

    public function __construct(string $name, string $description, string $link, string $image_url, ?string $slide_url = null, ?int $should_show_slide = 0)
    {
        $this->name = $name;
        $this->description = $description;
        $this->link = $link;
        $this->image_url = $image_url;
        $this->slide_url = $slide_url;
        $this->should_show_slide = $should_show_slide;
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
            'link' => $this->link,
            'image_url' => $this->image_url,
            'slide_url' => $this->slide_url,
            'should_show_slide' => $this->should_show_slide
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
            $data['image_url'],
            $data['slide_url'] ?? null,
            $data['should_show_slide'] ?? 0
        );
    }
}
