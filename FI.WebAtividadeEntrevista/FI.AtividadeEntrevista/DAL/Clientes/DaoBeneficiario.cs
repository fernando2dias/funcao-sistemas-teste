using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FI.AtividadeEntrevista.DML;

namespace FI.AtividadeEntrevista.DAL
{
    /// <summary>
    /// Classe de acesso a dados de Cliente
    /// </summary>
    internal class DaoBeneficiario : AcessoDados
    {
        
        internal long Incluir(Beneficiario beneficiario)
        {
                List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();
                parametros.Add(new System.Data.SqlClient.SqlParameter("Nome", beneficiario.Nome));
                parametros.Add(new System.Data.SqlClient.SqlParameter("CPF", beneficiario.CPF));
                parametros.Add(new System.Data.SqlClient.SqlParameter("IdCliente", beneficiario.IdCliente));

                DataSet ds = base.Consultar("FI_SP_IncBeneficiarioV2", parametros);
                long ret = 0;
                if (ds.Tables[0].Rows.Count > 0)
                    long.TryParse(ds.Tables[0].Rows[0][0].ToString(), out ret);
                return ret;

        }


        internal List<Beneficiario> Listar(long IdCliente)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("IdCliente", IdCliente));

            DataSet ds = base.Consultar("FI_SP_ConsBeneficiario", parametros);
            List<Beneficiario> beneficiario = Converter(ds);

            return beneficiario;
        }


     
        internal void Excluir(long Id)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("Id", Id));

            base.Executar("FI_SP_DelBeneficiario", parametros);
        }


        internal void Editar(Beneficiario beneficiario)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("Id", beneficiario.Id));
            parametros.Add(new System.Data.SqlClient.SqlParameter("CPF", beneficiario.CPF));
            parametros.Add(new System.Data.SqlClient.SqlParameter("Nome", beneficiario.Nome));

            base.Executar("FI_SP_AltBeneficiario", parametros);
        }


        public List<Beneficiario> Converter(DataSet ds)
        {
            List<Beneficiario> lista = new List<Beneficiario>();
            if (ds != null && ds.Tables != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    Beneficiario beneficiario = new Beneficiario();
                    beneficiario.Id = row.Field<long>("Id");
                    beneficiario.Nome = row.Field<string>("Nome");
                    beneficiario.CPF = row.Field<string>("CPF");
                    beneficiario.IdCliente = row.Field<long>("IDCLIENTE");
                    lista.Add(beneficiario);
                }
            }

            return lista;
        }
    }
}
