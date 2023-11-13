var stringsEn = {
    title: "Omar's Ticketing App",
    pageTitle: "Omar's Basically Okay Ticketing App",
    message: "Message",
    back: "Back",
    error: "Error",
    issueTicketMessage: "A ticket has been issued for",
    badRequest: "Bad request - check your configuration",
    unauthorized: "Authorization failed",
    notFound: "Not Found - Your bank does not have any active screens",
    internalServerError: "Internal server error",
    unexpectedError: "Unexpected error",
}

var stringsAr = {
    title: "تطبيق التذاكر",
    pageTitle: "تطبيق التذاكر",
    message: "رسالة",
    back: "عودة",
    error: "خطأ",
    issueTicketMessage: "تم إصدار تذكرة للخدمة",
    badRequest: "طلب خاطئ، تأكد من صحة الإعدادات",
    unauthorized: "بيانات الاعتماد غير صالحة",
    notFound: "غير موجود: البنك لا يملك أي شاشات مفعلة حالياً",
    internalServerError: "خطأ داخلي",
    unexpectedError: "خطأ غير متوقع",
}

function getString(key, language = 'en') {
    switch (language) {
        case 'ar':
            return stringsAr[key];
        case 'en':
            return stringsEn[key];
        default:
            return stringsEn[key];
    }
}

function startClock() { // TODO: localization
    try {
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();
    
        document.getElementById('dateAndTime').innerText = `${date} - ${time}`;
    
        setTimeout(startClock, 1000);
    }
    catch (error) {
        logError(error);
    }
}

function setButtonEvent(buttonElement, ticketingButton) { // TODO: localization
    try {
        let message = '';
        if (ticketingButton['Type'] === 'ISSUE_TICKET') {
            message = `${getString('issueTicketMessage')} ${ticketingButton['ServiceNameEn']}`; // TODO: localization
            buttonElement.addEventListener('click', () => {
                displayMessage(message);
                issueTicket(ticketingButton['ServiceId']);
            });
        }
        else if (ticketingButton['Type'] === 'SHOW_MESSAGE') {
            message = ticketingButton['MessageEn'];
            buttonElement.addEventListener('click', () => {
                displayMessage(message);
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

function displayMessage(message) {
    try {
        const messageBody = document.getElementById('message-body');
        messageBody.innerHTML = message;
        showMessageContainer();
        hideButtonsContainer();
    }
    catch (error) {
        logError(error);
    }
}

function displayErrorMessage(message) {
    try {
        const errorMessageBody = document.getElementById('error-message-body');
        errorMessageBody.innerHTML = message;
        hideButtonsContainer();
        showErrorMessageContainer();
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
    fetch('https://bankConfigurationPortal.local/api/Screens?branchId=3&counterId=17', {headers: {'authorization': 'YmFuazE6dXNlcjE6YQ=='}}) // bank1: YmFuazE6dXNlcjE6YQ== | bank4: YmFuazQ6dXNlcjQ6YQ== | invalid creds: YmVlcDpib29wOmJlZXA=
        .then(response => {
            if (!response.ok) {
                switch (response.status) {
                    case 400:
                        displayErrorMessage(getString('badRequest'));
                        break;
                    case 401:
                        displayErrorMessage(getString('unauthorized'));
                        break;
                    case 404:
                        displayErrorMessage(getString('notFound'));
                        break;
                    case 500:
                        displayErrorMessage(getString('internalServerError'));
                        break;
                    default:
                        displayErrorMessage(getString('unexpectedError'));
                        break;
                }
                
                throw new Error(`(${response.status}) Failed to fetch buttons.`);
            }

            return response.json();
        })
        .then(data => {
            displayCounterInformation(data['BankName'], data['BranchNameEn'], data['CounterNameEn']);
            loadButtons(data['Buttons']);
            console.log(data);
        })
        .catch(error => logError(error));
}

function loadButtons(buttons) {
    try {
        const buttonsContainer = document.getElementById('buttons-container');
        
        buttons.forEach(button => {
            const buttonElement = document.createElement('button');
            buttonElement.classList.add('ticketing-button');
            buttonElement.innerHTML = button['NameEn']; // TODO: name localization
            setButtonEvent(buttonElement, button);
            
            buttonsContainer.appendChild(buttonElement);
        });
    }
    catch (error) {
        logError(error);
    }
}

function displayCounterInformation(bankName, branchName, counterName) {
    try {
        document.getElementById('bank-info').innerText = `${bankName} ${branchName ? '- ' + branchName : ''} ${counterName ? '- ' + counterName : ''}`;
    }
    catch (error) {
        logError(error);
    }
}

function goBack() {
    try {
        showButtonsContainer();
        hideMessageContainer();
    }
    catch (error) {
        logError(error);
    }
}

function showButtonsContainer() {
    try {
        const buttonsContainer = document.getElementById('buttons-container');
        buttonsContainer.style.display = 'grid';
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
    }
    catch (error) {
        logError(error);
    }
}

function hideMessageContainer() {
    try {
        const container = document.getElementById('message-container');
        container.style.display = 'none';
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
    startClock();
    getButtons();
}
