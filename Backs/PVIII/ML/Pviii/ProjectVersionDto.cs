using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{
    
    public class ProjectVersionDto
    {
        public int EntityId { get; set; }
        public Guid P8Id { get; set; }
        public long RecordChangeSequence { get; set; }

        public string? CreatedByUserEmail { get; set; }
        public DateTime? CreatedDateTime { get; set; }

        public string? UpdatedByUserEmail { get; set; }
        public DateTime? UpdatedDateTime { get; set; }
    }
}
