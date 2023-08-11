using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(ClienteModel model)
        {
            BoCliente bo = new BoCliente();
            
            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                
                model.Id = bo.Incluir(new Cliente()
                {                    
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone,
                    CPF = model.CPF 
                });


                if (model.ListaBeneficiarios != null && model.ListaBeneficiarios.Any())
                {
                    CadastraBeneficiario(model);
                }


                if (model.Id > 0)
                {
                    return Json("Cadastro efetuado com sucesso");
                }

                Response.StatusCode = 400;
                return Json("CPF já cadastrado ou Inválido!");

            }
        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            BoCliente bo = new BoCliente();
             
            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                bool result = bo.Alterar(new Cliente()
                {
                    Id = model.Id,
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone,
                    CPF = model.CPF
                   
                });


                if (model.ListaBeneficiarios != null && model.ListaBeneficiarios.Any())
                {
                    CadastraBeneficiario(model);
                }
   

                if (result)
                {
                    return Json("Cadastro alterado com sucesso");
                }
                Response.StatusCode = 400;
                return Json("CPF já cadastrado ou inválido!");
            }
        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoCliente bo = new BoCliente();
            Cliente cliente = bo.Consultar(id);
            Models.ClienteModel model = null;

            if (cliente != null)
            {
                List<BeneficiarioModel> beneficiarioModels = new List<BeneficiarioModel>();

                foreach (var beneficiario in cliente.Beneficiarios)
                {
                    beneficiarioModels.Add(
                        new BeneficiarioModel()
                        {
                            Id = beneficiario.Id,
                            CPF = beneficiario.CPF,
                            Nome = beneficiario.Nome,
                            IdCliente = beneficiario.IdCliente
                        }); 
                }

                model = new ClienteModel()
                {
                    Id = cliente.Id,
                    CEP = cliente.CEP,
                    Cidade = cliente.Cidade,
                    Email = cliente.Email,
                    Estado = cliente.Estado,
                    Logradouro = cliente.Logradouro,
                    Nacionalidade = cliente.Nacionalidade,
                    Nome = cliente.Nome,
                    Sobrenome = cliente.Sobrenome,
                    Telefone = cliente.Telefone,
                    CPF = cliente.CPF,
                    ListaBeneficiarios = beneficiarioModels

                };

            
            }

            return View(model);
        }

        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                //Return result to jTable
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }


        private void CadastraBeneficiario(ClienteModel model)
        {
            BoBeneficiario boBeneficiario = new BoBeneficiario();

            foreach (var beneficiario in model.ListaBeneficiarios)
            {
                long result2 = boBeneficiario.Incluir(new Beneficiario()
                {
                    IdCliente = model.Id,
                    Nome = beneficiario.Nome,
                    CPF = beneficiario.CPF
                });
            }

        }


        [HttpPost]
        public JsonResult BenficiarioList(long idCliente)
        {
            try
            {
                List<Beneficiario> beneficiarios = new BoBeneficiario().Listar(idCliente);
     
                return Json(new { Result = "OK", Records = beneficiarios });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }


        [HttpPost]
        public JsonResult EditarBeneficiario(BeneficiarioModel model)
        {
            try
            {
                long result = new BoBeneficiario().Editar(new Beneficiario()
                {
                    Id = model.Id,
                    Nome = model.Nome,
                    CPF = model.CPF
                });

                if(result > 0)
                {
                    return Json(new { Result = "OK", Records = model });
                }

                Response.StatusCode = 400;
                return Json("CPF já cadastrado ou inválido!");

            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json("Erro interno");
            }
        }


        [HttpDelete]
        public void ExcluirBeneficiario(long id)
        {
            BoBeneficiario bo = new BoBeneficiario();
            bo.Excluir(id);

        } 

    }
}