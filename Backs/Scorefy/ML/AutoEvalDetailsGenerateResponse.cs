using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public class AutoEvalDetailsGenerateResponse
    {
        public string IdColabEmpProy { get; set; } = null!;
        public bool ExistePrevio { get; set; } 
        public bool ExisteCierre { get; set; }
        public List<AutoEvalDetailItem> Items { get; set; } = new();
        public AutoEvalHeaderDto? Header { get; set; }

    }
}
