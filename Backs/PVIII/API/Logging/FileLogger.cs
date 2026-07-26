//using Microsoft.Extensions.Logging;
//namespace API.Logging
//{
//    public class FileLogger : ILogger
//    {

//        private static readonly object _lock = new object(); 
//        public IDisposable BeginScope<TState>(TState state) => null;
//        public bool IsEnabled(LogLevel logLevel) => true;

//        public void Log<TState>(
//    LogLevel logLevel,
//    EventId eventId,
//    TState state,
//    Exception? exception,
//    Func<TState, Exception?, string> formatter)
//        {
//            var day = DateTime.Now.ToString("yyyy-MM-dd");

//            var basePath = AppContext.BaseDirectory; 
//            var path = Path.Combine(basePath, "Logs", day);

//            Directory.CreateDirectory(path);

//            var file = Path.Combine(path, "app.log");

//            var msg =
//                $"{DateTime.Now:HH:mm:ss} [{logLevel}] {formatter(state, exception)}";


//            lock (_lock)
//            {
//                File.AppendAllText(file, msg + Environment.NewLine);
//            }

//        }

//    }
//}
using System.Collections.Concurrent;
using Microsoft.Extensions.Logging;

namespace API.Logging
{
    public sealed class FileLogger : ILogger
    {
        private readonly string _category;
        private readonly LogLevel _min;
        private readonly BlockingCollection<string> _queue;

        public FileLogger(string category, LogLevel min, BlockingCollection<string> queue)
        {
            _category = category;
            _min = min;
            _queue = queue;
        }

        public IDisposable BeginScope<TState>(TState state) => null;

        public bool IsEnabled(LogLevel logLevel) => logLevel >= _min && logLevel != LogLevel.None;

        public void Log<TState>(
            LogLevel logLevel,
            EventId eventId,
            TState state,
            Exception? exception,
            Func<TState, Exception?, string> formatter)
        {
            if (!IsEnabled(logLevel)) return;

            var msg = $"{DateTime.Now:HH:mm:ss} [{logLevel}] {_category}: {formatter(state, exception)}";
            if (exception != null)
                msg += Environment.NewLine + exception;

            _queue.TryAdd(msg);
        }
    }
}
