import ReactDOM from 'react-dom';
import React from 'react';

import Notifications, { refreshNotes } from '../src/Notifications';
import AuthWrapper from './auth-wrapper';
import { receiveMessage, sendMessage } from './messaging';

require('../src/boot/stylesheets/style.scss');

const localePattern = /[&?]locale=([\w_-]+)/;
const match = localePattern.exec(document.location.search);
const locale = match ? match[1] : 'en';
let isShowing = true;
let isVisible = document.visibilityState === 'visible';

const render = () => {
    ReactDOM.render(
        React.createElement(AuthWrapper(Notifications), {
            clientId: 52716,
            isShowing,
            isVisible,
            locale,
            receiveMessage: sendMessage,
            redirectPath: '/',
        }),
        document.getElementsByClassName('wpnc__main')[0]
    );
};

const init = () => {
    document.addEventListener('visibilitychange', render);

    window.addEventListener(
        'message',
        receiveMessage(({ action, hidden, showing }) => {
            if ('togglePanel' === action) {
                isShowing = showing;
                render();
            }

            if ('toggleVisibility' === action) {
                isVisible = !hidden;
                render();
            }
        })
    );

    window.addEventListener(
        'message',
        receiveMessage(({ action }) => {
            if ('refreshNotes' === action) {
                refreshNotes();
            }
        })
    );

    render();
};

init();