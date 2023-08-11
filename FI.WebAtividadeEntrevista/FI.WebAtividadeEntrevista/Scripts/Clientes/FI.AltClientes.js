var listaBeneficiarios = new Array();
var editIndece=0;
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

        listaBeneficiarios.push({ "CPF": cpf, "Nome": name, "rowIdx": rowIdx });
       
        $('#gridBeneficiarios').append(

            $("<tr>").append(
                $("<td id='cpf-" + rowIdx + "'>" + cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") + "</td><td id='nome-" + rowIdx +"'>" + name + "</td><td><button class='btn btn-primary editar-beneficiario' id='editar-" + rowIdx +"'>Alterar</button>&nbsp;<button class='btn btn-primary excluir-lista' id='excluir-" + rowIdx +"'>Excluir</button></td> ")
            )
        );
        rowIdx++;
        $("#benef_Nome").val("");
        $("#benef_CPF").val("");

    });


    $(document).on("click", ".excluir", function () {
        console.log($(this).parent().parent());
        var TR = $(this).closest("tr");

        $.ajax({
            url: "/Cliente/ExcluirBeneficiario/" + this.id,
            method: "DELETE",
            data: {"id": this.id,},
            error:
                function (r) {
                    console.log(r);
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (r) {
                    console.log(r);
                    TR.remove();
                }
        });

    });

    $(document).on("click", ".excluir-lista", function () {
 
        var indece = this.id.split("-")[1];
      
        listaBeneficiarios = listaBeneficiarios.filter(item => item.rowIdx != indece);
   
        $(this).closest("tr").remove();

    });

    $(document).on("click", ".editar-beneficiario", function () {
        var indece = this.id.split("-")[1];
        editIndece = indece;

        $("#benef_Nome").val(listaBeneficiarios[indece].Nome);
        $("#benef_CPF").val(listaBeneficiarios[indece].CPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"));

        $("#btn-incluir").css("display", "none");
        $("#btn-editar").css("display", "block");

    });


    $(document).on("click", ".editar-beneficiario-db", function () {
        var id = this.id.split("-")[1];
        editIndece = id;
        var beneficiario = obj.ListaBeneficiarios.find(item => item.Id == id);

        $("#benef_Nome").val(beneficiario.Nome);
        $("#benef_CPF").val(beneficiario.CPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"));

        $("#btn-incluir").css("display", "none");
        $("#btn-editar").css("display", "none");
        $("#btn-editar-db").css("display", "block");

    });


    $(document).on("click", "#btn-editar", function () {
        i = listaBeneficiarios.findIndex(item => item.rowIdx == editIndece);
        listaBeneficiarios[i].CPF = $("#benef_CPF").val();
        listaBeneficiarios[i].Nome = $("#benef_Nome").val();

        $("#cpf-" + editIndece).text($("#benef_CPF").val());
        $("#nome-" + editIndece).text($("#benef_Nome").val());

        $("#btn-incluir").css("display", "block");
        $("#btn-editar").css("display", "none");
        $("#btn-editar-db").css("display", "none");

        $("#benef_Nome").val("");
        $("#benef_CPF").val("");

        editIndece = 0;

    });


    $(document).on("click", "#btn-editar-db", function () {

        var cpf = $("#benef_CPF").val();
        var nome = $("#benef_Nome").val()

        $.ajax({
            url: "/Cliente/EditarBeneficiario/",
            method: "POST",
            data: { "id": editIndece, "Nome": nome, "CPF": cpf.replace(/\D/g, '')},
            error:
                function (r) {
                    console.log(r)
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (r) {
                    $("#cpf-db-" + editIndece).text(cpf);
                    $("#nome-db-" + editIndece).text(nome);

                    $("#btn-incluir").css("display", "block");
                    $("#btn-editar").css("display", "none");
                    $("#btn-editar-db").css("display", "none");

                    $("#benef_Nome").val("");
                    $("#benef_CPF").val("");

                    editIndece = 0;
                }
        });

        
    
    });


    

    if (obj) {
        idCliente = obj.Id;
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #CPF').val(obj.CPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"));
    
        for (var i = 0; i < obj.ListaBeneficiarios.length; i++) {
     
            $('#gridBeneficiarios').append(

                $("<tr>").append(
                    $("<td id='cpf-db-" + obj.ListaBeneficiarios[i].Id + "'>" + obj.ListaBeneficiarios[i].CPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") + "</td><td id='nome-db-" + obj.ListaBeneficiarios[i].Id +"'>" + obj.ListaBeneficiarios[i].Nome + "</td><td><button class='btn btn-primary editar-beneficiario-db' id='edit-" + obj.ListaBeneficiarios[i].Id  +"'>Alterar</button>&nbsp;<button class='btn btn-primary excluir' id='" + obj.ListaBeneficiarios[i].Id +"'>Excluir</button></td> ")
                )
            );
        }

    }

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
                    console.log(r);
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();                                
                window.location.href = urlRetorno;
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

