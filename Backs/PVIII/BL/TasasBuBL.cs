using DL;
using ML;
using System;
using System.Collections.Generic;
using System.Text;

namespace BL
{
    public  class TasasBuBL
    {
        private readonly MexItaStaBiAuditContext _context;

        public TasasBuBL(MexItaStaBiAuditContext context)
        {
            _context = context;
        }
        public List<TasasBuML> GetAll()
        {
            return _context.CatRateByCategories
                .Where(t => t.LevelLabel == "Staff"
                         || t.LevelLabel == "Staff In Charge"
                         || t.LevelLabel == "Staff-Medio Tiempo"
                         || t.LevelLabel == "Senior"
                         || t.LevelLabel == "Supervising Senior"
                         || t.LevelLabel == "Staff In Charge-Medio Tiempo")
                .OrderBy(t => t.SegmentId)
                .Select(t => new TasasBuML
                {
                    RateByCategoryId = t.RateByCategoryId,
                    CostCenterId = t.CostCenterId,
                    LevelLabel = t.LevelLabel,
                    FiscalYearLabel = t.FiscalYearLabel,
                    CategoryRate = t.CategoryRate,
                    UpdatedByUserEmail = t.UpdatedByUserEmail,
                    UpdatedDateTime = t.UpdatedDateTime,
                    SegmentId = t.SegmentId,
                    SegmentLabel = t.SegmentLabel
                })
                .ToList();
        }



        public TasasBuML? GetById(int id)
        {
            var entidad = _context.CatRateByCategories
                .FirstOrDefault(x => x.RateByCategoryId == id);

            if (entidad == null)
                return null;

            return new TasasBuML
            {
                RateByCategoryId = entidad.RateByCategoryId,
                CostCenterId = entidad.CostCenterId,
                LevelLabel = entidad.LevelLabel,
                FiscalYearLabel = entidad.FiscalYearLabel,
                CategoryRate = entidad.CategoryRate,
                UpdatedByUserEmail = entidad.UpdatedByUserEmail,
                UpdatedDateTime = entidad.UpdatedDateTime,
                SegmentId = entidad.SegmentId,
                SegmentLabel = entidad.SegmentLabel
            };
        }


    }
}
