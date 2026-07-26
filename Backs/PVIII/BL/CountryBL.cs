using DL;
using ML;
using System;
using System.Collections.Generic;
using System.Text;

namespace BL
{
    public class CountryBL
    {
        private readonly MexItaStaBiAuditContext _context;

        public CountryBL(MexItaStaBiAuditContext context)
        {
            _context = context;
        }
        public List<CountryML> GetCountry()
        {
            var engagementSegment = _context.PviiiCatCountries
                .Where(x => x.CatCountryPk != null)
                .Select(x => new CountryML
                {
                    CatCurrencyPk = x.CatCountryPk,
                    CountryLabel = x.CountryLabel
                })
                .OrderBy(o => o.CountryLabel)
                .ToList();

            return engagementSegment;
        }
    }


}
