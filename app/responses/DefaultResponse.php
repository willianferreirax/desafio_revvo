<?php

class DefaultResponse
{

    public static function json(
        bool $success,
        string $message = "",
        array $data = [],
        int $statusCode = 200
    )
    {
        header('Content-Type: application/json');
        http_response_code($statusCode);
        return json_encode([
            "success" => $success,
            "message" => $message,
            "data" => $data
        ]);
    }
}