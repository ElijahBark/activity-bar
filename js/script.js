//----------data-------------
let persons = [
    {
        name: "Nicole",
        logo: 'images/userphoto/0.jpeg'
    },
    {
        name: "Alexa",
        logo: 'images/userphoto/1.jpeg'
    },
    {
        name: "Betty",
        logo: 'images/userphoto/2.jpeg'
    },
    {
        name: "Ciri",
        logo: 'images/userphoto/3.jpeg'
    },
    {
        name: "Debra",
        logo: 'images/userphoto/4.jpeg'
    },
    {
        name: "Ellis",
        logo: 'images/userphoto/5.jpeg'
    },
    {
        name: "Francis",
        logo: 'images/userphoto/6.jpeg'
    },
    {
        name: "Amber",
        logo: 'images/userphoto/7.jpeg'
    },
    {
        name: "Kimmy",
        logo: 'images/userphoto/8.jpeg'
    },
    {
        name: "Anna",
        logo: 'images/userphoto/9.jpeg'
    },
    {
        name: "Rachel",
        logo: 'images/userphoto/10.jpeg'
    },
    {
        name: "Robin",
        logo: 'images/userphoto/11.jpeg'
    },
    {
        name: "Lily",
        logo: 'images/userphoto/12.jpeg'
    },
    {
        name: "Michelle",
        logo: 'images/userphoto/13.jpeg'
    },
    {
        name: "Jenna",
        logo: 'images/userphoto/14.jpeg'
    },
];
let surprises = [['animals', 15], ['food', 26], ['halloween', 7], ['NY-17', 7]];
let messages = ['Привет! Как ты относишься к знакомствам в Интернете?',
    'Привет! Как ты относишься к пассионарной теории этногенеза?',
    'Привет! Какой у тебя любимый покемон?',
    'Привет! Что ты думаешь о причинах поражения белого движения в Гражданской войне?',
    'Привет! Можешь занять косарь на пару недель?',
    'Привет! За две минуты объясни принцип квантовой электродинамики. Начинай',
    'Привет! Оцени себя по десятибалльной шкале, насколько ты странная?',
    'Привет! Представь,ты стала размером с карандаш и попала в блендер. Как планируешь выбираться наружу?',
    'Привет! Что такое философия боевых искусств в твоём понимании?',
    'Привет! Расскажи, что творится в стране последние десять лет?',
    'Привет! Кем бы ты стала из супергероев?'
];


//-------activities-kinds
class Activity {
    constructor(person) {
        this.person = person;
    }
}

class Sticker extends Activity {
    constructor(person) {
        super(person);
        let {name, logo} = this.person;
        this.title = 'Обрадуйте стикером!';
        this.message = `Привлеките внимание пользователя ${name}`;
        this.logo = logo;
        this.image = `images/stickers/${randomNumberTo(8)}.png`;
        this.type = 'sticker';

    }
}

class Surprise extends Activity {
    constructor(person) {
        super(person);
        let {name, logo} = this.person;
        this.title = 'Отправьте сюрприз!';
        this.message = `${name} будет рада`;
        this.logo = logo;
        let [kind, imageNum] = [...surprises[randomNumberTo(surprises.length - 1)]];
        this.image = `images/surprises/${kind}/${randomNumberTo(imageNum)}.png`;
        this.type = 'surprise';
    }
}

class Greeting extends Activity {
    constructor(person) {
        super(person);
        let {name, logo} = this.person;
        this.title = `${name} ждет приветствий!`;
        this.message = messages[randomNumberTo(messages.length - 1)];
        this.logo = logo;
        this.type = 'greeting';
        this.image = '';
    }
}

function randomNumberTo(limit) {
    return Math.round(Math.random() * limit)
}

let model = {
    children: 0,
    isAutosendOn: false,
    isHidden: false
};

//--------activity-manipulation
function activityCreator() {
    let num = randomNumberTo(2);
    let person = persons[randomNumberTo(persons.length - 1)];
    let activity;
    switch (num) {
        case 0:
            activity = new Sticker(person);
            break;
        case 1:
            activity = new Surprise(person);
            break;
        case 2:
            activity = new Greeting(person);
            break;
    }

    model.children +=1;
    return activity;
}

function activityPost(activity, root) {
    let id = activity.type + new Date().getMilliseconds() + activity.logo;
    root.append(`<div data-atr="${id}" class="activity__item activity__item_type_${activity.type} ${id}"><h3 class="activity__item-title">${activity.title}</h3><p class="activity__item-text text text__type_small">${activity.message}</p><div class="activity__item-image" style="background-image: url(${activity.image})"></div><div class="activity__item-logo" style="background-image: url(${activity.logo})"></div><div class="js-autosend-popup"><span>Отправлено другим пользователем</span></div></div>`);
    let timeToDie =  Math.random() * 60000 + 60000;
    let $activityElement = $(`.activity__item[data-atr="${id}"]`);
    if (model.isAutosendOn) {
        $(`.activity__item[data-atr="${id}"]`).addClass('js-item-autosend');
    }
    if (model.isHidden) {
        $(`.activity__item[data-atr="${id}"]`).addClass('js-display-none');
    }
    setTimeout(()=>{
        $activityElement.addClass('js-already-send');
    },  timeToDie - 10000);
    setTimeout(() => {
        $activityElement.remove();
        model.children -= 1;
    }, timeToDie);
}


function addActivityToPage(num) {
    let $activityRoot = $('.activity__items');
    for (let i = 0; i < num; i++) {
        let activity = activityCreator();
        activityPost(activity, $activityRoot);
    }
    let timeout = setTimeout (function f () {
        let activity = activityCreator();
        model.children <4 ? activityPost(activity, $activityRoot): null;
        timeout = setTimeout(f, Math.random() * 10000 + 10000 );
    }, Math.random() * 60000 + 60000);

}

$(document).on("click", '.activity__item ',  function () {
    if(!$(this).hasClass('js-already-send')) {
        model.children -= 1;
        $(this).remove()
    }
});

addActivityToPage(4);


$(".activity__autosend-text").click((e) => {
    $(e.target.parentNode).toggleClass('js-autosend-active');
    $('.activity__item').toggleClass('js-item-autosend');
    model.isAutosendOn = !model.isAutosendOn;
    $(e.target).toggleClass('js-autosend-text');
});

$(".activity__header-icon").click((e) => {
    model.isHidden = !model.isHidden;
    $(e.target).toggleClass('js-rotate');
    $('.activity__others').toggleClass('js-display-none');
    $('.activity__item').toggleClass('js-display-none');
});

//-------------others-block-----------------
let numOfOthers;
function activityOthersChanges() {
    let others = $('.js-others-text');
    let timeout = setTimeout(function f() {
        let interval = Math.ceil(Math.random() * 20000 + 10000);
        numOfOthers = Math.ceil(Math.random() * 20);
        others.text(`Еще ${numOfOthers} человек видит ленту`);
        timeout = setTimeout(f, interval)
    }, 10000);
}

activityOthersChanges();

let $popup = $('.activity__others-popup');
let $popupText = $('.activity__others-popup-text');

$('.activity__others').click(()=>{
    $popupText.text(`Еще ${numOfOthers? numOfOthers: 9} человек могут видеть эту ленту и имеют возможность отправлять такую активность, поторопитесь и будьте первым.`);
    $popup.toggleClass('js-active');
});

$popup.click(function (e) {
    e.stopPropagation();
});

$('.activity__others-popup-close').click(()=>{
    $popup.removeClass('js-active');
});


