const os = require('os');
const axios = require('axios');
const randomColor = require('randomcolor');
const chalk = require('chalk');
const { program } = require('commander');
const fs = require('fs');
const inquirer = require('inquirer').default;

const todosFile = './todos.json';

function getRandomColor() {
    return chalk.hex(randomColor());
}

const color = getRandomColor();

const banner = `
 ██████╗██╗     ██╗      ████████╗ ██████╗ ██████╗  ██████╗ 
██╔════╝██║     ██║      ╚══██╔══╝██╔═══██╗██╔══██╗██╔═══██╗
██║     ██║     ██║ █████╗  ██║   ██║   ██║██║  ██║██║   ██║
██║     ██║     ██║ ╚════╝  ██║   ██║   ██║██║  ██║██║   ██║
╚██████╗███████╗██║         ██║   ╚██████╔╝██████╔╝╚██████╔╝
 ╚═════╝╚══════╝╚═╝         ╚═╝    ╚═════╝ ╚═════╝  ╚═════╝   
`;

const creator = "Kartik Goel";
const twitter = "https://x.com/kartikgoel007";
const github = "https://github.com/kartik739";

function ban() {
    console.log(color(banner));
    console.log(`     [${color('+')}] ${color(`Creator: ${creator}`)}`);
    console.log(`     [${color('+')}] ${color(`Twitter: ${twitter}`)}`);
    console.log(`     [${color('+')}] ${color(`Github: ${github}`)}`);
    console.log("");
}

function loadTodos() {
    if (!fs.existsSync(todosFile)) {
        return [];
    }
    const todos = fs.readFileSync(todosFile);
    return JSON.parse(todos);
}

function saveTodos(todos) {
    fs.writeFileSync(todosFile, JSON.stringify(todos, null, 2));
}

function listTodos() {
    const todos = loadTodos();
    const listColor = getRandomColor();
    if (todos.length === 0) {
        console.log(listColor('No todos found.'));
    } else {
        todos.forEach((todo, index) => {
            const statusColor = todo.done ? chalk.green : chalk.red;
            const status = statusColor('Done');
            console.log(`${index + 1}. ${todo.task} - ${status}`);
        });
    }
    console.log(""); // Add a line space after listing todos
}

function addTodo() {
    inquirer
        .prompt([{ type: 'input', name: 'task', message: 'Enter the todo:' }])
        .then((answers) => {
            const todos = loadTodos();
            todos.push({ task: answers.task, done: false });
            saveTodos(todos);
            console.log(getRandomColor()('Todo added successfully.'));
            console.log(""); // Add a line space after adding a todo
            mainMenu();
        });
}

function deleteTodo() {
    const todos = loadTodos();
    if (todos.length === 0) {
        console.log(getRandomColor()('No todos found.'));
        console.log(""); // Add a line space after no todos found
        mainMenu();
        return;
    }
    inquirer
        .prompt([{ type: 'input', name: 'index', message: 'Enter the todo number to delete:' }])
        .then((answers) => {
            const index = parseInt(answers.index) - 1;
            if (index >= 0 && index < todos.length) {
                todos.splice(index, 1);
                saveTodos(todos);
                console.log(getRandomColor()('Todo deleted successfully.'));
            } else {
                console.log(getRandomColor()('Invalid todo number.'));
            }
            console.log(""); // Add a line space after deleting a todo
            mainMenu();
        });
}

function markTodoDone() {
    const todos = loadTodos();
    if (todos.length === 0) {
        console.log(getRandomColor()('No todos found.'));
        console.log(""); // Add a line space after no todos found
        mainMenu();
        return;
    }
    inquirer
        .prompt([{ type: 'input', name: 'index', message: 'Enter the todo number to mark as done:' }])
        .then((answers) => {
            const index = parseInt(answers.index) - 1;
            if (index >= 0 && index < todos.length) {
                todos[index].done = true;
                saveTodos(todos);
                console.log(getRandomColor()('Todo marked as done.'));
            } else {
                console.log(getRandomColor()('Invalid todo number.'));
            }
            console.log(""); // Add a line space after marking a todo as done
            mainMenu();
        });
}

function mainMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'Add a todo',
                    'Delete a todo',
                    'Mark a todo as done',
                    'List all todos',
                    'Exit'
                ]
            }
        ])
        .then((answers) => {
            switch (answers.action) {
                case 'Add a todo':
                    addTodo();
                    break;
                case 'Delete a todo':
                    deleteTodo();
                    break;
                case 'Mark a todo as done':
                    markTodoDone();
                    break;
                case 'List all todos':
                    listTodos();
                    mainMenu(); // Ensure the menu is displayed after listing todos
                    break;
                case 'Exit':
                    console.log(getRandomColor()('Goodbye!'));
                    process.exit(0);
            }
        });
}

// Define commands using commander
program
    .command('start')
    .description('Start the todo CLI tool')
    .action(() => {
        ban();
        mainMenu();
    });

program.parse(process.argv);
