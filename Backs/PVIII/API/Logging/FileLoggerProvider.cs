//using Microsoft.Extensions.Logging;
//namespace API.Logging
//{

//    public class FileLoggerProvider : ILoggerProvider
//    {
//        public ILogger CreateLogger(string categoryName)
//            => new FileLogger();

//        public void Dispose() { }
//    }

//}
using System.Collections.Concurrent;
using Microsoft.Extensions.Logging;

namespace API.Logging
{
    public sealed class FileLoggerProvider : ILoggerProvider
    {
        private readonly BlockingCollection<string> _queue = new(boundedCapacity: 10_000);
        private readonly Task _writer;
        private readonly LogLevel _min;

        public FileLoggerProvider(LogLevel min = LogLevel.Information)
        {
            _min = min;
            _writer = Task.Run(WriteLoop);
        }

        public ILogger CreateLogger(string categoryName) => new FileLogger(categoryName, _min, _queue);

        private void WriteLoop()
        {
            foreach (var msg in _queue.GetConsumingEnumerable()) 
            {
                try
                {
                    var day = DateTime.Now.ToString("yyyy-MM-dd");
                    var dir = Path.Combine(AppContext.BaseDirectory, "Logs", day);
                    Directory.CreateDirectory(dir);
                    File.AppendAllText(Path.Combine(dir, "app.log"), msg + Environment.NewLine);
                }
                catch { 
                }
            }
        }

        public void Dispose()
        {
            _queue.CompleteAdding();
            try { _writer.Wait(2000); } catch { }
        }
    }
}
