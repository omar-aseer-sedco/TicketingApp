const url = 'https://bankConfigurationPortal.local/api/Screens';
const branchId = 3;
const counterId = 17;
const authorization = 'YmFuazE6dXNlcjE6YQ==';

const defaultLanguage = 'en';
const defaultDirection = 'ltr';

var stringsEn = {
    title: "Omar's Ticketing App",
    back: "Back",
    error: "Error",
    issueTicketMessage: "A ticket has been issued for",
    badRequest: "Bad request - check your configuration",
    unauthorized: "Authorization failed",
    notFound: "Not Found - Your bank does not have any active screens",
    internalServerError: "Internal server error",
    unexpectedError: "Unexpected error",
    welcome: "Welcome to",
    switchLanguage: "عربي",
}

var stringsAr = {
    title: "تطبيق التذاكر",
    back: "عودة",
    error: "خطأ",
    issueTicketMessage: "تم إصدار تذكرة لـ",
    badRequest: "طلب خاطئ، تأكد من صحة الإعدادات",
    unauthorized: "بيانات الاعتماد غير صالحة",
    notFound: "غير موجود: البنك لا يملك أي شاشات مفعلة حالياً",
    internalServerError: "خطأ داخلي",
    unexpectedError: "خطأ غير متوقع",
    welcome: "أهلاً بك في",
    switchLanguage: "English",
}

function getString(key, language = 'en') {
    try {
        switch (language) {
            case 'ar':
                return stringsAr[key];
            case 'en':
                return stringsEn[key];
            default:
                return stringsEn[key];
        }
    }
    catch (error) {
        logError(error);
    }
}

function startClock() {
    try {
        const languageString = localStorage.getItem('language');
        const now = new Date();
        const date = now.toLocaleDateString(languageString ? languageString : defaultLanguage);
        const time = now.toLocaleTimeString(languageString ? languageString : defaultLanguage);
    
        const datetime = document.getElementById('date-and-time');
        datetime.innerText = `${date} - ${time}`;
    
        setTimeout(startClock, 1000);
    }
    catch (error) {
        logError(error);
    }
}

function setButtonEvent(buttonElement, ticketingButton) {
    try {
        let messageEn = '';
        let messageAr = '';
        if (ticketingButton['Type'] === 'ISSUE_TICKET') {
            messageEn = `${getString('issueTicketMessage', 'en')} ${ticketingButton['ServiceNameEn']}`;
            messageAr = `${getString('issueTicketMessage', 'ar')} ${ticketingButton['ServiceNameAr']}`;
            buttonElement.addEventListener('click', () => {
                displayMessage(messageEn, messageAr);
                issueTicket(ticketingButton['ServiceId']);
            });
        }
        else if (ticketingButton['Type'] === 'SHOW_MESSAGE') {
            messageEn = ticketingButton['MessageEn'];
            messageAr = ticketingButton['MessageAr'];
            buttonElement.addEventListener('click', () => {
                displayMessage(messageEn, messageAr);
            });
        }
        else {
            console.error("Invalid button type.");
        }
    }
    catch (error) {
        logError(error);
    }
}

let globalBackTimeout;

function displayMessage(messageEn, messageAr) {
    try {
        const messageBody = document.getElementById('message-body');
        localStorage.setItem('englishMessage', messageEn);
        localStorage.setItem('arabicMessage', messageAr);
        messageBody.innerHTML = localStorage.getItem('language') === 'en' ? messageEn : messageAr;

        showMessageContainer();
        hideButtonsContainer();
        hideWelcomeMessage();

        globalBackTimeout = setTimeout(goBack, 10000);
    }
    catch (error) {
        logError(error);
    }
}

function displayErrorMessage(errorName) {
    try {
        const errorMessageBody = document.getElementById('error-message-body');

        localStorage.setItem('errorName', errorName);
        errorMessageBody.innerHTML = getString(errorName, localStorage.getItem('language'));

        hideButtonsContainer();
        showErrorMessageContainer();
        hideWelcomeMessage();
    }
    catch (error) {
        logError(error);
    }
}

function issueTicket(serviceId) {
    try {
        console.log(`Ticket ${serviceId} issued (jk i don't do anything)`);
    }
    catch (error) {
        logError(error);
    }
}

function getButtons() {
    try {
        document.getElementById('buttons-container').innerHTML = '';
    }
    catch (error) {
        logError(error);
    }

    fetch(`${url}?branchId=${branchId}&counterId=${counterId}`, {headers: {'authorization': authorization}})
        .then(response => {
            if (!response.ok) {
                switch (response.status) {
                    case 400:
                        displayErrorMessage('badRequest');
                        break;
                    case 401:
                        displayErrorMessage('unauthorized');
                        break;
                    case 404:
                        displayErrorMessage('notFound');
                        break;
                    case 500:
                        displayErrorMessage('internalServerError');
                        break;
                    default:
                        displayErrorMessage('unexpectedError');
                        break;
                }
                
                throw new Error(`(${response.status}) Failed to fetch buttons.`);
            }

            return response.json();
        })
        .then(data => {
            displayCounterInformation(data['BankName'], localStorage.getItem('language') === 'en' ? data['BranchNameEn'] : data['BranchNameAr']);
            loadButtons(data['Buttons']);
        })
        .catch(error => logError(error));
}

