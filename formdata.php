<?php

$result = mail("test@test.ru","Анкета листа","З сайту була отримана наступна інформація:\nІм'я:$_POST[name]\nПовідомлення від читача:$_POST[message]");
if ($result){
	echo "<p>Повідомлення надіслано успішно</p>";
}
else {
	echo "<p> Усп! Сталася помилка!</p>";
}
?>