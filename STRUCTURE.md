# This file acts as a guideline for the layout and structure of the automata project

Everything in this is subject to change as the complexity of the project builds, such as adding other pages, adding databases, etc... but should conform to this guideline in its current state

First, this project is created with Vite, so as with all Vite projects, there is a public and src folder
The src folder acts as the baseURL for tsconfig, and is where most of everything should be done

- index.tsx should be left untouched
- globals.css should not be modified unless there is a really good reason



The goal is that, **all** UI code should be separate from actual data, such as the editor, player, etc..., This should keep the UI and the data being easily testable
- If they are connected (Which they will have to be in a sense obviously), it should only be through events or necessary data that the user generates toward the UI, such as the size of a canvas or screen. 
- To enforce this, the ui and editor code are in completely separate directories under the src directory

Styles should be written in CSS Modules, please
The site must look good and function on all screen sizes
- Generally, target devices in these width ranges: 360px. 600 px, 768 px, 1000 px, 1280px, W1500px, 2000px+
- You probably won't have to make different designs or media queries for each size, but make sure they all work well and provide a nice UI Experience 