<?php
require "pretty-json.php";
$permission = true;
$reg_tel = "/\+7\ \(\d\d\d\)\ \d\d\d\-\d\d\-\d\d/";
$reg_name = "/[A-Za-zА-Яа-яЁё]/";
$data = file_get_contents('php://input'); 
$decode_data = json_decode($data,true);

$answer = count($decode_data);

$answer =array(
    "ok" => false,
    "page" => "",
);

if (!preg_match($reg_tel,$decode_data['tel'])) $permission = false;
if (!preg_match($reg_name,$decode_data['name'])) $permission = false;

$check = "";

foreach ($decode_data as $value) {
    if (gettype($value) === "string") {
        $len = mb_strlen($value);
        if ( $len < 2 || $len > 100) $permission = false;
    };
    if (gettype($value) === "array") {
        if (gettype($value['answer']) === "string") {
            $len = mb_strlen($value['answer']);
            if ( $len < 2 || $len > 100) $permission = false;
        };
        if (gettype($value['answer']) === "array") {
            foreach ($value['answer'] as $elem) {
                $len = mb_strlen($elem);
                if ( $len < 2 || $len > 100) $permission = false;
            };
        }
    };
};

$send_text = "";

if ($permission === true) {
    foreach ($decode_data as $value) {
        if (gettype($value) === "string") {
            $send_text .= $value . PHP_EOL;
        }
        if (gettype($value) === "array") {
            $send_text .= "<strong>" . $value['question'] . "</strong>" . PHP_EOL;
            if (gettype($value['answer']) === "string") {
                $send_text .= $value['answer'] . PHP_EOL;
            }
            if (gettype($value['answer']) === "array") {
                foreach ($value['answer'] as $elem)
                $send_text .= $elem . PHP_EOL;
            }
            $send_text .= PHP_EOL;
        }
    }

    // гриша
    $token = "1524720512:AAEDVWcBevpz3TiPda0VC2BO3k4FpeSaivA";
    $chat_id = "-574660350";
    // саша 
    // $token = "1824349737:AAGKSR09PNa69LEBkSpTTNL6TsA7kyydhtw";
    // $chat_id = "-536920162";
   
    $ch = curl_init();
    curl_setopt_array(
        $ch,
        array(
            CURLOPT_URL => 'https://api.telegram.org/bot' . $token . '/sendMessage',
            CURLOPT_POST => TRUE,
            CURLOPT_RETURNTRANSFER => TRUE,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_POSTFIELDS => array(
                'chat_id' => $chat_id,
                'text' => $send_text,
                'parse_mode' => 'HTML'
            ),
        )
    );
    $res = curl_exec($ch);
    curl_close($ch);

    $decode_res = json_decode($res,true);

    if ($decode_res['ok'] === true) {
        $answer['ok'] = $decode_res['ok'];
        $answer['page'] = 'quiz-thank.html';
    } else {
        $answer['ok'] = $decode_res['ok'];
    };    
}

echo json_encode($answer);
?>