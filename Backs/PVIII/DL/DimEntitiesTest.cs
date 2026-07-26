using System;
using System.Collections.Generic;

namespace DL;

public partial class DimEntitiesTest
{
    public int DimetId { get; set; }

    public long? EntityId { get; set; }

    public string? EntityDescription { get; set; }

    public long? EntityGroupId { get; set; }

    public string? EntityGroupDescription { get; set; }

    public long? Gisid { get; set; }

    public long? ParentGisid { get; set; }

    public string? EntitySector { get; set; }

    public string? EntityLob { get; set; }

    public bool? IsValidated { get; set; }

    public DateOnly? Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateOnly? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public int? ColumnA { get; set; }

    public int? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }
}
