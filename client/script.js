let baseURL = 'http://localhost:3000'

$(document).ready(() => {
    console.log('reload')

    if (localStorage.access_token) {
        getNewsAPI()
        showMainPage()
    } else {
        getNewsAPI()
        showLoginPage()
    }

    $('#logout').click((e) => {
        console.log('logout')
        e.preventDefault()

        localStorage.clear()
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });

        showLoginPage()
    })

    $('#toRegisterPage').click((e) => {
        console.log('toRegisterPage')
        e.preventDefault()

        showRegisterPage()
    })

    $('#toLoginPage').click((e) => {
        console.log('toLoginPage')
        e.preventDefault()

        showLoginPage()
    })

    $('#login').click((e) => {
        console.log('login')
        e.preventDefault()

        let email = $('#emailLogin').val()
        let password = $('#passwordLogin').val()
        console.log(email, password)

        // ajax
        $.ajax({
            method: 'POST',
            url: `${baseURL}/login`,
            data: { email, password }
        })
            .done(response => {
                // console.log('>>> response', response)

                if (response.access_token) {
                    localStorage.setItem('access_token', response.access_token)
                    showMainPage()
                } else {
                    console.log(response.message)
                }
            })

            .fail(err => {
                console.log(err.responseJSON.message)
            })

            .always(() => {
                $('#emailLogin').val('')
                $('#passwordLogin').val('')
            })
    })

    $('#register').click((e) => {
        console.log('register')
        e.preventDefault()

        let email = $('#emailRegister').val()
        let password = $('#passwordRegister').val()
        console.log(email, password)

        $.ajax({
            method: 'POST',
            url: `${baseURL}/register`,
            data: { email, password }
        })
            .done(response => {
                console.log('berhasil : ', response)
                showLoginPage()
            })

            .fail(err => {
                console.log(err.responseJSON.message)
                // console.log(err)
            })

            .always(() => {
                $('#emailRegister').val('')
                $('#passwordRegister').val('')
            })
    })

    $('#todoAdd').click((e) => {
        console.log('todoAdd')
        e.preventDefault()

        let title = $('#titleAdd').val()
        let description = $('#descriptionAdd').val()
        let due_date = $('#due_dateAdd').val()
        console.log(title, description, due_date)

        $.ajax({
            method: 'POST',
            url: `${baseURL}/todos`,
            data: { title, description, due_date },
            headers: { access_token: localStorage.access_token }
        })
            .done(response => {
                console.log(response)
                showMainPage()
            })
            .fail(err => {
                // console.log(err)
                console.log(err.responseJSON.message)
            })
            .always(() => {
                $('#titleAdd').val('')
                $('#descriptionAdd').val('')
                $('#due_dateAdd').val('')
            })
    })

    $('#showAddTodoPage').click((e) => {
        e.preventDefault()
        $('#todo-add-page').show()
        $('#showAddTodoPage').hide()
    })

    $('#cancelTodoAdd').click((e) => {
        e.preventDefault()
        showMainPage()
    })

    $('#updateTodoStatus').click((e) => {
        e.preventDefault()
        updateStatusTodo()
    })

    $('#cancelTodoEdit').click((e) => {
        e.preventDefault()
        $('#todo-edit-page').hide()
    })
})

function showMainPage() {
    getTodoList()
    $('#main-page').show()
    $('#register-page').hide()
    $('#login-page').hide()
    $('#todo-add-page').hide()
    $('#logout').show()
    $('#showAddTodoPage').show()
    $('#user-API').hide()
    $('#todo-edit-page').hide()
}

function showLoginPage() {
    $('#main-page').hide()
    $('#register-page').hide()
    $('#login-page').show()
    $('#todo-add-page').hide()
    $('#logout').hide()
    $('#user-API').show()
}

function showRegisterPage() {
    $('#register-page').show()
    $('#login-page').hide()
    $('#user-API').show()
}

function getTodoList() {
    $.ajax({
        method: 'GET',
        url: `${baseURL}/todos`,
        headers: { access_token: localStorage.access_token }
    })

        .done(response => {
            console.log(response.message)
            let todos = response.message
            $('#todo-list').empty()

            todos.forEach(todo => {
                $('#todo-list').append(`
            <tr>
                <td scope="row">
                ${todo.status === true ? '<button type="button" class="btn btn-success">Done</button>' : `<button type="button" class="btn btn-outline-danger" id="updateTodoStatus" onclick="updateTodoStatus(${todo.id})">Not done</button>`}
                </td>
                <td>${todo.title}</td>
                <td>${todo.description}</td>
                <td>${todo.due_date}</td>
                <td>
                    <button class='btn btn-lg btn-danger' id='deleteTodo' onclick="deleteTodo(${todo.id})">Delete</button>
                    <button class='btn btn-lg btn-success' id='updateTodo' onclick="updateTodo(${todo.id})">Edit</button>
                </td>
            </tr>`)
            });
        })
        .fail(err => {
            console.log(err)
        })
        .always(() => {

        })
}

function getNewsAPI() {
    console.log('newsAPI')
    $('#date').append(getDateToday())

    $.ajax({
        method: 'GET',
        url: `${baseURL}/news`
    })
        .done(response => {
            console.log(response)
            response.slice(-1).forEach(news => {
                $('#main-API').append(`
                <div class="card" style="width: 18rem;">
                    <img src="${news.urlToImage}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${news.source.name}</h5>
                        <p class="card-text">${news.description}</p>
                        <a href="${news.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Read the news</a>
                    </div>
                </div>
                `)

                $('#user-API').append(`
                <div class="card" style="width: 18rem;">
                    <img src="${news.urlToImage}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${news.source.name}</h5>
                        <p class="card-text">${news.description}</p>
                        <a href="${news.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Read the news</a>
                    </div>
                </div>
                `)
            })
        })
        .fail(err => {
            console.log(err)
        })
}

function getDateToday() {
    return (new Date()).toDateString()
}

function deleteTodo(id) {
    console.log('deleteTodo', id)

    $.ajax({
        method: 'DELETE',
        url: `${baseURL}/todos/${id}`,
        headers: { access_token: localStorage.access_token }
    })
        .done(response => {
            console.log(response)
            showMainPage()
        })
        .fail(err => {
            console.log(err)
        })
}

function updateTodo(id) {
    console.log('update', id)
    $('#todo-edit-page').show()

    $.ajax({
        method: 'GET',
        url: `${baseURL}/todos/${id}`,
        headers: { access_token: localStorage.access_token }
    })
        .done(response => {
            console.log(response)
            let { title, status, due_date, description } = response.message

            $('#titleEdit').val(title)
            $('#descriptionEdit').val(description)
            $('#due_dateEdit').val(due_date)
        })
        .fail(err => {
            console.log(err)
        })
}

function updateTodoStatus(id) {
    console.log('edit', id)
    $.ajax({
        method: 'PATCH',
        url: `${baseURL}/todos/${id}`,
        headers: { access_token: localStorage.access_token }
    })
        .done(response => {
            console.log(response)
            showMainPage()
        })
        .fail(err => {
            console.log(err)
        })
}

function onSignIn(googleUser) {

    let id_token = googleUser.getAuthResponse().id_token;
    console.log('>>> id_token google : ', id_token)

    $.ajax({
        method: 'POST',
        url: `${baseURL}/loginGoogle`,
        data: { id_token }
    })
        .done(response => {
            console.log(response)
            localStorage.setItem('access_token', response.access_token)
            showMainPage()
        })
        .fail((xhr, status) => {
            console.log(status)
        })

}