function loadButtons(buttons) {
    try {
        const buttonsContainer = document.getElementById('buttons-container');
        
        buttons.forEach(button => {
            const buttonElement = document.createElement('button');
            buttonElement.classList.add('ticketing-button');
            buttonElement.innerHTML = button[localStorage.getItem('language') === 'en' ? 'NameEn' : 'NameAr'];
            setButtonEvent(buttonElement, button);
            
            buttonsContainer.appendChild(buttonElement);
        });
    }
    catch (error) {
        logError(error);
    }
}

function displayCounterInformation(bankName, branchName) {
    try {
        document.getElementById('page-title').innerText = bankName;
        document.getElementById('welcome-message').innerText = `${getString('welcome', localStorage.getItem('language'))} ${branchName}`;
    }
    catch (error) {
        logError(error);
    }
}

function goBack() {
    try {
        showButtonsContainer();
        showWelcomeMessage();
        hideMessageContainer();

        clearTimeout(globalBackTimeout);
    }
    catch (error) {
        logError(error);
    }
}

function changeLanguage(languageString = defaultLanguage) {
    try {
        switch (languageString) {
            case 'ar':
                localStorage.setItem('language', 'ar');
                document.body.dir = 'rtl';
                break;
            case 'en':
                localStorage.setItem('language', 'en');
                document.body.dir = 'ltr';
                break;
            default:
                localStorage.setItem('language', defaultLanguage);
                document.body.dir = defaultDirection;
                break;
        }
    
        getButtons();
        updateHtmlStrings();
    }
    catch (error) {
        logError(error);
    }
}

function updateHtmlStrings() {
    try {
        const languageString = localStorage.getItem('language');
        document.title = getString('title', languageString);
        document.getElementById('back-button').innerText = getString('back', languageString);
        document.getElementById('language-button').innerText = getString('switchLanguage', languageString);
        document.getElementById('error-message-title').innerHTML = getString('error', languageString) + ':';
        document.getElementById('error-message-body').innerHTML = getString(localStorage.getItem('errorName'), languageString);
        document.getElementById('message-body').innerHTML = languageString === 'en' ? localStorage.getItem('englishMessage') : localStorage.getItem('arabicMessage');
    }
    catch (error) {
        logError(error);
    }
}

function toggleLanguage() {
    try {
        const languageString = localStorage.getItem('language');
        if (languageString === 'en') {
            changeLanguage('ar');
        }
        else {
            changeLanguage('en');
        }
    }
    catch (error) {
        logError(error);
    }
}

function showWelcomeMessage() {
    try {
        const buttonsContainer = document.getElementById('welcome-message');
        buttonsContainer.style.display = null;
    }
    catch (error) {
        logError(error);
    }
}

function hideWelcomeMessage() {
    try {
        const buttonsContainer = document.getElementById('welcome-message');
        buttonsContainer.style.display = 'none';
    }
    catch (error) {
        logError(error);
    }
}

function showButtonsContainer() {
    try {
        const buttonsContainer = document.getElementById('buttons-container');
        buttonsContainer.style.display = null;
    }
    catch (error) {
        logError(error);
    }
}

function hideButtonsContainer() {
    try {
        const buttonsContainer = document.getElementById('buttons-container');
        buttonsContainer.style.display = 'none';
    }
    catch (error) {
        logError(error);
    }
}

function showMessageContainer() {
    try {
        const container = document.getElementById('message-container');
        container.style.display = 'block';
        const backButton = document.getElementById('back-button');
        backButton.style.display = 'inline-block';
    }
    catch (error) {
        logError(error);
    }
}

function hideMessageContainer() {
    try {
        const container = document.getElementById('message-container');
        container.style.display = 'none';
        const backButton = document.getElementById('back-button');
        backButton.style.display = 'none';
    }
    catch (error) {
        logError(error);
    }
}

function showErrorMessageContainer() {
    try {
        const container = document.getElementById('error-message-container');
        container.style.display = 'block';
    }
    catch (error) {
        logError(error);
    }
}

function hideErrorMessageContainer() {
    try {
        const container = document.getElementById('error-message-container');
        container.style.display = 'none';
    }
    catch (error) {
        logError(error);
    }
}

function logError(error) {
    try {
        console.error(`[${new Date()}] ${error}`);
    }
    catch (error) {
        logError(error);
    }
}

window.onload = _ => {
    localStorage.clear();
    changeLanguage();
    startClock();
}
