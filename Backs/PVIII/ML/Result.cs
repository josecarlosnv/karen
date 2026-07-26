using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public class Result
    {
        public bool Correct { get; set; }
        public object? Object { get; set; }
        public List<object>? Objects { get; set; }
        public string? ErrorMessage { get; set; }
        public Exception? Ex { get; set; }
        public string? ErrorCode
        {
            get; set;
        }

        }
}
