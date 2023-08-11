using FI.AtividadeEntrevista.DML;
using System;
using System.Collections.Generic;


namespace FI.AtividadeEntrevista.BLL
{
    public class BoBeneficiario
    {
        public long Incluir(Beneficiario beneficiario)
        {
       
                if (VerificarExistencia(beneficiario.Id, beneficiario.CPF) || !ValidaCPF(beneficiario.CPF))
                {
                    return 0;
                }
                DAL.DaoBeneficiario ben = new DAL.DaoBeneficiario();
                return ben.Incluir(beneficiario);
        }

     
        public void Excluir(long id)
        {
            DAL.DaoBeneficiario beneficiario = new DAL.DaoBeneficiario();
            beneficiario.Excluir(id);
        }

        public long Editar(Beneficiario beneficiario)
        {
            if (VerificarExistencia(beneficiario.Id, beneficiario.CPF) || !ValidaCPF(beneficiario.CPF))
            {
                return 0;
            }

            DAL.DaoBeneficiario daoBeneficiario = new DAL.DaoBeneficiario();
            daoBeneficiario.Editar(beneficiario);
            return beneficiario.Id;
        }

        public List<Beneficiario> Listar(long IdCliente)
        {
            DAL.DaoBeneficiario beneficiario = new DAL.DaoBeneficiario();
            return beneficiario.Listar(IdCliente);
        }


        public bool VerificarExistencia(string CPF)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.VerificarExistencia(CPF);
        }


        public bool VerificarExistencia(long Id, string CPF)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.VerificarExistencia(Id, CPF);
        }


        private bool ValidaCPF(string cpf)
        {
            int[] multiplicador1 = new int[9] { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicador2 = new int[10] { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            string tempCpf;
            string digito;
            int soma;
            int resto;
            cpf = cpf.Trim();
            cpf = cpf.Replace(".", "").Replace("-", "");
            if (cpf.Length != 11)
                return false;
            tempCpf = cpf.Substring(0, 9);
            soma = 0;

            for (int i = 0; i < 9; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador1[i];
            resto = soma % 11;
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = resto.ToString();
            tempCpf = tempCpf + digito;
            soma = 0;
            for (int i = 0; i < 10; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador2[i];
            resto = soma % 11;
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = digito + resto.ToString();
            return cpf.EndsWith(digito);
        }
    }
        
}
