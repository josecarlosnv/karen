namespace ML
{
    public class EntityModel
    {
        public long Id { get; set; }
        public string? Description { get; set; }
        public long GroupId { get; set; }
        public string? GroupDescription { get; set; }
        public string? Sector { get; set; }
        public string? Lob { get; set; }
    }
}