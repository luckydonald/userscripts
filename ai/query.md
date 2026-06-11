# AI query log file

#### General AI development guidelines:
- Create `ai/PROGRESS.md`, and keep it updated when you complete steps.
- You may refer to `ai/refrences` for code examples of other plugins or extra documentation provided for this task.
- When writing code, follow these guidelines:
  - Always prefer the early-return pattern to reduce nesting of `if`s, etc.
  - Similarly, prefer `if …` -> `continue`/`return`/`break` early in loops over large nested blocks.
- _If_ the project requires a frontend, use Vue, TS, and SCSS for that.
  - Prefer using `<script setup lang="ts">` style single file components.
  - Use proper TypeScript type hinting.
- _If_ the project requires a backend, use modern Python `3.14+` for that.
  - Do proper type hinting with full type annotations.
  - For type-hinting, prefer the native types (e.g. `dict[str, int]` over the older `typing.*` aliases like `Dict[AnyStr, int]`)
  - Prefer async programming where possible.
  - For web stuff: `FastApi`
  - For postgres: typed `sqlalchemy`
    - For migrations: `alembic`
- Write tests for both frontend and backend parts.
- Remember to update the `/CHANGELOG.md` and `/README.md` if existent (including other pre-existing documentation).
- If you want to write Markdown summaries of the task you just did (only if specifically asked for by the user!) write those to `ai/summaries/` folder, and never into the root folder.
  - However, usually you don't need to write Markdown summaries.
- Please prefer to use the read file tool over weird constructs with `cat` etc. Terminal should not be needed for searches most of the time, either.

----

#### Previous user prompts:

🦆> write me a js to paste into the browser console which unchecks all checkboxes, but waits for them being disabled and enabled between unchecking them.
    Log the progress including x/y, time estimate and the current item name (here: "Anker Soundcore 2 Portable Bluetooth Speaker with 12 W Stereo Sound, BassUp, IPX7 Waterproof, 24-Hour Playtime, Wireless Stereo Pairing, Speaker for Home, Outdoors, Travel")
    The list is this:
    ```html
    <ul data-name="Active Items" aria-labelledby="sc-active-items-header" class="a-unordered-list a-nostyle a-vertical a-spacing-mini sc-list-body sc-java-remote-feature">…</ul>
    ```
    Notice that the product div has multiple checkboxes and only the first one is interesting (i.e. not the gift one and no additional ones like payment plans or insurances offers).
    Also obviously skip already deactivated products, don't include those in the ETA.
    Set the bg of the label of the checkboxes you want to uncheck to hotpink.
    Send only the code, but wrap it in markdown formatting code block.
    alright here's one example div you would iterate over actually:
    @ai/references/snippets/amazon/cart.md

🦆> use warn level for logProgress, run logProgress async 500ms after clicking.
🦆> Convert into an userscript with an additional on-page progressbar display, and the button to start added right after `<a id="select-all" …>…</a>`.
    Header:
    ```user.js
    // ==UserScript==
    // @name         Amazon: Deselect all
    // @namespace    tampermonkey.net/
    // @version      2026-06-11
    // @description  …
    // @author       luckylucy
    // @match        https://www.amazon.de/-/en/gp/cart/view.html
    // @icon         www.google.com/s2/favicons?sz=64&domain=amazon.de
    // ==/UserScript==
    ```
    add headers as needed.

🦆> How do I make it update check from github?
    raw.githubusercontent.com/luckydonald/userscripts/refs/heads/mane/Amazon Deselect All/amazon-deselect-all.user.js

🦆> Can I write the `@supportURL` make start the title with `[Amazon: Deselect all] `?

🦆> can I add regexeses to match other amazons too?

› FIX @"Amazon Deselect All/amazon-deselect-all.user.js" to not remove the progress bar UI when clicking, to make the progress bar floating if scrolled down, autoscroll to the
  next checkbox to click


› @"Amazon Deselect All/amazon-deselect-all.user.js": Make the progress bar segments. Check after the timeouts, if the element is actually deselected. If not make it orange, otherwise make it green if successful. Have a proper in-between logging of what it is doing (to both the UI and console.log)

