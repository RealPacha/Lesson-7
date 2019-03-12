var doc = document;

var size = doc.getElementById('sizeSelect'); //ID изменения размера
var newColor = doc.getElementById('color'); //ID изменения цвета
var canvas = doc.getElementById('canv'); //ID поля рисования
var ctx = canvas.getContext('2d'); //Рисование в дмуверном пространстве
var xCoord = doc.getElementById('xCoord'); //ID координаты x
var yCoord = doc.getElementById('yCoord'); //ID координаты y
var tools = ['brush', 'line', 'rectangle']; //Массив инструментов рисования
var activeTool = ''; //Активный инструмент рисования
var wid = doc.getElementById('wid'); //ID ширины прямоугольник
var hei = doc.getElementById('hei'); //ID высоты прямоугольника
var delet = doc.getElementById('del'); //ID удаления


var system = { //Создание объекта, в котором хранится:
	width: canvas.getAttribute('width'), //Длинна
	height: canvas.getAttribute('height'), //Высота
	currentColor: newColor.value, //Цвет, в данный момент
	currentTool: '', //Инструмент, в данный момент
	brushSize : size.value //Размер кисти, в данный момент
};

//рендер Системы
var renderSystem = function (obj, elem, action) {
	obj[elem] = action;
};

var getCoordinates = function (evt) { //Функция вывода координат
	let mas = {}; //Создание объекта
	let x = evt.offsetX; //x = отступ от координаты x
	let y = evt.offsetY; //y = отступ от координаты y

	mas = {x : x, y : y}; //Заполняем объект координатами, с соответствующими ключами
	xCoord.innerText = x; //Выводим значение координаты x в span
	yCoord.innerText = y; //Выводим значение координаты y в span

	return mas;
};

var switchSize = function (list) { //Функция смены размера кисти
	return list.value; //Выбрать размер кисти
};

var switchColor = function (colorInput) { //Функция смены цвета
	return colorInput.value; //Вернуть выбранный цвет
};

var switchTool = function (button) { //Функция выбора инструмента
	if (button.id == 'brush') { //Если нажата кнопка кисти
		return 'brush' //Вернуть кисть
	} else if (button.id == 'line') { //Или, если выбрана линия
		return 'line' //Выбрать её
	} else if (button.id == 'rectangle') { //Или, выбрано что-то еще
		return 'rectangle' //Выбрать это
	}
};

var mouseActionsClick = function (evt) { //Функция события, в зависимости куда нажали
	if (evt.target.classList.contains('toolButton') == true) { //Если нажата одна из кнопок
		renderSystem (system, 'currentTool', switchTool (evt.target)); //Выбрать соответствующий инструмент
	} else if (evt.target.id == 'sizeSelect') { //Или, если нажата кнопка выбора размера кисти
		renderSystem (system, 'brushSize', switchSize (evt.target)); //Выбрать соответствующий размер
	} else if (evt.target.id == 'color') { //Или, если нажата кнопка выбора цвета
		renderSystem (system, 'currentColor', switchColor (evt.target)); //Выбрать цвет
	}
};

//РИСОВАНИЕ
var startDraw = function (evt) { //Функция начала рисования
	if (system.currentTool == 'brush') { //Если выбрана кисть
		drawDot (evt); //Вызываем функцию рисования кистью
	} else if (system.currentTool == 'line') { //Если выбрана линия
		drawLines (evt);  //Вызываем функцию рисования линий
	} else if (system.currentTool == 'rectangle') { //Если выбран прямоугольник
		drawRec (evt);  //Вызываем функцию рисования прямоугольника
	}
};

//ЛИНИИ
var drawLines = function (evt) { //Функция рисования линий
	canvas.onmousedown = function (evt){ //Функция, которая рисует при нажатии мыши
		ctx.beginPath(); //Начать рисовать
		ctx.fillStyle = system.currentColor; //Рисовать выбранным цветом
		ctx.moveTo(500, 400);  //Начальная точка рисования (!!!ПОЧЕМУ-ТО РИСУЕТСЯ ТОЛЬКО ПРИ ЗАДАННОМ НАЧАЛЬНОМ ЗНАЧЕНИИ!!!)
    	ctx.lineTo(xCoord.innerText, yCoord.innerText); //Конечная точка рисования
    	ctx.stroke(); //Построить фигуру, которая была нарисована
    	ctx.closePath(); //Конец рисования
	}
};
canvas.onmousedown = null; //Обнуление события мыши

//ПРЯМОУГОЛЬНИК
var drawRec = function (evt) { //Функция рисования прямоугольников
	canvas.onmousedown = function (evt){ //Функция, которая рисует при отпускании кнопки мыши
		ctx.beginPath(); //Начать рисовать
		ctx.fillStyle = system.currentColor; //Рисовать выбранным цветом
		ctx.strokeRect(xCoord.innerText, yCoord.innerText, wid.value, hei.value); //Рисовать прямоугольник в выбранных координатах, с выбранной длинной и высотой
		ctx.closePath(); //Конец рисования
	}
};

//КИСТЬ
var drawDot = function (evt) { //Функция рисования
	canvas.onmousemove = function (evt) { //Функция, которая рисует при движении мыши
		ctx.beginPath(); //Начать рисовать
		ctx.fillStyle = system.currentColor; //Рисовать выбранным цветом
		ctx.fillRect (xCoord.innerText, yCoord.innerText, system.brushSize, system.brushSize); //Рисовать в координате x и y, с выбранным размером
		ctx.closePath(); //Конец рисования
	}
};

var endDraw = function (evt) { //Функция конца рисования
	canvas.onmousemove = null; //Обнуление события мыши
};

var del = function (){ //Функция очистки всего поля
	ctx.clearRect(0, 0, canvas.width, canvas.height); //Очистить с 0, 0 до ширины и высоты всего поля
}

delet.addEventListener('click', del); //Активировать удаление
canvas.addEventListener ('mousemove', getCoordinates); //Активация получения координат
doc.addEventListener ('click', mouseActionsClick); //Активация кликов
canvas.addEventListener ('mousedown', startDraw); //Мышь нажата, рисуем
canvas.addEventListener ('mouseup', endDraw); //Мышь отжата, прекращаем рисовать

//ВРЕМЯ
var time = function () { //Функция времени
	var date = new Date(); //Вызов функции времени
	var h = date.getHours(); //Получение часов
	var m = date.getMinutes(); //Получение минут
	var s = date.getSeconds(); //Получение секунд
	m = checkTime(m); //Вызов функции checkTime для минут
	s = checkTime(s); //Вызов функции checkTime для секунд
	document.getElementById('date').innerHTML = h + ":" + m + ":" + s; //Вывод в эемелент с id = 'date' времени
	t = setTimeout('time()', 1000); //Обновлять функцию time() каждые 1000 миллисекунд (1 секунда)
}

var checkTime = function (i) { //Функция прибавление 0
	if (i < 10) { //Если минут или секунд < 10
		i = "0" + i; //То пририсовываем им вначало "0"
	}
	return i; //Иначе просто возвращаем текущую минуту/секунду
}