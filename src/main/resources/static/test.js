let allUsers;
const tBody = $('#bodyTable');

$(document).ready(function () {
    $.getJSON('/admin/users', function (text) {
        allUsers = text;
        text.forEach(function (el) {
            createLineInTable(el).appendTo(tBody);
        })
    })
    addUserBodyTable();
});

$('#add_form').on('submit', function (e) {
    e.preventDefault();
    let usersJson = JSON.stringify(getFormData($('#add_form')));
    $.post({
        url: '/admin/users',
        dataType: 'json',
        data: usersJson,
        contentType: 'application/json;charset=UTF-8',
        success: function (msg) {
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

$('#editUser').on('submit', function (e) {
    e.preventDefault();
    let userJson = JSON.stringify(getFormData($('#editUser')));

    $.ajax('/admin/user', {
        method: 'PUT',
        dataType: 'json',
        data: userJson,
        contentType: 'application/json;charset=UTF-8',
        success: function (msg) {
            allUsers.splice(allUsers.findIndex(item => item.id === msg.id), 1, msg);
            $('#tr' + msg.id).remove();
            createLineInTable(msg).appendTo(tBody);
        }
    })
    $('#editModal').modal('hide');
});

$('#deleteUser').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
        url: '/admin/users/' + $('#deleteId').val(),
        method: 'DELETE',
        dataType: 'text',
        success: function (msg) {
            allUsers.splice(allUsers.findIndex(item => item.id === parseInt(msg)), 1);
            $('#tr' + msg).remove();
        }
    })
    $('#deleteModal').modal('hide');
});

function fillModal(action, user) {
    $('#' + action + 'Id').attr('value', user.id);
    $('#' + action + 'FirstName').attr('value', user.firstname);
    $('#' + action + 'LastName').attr('value', user.lastname);
    $('#' + action + 'Age').attr('value', user.age);
    $('#' + action + 'Username').attr('value', user.username);
    $('#' + action + 'Password').attr('value', user.password);
    $.each(user.roles, function (key, value) {
        $('#' + action + 'Role' + value.role.replaceAll('ROLE_', '')).attr('selected', true);
    });
}

function getUser (id) {
    return allUsers.find(function (el) {
        if (el.id === id) {
            return el;
        }
    });
}

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

let getTd = function (text, valueOfName) {
    let td = $('<td></td>');
    td.attr('id', valueOfName);
    return td.text(text);
}

let getRoles = function (el) {
    let td = $('<td></td>');
    let span = $('<span></span>');
    td.attr('id', 'roles' + el.id);
    el.roles.forEach(function (role) {
        span.clone().text(role.role.replaceAll('ROLE_', ' ')).appendTo(td);
    });
    return td;
}

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

function addUserBodyTable() {
    let userBodyTable = $('#userBody');
    let row = $('<tr></tr>');
    let td = $('<td></td>');
    $.getJSON('/admin/user', function (text) {
        console.log(text);
        td.clone().text(text.id).appendTo(row);
        td.clone().text(text.firstname).appendTo(row);
        td.clone().text(text.lastname).appendTo(row);
        td.clone().text(text.age).appendTo(row);
        td.clone().text(text.username).appendTo(row);
        getRoles(text).appendTo(row);
    });
    row.appendTo(userBodyTable);
}