using System;
using System.Collections.Generic;

namespace DL;

public partial class MatrixContactRelated
{
    public string EntityGroupNumber { get; set; } = null!;

    public int IdKpmgcontact { get; set; }

    public int IdContact { get; set; }

    public int ObtainedRelationshipId { get; set; }

    public int? DesiredRelationshipId { get; set; }

    public int InfluenceGradeId { get; set; }
}
