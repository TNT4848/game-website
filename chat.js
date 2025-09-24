<?php
// CORS headers — must be at the top
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Database credentials
$host = "mysql.apexhosting.gdn";
$user = "apexMC2653852";
$pass = "y2fXcWQni2iqD5IWS^n@Nvp#";
$db   = "apexMC2653852";

// Connect
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) die(json_encode(["error" => "DB connection failed"]));

// Determine request method
$method = $_SERVER['REQUEST_METHOD'];

// GET: fetch messages
if ($method === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get') {
    $res = $conn->query("SELECT * FROM chat ORDER BY id ASC");
    $messages = [];
    while ($row = $res->fetch_assoc()) {
        $messages[] = ["message" => $row['message']];
    }
    echo json_encode($messages);
}

// POST: send message
if ($method === 'POST') {
    // Read POST data
    $action = $_POST['action'] ?? '';
    $message = $_POST['message'] ?? '';

    if ($action === 'send' && $message !== '') {
        $stmt = $conn->prepare("INSERT INTO chat (message) VALUES (?)");
        $stmt->bind_param("s", $message);
        $stmt->execute();
        $stmt->close();
        echo json_encode(["success" => true]);
    }
}

$conn->close();
?>
