<?php

require_once '../app/controllers/CourseController.php';
require_once '../app/responses/DefaultResponse.php';

// Get the request URL
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// cors
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

if($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

//build data array
if ($_SERVER['REQUEST_METHOD'] === 'POST' && str_contains($_SERVER['CONTENT_TYPE'], 'multipart/form-data')) {
    $data = $_POST;
}
else {
    $data = json_decode(file_get_contents('php://input'), true);
}

if ($uri === '/courses' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    echo (new CourseController())->index();
} 
elseif ($uri === '/courses' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    echo (new CourseController())->store($data);
} 
elseif (preg_match('/^\/courses\/(\d+)$/', $uri, $matches) && $_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['_method'] === 'PUT') {
    $id = $matches[1];
    echo (new CourseController())->edit($id, $data);
}
elseif (preg_match('/^\/courses\/(\d+)$/', $uri, $matches) && $_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $matches[1];
    echo (new CourseController())->destroy($id);
}
else {
    echo DefaultResponse::json(false, "Route not found", [], 404);
}
