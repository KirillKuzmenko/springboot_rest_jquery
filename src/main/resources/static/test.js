let allUsers;
const tBody = $('#bodyTable');

/*Срабатывает при открытии админки*/
$(document).ready(function () {
    $.getJSON('/admin/users', function (text) {
        allUsers = text;
        text.forEach(function (el) {
            createLineInTable(el).appendTo(tBody);
        })
    })
    addUserBodyTable();
});

/*форма добавления пользователя*/
$('#add_form').on('submit', function (e) {
    e.preventDefault();
    let usersJson = JSON.stringify(getFormData($('#add_form')));
    $.post({
        url: '/admin/users',
        dataType: 'json',
        data: usersJson,
        contentType: 'application/json;charset=UTF-8',
        success: function (msg) {

            $('#add_form')[0].reset();
            allUsers.push(msg);
            createLineInTable(msg).appendTo(tBody);
        },
    });
});

$('#editModal').on('show.bs.modal', function (event) {
   let button = $(event.relatedTarget);
   let user = getUser(parseInt(button.attr('id').replaceAll('edit', '')));
   fillModal('edit', user);
});
$('#editModal').on('hide.bs.modal', function () {
    $(this).find('#editRoleADMIN').attr('selected', false);
    $(this).find('#editRoleUSER').attr('selected', false);
});

$('#deleteModal').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget);
    let user = getUser(parseInt(button.attr('id').replaceAll('delete', '')));
    fillModal('delete', user);
});

/*форма редактирования юзера*/
$('#editUser').on('submit', function (e) {
    e.preventDefault();
    let userJson = JSON.stringify(getFormData($('#editUser')));

    $.ajax('/admin/user', {
        method: 'PUT',
        dataType: 'json',
        data: userJson,
        contentType: 'application/json;charset=UTF-8',
        success: function (msg) {
             $('#editUser')[0].reset();
            allUsers.splice(allUsers.findIndex(item => item.id === msg.id), 1, msg);
            $('#tr' + msg.id).remove();
            createLineInTable(msg).appendTo(tBody);
        }
    })
    $('#editModal').modal('hide');
});

/*форма удаления юзера*/
$('#deleteUser').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
        url: '/admin/users/' + $('#deleteId').val(),
        method: 'DELETE',
        dataType: 'text',
        success: function (msg) {
            $('#deleteUser')[0].reset();
            allUsers.splice(allUsers.findIndex(item => item.id === parseInt(msg)), 1);
            $('#tr' + msg).remove();
        }
    })
    $('#deleteModal').modal('hide');
});

/*заполнение модального окна*/
function fillModal(action, user) {
    $('#' + action + 'Id').attr('value', user.id);
    $('#' + action + 'FirstName').attr('value', user.firstname);
    $('#' + action + 'LastName').attr('value', user.lastname);
    $('#' + action + 'Age').attr('value', user.age);
    $('#' + action + 'Username').attr('value', user.username);
    $.each(user.roles, function (key, value) {
        $('#' + action + 'Role' + value.role.replaceAll('ROLE_', '')).attr('selected', true);
    });
}

/*получение юзера из allUsers*/
function getUser (id) {
    return allUsers.find(function (el) {
        if (el.id === id) {
            return el;
        }
    });
}

/*сериализация формы в строку*/
function getFormData(form) {
    let fd = $(form).serializeArray();

    let d = {};
    $(fd).each(function () {
        if (this.name === 'roles') {
            if (!Array.isArray(d[this.name])) {
                d[this.name] = [];
            }
            d[this.name].push(this.value);
        } else {
            d[this.name] = this.value;
        }
    });
    d['id'] = $('#editId').val();
    return d;
}

/*функция создания таблицы*/
function createLineInTable(el) {
    let row = $('<tr></tr>');
    row.attr('id', 'tr' + el.id);
    getTd(el.id, 'id' + el.id).appendTo(row);
    getTd(el.firstname, 'firstName' + el.id).appendTo(row);
    getTd(el.lastname, 'lastName' + el.id).appendTo(row);
    getTd(el.age, 'age' + el.id).appendTo(row);
    getTd(el.username, 'username' + el.id).appendTo(row);
    getRoles(el).appendTo(row);
    getButton('Edit', 'btn btn-primary', 'edit' + el.id, '#editModal').appendTo(row);
    getButton('Delete', 'btn btn-danger', 'delete' + el.id, '#deleteModal').appendTo(row);
    return row;
}

/*создание ячейки таблицы*/
let getTd = function (text, valueOfName) {
    let td = $('<td></td>');
    td.attr('id', valueOfName);
    return td.text(text);
}

/*получение и вставка ролей в таблицу*/
let getRoles = function (el) {
    let td = $('<td></td>');
    let span = $('<span></span>');
    td.attr('id', 'roles' + el.id);
    el.roles.forEach(function (role) {
        span.clone().text(role.role.replaceAll('ROLE_', ' ')).appendTo(td);
    });
    return td;
}

/*добавление в таблицу кнопки edit or delete*/
let getButton = function (text, classType, id, target) {
    let btn = $('<button></button>');
    let td = $('<td></td>');
    btn.addClass(classType);
    btn.attr('id', id);
    btn.attr('data-toggle', 'modal');
    btn.attr('data-target', target);
    btn.text(text);
    btn.appendTo(td);
    return td;
}

/*эта и следующая переключение в левой колонке*/
$('#admin').on('click', function () {
    $('#userInfo').attr('hidden', true);
    $('#adminPanel').attr('hidden', false);
    $('#user').toggleClass('active');
    $('#admin').toggleClass('active');
});

$('#user').on('click', function () {
    $('#admin').toggleClass('active');
    $('#user').toggleClass('active');
    $('#adminPanel').attr('hidden', true);
    $('#userInfo').attr('hidden', false);
});

/*создание таблицы в админке*/
function addUserBodyTable() {
    let userBodyTable = $('#userBody');
    let row = $('<tr></tr>');
    let td = $('<td></td>');
    $.getJSON('/admin/user', function (text) {
        td.clone().text(text.id).appendTo(row);
        td.clone().text(text.firstname).appendTo(row);
        td.clone().text(text.lastname).appendTo(row);
        td.clone().text(text.age).appendTo(row);
        td.clone().text(text.username).appendTo(row);
        getRoles(text).appendTo(row);
    });
    row.appendTo(userBodyTable);
}