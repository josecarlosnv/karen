using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{

    public class SaveClientConfigurationDto
        {
            public EngagementFrameworkDto? GeneralDetails { get; set; } = null!;
            public List<CreateEntityReportConfigDto>? EntityConfigurations { get; set; } = new();
        }

    
}
