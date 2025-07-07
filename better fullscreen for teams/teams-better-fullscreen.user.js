// ==UserScript==
// @name         Toggle Fullscreen on F11
// @namespace    http://tampermonkey.net/
// @version      2025-07-02
// @description  Toggle better fullscreen mode on F11 key press
// @author       luckydonald
// @match        https://teams.microsoft.com/v2/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    // Function to toggle the 'fullscreen' class on the body
    function toggleFullscreenClass() {
        document.body.classList.toggle('fullscreen');
    }

    // Function to toggle fullscreen
    function toggleFullscreen() {
        const screen = document.querySelector('[data-tid="Stage-wrapper"] .fui-Primitive');
        if (!screen) {
            screen.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // Function to create and add the F11 button
    function addF11Button() {
        const button = document.createElement('button');
        button.textContent = 'F11';
        button.style.marginLeft = '10px'; // Add some spacing
        button.style.cursor = 'pointer';

        // Add click event to the button
        button.addEventListener('click', function() {
            toggleFullscreenClass();
        });

        // Find the target element and append the button
        const targetElement = document.querySelector('[data-tid="Stage-wrapper"] .fui-Primitive [data-tid="participant-info-nametag"] .fui-ToolbarGroup');
        if (targetElement) {
            targetElement.appendChild(button);
        }
    }

    // Event listener for keydown event
    window.addEventListener('keydown', function(event) {
        if (event.key === 'F11') {
            event.preventDefault(); // Prevent the default F11 behavior
            toggleFullscreen();
        }
    });

    // Run the function to add the button after the DOM is fully loaded
    window.addEventListener('load', addF11Button);
})();
