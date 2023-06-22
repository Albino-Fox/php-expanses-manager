$(document).ready(function() {
    let pluralMap = {
        'category': 'categories',
        'vendor': 'vendors',
        'account': 'accounts'
    };

    setupModal('category');
    setupModal('vendor');
    setupModal('account');

    function setupModal(type) {
        let plural = pluralMap[type];
        let table = $('#' + type + 'Table').DataTable();

        $('#' + type + 'Modal').on('show.bs.modal', function (event) {
            $.ajax({
                url: '/expenses/get' + capitalizeFirstLetter(plural),
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    // clear the table before populating it
                    table.clear().draw();

                    // add each item to the table
                    for (let i = 0; i < data.length; i++) {
                        table.row.add([
                            '<input type="checkbox" class="select-' + type + '" value="' + data[i].id + '">',
                            data[i].name,
                            '<button type="button" class="btn btn-danger delete-' + type + '" data-id="' + data[i].id + '">Delete</button>'
                        ]).draw();
                    }
                }
            });
        });

        // wire up the delete buttons
        $('#' + type + 'Table').on('click', '.delete-' + type, function() {
            let itemId = $(this).data('id');

            $.ajax({
                url: '/expenses/delete' + capitalizeFirstLetter(plural),
                type: 'POST',
                data: { [plural]: [itemId] },
                success: function() {
                    // refresh the table
                    $('#' + type + 'Modal').trigger('show.bs.modal');
                }
            });
        });


        // handle the delete selected items button
        $('#deleteSelected' + capitalizeFirstLetter(plural)).click(function() {
            let selectedItems = $('.select-' + type + ':checked').map(function() {
                return $(this).val();
            }).get();
            if(selectedItems){
                $.ajax({
                    url: '/expenses/delete' + capitalizeFirstLetter(plural),
                    type: 'POST',
                    data: { [plural]: selectedItems },
                    success: function() {
                        // refresh the table
                        $('#' + type + 'Modal').trigger('show.bs.modal');
                    }
                });
            }
        });
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});
