$(document).ready(function() {
    // Маска для номеру телефону
    $('#phone').mask('+38 (000) 000-00-00', {
        placeholder: "+38 (0__) ___-__-__",
        clearIfNotMatch: true
    });

    // Валідація форми при зміні значень в полях
    $('#registerForm input, #registerForm select').on('input change', function() {
        validateField($(this));
    });

    // Автоматичне перетворення першої літери на велику для полів Ім'я, Прізвище, По батькові
    $('#firstName, #lastName, #middleName').on('input', function() {
        $(this).val(capitalizeFirstLetter($(this).val()));
    });

    // Функція для перетворення першої літери на велику
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    // Валідація під час сабміту форми
    $('#registerForm').on('submit', function(event) {
        event.preventDefault();
        let isValid = true;

        // Перевіряємо всі поля форми
        $('#registerForm input, #registerForm select').each(function() {
            if (!validateField($(this))) {
                isValid = false;
            }
        });

        // Якщо всі поля валідні, додаємо користувача у таблицю
        if (isValid) {
            addUserToTable();
            this.reset();
            $('small.error-message').text(''); // Очищуємо всі повідомлення про помилки
            $('.table-register').show(); // Показуємо таблицю після заповнення форми
        }
    });

    // Функція валідації для окремого поля
    function validateField(field) {
        const id = field.attr('id');
        let isValid = true;

        switch (id) {
            case 'email':
                if (!validateEmail(field.val())) {
                    showError(field, 'Введіть коректні дані');
                    isValid = false;
                } else {
                    clearError(field);
                }
                break;

            case 'password':
                if (field.val().length < 6) {
                    showError(field, 'Введіть коректні дані');
                    isValid = false;
                } else {
                    clearError(field);
                }
                break;

            case 'phone':
                const phoneRegex = /^\+38 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
                if (!phoneRegex.test(field.val())) {
                    showError(field, 'Введіть коректні дані');
                    isValid = false;
                } else {
                    clearError(field);
                }
                break;

            case 'dob':
                const age = calculateAge(new Date(field.val()));
                if (age < 16 || age > 100) {
                    showError(field, 'Введіть коректні дані');
                    isValid = false;
                } else {
                    clearError(field);
                }
                break;

            case 'group':
                if (!field.val()) {
                    showError(field, 'Введіть коректні дані');
                    isValid = false;
                } else {
                    clearError(field);
                }
                break;

            case 'lastName':
            case 'firstName':
            case 'middleName':
                const nameRegex = /^[a-zA-ZА-Яа-яІіЇїЄєҐґ']+$/;
                if (!nameRegex.test(field.val())) {
                    showError(field, 'Введіть коректні дані');
                    isValid = false;
                } else {
                    clearError(field);
                }
                break;

            default:
                // Валідація статі
                if (!$('input[name="gender"]:checked').val()) {
                    showError($('#genderError'), 'Введіть коректні дані');
                    isValid = false;
                } else {
                    clearError($('#genderError'));
                }
                break;
        }

        return isValid;
    }

    // Показати повідомлення про помилку
    function showError(field, message) {
        let error = field.next('small.error-message');
        if (error.length === 0) {
            error = $('<small class="error-message"></small>').insertAfter(field);
        }
        error.text(message).css('color', 'red').show();
    }

    // Очищення повідомлення про помилку
    function clearError(field) {
        field.next('small.error-message').text('').hide();
    }

    // Валідація email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Обчислення віку
    function calculateAge(birthday) {
        const diff = Date.now() - birthday.getTime();
        const age = new Date(diff).getUTCFullYear() - 1970;
        return age;
    }

    // Додавання користувача у таблицю
    function addUserToTable() {
        const email = $('#email').val();
        const lastName = $('#lastName').val();
        const firstName = $('#firstName').val();
        const middleName = $('#middleName').val();
        const gender = $('input[name="gender"]:checked').val();
        const phone = $('#phone').val();
        const group = $('#group').val();

        const newRow = `
      <tr>
        <td><input type="checkbox" class="row-select"></td>
        <td>${email}</td>
        <td>${lastName}</td>
        <td>${firstName}</td>
        <td>${middleName}</td>
        <td>${gender}</td>
        <td>${phone}</td>
        <td>${group}</td>
      </tr>
    `;

        $('#usersTable tbody').append(newRow);

        $('html, body').animate({ scrollTop: $('#registerForm').offset().top }, 'slow');
    }

    // Функція для видалення обраних рядків
    $('#deleteRows').on('click', function() {
        $('.row-select:checked').each(function() {
            $(this).closest('tr').remove();
        });
    });

    // Функція для дублювання обраних рядків
    $('#duplicateRows').on('click', function() {
        $('.row-select:checked').each(function() {
            const row = $(this).closest('tr');
            const newRow = row.clone();
            newRow.find('.row-select').prop('checked', false); // Скинути чекбокс
            $('#usersTable tbody').append(newRow);
        });
    });

    // Сховати таблицю за замовчуванням
    $('.table-register').hide();
});
