using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebAtividadeEntrevista.Models
{
    /// <summary>
    /// Classe de Modelo de Benificiario
    /// </summary>
    public class BeneficiarioModel
    {
        public long Id { get; set; }

        /// <summary>
        /// CPF
        /// </summary>
        [Required]
        [RegularExpression(@"[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$", ErrorMessage = "Digite um CPF válido")]
        public string CPF { get; set; }
        [Required]

        /// <summary>
        /// Nome
        /// </summary>
        public string Nome { get; set; }

        /// <summary>
        /// IdCliente
        /// </summary>
        [Required]
        public long IdCliente { get; set; }


    }
}