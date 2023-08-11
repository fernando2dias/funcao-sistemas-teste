var listaBeneficiarios = new Array();
var rowIdx = 0;

$(document).ready(function () {

    document.addEventListener('keydown', function (event) {
        if (event.keyCode != 46 && event.keyCode != 8) {
            var i = document.getElementById("CPF").value.length;
            if (i === 3 || i === 7)
                document.getElementById("CPF").value = document.getElementById("CPF").value + ".";
            else if (i === 11)
                document.getElementById("CPF").value = document.getElementById("CPF").value + "-";
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.keyCode != 46 && event.keyCode != 8) {
            var i = document.getElementById("benef_CPF").value.length;
            if (i === 3 || i === 7)
                document.getElementById("benef_CPF").value = document.getElementById("benef_CPF").value + ".";
            else if (i === 11)
                document.getElementById("benef_CPF").value = document.getElementById("benef_CPF").value + "-";
        }
    });

    $("#btn-incluir").on("click", function () {
        let name = $("#benef_Nome").val();
        let cpf = $("#benef_CPF").val().replace(/\D/g, '');

        listaBeneficiarios.push({ "CPF": cpf, "Nome": name });

        $('#gridBeneficiarios').append(

            $("<tr>").append(
                $("<td>" + cpf + "</td><td>" + name + "</td><td><button class='btn btn-primary'>Alterar</button>&nbsp;<button class='btn btn-primary'>Excluir</button></td> ")
            )
        );

        $("#benef_Nome").val("");
        $("#benef_CPF").val("");

    });

   
    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": $(this).find("#CPF").val().replace(/\D/g, ''),
                "ListaBeneficiarios": listaBeneficiarios
            },
            error:
                function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();
            }
        });
    })
    
})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

function carregaBeneficiarios(idCliente) {
    console.log('carregar beneficiados ' + idCliente);
}
