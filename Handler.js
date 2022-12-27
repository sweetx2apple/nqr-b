const fs = require('fs');

class Handler {
    constructor() {
        this.loadUsers();
        this.loadAdmins();
        this.users = [];
        this.admins = [];
    }

    loadUsers() {
        fs.readFile('users.txt', 'utf8', (err, data) => {
            if(err) throw err;
            this.users = JSON.parse(data);
        });
    }

    loadAdmins() {
        fs.readFile('admins.txt', 'utf8', (err, data) => {
            if(err) throw err;
            this.admins = JSON.parse(data);
            console.log(this.admins);
        });
    }

    findAdmin(id) {
        for(let i = 0; i < this.admins.length; i++) {
            if(this.admins[i].id == id) {
                return i;
            }
        }
        
    }

    saveUsers() {
        fs.writeFile('users.txt', JSON.stringify(this.users), (err) => {
            if(err) throw err;
            console.log('Data has been replaced!');
        });
    }



    registerAnswers(value) {
        let userId = this.findUser(value.id);
        this.users[userId].answers = value.answers;
        this.users[userId].status = "done";
        this.saveUsers();
    }

    findUser(id) {
        for(let i = 0; i < this.users.length; i++) {
            if(this.users[i].id == id) {
                return i;
            }
        }
        
    }

}

module.exports = {
    Handler
}