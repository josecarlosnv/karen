using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{
  
    public class seguridaaApprobasDTOML
    {
        public bool ApprobAcces { get; set; }

        public int? lvl { get; set; }
        public bool IsLeaderPartner { get; set; }
        public bool CanSeeLeadPartner { get; set; }
        public bool CanSeeBULeader { get; set; }
        public bool CanSeeLevel3 { get; set; }

        public bool CanSeeLevel4 { get; set; }
        public bool isSuperUser { get; set; }
        public string? userRole { get; set; }
    }
}
