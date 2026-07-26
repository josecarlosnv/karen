namespace ML
{
    public class ExcludedItem
    { 
        public int Index { get; set; }               // índice del reactivo en Items
        public string Competency { get; set; } = "";
        public string SubCompetency { get; set; } = "";
        public string Description { get; set; } = "";
        public string MarkedBy { get; set; } = "self";  // self | evaluator | both
    }
}
