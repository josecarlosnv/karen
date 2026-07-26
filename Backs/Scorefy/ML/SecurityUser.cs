namespace ML;

public class SecurityUser
{
    public int ID { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? BU { get; set; }
    public bool? Is_Committee { get; set; }
    public string? TypeCommittee { get; set; }
}

public class SecurityUserRequest
{
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? BU { get; set; }
    public bool? IsCommittee { get; set; }
    public string? TypeCommittee { get; set; }
}
