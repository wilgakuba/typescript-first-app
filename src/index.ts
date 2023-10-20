const inquirer = require('inquirer');
const consola = require('consola');

enum Action {
  List = 'list',
  Add = 'add',
  Edit = 'edit',
  Remove = 'remove',
  Quit = 'quit',
}

enum options {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}

type InquirerAnswers = {
  action: Action;
};

interface User {
  name: string;
  age: number;
}

class Message {
  constructor(private content: string) {}

  show() {
    console.log(this.content);
  }

  capitalize() {
    this.content =
      this.content.charAt(0).toUpperCase() +
      this.content.slice(1).toLowerCase();
  }

  toUpperCase() {
    this.content = this.content.toUpperCase();
  }

  toLowerCase() {
    this.content = this.content.toLowerCase();
  }

  static showColorized(option: options, text: string) {
    if (option === options.Success) {
      consola.success(text);
    } else if (option === options.Error) {
      consola.error(text);
    } else if (option === options.Info) {
      consola.info(text);
    } else {
      console.error('Invalid option');
    }
  }
}

class UsersData {
  data: User[] = [];

  showAll() {
    Message.showColorized(options.Info, 'Users data');
    if (this.data.length > 0) {
      console.table(this.data);
    } else {
      console.log('No data...');
    }
  }

  add(newUser: User) {
    if (newUser.name.length > 0 && newUser.age > 0) {
      this.data.push(newUser);
      Message.showColorized(
        options.Success,
        'User has been successfully added!'
      );
    } else {
      Message.showColorized(options.Error, 'Wrong data!');
    }
  }

  edit(userName: string, updatedUserData: User) {
    const userIndex = this.data.findIndex((user) => user.name === userName);
    if (userIndex !== -1) {
      this.data[userIndex] = { ...this.data[userIndex], ...updatedUserData };
      Message.showColorized(
        options.Success,
        'User has been successfully updated!'
      );
    } else {
      Message.showColorized(options.Error, 'User not found...');
    }
  }

  remove(userName: string) {
    const index = this.data.findIndex((user) => user.name === userName);
    if (index !== -1) {
      this.data.splice(index, 1);
      Message.showColorized(options.Success, 'User deleted!');
    } else {
      Message.showColorized(options.Error, 'User not found...');
    }
  }
}

const users = new UsersData();
console.log('\n');
console.info('???? Welcome to the UsersApp!');
console.log('====================================');
Message.showColorized(options.Info, 'Available actions');
console.log('\n');
console.log('list – show all users');
console.log('add – add new user to the list');
console.log('edit – edit user from the list');
console.log('remove – remove user from the list');
console.log('quit – quit the app');
console.log('\n');

const startApp = () => {
  inquirer
    .prompt([
      {
        name: 'action',
        type: 'input',
        message: 'How can I help you?',
      },
    ])
    .then(async (answers: InquirerAnswers) => {
      switch (answers.action) {
        case Action.List:
          users.showAll();
          break;
        case Action.Add:
          const user = await inquirer.prompt([
            {
              name: 'name',
              type: 'input',
              message: 'Enter name',
            },
            {
              name: 'age',
              type: 'number',
              message: 'Enter age',
            },
          ]);
          users.add(user);
          break;
        case Action.Edit:
          const editName = await inquirer.prompt([
            {
              name: 'name',
              type: 'input',
              message: 'Enter name of user to edit',
            },
          ]);

          const userToEdit = users.data.find(
            (user) => user.name === editName.name
          );
          if (!userToEdit) {
            Message.showColorized(options.Error, 'User not found...');
            startApp();
            return;
          }

          const updatedUserData = await inquirer.prompt([
            {
              name: 'name',
              type: 'input',
              message: 'Enter new name',
            },
            {
              name: 'age',
              type: 'number',
              message: 'Enter new age',
            },
          ]);

          users.edit(editName.name, updatedUserData);
          break;
        case Action.Remove:
          const name = await inquirer.prompt([
            {
              name: 'name',
              type: 'input',
              message: 'Enter name',
            },
          ]);
          users.remove(name.name);
          break;
        case Action.Quit:
          Message.showColorized(options.Info, 'Bye bye!');
          return;
        default:
          Message.showColorized(options.Error, 'Command not found');
      }

      startApp();
    });
};

startApp();