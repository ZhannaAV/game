const color = ['mediumspringgreen', "dodgerblue", 'aqua', 'seagreen', 'greenyellow', 'yellow', 'darkturquoise', 'teal', 'cyan']
const radius = 30;
let rate = 5;
let time = 60;
let scoreWin = 0;
let scoreLose = 0;
let bolls = [];
let wind = [];
let canvas = document.querySelector('.canvas');
const canvasWidth = 400, canvasHeight = 580;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
let context = canvas.getContext('2d');
const startBtn = document.querySelector('.start');
const playScore = document.querySelector('.score');
const timeScore = document.querySelector('.time');
const gameOver = document.querySelector('.table_position_center')

let needle = new Needle(canvasWidth, 4, 35)

function renewScore() {
    playScore.textContent = `${scoreWin}`;
}

// меняет положение иглы при нажатии стрелок влево/вправо
function needleMove(evt) {
    if (evt.key === 'ArrowLeft') return needle.moveLeft()
    if (evt.key === 'ArrowRight') return needle.moveRight()
}

//запускает игру при нажатии кнопки старт
startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';
    renewScore();
    document.addEventListener('keydown', needleMove);
    let generateBollsInterval = setInterval(generateBolls, 2000);
    let checkBoomInterval = setInterval(checkBoom, 40);
    let windInterval = setInterval(windArrow, 2000);
    let renderInterval = setInterval(render, 40);

    //счетчик обратного отсчета времени
    let timerId = setTimeout(function renewTime() {
        time--;
        timeScore.textContent = `${time}`;
        if (time > 0) {
            if (time === 24 || time === 18 || time === 12 || time === 6) rate++;//ускоряет скорость шаров
            timerId = setTimeout(renewTime, 1000);
        } else {
            stop(generateBollsInterval, checkBoomInterval, windInterval, renderInterval)
        }
    }, 1000)
})

//останавливает игру по истечении time
function stop(generateBollsInterval, checkBoomInterval, windInterval, renderInterval) {
    document.removeEventListener('keydown', needleMove);
    clearInterval(generateBollsInterval);
    clearInterval(checkBoomInterval);
    clearInterval(windInterval);
    renderInterval = setInterval(render, 4);
    setTimeout(() => {
        clearInterval(renderInterval)
    }, 4000)
    gameOver.style.display = 'block';
    gameOver.textContent = `Время истекло. Лопнуто: ${scoreWin}. Пропущено: ${scoreLose}`
}

//генерация шаров
function generateBolls() {
    bolls.push(new BollModel(canvasWidth, canvasHeight, radius, rate))
}

//проверка проколот или пропущен шар
function checkBoom() {
    bolls.forEach((boll, index, array) => {
        if (isBoom(boll, needle)) {
            array[index] = new BollModel(canvasWidth, canvasHeight, radius, rate);
            scoreWin++;
            renewScore();
        }
        if (isPass(boll)) {
            array[index] = new BollModel(canvasWidth, canvasHeight, radius, rate);
            scoreLose++;
        }
    })
}

//проверка прокола шара
function isBoom(boll, needle) {
    return Math.sqrt((needle.x - boll.x) ** 2 + (needle.y - boll.y) ** 2) <= boll.r;
}

//проверка, что шарик прошел мимо иглы
function isPass(boll) {
    return boll.y <= 0 && boll.y > (-rate)
}

//массив скоростей ветра
function windArrow() {
    let v = Math.random() * 2;
    const symbol = Math.random() * 2;
    if (symbol < 1) {
        v = -v;
        wind[3] = v;
        for (let i = 4; i > 1; i--) {
            wind[4 - i] = v / i / 2
        }
    } else {
        wind[0] = v;
        for (let i = 2; i < 5; i++) {
            wind[i - 1] = v / i / 2
        }
    }
    return wind
}

//обновление координат шаров
function updateBolls() {
    bolls.forEach(boll => {
        boll.update();
        boll.windUpdate(wind);
    });
}

//обновление изображения canvas
function render() {
    updateBolls();
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.fillStyle = needle.color;
    context.fillRect(needle.x, needle.y, needle.weight, needle.length);
    bolls.forEach(boll => {
        context.fillStyle = boll.color;
        context.beginPath();
        context.arc(boll.x, boll.y, boll.r, 0, 2 * Math.PI, false);
        context.fill();
    })
}

