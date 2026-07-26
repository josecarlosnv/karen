using DL;
using System;
using System.Collections.Generic;
using System.Text;

namespace BL
{
    public class ReviewBL
    {
        private readonly MexItaStaBiAuditContext _context;

        public ReviewBL(MexItaStaBiAuditContext context)
        {
            _context = context;
        }
    }
}
