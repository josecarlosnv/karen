namespace ML
{

    public class WhoAmIViewModel
    {
        public string? Name { get; set; }
        public bool IsAuthenticated { get; set; }
        public string? Email { get; set; } 
        public string? RoleClaimType { get; set; }
        public List<string> Roles { get; set; } = new();
        public List<ClaimItem> Claims { get; set; } = new();

        public class ClaimItem
        {
            public string Type { get; set; } = "";
            public string Value { get; set; } = "";
        }
    }

}
