using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{
    public class ClientEntitiesDto
    {
        public int IdDb { get; set; }

        public List<EntityItemDto> Entities { get; set; }
    }

    public class EntityItemDto
    {
        public string EntityName { get; set; }
        public string Jurisdiction { get; set; }
        public string Type { get; set; }
        public string Ownership { get; set; }
        public string Consolidation { get; set; }
        public decimal Revenue { get; set; }
    }
}