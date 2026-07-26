namespace ML
{
    public class Result
    {
        public bool Correct { get; set; }
        public object? Object { get; set; }
        public List<object>? Objects { get; set; }
        public string? ErrorMessage { get; set; }
        public Exception? Ex { get; set; } 

        // ======================================================
        // Métodos Helper (ESTO ES LO QUE TE FALTABA)
        // ======================================================

        public Result Ok()
        {
            Correct = true;
            return this;
        }

        public Result Ok(object obj)
        {
            Correct = true;
            Object = obj;
            return this;
        }

        public Result Fail(string message)
        {
            Correct = false;
            ErrorMessage = message;
            return this;
        }

        public Result Exception(Exception ex)
        {
            Correct = false;
            Ex = ex;
            ErrorMessage = ex.Message;
            return this;
        }
    }
}