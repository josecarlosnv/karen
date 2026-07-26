using System;
using System.Collections.Generic;

namespace DL;

public partial class TipoRev
{
    public int TipoRevId { get; set; }

    public string TipoRev1 { get; set; } = null!;

    public virtual ICollection<Entidade> Entidades { get; set; } = new List<Entidade>();

    public virtual ICollection<Generale> Generales { get; set; } = new List<Generale>();

    public virtual ICollection<Horas2doRevisor> Horas2doRevisors { get; set; } = new List<Horas2doRevisor>();
}
