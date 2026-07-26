using Microsoft.EntityFrameworkCore;

namespace DL;

public partial class LeadershipQmContext : DbContext
{
    public LeadershipQmContext(DbContextOptions<LeadershipQmContext> options) : base(options) { }

    public virtual DbSet<EmployeeDatum> EmployeeData { get; set; }
    public virtual DbSet<LqmTblSecurity> LqmTblSecurities { get; set; }
    public virtual DbSet<LqmTblLeaderDatum> LqmTblLeaderData { get; set; }
    public virtual DbSet<LqmTblPenOneMetric> LqmTblPenOneMetrics { get; set; }
    public virtual DbSet<LqmCatIndicatorsPenTwo> LqmCatIndicatorsPenTwos { get; set; }
    public virtual DbSet<LqmTblQualificationsPenTwo> LqmTblQualificationsPenTwos { get; set; }
    public virtual DbSet<LqmCatLeaderHour> LqmCatLeaderHours { get; set; }
    public virtual DbSet<LqmCatManagerDatum> LqmCatManagerData { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ---- Employee_Data (sin llave) ----
        modelBuilder.Entity<EmployeeDatum>(entity =>
        {
            entity.HasNoKey().ToTable("Employee_Data");

            entity.Property(e => e.EmployeeId).HasColumnName("Employee_Id");
            entity.Property(e => e.EmailAddressBusiness).HasColumnName("Email_Address_Business");
            entity.Property(e => e.NetworkId).HasColumnName("Network_Id");
            entity.Property(e => e.FirstName).HasColumnName("First_Name");
            entity.Property(e => e.LastName).HasColumnName("Last_Name");
            entity.Property(e => e.LocalJobLevelName).HasColumnName("Local_Job_Level_Name");
            entity.Property(e => e.LocationName).HasColumnName("Location_Name");
            entity.Property(e => e.PracticaDescription).HasColumnName("PracticaDescription");
            entity.Property(e => e.FechaInicio).HasColumnName("Fecha_Inicio");
        });

                // ---- LQM_Cat_LeaderHours ----
        modelBuilder.Entity<LqmCatLeaderHour>(entity =>
        {
            entity.HasKey(e => e.LeaderHoursKey);
            entity.ToTable("LQM_Cat_LeaderHours");

            entity.Property(e => e.LeaderHoursKey).HasColumnName("leaderHours_Key");
            entity.Property(e => e.LeaderEmployeeId).HasColumnName("leaderEmployeeID");
            entity.Property(e => e.Fy).HasColumnName("FY");
            entity.Property(e => e.LeaderDataUniqueKey).HasColumnName("leaderDataUniqueKey");
            entity.Property(e => e.TotalHours).HasColumnName("totalHours");
            entity.Property(e => e.Waiver).HasColumnName("Waiver");
            entity.Property(e => e.HoursTarget).HasColumnName("hoursTarget");
            entity.Property(e => e.JobEntryDate).HasColumnName("job_EntryDate");
            entity.Property(e => e.ComplianceValidation).HasColumnName("complianceValidation");
        });


        // ---- LQM_Cat_ManagerData ----
        modelBuilder.Entity<LqmCatManagerDatum>(entity =>
        {
            entity.HasKey(e => e.MgrDataPK);
            entity.ToTable("LQM_Cat_ManagerData");

            entity.Property(e => e.MgrDataPK).HasColumnName("mgrDataPK");
            entity.Property(e => e.ManagerEmployeeId).HasColumnName("managerEmployeeID");
            entity.Property(e => e.ManagerName).HasColumnName("managerName");
            entity.Property(e => e.ManagerTitle).HasColumnName("managerTitle");
            entity.Property(e => e.Practice).HasColumnName("Practice");
            entity.Property(e => e.BusinessUnitIdLabel).HasColumnName("businessUnitIdLabel");
            entity.Property(e => e.OfficeLabel).HasColumnName("officeLabel");
            entity.Property(e => e.ManagerEmail).HasColumnName("managerEmail");
            entity.Property(e => e.Fy).HasColumnName("FY");
            entity.Property(e => e.ManagerDataUniqueKey).HasColumnName("managerDataUniqueKey");
        });


        // ---- LQM_Tbl_Security ----
        modelBuilder.Entity<LqmTblSecurity>(entity =>
        {
            entity.HasKey(e => e.SecQrKey);
            entity.ToTable("LQM_Tbl_Security");

            entity.Property(e => e.SecQrKey).HasColumnName("secQR_Key");
            entity.Property(e => e.UserEmail).HasMaxLength(200).HasColumnName("userEmail");
            entity.Property(e => e.UserRole).HasMaxLength(80).HasColumnName("userRole");
            entity.Property(e => e.BusinessUnitIdLabel).HasMaxLength(40).HasColumnName("businessUnitIdLabel");
            entity.Property(e => e.OfficeLabel).HasMaxLength(80).HasColumnName("officeLabel");
            entity.Property(e => e.IsBupic).HasColumnName("isBUPIC");
            entity.Property(e => e.IsHofa).HasColumnName("isHofA");
        });

        // ---- LQM_Tbl_LeaderData (portón de acceso + perfil) ----
        modelBuilder.Entity<LqmTblLeaderDatum>(entity =>
        {
            entity.HasKey(e => e.LeaderDataPK);
            entity.ToTable("LQM_Tbl_LeaderData");

            entity.Property(e => e.LeaderDataPK).HasColumnName("leaderDataPK");
            entity.Property(e => e.LeaderEmployeeID).HasColumnName("leaderEmployeeID");
            entity.Property(e => e.LeaderName).HasColumnName("leaderName");
            entity.Property(e => e.FiscalYearLabel).HasColumnName("FY");
            entity.Property(e => e.LeaderTitle).HasColumnName("leaderTitle");
            entity.Property(e => e.Practice).HasColumnName("Practice");
            entity.Property(e => e.BusinessUnitIdLabel).HasColumnName("businessUnitIdLabel");
            entity.Property(e => e.OfficeLabel).HasColumnName("officeLabel");
            entity.Property(e => e.LeaderDataUniqueKey).HasColumnName("leaderDataUniqueKey").ValueGeneratedOnAddOrUpdate();
            entity.Property(e => e.LeaderEmail).HasColumnName("leaderEmail");
            entity.Property(e => e.NetworkId).HasColumnName("Network_Id");
            entity.Property(e => e.AllowedOffices).HasColumnName("allowedOffices");
            entity.Property(e => e.IsBupic).HasColumnName("IsBUPIC");

        });

        // ---- LQM_Tbl_PenOneMetrics ----
        modelBuilder.Entity<LqmTblPenOneMetric>(entity =>
        {
            entity.HasKey(e => e.LeaderMetricsKey);
            entity.ToTable("LQM_Tbl_PenOneMetrics");

            entity.Property(e => e.LeaderMetricsKey).HasColumnName("leaderMetricsKey");
            entity.Property(e => e.EmployeeId).HasColumnName("Employee_Id");
            entity.Property(e => e.FiscalYearLabel).HasColumnName("fiscalYearLabel");
            entity.Property(e => e.OpenPD).HasColumnName("OpenPD");
            entity.Property(e => e.ClientsGainedText).HasColumnName("clientsGainedText");
            entity.Property(e => e.ClientsLostText).HasColumnName("clientsLostText");
            entity.Property(e => e.KeyActivitiesAssignments).HasColumnName("keyActivitiesAssignments");
            entity.Property(e => e.AcademicTeachingInstitution).HasColumnName("academicTeachingInstitution");
            entity.Property(e => e.AdvancedDegreesCertifications).HasColumnName("advancedDegreesCertifications");
            entity.Property(e => e.IsAdvanceCapabilitiesUsed).HasColumnName("isAdvanceCapabilitiesUsed");
            entity.Property(e => e.IsMapJeUsed).HasColumnName("isMapJeUsed");
            entity.Property(e => e.IsDatasnipperFssUsed).HasColumnName("isDatasnipperFssUsed");
            entity.Property(e => e.IsKcwRolloverUsed).HasColumnName("isKcwRolloverUsed");
            entity.Property(e => e.CreatedByUserEmail).HasColumnName("createdByUserEmail");
            entity.Property(e => e.CreatedDateTime).HasColumnName("createdDateTime");
            entity.Property(e => e.UpdatedByUserEmail).HasColumnName("updatedByUserEmail");
            entity.Property(e => e.UpdatedDateTime).HasColumnName("updatedDateTime");
        });

        // ---- LQM_Cat_Indicators_PenTwo (catálogo de indicadores) ----
        modelBuilder.Entity<LqmCatIndicatorsPenTwo>(entity =>
        {
            entity.HasKey(e => e.CatIndicatorsKey);
            entity.ToTable("LQM_Cat_Indicators_PenTwo");

            entity.Property(e => e.CatIndicatorsKey).HasColumnName("cat_IndicatorsKey");
            entity.Property(e => e.IndicatorLabel).HasColumnName("indicatorLabel");
            entity.Property(e => e.MeasureDescription).HasColumnName("measureDescription");
            entity.Property(e => e.IndicatorDescription).HasColumnName("indicatorDescription");
            entity.Property(e => e.DoesNotMeetQualityExpectations).HasColumnName("doesNotMeetQualityExpectations");
            entity.Property(e => e.PartiallyMeetQualityExpectations).HasColumnName("partiallyMeetQualityExpectations");
            entity.Property(e => e.ConsistentlyMeetsQualityExpectations).HasColumnName("ConsistentlyMeetsQualityExpectations");
            entity.Property(e => e.ExceedsQualityExpectations).HasColumnName("exceedsQualityExpectations");
            entity.Property(e => e.IndicatorsUniqueId).HasColumnName("indicatorsUniqueId");
            entity.Property(e => e.IsIrmApplied).HasColumnName("IsIRMApplied");
            entity.Property(e => e.SourceLabel).HasColumnName("sourcelabel");
            entity.Property(e => e.Fy).HasColumnName("FY");
            entity.Property(e => e.IrmMeasure).HasColumnName("IRMMeasure");
            entity.Property(e => e.IrmMaxMeasure).HasColumnName("IRMMaxMeasure");
            entity.Property(e => e.IndicatorsUniqueKey).HasColumnName("indicatorsUniqueKey").ValueGeneratedOnAddOrUpdate();
            entity.Property(e => e.ApplicableTo).HasColumnName("ApplicableTo");
            entity.Property(e => e.MaxMeasure).HasColumnName("MaxMeasure");
        });

        // ---- LQM_Tbl_Qualifications_PenTwo (calificación por líder+indicador) ----
        modelBuilder.Entity<LqmTblQualificationsPenTwo>(entity =>
        {
            entity.HasKey(e => e.QualyPtKey);
            entity.ToTable("LQM_Tbl_Qualifications_PenTwo");

            entity.Property(e => e.QualyPtKey).HasColumnName("qualyPT_Key");
            entity.Property(e => e.LeaderDataUniqueKey).HasColumnName("leaderDataUniqueKey");
            entity.Property(e => e.IndicatorsUniqueKey).HasColumnName("indicatorsUniqueKey");
            entity.Property(e => e.QualificationScore).HasColumnName("qualificationScore").HasColumnType("decimal(18,2)");
            entity.Property(e => e.CreatedByUserEmail).HasColumnName("createdByUserEmail");
            entity.Property(e => e.CreatedDateTime).HasColumnName("createdDateTime");
            entity.Property(e => e.UpdatedByUserEmail).HasColumnName("updatedByUserEmail");
            entity.Property(e => e.UpdatedDateTime).HasColumnName("updatedDateTime");
            entity.Property(e => e.QualificationDescription).HasColumnName("qualificationDescription");
            entity.Property(e => e.QualificationMessage).HasColumnName("qualificationMessage");

        });
    }
}
