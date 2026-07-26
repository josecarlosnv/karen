using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace DL;

public partial class MexItaStaBiAuditContext : DbContext
{
    //public MexItaStaBiAuditContext()
    //{
    //}

    public MexItaStaBiAuditContext(DbContextOptions<MexItaStaBiAuditContext> options)
        : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // Dejar vacío. La cadena va por DI en Program.cs
    }



    public virtual DbSet<AipFactEnglishLevel> AipFactEnglishLevels { get; set; }

    
    public virtual DbSet<AipTblAuditNote> AipTblAuditNotes { get; set; }

   

    public virtual DbSet<AudColabsSgVw> AudColabsSgVws { get; set; }

    public virtual DbSet<AudColabsVw> AudColabsVws { get; set; }

    public virtual DbSet<AudNotasT> AudNotasTs { get; set; }

   

    public virtual DbSet<AuditNotesAudt> AuditNotesAudts { get; set; }

    public virtual DbSet<Audnota> Audnotas { get; set; }

   

    public virtual DbSet<Bu> Bus { get; set; }

    

    public virtual DbSet<CatalogoBu> CatalogoBus { get; set; }

    

    public virtual DbSet<ConclusionsEval> ConclusionsEvals { get; set; }

    

    
    public virtual DbSet<Employee> Employees { get; set; }

    public virtual DbSet<EmployeeCourse> EmployeeCourses { get; set; }

    public virtual DbSet<EmployeeDataInactive> EmployeeDataInactives { get; set; }
    public virtual DbSet<EmployeeDatum> EmployeeData { get; set; }

    public virtual DbSet<English> Englishes { get; set; }

    public virtual DbSet<EnglishLevel> EnglishLevels { get; set; }

    public virtual DbSet<EnglishlevelAudt> EnglishlevelAudts { get; set; }

    public virtual DbSet<Entidade> Entidades { get; set; }

    public virtual DbSet<Entity> Entities { get; set; }

    

    public virtual DbSet<Estatus> Estatuses { get; set; }

    public virtual DbSet<EvaluaColabDetail> EvaluaColabDetails { get; set; }

    public virtual DbSet<EvaluaColabDetails2025> EvaluaColabDetails2025s { get; set; }

    public virtual DbSet<EvaluaColabResume> EvaluaColabResumes { get; set; }

    public virtual DbSet<EvaluaColabResume2025> EvaluaColabResume2025s { get; set; }
    //tablas agregadas manualmente para el modelo nuevo para final conclusion
    public virtual DbSet<Evaluation> Evaluations { get; set; }
    public virtual  DbSet<EvaluationStep> EvaluationSteps { get; set; }
    public virtual DbSet<LkpDecisionType> LkpDecisionTypes { get; set; }
    public virtual DbSet<LkpPromotionCategory> LkpPromotionCategories { get; set; }
    public virtual DbSet<LkpStageStatus> LkpStageStatuses { get; set; }

   

   

    public virtual DbSet<IncisosEdp> IncisosEdps { get; set; }

    

   
   

   

    public virtual DbSet<Office> Offices { get; set; }

    public virtual DbSet<Oficina> Oficinas { get; set; }

   

    public virtual DbSet<ReactivosEdp> ReactivosEdps { get; set; }

    public virtual DbSet<ReactivosRoleProfile> ReactivosRoleProfiles { get; set; }

   

    public virtual DbSet<ReporteAuditGeneral> ReporteAuditGenerals { get; set; }

    public virtual DbSet<ReporteAuditGeneral2025> ReporteAuditGeneral2025s { get; set; }

    public virtual DbSet<ReporteAuditGeneral2026> ReporteAuditGeneral2026s { get; set; }

    public virtual DbSet<ReporteAuditProductividad> ReporteAuditProductividads { get; set; }

    public virtual DbSet<ReporteAuditProductividad2025> ReporteAuditProductividad2025s { get; set; }

    public virtual DbSet<ReporteAuditTiempo> ReporteAuditTiempos { get; set; }

    public virtual DbSet<ReporteAuditTiempos2025> ReporteAuditTiempos2025s { get; set; }

    public virtual DbSet<ReporteAuditTiempos2026> ReporteAuditTiempos2026s { get; set; }

    public virtual DbSet<ReporteIngreso> ReporteIngresos { get; set; }

   

    public virtual DbSet<RoleProfileDetail> RoleProfileDetails { get; set; }

    public virtual DbSet<RoleProfileResuman> RoleProfileResumen { get; set; }

    

    public virtual DbSet<ScorefyDimFiscalYearPeriod> ScorefyDimFiscalYearPeriods { get; set; }

    public virtual DbSet<ScorefyTblEvaluationsGenerate> ScorefyTblEvaluationsGenerates { get; set; }

    public virtual DbSet<ScorefyTblEvaluationsGenerateExtra> ScorefyTblEvaluationsGenerateExtras { get; set; }

    public virtual DbSet<ScorefyTblException> ScorefyTblExceptions { get; set; }

   

    public virtual DbSet<SecurityScorefy> SecurityScorefies { get; set; }

   

    public virtual DbSet<VistaEvaluacRp> VistaEvaluacRps { get; set; }

    

    public virtual DbSet<VwDimEntity> VwDimEntities { get; set; }

    

    public virtual DbSet<VwEntidadesCfy> VwEntidadesCfies { get; set; }

    public virtual DbSet<VwEntidadesPfy> VwEntidadesPfies { get; set; }

    public virtual DbSet<VwEntity> VwEntities { get; set; }

   

    public virtual DbSet<VwEstatusEvalProy> VwEstatusEvalProys { get; set; }

    

    public virtual DbSet<VwEvaluaColabDetail> VwEvaluaColabDetails { get; set; }

    public virtual DbSet<VwEvaluaColabResume> VwEvaluaColabResumes { get; set; }

    public virtual DbSet<VwEvaluaColabResumeRespaldo> VwEvaluaColabResumeRespaldos { get; set; }

    public virtual DbSet<VwEvaluaColabResumeTest> VwEvaluaColabResumeTests { get; set; }

    public virtual DbSet<VwEvaluacRp> VwEvaluacRps { get; set; }

   

    public virtual DbSet<VwIncisosEdp> VwIncisosEdps { get; set; }

   

    public virtual DbSet<VwReactivosEdp> VwReactivosEdps { get; set; }

    public virtual DbSet<VwReactivosEdpinciso> VwReactivosEdpincisos { get; set; }

    public virtual DbSet<VwReactivosRoleProfile> VwReactivosRoleProfiles { get; set; }

    public virtual DbSet<VwReactivosRp> VwReactivosRps { get; set; }

    public virtual DbSet<VwReporteAuditGeneral> VwReporteAuditGenerals { get; set; }

    public virtual DbSet<VwReporteAuditTiempo> VwReporteAuditTiempos { get; set; }

    public virtual DbSet<VwReporteAuditTiemposColab> VwReporteAuditTiemposColabs { get; set; }

    public virtual DbSet<VwRoleProfileDetail> VwRoleProfileDetails { get; set; }

    public virtual DbSet<VwRoleProfileResuman> VwRoleProfileResumen { get; set; }

    public virtual DbSet<VwScorefyEmployee> VwScorefyEmployees { get; set; }

    public virtual DbSet<VwScorefyFirstCutOff> VwScorefyFirstCutOffs { get; set; }

    public virtual DbSet<VwScorefySecondCutOff> VwScorefySecondCutOffs { get; set; }


    public virtual DbSet<ScorefyDimProfileCompetencyWeight> ScorefyDimProfileCompetencyWeights { get; set; } = null!;


    public virtual DbSet<ScorefyTblPersonalProfile> ScorefyTblPersonalProfiles { get; set; } = null!;

    public virtual DbSet<ScorefyTblManagerPerformanceConclusion> ScorefyTblManagerPerformanceConclusions { get; set; }
    public virtual DbSet<ScorefyTblCommitePerformanceConclusion> ScorefyTblCommitePerformanceConclusions { get; set; }
    public virtual DbSet<ScorefyDimPromotionCategory> ScorefyDimPromotionCategories { get; set; }
    public virtual DbSet<ScorefyDimScoreQPR> ScorefyDimScoreQprs { get; set; }
    public virtual DbSet<ScorefyTblEmail> ScorefyTblEmails { get; set; }



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ScorefyTblEmail>(entity =>
        {
            entity.HasKey(e => e.IdEmail);

            entity.ToTable("scorefy_tbl_Email");

            entity.HasIndex(e => new { e.ContextKey, e.EmailType }, "UX_scorefy_tbl_Email_NoDuplicates")
                .IsUnique()
                .HasFilter("([IdentitySect] IN ((1), (2)))");

            entity.Property(e => e.ContextKey).HasMaxLength(100);
            entity.Property(e => e.Created)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())", "DF_scorefy_tbl_Email_CreatedUtc");
            entity.Property(e => e.EmailType).HasMaxLength(50);
            entity.Property(e => e.FromEmail)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.FromName)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.ToEmail)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.ToName)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ScorefyTblManagerPerformanceConclusion>(entity =>
        {
            entity.ToTable("scorefy_tbl_ManagerPerformanceConclusion");

            entity.HasKey(e => e.MPC_Id);

            entity.Property(e => e.EmployeeId).HasColumnName("EmployeeId");

            entity.Property(e => e.Local_Job_Level_Name)
                .HasColumnName("Local_Job_Level_Name")
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.Email_Address_Business)
                .HasColumnName("Email_Address_Business")
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.PM_LocalJob)
                .HasColumnName("PM_LocalJob")
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.PM_Email)
                .HasColumnName("PM_Email")
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.FY).HasColumnName("FY");

            entity.Property(e => e.ManagerFeedbackDiscussionConfirmed)
                .HasColumnName("ManagerFeedbackDiscussionConfirmed");

            entity.Property(e => e.MandatoryTrainingCompleted)
                .HasColumnName("MandatoryTrainingCompleted");

            entity.Property(e => e.IndependenceEth)
                .HasColumnName("IndependenceEth");

            entity.Property(e => e.RoleResponsibilitiesMet)
                .HasColumnName("RoleResponsibilitiesMet");

            entity.Property(e => e.CodeOfConductIncidents)
                .HasColumnName("CodeOfConductIncidents");

            entity.Property(e => e.ScoreQPR)
                .HasColumnName("ScoreQPR");

            entity.Property(e => e.ComplianceAdditionalComments)
                .HasColumnName("ComplianceAdditionalComments")
                .HasColumnType("nvarchar(max)");

            entity.Property(e => e.PromotionOrCO)
                .HasColumnName("PromotionOrCO");

            entity.Property(e => e.PromotedToCategory)
                .HasColumnName("PromotedToCategory");

            entity.Property(e => e.COReason)
                .HasColumnName("COReason")
                .HasColumnType("nvarchar(max)");

            entity.Property(e => e.FinalOpenPDRating)
                .HasColumnName("FinalOpenPDRating");

            entity.Property(e => e.FinalStrengthsSummary)
                .HasColumnName("FinalStrengthsSummary")
                .HasColumnType("nvarchar(max)");

            entity.Property(e => e.FinalAreasOfOpportunity)
                .HasColumnName("FinalAreasOfOpportunity")
                .HasColumnType("nvarchar(max)");

            entity.Property(e => e.CreatedBy)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.Property(e => e.Created)
                .HasColumnType("datetime");

            entity.Property(e => e.ModifiedBy)
                .HasColumnName("ModifiedBy")
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.Property(e => e.Modified)
                .HasColumnType("datetime");

            entity.Property(e => e.IsCurrent)
                .HasColumnName("IsCurrent");

            entity.Property(e => e.Columna_A).HasColumnName("Columna_A");
            entity.Property(e => e.Columna_B).HasColumnName("Columna_B");

            entity.Property(e => e.Columna_C)
                .HasColumnName("Columna_C")
                .HasMaxLength(250)
                .IsUnicode(false);

            entity.Property(e => e.Columna_D)
                .HasColumnName("Columna_D")
                .HasMaxLength(250)
                .IsUnicode(false);

            // ✅ Relationship: EmployeeId → vw_scorefy_employees.Employee_Id
            //entity.HasOne<VwScorefyEmployee>()
            //    .WithMany()
            //    .HasForeignKey(e => e.EmployeeId)
            //    .HasPrincipalKey(v => v.EmployeeId);

            // ✅ Relationship: PM_Email → vw_scorefy_employees.PMEmail
            //entity.HasOne<VwScorefyEmployee>()
            //    .WithMany()
            //    .HasForeignKey(e => e.PM_Email)
            //    .HasPrincipalKey(v => v.PMEmail);

            // ✅ Relationship: ScoreQPR → dim ScoreQPR
            entity.HasOne<ScorefyDimScoreQPR>()
                .WithMany()
                .HasForeignKey(e => e.ScoreQPR)
                .HasPrincipalKey(d => d.ScoreQPRId);

            // ✅ Relationship: PromotedToCategory → promotionCategory
            entity.HasOne<ScorefyDimPromotionCategory>()
                .WithMany()
                .HasForeignKey(e => e.PromotedToCategory)
                .HasPrincipalKey(c => c.PromotionCategoryId);
        });

        modelBuilder.Entity<ScorefyTblCommitePerformanceConclusion>(entity =>
        {
            entity.ToTable("scorefy_tbl_CommitePerformanceConclusion");

            entity.HasKey(e => e.CPC_Id);

            entity.Property(e => e.EmployeeId).HasColumnName("EmployeeId");
            entity.Property(e => e.FY).HasColumnName("FY");

            entity.Property(e => e.Cpc_PromotionOrCO).HasColumnName("Cpc_PromotionOrCO");
            entity.Property(e => e.Cpc_PromotedToCategory).HasColumnName("Cpc_PromotedToCategory");
            entity.Property(e => e.Cpc_COReason)
                .HasColumnName("Cpc_COReason")
                .HasColumnType("nvarchar(max)");
            entity.Property(e => e.Cpc_FinalOpenPDRating).HasColumnName("Cpc_FinalOpenPDRating");
            entity.Property(e => e.Cpc_GeneralComments)
                .HasColumnName("Cpc_GeneralComments")
                .HasColumnType("nvarchar(max)");

            entity.Property(e => e.Calibration_FinalOpenPDRating).HasColumnName("Calibration_FinalOpenPDRating");
            entity.Property(e => e.Calibration_GeneralComments)
                .HasColumnName("Calibration_GeneralComments")
                .HasColumnType("nvarchar(max)");

            entity.Property(e => e.CreatedBy)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Created).HasColumnType("datetime");

            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Modified).HasColumnType("datetime");

            entity.Property(e => e.IsCurrent).HasColumnName("IsCurrent");

            entity.Property(e => e.Columna_A).HasColumnName("Columna_A");
            entity.Property(e => e.Columna_B).HasColumnName("Columna_B");
            entity.Property(e => e.Columna_C)
                .HasColumnName("Columna_C")
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Columna_D)
                .HasColumnName("Columna_D")
                .HasMaxLength(250)
                .IsUnicode(false);

            // ✅ Relaciones
            entity.HasOne<ScorefyDimPromotionCategory>()
                .WithMany()
                .HasForeignKey(e => e.Cpc_PromotedToCategory)
                .HasPrincipalKey(p => p.PromotionCategoryId);

            //entity.HasOne<VwScorefyEmployee>()
            //    .WithMany()
            //    .HasForeignKey(e => e.EmployeeId)
            //    .HasPrincipalKey(v => v.EmployeeId);
        });

        modelBuilder.Entity<ScorefyDimPromotionCategory>(entity =>
        {
            entity.ToTable("scorefy_dim_promotionCategory");
            entity.HasKey(e => e.PromotionCategoryId);
            entity.Property(e => e.PromotionCategoryName).HasMaxLength(100);
        });

        modelBuilder.Entity<ScorefyDimScoreQPR>(entity =>
        {
            entity.ToTable("scorefy_dim_ScoreQPR");
            entity.HasKey(e => e.ScoreQPRId);
            entity.Property(e => e.ScoreDetail).HasMaxLength(50);
        });

        modelBuilder.Entity<ScorefyDimProfileCompetencyWeight>(e =>
        {
            e.ToTable("scorefy_dim_profile_competency_weight"); // nombre real de la tabla
            e.HasKey(x => x.CompetencyWeightId);
            e.Property(x => x.Fy).HasColumnName("FY");
            e.Property(x => x.CompetenciaId).HasColumnName("CompetenciaId"); // o el nombre real exacto
            e.Property(x => x.Local_Job_Level_Name).HasColumnName("Local_Job_Level_Name");
            e.Property(x => x.Weight).HasColumnName("Weight");
        });

        modelBuilder.Entity<AipFactEnglishLevel>(entity =>
        {
            entity.HasKey(e => e.EnglishId).HasName("PK__aip_fact__57A4636295EA1981");

            entity.ToTable("aip_fact_english_level");

            entity.Property(e => e.EnglishId).HasColumnName("english_id");
            entity.Property(e => e.Comments)
                .HasColumnType("text")
                .HasColumnName("comments");
            entity.Property(e => e.EmployeeId).HasColumnName("employee_id");
            entity.Property(e => e.EnglishLevel)
                .HasColumnType("decimal(3, 1)")
                .HasColumnName("english_level");
            entity.Property(e => e.EnglishTypeLevel)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("english_type_level");
            entity.Property(e => e.EvaluationYear).HasColumnName("evaluation_year");
        });


        modelBuilder.Entity<AipTblAuditNote>(entity =>
        {
            entity.HasKey(e => e.AuditId).HasName("PK__aip_tbl___5AF33E33E94FE48B");

            entity.ToTable("aip_tbl_audit_notes");

            entity.Property(e => e.AuditId).HasColumnName("audit_id");
            entity.Property(e => e.Address)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("address_");
            entity.Property(e => e.AvailableForTravel).HasColumnName("available_for_travel");
            entity.Property(e => e.Created)
                .HasColumnType("datetime")
                .HasColumnName("created");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("created_by");
            entity.Property(e => e.EmergencyContactName)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("emergency_contact_name");
            entity.Property(e => e.EmergencyContactPersonalNumber)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("emergency_contact_personal_number");
            entity.Property(e => e.EmployeeId).HasColumnName("employee_id");
            entity.Property(e => e.GraduationDate)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("graduation_date");
            entity.Property(e => e.IsFullTime).HasColumnName("is_full_time");
            entity.Property(e => e.IsGraduated).HasColumnName("is_graduated");
            entity.Property(e => e.IsStudying).HasColumnName("is_studying");
            entity.Property(e => e.ModifiedAt)
                .HasColumnType("datetime")
                .HasColumnName("modified_at");
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("modified_by");
            entity.Property(e => e.PersonalNumber)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("personal_number");
            entity.Property(e => e.PostalCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("postal_code");
            entity.Property(e => e.Schedule)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("schedule_");
            entity.Property(e => e.SchoolName)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("school_name");
            entity.Property(e => e.StatusUpdate).HasColumnName("status_update");
            entity.Property(e => e.TerminationDate).HasColumnName("termination_date");
            entity.Property(e => e.TerminationReason)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("termination_reason");
            entity.Property(e => e.TerminationStatus).HasColumnName("termination_status");
            
        });


        modelBuilder.Entity<AudColabsSgVw>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("Aud_Colabs_SG_VW");

            entity.Property(e => e.CostCenter)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Cost_Center");
            entity.Property(e => e.CostCenterDescrip)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Cost_Center_Descrip");
            entity.Property(e => e.EmailAddressBusiness)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Email_Address_Business");
            entity.Property(e => e.EmployeeClassName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Employee_Class_Name");
            entity.Property(e => e.EmployeeId)
                .HasMaxLength(11)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Employee_Id");
            entity.Property(e => e.EmployeeSubClass)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Employee_Sub_Class");
            entity.Property(e => e.EmployeeSubClassName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Employee_Sub_Class_Name");
            entity.Property(e => e.EndDate).HasColumnName("End_date");
            entity.Property(e => e.EstatusEmployee)
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Estatus_Employee");
            entity.Property(e => e.FechaInicio).HasColumnName("Fecha_Inicio");
            entity.Property(e => e.FechaUltimaAct).HasColumnType("datetime");
            entity.Property(e => e.FiServiceNetwork)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FI_Service_Network");
            entity.Property(e => e.FiServiceNetworkName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FI_Service_Network_Name");
            entity.Property(e => e.FirstName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("First_Name");
            entity.Property(e => e.FullName)
                .HasMaxLength(62)
                .IsUnicode(false)
                .HasColumnName("Full_Name");
            entity.Property(e => e.HireDate).HasColumnName("Hire_Date");
            entity.Property(e => e.JobEntryDate).HasColumnName("Job_Entry_Date");
            entity.Property(e => e.LastDateWorked).HasColumnName("Last_DateWorked");
            entity.Property(e => e.LastName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("Last_Name");
            entity.Property(e => e.LocalJobLevel)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Local_Job_Level");
            entity.Property(e => e.LocalJobLevelName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Local_Job_Level_Name");
            entity.Property(e => e.LocalJobTitle)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Local_Job_Title");
            entity.Property(e => e.LocationName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("Location_Name");
            entity.Property(e => e.OriginalHireDate).HasColumnName("Original_Hire_Date");
            entity.Property(e => e.PracticaDescription)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.ProbationaryEndDate).HasColumnName("Probationary_End_Date");
            entity.Property(e => e.ProbationaryPeriodo).HasColumnName("Probationary_Periodo");
            entity.Property(e => e.ProductoDescription).IsUnicode(false);
            entity.Property(e => e.SeniorityDate).HasColumnName("Seniority_Date");
            entity.Property(e => e.ServiceLine)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Service_Line");
            entity.Property(e => e.ServiceLineName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Service_Line_Name");
            entity.Property(e => e.UserName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("User_Name");
            entity.Property(e => e.YearsInRole).HasColumnType("decimal(10, 2)");
        });

        modelBuilder.Entity<AudColabsVw>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("Aud_Colabs_VW");

            entity.Property(e => e.CostCenter)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Cost_Center");
            entity.Property(e => e.CostCenterDescrip)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Cost_Center_Descrip");
            entity.Property(e => e.EmailAddressBusiness)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Email_Address_Business");
            entity.Property(e => e.EmployeeClassName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Employee_Class_Name");
            entity.Property(e => e.EmployeeId)
                .HasMaxLength(11)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Employee_Id");
            entity.Property(e => e.EmployeeSubClass)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Employee_Sub_Class");
            entity.Property(e => e.EmployeeSubClassName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Employee_Sub_Class_Name");
            entity.Property(e => e.EndDate).HasColumnName("End_date");
            entity.Property(e => e.EstatusEmployee)
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Estatus_Employee");
            entity.Property(e => e.FechaInicio).HasColumnName("Fecha_Inicio");
            entity.Property(e => e.FechaUltimaAct).HasColumnType("datetime");
            entity.Property(e => e.FiServiceNetwork)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FI_Service_Network");
            entity.Property(e => e.FiServiceNetworkName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FI_Service_Network_Name");
            entity.Property(e => e.FirstName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("First_Name");
            entity.Property(e => e.FullName)
                .HasMaxLength(62)
                .IsUnicode(false)
                .HasColumnName("Full_Name");
            entity.Property(e => e.HireDate).HasColumnName("Hire_Date");
            entity.Property(e => e.JobEntryDate).HasColumnName("Job_Entry_Date");
            entity.Property(e => e.LastDateWorked).HasColumnName("Last_DateWorked");
            entity.Property(e => e.LastName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("Last_Name");
            entity.Property(e => e.LocalJobLevel)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Local_Job_Level");
            entity.Property(e => e.LocalJobLevelName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Local_Job_Level_Name");
            entity.Property(e => e.LocalJobTitle)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Local_Job_Title");
            entity.Property(e => e.LocationName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("Location_Name");
            entity.Property(e => e.OriginalHireDate).HasColumnName("Original_Hire_Date");
            entity.Property(e => e.PracticaDescription)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.ProbationaryEndDate).HasColumnName("Probationary_End_Date");
            entity.Property(e => e.ProbationaryPeriodo).HasColumnName("Probationary_Periodo");
            entity.Property(e => e.ProductoDescription).IsUnicode(false);
            entity.Property(e => e.SeniorityDate).HasColumnName("Seniority_Date");
            entity.Property(e => e.ServiceLine)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Service_Line");
            entity.Property(e => e.ServiceLineName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Service_Line_Name");
            entity.Property(e => e.UserName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("User_Name");
            entity.Property(e => e.YearsInRole).HasColumnType("decimal(10, 2)");
        });

        modelBuilder.Entity<AudNotasT>(entity =>
        {
            entity.HasKey(e => e.AudNotasTId).HasName("AudNotasT_Id");

            entity.ToTable("AudNotasT");

            entity.Property(e => e.AudNotasTId).HasColumnName("AudNotasT_Id");
            entity.Property(e => e.AntigPuestoActual)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.ColumnA)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_A");
            entity.Property(e => e.ColumnB)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_B");
            entity.Property(e => e.ColumnC).HasColumnName("Column_C");
            entity.Property(e => e.ColumnD).HasColumnName("Column_D");
            entity.Property(e => e.Comentarios)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.ContactoEmerg)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Cp).HasColumnName("CP");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Domicilio)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.EscuelaCampus)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Esquema)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.EstudiaName)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.FechaFinEstudios)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.HorarioClases)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
        });


        modelBuilder.Entity<AuditNotesAudt>(entity =>
        {
            entity.HasKey(e => e.AuditNoteId).HasName("PK__audit_no__F3C18F3A7D4D05E4");

            entity.ToTable("audit_notes_audt");

            entity.Property(e => e.AuditNoteId)
                .ValueGeneratedNever()
                .HasColumnName("audit_note_id");
            entity.Property(e => e.AntigPuestoActual)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Comentarios)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.ContactoEmerg)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Cp).HasColumnName("CP");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Domicilio)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.EscuelaCampus)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Esquema)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.EstudiaName)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.FechaFinEstudios)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.HorarioClases)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Audnota>(entity =>
        {
            entity.HasKey(e => e.AudnotasId).HasName("audnotas_Id");

            entity.ToTable("audnotas");

            entity.Property(e => e.AudnotasId).HasColumnName("audnotas_Id");
            entity.Property(e => e.Antigpuestoactual)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("antigpuestoactual");
            entity.Property(e => e.Celular).HasColumnName("celular");
            entity.Property(e => e.Comentarios)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("comentarios");
            entity.Property(e => e.Contactoemerg)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("contactoemerg");
            entity.Property(e => e.Costcenter).HasColumnName("costcenter");
            entity.Property(e => e.Cp).HasColumnName("cp");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Dispxviaje).HasColumnName("dispxviaje");
            entity.Property(e => e.Dispxviajename)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("dispxviajename");
            entity.Property(e => e.Domicilio)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("domicilio");
            entity.Property(e => e.Employeeid).HasColumnName("employeeid");
            entity.Property(e => e.Escuelacampus)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("escuelacampus");
            entity.Property(e => e.Esquema)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("esquema");
            entity.Property(e => e.Estudia)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("estudia");
            entity.Property(e => e.Estudianame)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("estudianame");
            entity.Property(e => e.Fechafinestudios)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("fechafinestudios");
            entity.Property(e => e.Fechaingresofirma)
                .HasColumnType("datetime")
                .HasColumnName("fechaingresofirma");
            entity.Property(e => e.Fechanacimiento)
                .HasColumnType("datetime")
                .HasColumnName("fechanacimiento");
            entity.Property(e => e.Fechapromocion).HasColumnName("fechapromocion");
            entity.Property(e => e.Fullname)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("fullname");
            entity.Property(e => e.Horarioclases)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("horarioclases");
            entity.Property(e => e.Isfulltime).HasColumnName("isfulltime");
            entity.Property(e => e.Isfulltimename)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("isfulltimename");
            entity.Property(e => e.Istfulltime)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("istfulltime");
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Nombre)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.Productodescrip)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("productodescrip");
            entity.Property(e => e.Puesto)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("puesto");
            entity.Property(e => e.Titulado)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("titulado");
        });

        modelBuilder.Entity<Bu>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("BU");

            entity.Property(e => e.Buid).HasColumnName("BUID");
            entity.Property(e => e.Name)
                .HasMaxLength(10)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CatalogoBu>(entity =>
        {
            entity.ToTable("CatalogoBU");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Bu)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("BU");
            entity.Property(e => e.ColumnA)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_A");
            entity.Property(e => e.ColumnB)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_B");
            entity.Property(e => e.ColumnC)
                .HasColumnType("decimal(18, 4)")
                .HasColumnName("Column_C");
            entity.Property(e => e.ColumnD)
                .HasColumnType("decimal(18, 4)")
                .HasColumnName("Column_D");
            entity.Property(e => e.CostCenter)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.CostCenterDescrip)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Fy).HasColumnName("FY");
            entity.Property(e => e.Oficina)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.OficinaId)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Segmento)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.SegmentoId)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ScorefyTblPersonalProfile>(entity =>
        {
            entity.ToTable("scorefy_tbl_PersonalProfile");

            entity.HasKey(e => e.ProfileId);

            entity.Property(e => e.EmployeeId)
                .HasColumnName("Employee_ID")
                .HasColumnType("char(11)")
                .IsFixedLength()
                .HasMaxLength(11);

            entity.Property(e => e.EvaluatedName).HasMaxLength(250);
            entity.Property(e => e.PMName).HasMaxLength(250);
            entity.Property(e => e.EvaluatedEmail).HasMaxLength(250);
            entity.Property(e => e.StaffLevel).HasColumnName("Staff_Level").HasMaxLength(250);
            entity.Property(e => e.CreatedBy).HasMaxLength(250);
            entity.Property(e => e.ColumnA).HasColumnName("Column_A").HasMaxLength(250);
            entity.Property(e => e.ColumnB).HasColumnName("Column_B").HasMaxLength(250);
            entity.Property(e => e.PMEmail).HasMaxLength(100);

            // Tipos y nombres ya están indicados por [Column], pero se pueden reiterar:
            entity.Property(e => e.PMID).HasColumnName("PMID");
            entity.Property(e => e.ProffesionalDegree).HasColumnName("Proffesional_Degree");
            entity.Property(e => e.CP).HasColumnName("CP");
            entity.Property(e => e.IsCurrent).HasColumnName("IsCurrent");
            entity.Property(e => e.EventNumber).HasColumnName("Event_Number").IsRequired();
            entity.Property(e => e.Created).HasColumnName("Created");
            entity.Property(e => e.ColumnC).HasColumnName("Column_C");
            entity.Property(e => e.ColumnD).HasColumnName("Column_D");
        });

        modelBuilder.Entity<ConclusionsEval>(entity =>
        {
            entity.ToTable("ConclusionsEval");

            entity.Property(e => e.Id).HasColumnName("ID");

            entity.Property(e => e.ReunionPM).HasColumnName("ReunionPM");
            entity.Property(e => e.AreasOportunidadPm)
                .HasMaxLength(600)
                .IsUnicode(false)
                .HasColumnName("AreasOportunidad_PM");
            entity.Property(e => e.BuEvaluado)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("BU_Evaluado");
            entity.Property(e => e.CategoriaEvaluado)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Categoria_Evaluado");
            entity.Property(e => e.CategoriaPromocionCj)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("CategoriaPromocion_CJ");
            entity.Property(e => e.CategoriaPromocionPm)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("CategoriaPromocion_PM");
            entity.Property(e => e.CoCj).HasColumnName("CO_CJ");
            entity.Property(e => e.CoPm).HasColumnName("CO_PM");
            entity.Property(e => e.CocomentariosCj)
                .HasMaxLength(600)
                .IsUnicode(false)
                .HasColumnName("COComentarios_CJ");
            entity.Property(e => e.CocomentariosPm)
                .HasMaxLength(600)
                .IsUnicode(false)
                .HasColumnName("COComentarios_PM");
            entity.Property(e => e.ColumnA)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_A");
            entity.Property(e => e.ColumnB)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_B");
            entity.Property(e => e.ColumnC)
                .HasColumnType("decimal(18, 4)")
                .HasColumnName("Column_C");
            entity.Property(e => e.ColumnD)
                .HasColumnType("decimal(18, 4)")
                .HasColumnName("Column_D");
            entity.Property(e => e.ColumnE)
                .HasMaxLength(600)
                .IsUnicode(false)
                .HasColumnName("Column_E");
            entity.Property(e => e.ColumnF)
                .HasColumnType("decimal(18, 4)")
                .HasColumnName("Column_F");
            entity.Property(e => e.ColumnG)
                .HasMaxLength(600)
                .IsUnicode(false)
                .HasColumnName("Column_G");
            entity.Property(e => e.ColumnH)
                .HasColumnType("decimal(18, 4)")
                .HasColumnName("Column_H");
            entity.Property(e => e.ColumnI)
                .HasMaxLength(600)
                .IsUnicode(false)
                .HasColumnName("Column_I");
            entity.Property(e => e.ColumnJ)
                .HasColumnType("decimal(18, 4)")
                .HasColumnName("Column_J");
            entity.Property(e => e.ComentariosEval)
                .HasMaxLength(600)
                .IsUnicode(false)
                .HasColumnName("Comentarios_Eval");
            entity.Property(e => e.ComentariosGenerales)
                .HasMaxLength(600)
                .IsUnicode(false);
            entity.Property(e => e.Created)
                .HasDefaultValueSql("(getdate())", "dfd_ConclusionsEval_Created")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.EmailConclusion)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Email_Conclusion");
            entity.Property(e => e.EmailEvaluado)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Email_Evaluado");
            entity.Property(e => e.EmailEvaluador)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Email_Evaluador");
            entity.Property(e => e.EmployeeIdConclusion).HasColumnName("EmployeeId_Conclusion");
            entity.Property(e => e.EmployeeIdEvaluado).HasColumnName("EmployeeId_Evaluado");
            entity.Property(e => e.EmployeeIdEvaluador).HasColumnName("EmployeeId_Evaluador");
            entity.Property(e => e.FortalezasPm)
                .HasMaxLength(600)
                .IsUnicode(false)
                .HasColumnName("Fortalezas_PM");
            entity.Property(e => e.Fy).HasColumnName("FY");
            entity.Property(e => e.Modified).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.OficinaEvaluado)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Oficina_Evaluado");
            entity.Property(e => e.OpenPdCj).HasColumnName("OpenPD_CJ");
            entity.Property(e => e.OpenPdPm).HasColumnName("OpenPD_PM");
            entity.Property(e => e.Periodo)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.PromocionCj).HasColumnName("Promocion_CJ");
            entity.Property(e => e.PromocionPm).HasColumnName("Promocion_PM");
        });


        modelBuilder.Entity<Employee>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Employee");

            entity.Property(e => e.Name).IsUnicode(false);
        });

        modelBuilder.Entity<EmployeeCourse>(entity =>
        {
            entity.HasKey(e => e.QeId).HasName("QE");

            entity.Property(e => e.QeId).HasColumnName("QE_ID");
            entity.Property(e => e.AuditGeneral)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ColumnA)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_A");
            entity.Property(e => e.ColumnB)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_B");
            entity.Property(e => e.ColumnC).HasColumnName("Column_C");
            entity.Property(e => e.ColumnD).HasColumnName("Column_D");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeId).HasColumnName("Employee_Id");
            entity.Property(e => e.Esg)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ESG");
            entity.Property(e => e.GlobalBanking)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Ifrbaseline)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("IFRBaseline");
            entity.Property(e => e.IfrbaselineFs)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("IFRBaselineFS");
            entity.Property(e => e.Ifrs09)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("IFRS09");
            entity.Property(e => e.Ifrs17)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("IFRS17");
            entity.Property(e => e.Irm)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("IRM");
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Pcaob)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("PCAOB");
            entity.Property(e => e.SegurosFianzas)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.SoQm)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("SoQM");
            entity.Property(e => e.Soc)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("SOC");
        });

        modelBuilder.Entity<EmployeeDataInactive>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Employee_Data_Inactive");

            entity.Property(e => e.ApplicantTrackId)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Applicant_Track_Id");
            entity.Property(e => e.BusinessMobile)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("Business_Mobile");
            entity.Property(e => e.ClientFacing)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Client_Facing");
            entity.Property(e => e.CommunicationLanguage)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Communication_Language");
            entity.Property(e => e.ContractExpDate).HasColumnName("Contract_Exp_Date");
            entity.Property(e => e.CostCenter)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Cost_Center");
            entity.Property(e => e.CostCenterDescrip)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Cost_Center_Descrip");
            entity.Property(e => e.CountryOfBirth)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Country_Of_Birth");
            entity.Property(e => e.DateOfBirth).HasColumnName("Date_Of_Birth");
            entity.Property(e => e.EmailAddressBusiness)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Email_Address_Business");
            entity.Property(e => e.EmailAddressPersonal)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Email_Address_Personal");
            entity.Property(e => e.EmployeeClass)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Employee_Class");
            entity.Property(e => e.EmployeeClassName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Employee_Class_Name");
            entity.Property(e => e.EmployeeClassReplication)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Employee_Class_Replication");
            entity.Property(e => e.EmployeeId)
                .HasMaxLength(11)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Employee_Id");
            entity.Property(e => e.EmployeePorcentaje)
                .HasColumnType("numeric(5, 0)")
                .HasColumnName("Employee_Porcentaje");
            entity.Property(e => e.EmployeeSubClass)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Employee_Sub_Class");
            entity.Property(e => e.EmployeeSubClassName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Employee_Sub_Class_Name");
            entity.Property(e => e.EndDate).HasColumnName("End_date");
            entity.Property(e => e.EstatusEmployee)
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Estatus_Employee");
            entity.Property(e => e.EventReason)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("Event_Reason");
            entity.Property(e => e.FechaInicio).HasColumnName("Fecha_Inicio");
            entity.Property(e => e.FechaUltimaAct).HasColumnType("datetime");
            entity.Property(e => e.FiFunction)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("FI_Function");
            entity.Property(e => e.FiFunctionName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Fi_Function_Name");
            entity.Property(e => e.FiSegment)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("FI_Segment");
            entity.Property(e => e.FiSegmentName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FI_Segment_Name");
            entity.Property(e => e.FiServiceGroup)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FI_Service_Group");
            entity.Property(e => e.FiServiceGroupName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FI_Service_Group_Name");
            entity.Property(e => e.FiServiceNetwork)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FI_Service_Network");
            entity.Property(e => e.FiServiceNetworkName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FI_Service_Network_Name");
            entity.Property(e => e.FirstName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("First_Name");
            entity.Property(e => e.Fte)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("FTE");
            entity.Property(e => e.FunctionId)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Function_Id");
            entity.Property(e => e.FunctionName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Function_Name");
            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.GlobalId)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Global_Id");
            entity.Property(e => e.GlobalJobLevel)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Global_Job_Level");
            entity.Property(e => e.HireDate).HasColumnName("Hire_Date");
            entity.Property(e => e.HomePhone)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("Home_Phone");
            entity.Property(e => e.IbsCostCenter)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("IBS_Cost_Center");
            entity.Property(e => e.JobCode)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("Job_Code");
            entity.Property(e => e.JobCodeTitle)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("Job_Code_Title");
            entity.Property(e => e.LastDateWorked).HasColumnName("Last_DateWorked");
            entity.Property(e => e.LastName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("Last_Name");
            entity.Property(e => e.LegalEntity)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Legal_Entity");
            entity.Property(e => e.LegalEntityName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Legal_Entity_Name");
            entity.Property(e => e.LocalJobLevel)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Local_Job_Level");
            entity.Property(e => e.LocalJobLevelName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Local_Job_Level_Name");
            entity.Property(e => e.LocalJobTitle)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Local_Job_Title");
            entity.Property(e => e.Location)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.LocationName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("Location_Name");
            entity.Property(e => e.Manager)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.MaritalStatus)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Marital_Status");
            entity.Property(e => e.MemberFirm)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Member_Firm");
            entity.Property(e => e.MemberFirmName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Member_Firm_Name");
            entity.Property(e => e.MiddleName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("Middle_Name");
            entity.Property(e => e.Nationality)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.NetworkId)
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Network_Id");
            entity.Property(e => e.OriginalHireDate).HasColumnName("Original_Hire_Date");
            entity.Property(e => e.Pais)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.PayGrade)
                .HasMaxLength(2)
                .IsUnicode(false)
                .HasColumnName("Pay_Grade");
            entity.Property(e => e.PayGradeName)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("Pay_Grade_Name");
            entity.Property(e => e.PayGroup)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Pay_Group");
            entity.Property(e => e.PayGroupCompInformation)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Pay_Group_Comp_Information");
            entity.Property(e => e.PayrollEndDate).HasColumnName("Payroll_EndDate");
            entity.Property(e => e.PayrollId)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Payroll_Id");
            entity.Property(e => e.PersonalMobile)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("Personal_Mobile");
            entity.Property(e => e.PracticaDescription)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.PracticePorcentaje)
                .HasColumnType("numeric(5, 0)")
                .HasColumnName("Practice_Porcentaje");
            entity.Property(e => e.ProbationaryEndDate).HasColumnName("Probationary_End_Date");
            entity.Property(e => e.ProbationaryPeriodo).HasColumnName("Probationary_Periodo");
            entity.Property(e => e.ProbationaryTime)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Probationary_Time");
            entity.Property(e => e.ProductoDescription).IsUnicode(false);
            entity.Property(e => e.ProjectExpDate).HasColumnName("Project_Exp_Date");
            entity.Property(e => e.SapIbsId)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("SAP_IBS_ID");
            entity.Property(e => e.SecondLastName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("Second_Last_Name");
            entity.Property(e => e.SecondmentExpDate).HasColumnName("Secondment_Exp_Date");
            entity.Property(e => e.SeniorityDate).HasColumnName("Seniority_Date");
            entity.Property(e => e.ServiceGroup)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Service_Group");
            entity.Property(e => e.ServiceGroupName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Service_Group_Name");
            entity.Property(e => e.ServiceLine)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Service_Line");
            entity.Property(e => e.ServiceLineName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Service_Line_Name");
            entity.Property(e => e.UserName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("User_Name");
        });

        modelBuilder.Entity<EmployeeDatum>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Employee_Data");

            entity.HasIndex(e => e.EmployeeId, "UX_Employee_Data_Employee_Id").IsUnique();

            entity.Property(e => e.ApplicantTrackId)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Applicant_Track_Id");
            entity.Property(e => e.ClientFacing)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Client_Facing");
            entity.Property(e => e.ContractExpDate).HasColumnName("Contract_Exp_Date");
            entity.Property(e => e.CostCenter)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Cost_Center");
            entity.Property(e => e.CostCenterDescrip)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Cost_Center_Descrip");
            entity.Property(e => e.EmailAddressBusiness)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Email_Address_Business");
            entity.Property(e => e.EmployeeClass)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Employee_Class");
            entity.Property(e => e.EmployeeClassName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Employee_Class_Name");
            entity.Property(e => e.EmployeeClassReplication)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Employee_Class_Replication");
            entity.Property(e => e.EmployeeId)
                .HasMaxLength(11)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Employee_Id");
            entity.Property(e => e.EmployeePorcentaje)
                .HasColumnType("numeric(5, 0)")
                .HasColumnName("Employee_Porcentaje");
            entity.Property(e => e.EmployeeSubClass)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Employee_Sub_Class");
            entity.Property(e => e.EmployeeSubClassName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Employee_Sub_Class_Name");
            entity.Property(e => e.EndDate).HasColumnName("End_date");
            entity.Property(e => e.EstatusEmployee)
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Estatus_Employee");
            entity.Property(e => e.EventReason)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("Event_Reason");
            entity.Property(e => e.FechaInicio).HasColumnName("Fecha_Inicio");
            entity.Property(e => e.FechaUltimaAct).HasColumnType("datetime");
            entity.Property(e => e.FiFunction)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("FI_Function");
            entity.Property(e => e.FiFunctionName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Fi_Function_Name");
            entity.Property(e => e.FiSegment)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("FI_Segment");
            entity.Property(e => e.FiSegmentName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FI_Segment_Name");
            entity.Property(e => e.FiServiceGroup)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FI_Service_Group");
            entity.Property(e => e.FiServiceGroupName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FI_Service_Group_Name");
            entity.Property(e => e.FiServiceNetwork)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FI_Service_Network");
            entity.Property(e => e.FiServiceNetworkName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FI_Service_Network_Name");
            entity.Property(e => e.FirstName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("First_Name");
            entity.Property(e => e.Fte)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("FTE");
            entity.Property(e => e.FunctionId)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Function_Id");
            entity.Property(e => e.FunctionName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Function_Name");
            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.GlobalId)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Global_Id");
            entity.Property(e => e.GlobalJobLevel)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Global_Job_Level");
            entity.Property(e => e.HireDate).HasColumnName("Hire_Date");
            entity.Property(e => e.IbsCostCenter)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("IBS_Cost_Center");
            entity.Property(e => e.JobCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Job_Code");
            entity.Property(e => e.JobCodeTitle)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Job_Code_Title");
            entity.Property(e => e.JobEntryDate).HasColumnName("Job_Entry_Date");
            entity.Property(e => e.LastDateWorked).HasColumnName("Last_DateWorked");
            entity.Property(e => e.LastName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("Last_Name");
            entity.Property(e => e.LegalEntity)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Legal_Entity");
            entity.Property(e => e.LegalEntityName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Legal_Entity_Name");
            entity.Property(e => e.LocalJobLevel)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Local_Job_Level");
            entity.Property(e => e.LocalJobLevelName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Local_Job_Level_Name");
            entity.Property(e => e.LocalJobTitle)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Local_Job_Title");
            entity.Property(e => e.Location)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.LocationName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("Location_Name");
            entity.Property(e => e.Manager)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.MemberFirm)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Member_Firm");
            entity.Property(e => e.MemberFirmName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Member_Firm_Name");
            entity.Property(e => e.MiddleName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("Middle_Name");
            entity.Property(e => e.Nationality)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.NetworkId)
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Network_Id");
            entity.Property(e => e.OriginalHireDate).HasColumnName("Original_Hire_Date");
            entity.Property(e => e.Pais)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.PayGrade)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Pay_Grade");
            entity.Property(e => e.PayGradeName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Pay_Grade_Name");
            entity.Property(e => e.PayGroup)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Pay_Group");
            entity.Property(e => e.PayGroupCompInformation)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Pay_Group_Comp_Information");
            entity.Property(e => e.PayrollEndDate).HasColumnName("Payroll_EndDate");
            entity.Property(e => e.PayrollId)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Payroll_Id");
            entity.Property(e => e.PracticaDescription)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.PracticePorcentaje)
                .HasColumnType("numeric(5, 0)")
                .HasColumnName("Practice_Porcentaje");
            entity.Property(e => e.ProbationaryEndDate).HasColumnName("Probationary_End_Date");
            entity.Property(e => e.ProbationaryPeriodo).HasColumnName("Probationary_Periodo");
            entity.Property(e => e.ProbationaryTime)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Probationary_Time");
            entity.Property(e => e.ProductoDescription).IsUnicode(false);
            entity.Property(e => e.ProjectExpDate).HasColumnName("Project_Exp_Date");
            entity.Property(e => e.SapIbsId)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("SAP_IBS_ID");
            entity.Property(e => e.SecondLastName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("Second_Last_Name");
            entity.Property(e => e.SecondmentExpDate).HasColumnName("Secondment_Exp_Date");
            entity.Property(e => e.SeniorityDate).HasColumnName("Seniority_Date");
            entity.Property(e => e.ServiceGroup)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Service_Group");
            entity.Property(e => e.ServiceGroupName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Service_Group_Name");
            entity.Property(e => e.ServiceLine)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Service_Line");
            entity.Property(e => e.ServiceLineName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Service_Line_Name");
            entity.Property(e => e.UserName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("User_Name");
        });

        modelBuilder.Entity<English>(entity =>
        {
            entity.HasKey(e => e.EnglishId).HasName("EnglishId");

            entity.ToTable("English");

            entity.Property(e => e.English1)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("English");
        });

        modelBuilder.Entity<EnglishLevel>(entity =>
        {
            entity.ToTable("EnglishLevel");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ColumnA).HasColumnName("Column_A");
            entity.Property(e => e.ColumnB)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_B");
            entity.Property(e => e.Comentarios)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeId).HasColumnName("Employee_ID");
            entity.Property(e => e.EnglishLevel1)
                .HasColumnType("decimal(18, 4)")
                .HasColumnName("English_Level");
        });

        modelBuilder.Entity<EnglishlevelAudt>(entity =>
        {
            entity.HasKey(e => e.PkEnglishId).HasName("PK__englishl__767CBC4BE9B55649");

            entity.ToTable("englishlevel_audt");

            entity.HasIndex(e => e.FkEmployeeId, "UQ__englishl__6D523DFBCAE64D1F").IsUnique();

            entity.Property(e => e.PkEnglishId).HasColumnName("pk_english_id");
            entity.Property(e => e.EnglishLevel)
                .HasColumnType("decimal(3, 1)")
                .HasColumnName("english_level");
            entity.Property(e => e.EvaluationDate).HasColumnName("evaluation_date");
            entity.Property(e => e.FkEmployeeId).HasColumnName("fk_employee_id");
        });

        modelBuilder.Entity<Entidade>(entity =>
        {
            entity.HasKey(e => e.IdPviiiEnt).HasName("ID_PVIII_Ent");

            entity.Property(e => e.IdPviiiEnt).HasColumnName("ID_PVIII_Ent");
            entity.Property(e => e.AuditRules)
                .HasMaxLength(300)
                .IsUnicode(false);
            entity.Property(e => e.ColumnA).HasColumnName("Column_A");
            entity.Property(e => e.ColumnB).HasColumnName("Column_B");
            entity.Property(e => e.ColumnC)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_C");
            entity.Property(e => e.ColumnD)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_D");
            entity.Property(e => e.ComissarId).HasColumnName("ComissarID");
            entity.Property(e => e.ComissarName)
                .HasMaxLength(300)
                .IsUnicode(false);
            entity.Property(e => e.Created).HasColumnType("datetime");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.ESic)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("e_SIC");
            entity.Property(e => e.EntityClient)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("Entity_client");
            entity.Property(e => e.EntityGroupId)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Entity_group_ID");
            entity.Property(e => e.EntityId)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Entity_ID");
            entity.Property(e => e.Fdo)
                .HasColumnType("datetime")
                .HasColumnName("FDO");
            entity.Property(e => e.FinancialRules)
                .HasMaxLength(300)
                .IsUnicode(false);
            entity.Property(e => e.HonAudit)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Hon_audit");
            entity.Property(e => e.HonFisc)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Hon_fisc");
            entity.Property(e => e.HonReport)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Hon_report");
            entity.Property(e => e.IdP8)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ID_P8");
            entity.Property(e => e.Modified).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Nature)
                .HasMaxLength(300)
                .IsUnicode(false);
            entity.Property(e => e.Srfee).HasColumnName("SRFee");
            entity.Property(e => e.Srid).HasColumnName("SRID");
            entity.Property(e => e.Srname)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("SRName");
            entity.Property(e => e.TipoInfId).HasColumnName("Tipo_infId");
            entity.Property(e => e.TipoRevId).HasColumnName("Tipo_revId");
            entity.Property(e => e.TotalHonEnt)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Total_hon_ent");
        });

        modelBuilder.Entity<Entity>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.Country)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.EntityDescription)
                .HasMaxLength(300)
                .IsUnicode(false);
            entity.Property(e => e.EntityGroupDescription)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.EntityGroupId).HasColumnName("EntityGroupID");
            entity.Property(e => e.EntityId).HasColumnName("EntityID");
            entity.Property(e => e.EntityLob)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasColumnName("EntityLOB");
            entity.Property(e => e.EntitySector)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.EntitySic)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("EntitySIC");
            entity.Property(e => e.PostalCode)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.Region)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.StreetConcatenation).IsUnicode(false);
        });

        modelBuilder.Entity<Estatus>(entity =>
        {
            entity.HasKey(e => e.EstatusId).HasName("EstatusId");

            entity.ToTable("Estatus");

            entity.Property(e => e.Estatus1)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("Estatus");
        });

        modelBuilder.Entity<EvaluaColabDetail>(entity =>
        {
            entity.HasKey(e => e.EcdId).HasName("ECD_Id");

            entity.Property(e => e.EcdId).HasColumnName("ECD_Id");
            entity.Property(e => e.ColumnA)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("Column_A");
            entity.Property(e => e.ColumnB)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("Column_B");
            entity.Property(e => e.ColumnC).HasColumnName("Column_C");
            entity.Property(e => e.ColumnD).HasColumnName("Column_D");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.CreatedTime)
                .HasDefaultValueSql("(getdate())", "dfd_EvaluaColabDetails_Created_time")
                .HasColumnType("datetime")
                .HasColumnName("Created_time");
            entity.Property(e => e.EvaluatedComent)
                .HasMaxLength(350)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatorComent)
                .HasMaxLength(350)
                .IsUnicode(false);
            entity.Property(e => e.IdColabEmpProy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("ID_Colab_Emp_Proy");
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.ModifiedTime)
                .HasColumnType("datetime")
                .HasColumnName("Modified_time");
            entity.Property(e => e.ReactiveNum)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.SubCompetence).HasColumnType("decimal(18, 2)");


            // ...tu mapeo actual...
            entity.Ignore(e => e.CutOff);
            entity.Ignore(e => e.EvaluationType);
            entity.Ignore(e => e.IsCurrent);

        });

        modelBuilder.Entity<EvaluaColabDetails2025>(entity =>
        {
            entity.HasKey(e => e.EcdId);

            entity.ToTable("EvaluaColabDetails2025");

            entity.Property(e => e.EcdId)
                .ValueGeneratedNever()
                .HasColumnName("ECD_Id");
            entity.Property(e => e.ColumnA)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Column_A");
            entity.Property(e => e.ColumnB)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Column_B");
            entity.Property(e => e.ColumnC)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Column_C");
            entity.Property(e => e.ColumnD)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Column_D");
            entity.Property(e => e.Created)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreatedTime)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Created_time");
            entity.Property(e => e.EvaluatedComent).IsUnicode(false);
            entity.Property(e => e.EvaluatorComent).IsUnicode(false);
            entity.Property(e => e.IdColabEmpProy)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ID_Colab_Emp_Proy");
            entity.Property(e => e.Modified)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ModifiedTime)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Modified_time");
            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<EvaluaColabResume>(entity =>
        {
            entity.HasKey(e => e.EcrId).HasName("ECRE_Id");

            entity.ToTable("EvaluaColabResume");

            entity.Property(e => e.EcrId).HasColumnName("ECR_Id");
            entity.Property(e => e.ClientName)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.ColumnA)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("Column_A");
            entity.Property(e => e.ColumnB)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("Column_B");
            entity.Property(e => e.ColumnC).HasColumnName("Column_C");
            entity.Property(e => e.ColumnD).HasColumnName("Column_D");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.CreatedTime)
                .HasDefaultValueSql("(getdate())", "dfd_EvaluaColabResume_Created_time")
                .HasColumnType("datetime")
                .HasColumnName("Created_time");
            entity.Property(e => e.CutOff).HasColumnName("Cut_Off");
            entity.Property(e => e.EntityNumber)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatedId).HasColumnName("EvaluatedID");
            entity.Property(e => e.EvaluatorId).HasColumnName("EvaluatorID");
            entity.Property(e => e.Fy).HasColumnName("FY");
            entity.Property(e => e.GeneratedType).HasColumnName("Generated_Type");
            entity.Property(e => e.GradeEvaluated).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.GradeEvaluator).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.IdColabEmpProy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("ID_Colab_Emp_Proy");
            entity.Property(e => e.KeyReport)
                .HasMaxLength(56)
                .IsUnicode(false)
                .HasComputedColumnSql("(concat([EntityNumber],[EvaluatedID],[Generated_Type],[Cut_Off]))", true)
                .HasColumnName("Key_Report");
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.ModifiedTime)
                .HasColumnType("datetime")
                .HasColumnName("Modified_time");
            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<EvaluaColabResume2025>(entity =>
        {
            entity.HasKey(e => e.EcrId);

            entity.ToTable("EvaluaColabResume2025");

            entity.Property(e => e.EcrId)
                .ValueGeneratedNever()
                .HasColumnName("ECR_Id");
            entity.Property(e => e.ClientName).IsUnicode(false);
            entity.Property(e => e.ColumnA)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Column_A");
            entity.Property(e => e.ColumnB)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Column_B");
            entity.Property(e => e.ColumnC)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Column_C");
            entity.Property(e => e.ColumnD)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Column_D");
            entity.Property(e => e.Created)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreatedTime)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Created_time");
            entity.Property(e => e.CutOff)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Cut_Off");
            entity.Property(e => e.EvaluatedId).HasColumnName("EvaluatedID");
            entity.Property(e => e.EvaluatorId).HasColumnName("EvaluatorID");
            entity.Property(e => e.Fy).HasColumnName("FY");
            entity.Property(e => e.GeneratedType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Generated_Type");
            entity.Property(e => e.IdColabEmpProy)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ID_Colab_Emp_Proy");
            entity.Property(e => e.KeyReport)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Key_Report");
            entity.Property(e => e.Modified)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ModifiedTime)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Modified_time");
            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<IncisosEdp>(entity =>
        {
            entity.HasKey(e => e.IdtRedp).HasName("Idt_REDP");

            entity.ToTable("IncisosEDP");

            entity.Property(e => e.IdtRedp).HasColumnName("Idt_REDP");
            entity.Property(e => e.ColumnA)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_A");
            entity.Property(e => e.ColumnB)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_B");
            entity.Property(e => e.ColumnC).HasColumnName("Column_C");
            entity.Property(e => e.ColumnD).HasColumnName("Column_D");
            entity.Property(e => e.CompetenciaDescrip)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Fy).HasColumnName("FY");
            entity.Property(e => e.Nivel)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.NumReactivo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ReactivoDescrip)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.SubCompetencia).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.SubCompetenciaDescrip)
                .HasMaxLength(250)
                .IsUnicode(false);
        });


        modelBuilder.Entity<Office>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Office");

            entity.Property(e => e.Name)
                .HasMaxLength(150)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Oficina>(entity =>
        {
            entity.HasKey(e => e.OficinaId).HasName("OficinaId");

            entity.ToTable("Oficina");

            entity.Property(e => e.Oficina1)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("Oficina");
        });

        modelBuilder.Entity<ReactivosEdp>(entity =>
        {
            entity.HasKey(e => e.IdRedp).HasName("Id_REDP");

            entity.ToTable("ReactivosEDP");

            entity.Property(e => e.IdRedp).HasColumnName("Id_REDP");
            entity.Property(e => e.ColumnA)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_A");
            entity.Property(e => e.ColumnB)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_B");
            entity.Property(e => e.ColumnC).HasColumnName("Column_C");
            entity.Property(e => e.ColumnD).HasColumnName("Column_D");
            entity.Property(e => e.CompetenciaDescrip)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Fy).HasColumnName("FY");
            entity.Property(e => e.Nivel)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.NumReactivo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ReactivoDescrip)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.SubCompetencia).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.SubCompetenciaDescrip)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ReactivosRoleProfile>(entity =>
        {
            entity.HasKey(e => e.IdRrp).HasName("Id_RRP");

            entity.ToTable("ReactivosRoleProfile");

            entity.Property(e => e.IdRrp).HasColumnName("Id_RRP");
            entity.Property(e => e.ColumnA)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_A");
            entity.Property(e => e.ColumnB)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_B");
            entity.Property(e => e.ColumnC).HasColumnName("Column_C");
            entity.Property(e => e.ColumnD).HasColumnName("Column_D");
            entity.Property(e => e.Fy).HasColumnName("FY");
            entity.Property(e => e.Indicador)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Nivel)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ReporteAuditGeneral>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("ReporteAuditGeneral");

            entity.Property(e => e.BilledWip).HasColumnName("Billed WIP");
            entity.Property(e => e.CeacId).HasColumnName("CEAC ID");
            entity.Property(e => e.ClientGroup).HasColumnName("Client Group");
            entity.Property(e => e.ClientGroupDesc).HasColumnName("Client Group Desc");
            entity.Property(e => e.ClientName).HasColumnName("Client Name");
            entity.Property(e => e.ClosingReceivableBalance).HasColumnName("Closing Receivable Balance");
            entity.Property(e => e.ClosingWipBalance).HasColumnName("Closing WIP Balance");
            entity.Property(e => e.CurrentAdditionalEngagementRole).HasColumnName("Current Additional Engagement Role");
            entity.Property(e => e.CurrentAdditionalEngagementRoleName).HasColumnName("Current Additional Engagement Role Name");
            entity.Property(e => e.CurrentEngagementBusinessArea).HasColumnName("Current Engagement Business Area");
            entity.Property(e => e.CurrentEngagementBusinessAreaDesc).HasColumnName("Current Engagement Business Area Desc");
            entity.Property(e => e.CurrentEngagementErp).HasColumnName("Current Engagement ERP%");
            entity.Property(e => e.CurrentEngagementManager).HasColumnName("Current Engagement Manager");
            entity.Property(e => e.CurrentEngagementManagerName).HasColumnName("Current Engagement Manager Name");
            entity.Property(e => e.CurrentEngagementPartner).HasColumnName("Current Engagement Partner");
            entity.Property(e => e.CurrentEngagementPartnerName).HasColumnName("Current Engagement Partner Name");
            entity.Property(e => e.CurrentEngagementProfitCenter).HasColumnName("Current Engagement Profit Center");
            entity.Property(e => e.CurrentEngagementProfitCenterDesc).HasColumnName("Current Engagement Profit Center Desc");
            entity.Property(e => e.CurrentEngagementProfitCenterFunction).HasColumnName("Current Engagement Profit Center : Function");
            entity.Property(e => e.CurrentEngagementProfitCenterFunctionDesc).HasColumnName("Current Engagement Profit Center : Function Desc");
            entity.Property(e => e.CurrentEngagementStatus).HasColumnName("Current Engagement Status");
            entity.Property(e => e.CurrentEngagementStatusDesc).HasColumnName("Current Engagement Status Desc");
            entity.Property(e => e.EngagementAdminSurcharge).HasColumnName("Engagement Admin Surcharge");
            entity.Property(e => e.EngagementBusinessArea).HasColumnName("Engagement Business Area");
            entity.Property(e => e.EngagementBusinessAreaDesc).HasColumnName("Engagement Business Area Desc");
            entity.Property(e => e.EngagementLastTimeEntryDate).HasColumnName("Engagement Last Time Entry Date");
            entity.Property(e => e.EngagementName).HasColumnName("Engagement Name");
            entity.Property(e => e.EngagementTechnologySurcharge).HasColumnName("Engagement Technology Surcharge");
            entity.Property(e => e.ErpDiscount).HasColumnName("ERP Discount");
            entity.Property(e => e.EstimatedRecoverableFees).HasColumnName("Estimated Recoverable Fees");
            entity.Property(e => e.FiscalPeriod).HasColumnName("Fiscal Period");
            entity.Property(e => e.FiscalYear).HasColumnName("Fiscal Year");
            entity.Property(e => e.GrossEngagementRevenue).HasColumnName("Gross Engagement Revenue");
            entity.Property(e => e.GrossMargin).HasColumnName("Gross Margin");
            entity.Property(e => e.LaborCosts).HasColumnName("Labor Costs");
            entity.Property(e => e.LeadEngagement).HasColumnName("Lead Engagement");
            entity.Property(e => e.LeadEngagementName).HasColumnName("Lead Engagement Name");
            entity.Property(e => e.NetEngagementRevenue).HasColumnName("Net Engagement Revenue");
            entity.Property(e => e.NetLockup).HasColumnName("Net Lockup");
            entity.Property(e => e.OpeningWipBalance).HasColumnName("Opening WIP Balance");
            entity.Property(e => e.ReportingCurrency).HasColumnName("Reporting Currency");
            entity.Property(e => e.RevenueRealization).HasColumnName("Revenue @ Realization");
            entity.Property(e => e.RevenueStandard).HasColumnName("Revenue @ Standard");
            entity.Property(e => e.WipProvision).HasColumnName("WIP Provision");
            entity.Property(e => e.WriteOnOff).HasColumnName("Write On/(Off)");
        });

        modelBuilder.Entity<ReporteAuditGeneral2025>(entity =>
        {
            entity.HasKey(e => e.ReporteAuditGeneralId);

            entity.ToTable("ReporteAuditGeneral2025");

            entity.Property(e => e.ReporteAuditGeneralId).ValueGeneratedNever();
            entity.Property(e => e.BilledWip).HasColumnName("Billed WIP");
            entity.Property(e => e.CeacId).HasColumnName("CEAC ID");
            entity.Property(e => e.ClientGroup).HasColumnName("Client Group");
            entity.Property(e => e.ClientGroupDesc).HasColumnName("Client Group Desc");
            entity.Property(e => e.ClientName).HasColumnName("Client Name");
            entity.Property(e => e.ClosingReceivableBalance).HasColumnName("Closing Receivable Balance");
            entity.Property(e => e.ClosingWipBalance).HasColumnName("Closing WIP Balance");
            entity.Property(e => e.CurrentAdditionalEngagementRole).HasColumnName("Current Additional Engagement Role");
            entity.Property(e => e.CurrentAdditionalEngagementRoleName).HasColumnName("Current Additional Engagement Role Name");
            entity.Property(e => e.CurrentEngagementBusinessArea).HasColumnName("Current Engagement Business Area");
            entity.Property(e => e.CurrentEngagementBusinessAreaDesc).HasColumnName("Current Engagement Business Area Desc");
            entity.Property(e => e.CurrentEngagementErp).HasColumnName("Current Engagement ERP%");
            entity.Property(e => e.CurrentEngagementManager).HasColumnName("Current Engagement Manager");
            entity.Property(e => e.CurrentEngagementManagerName).HasColumnName("Current Engagement Manager Name");
            entity.Property(e => e.CurrentEngagementPartner).HasColumnName("Current Engagement Partner");
            entity.Property(e => e.CurrentEngagementPartnerName).HasColumnName("Current Engagement Partner Name");
            entity.Property(e => e.CurrentEngagementProfitCenter).HasColumnName("Current Engagement Profit Center");
            entity.Property(e => e.CurrentEngagementProfitCenterDesc).HasColumnName("Current Engagement Profit Center Desc");
            entity.Property(e => e.CurrentEngagementProfitCenterFunction).HasColumnName("Current Engagement Profit Center : Function");
            entity.Property(e => e.CurrentEngagementProfitCenterFunctionDesc).HasColumnName("Current Engagement Profit Center : Function Desc");
            entity.Property(e => e.CurrentEngagementStatus).HasColumnName("Current Engagement Status");
            entity.Property(e => e.CurrentEngagementStatusDesc).HasColumnName("Current Engagement Status Desc");
            entity.Property(e => e.EngagementAdminSurcharge).HasColumnName("Engagement Admin Surcharge");
            entity.Property(e => e.EngagementBusinessArea).HasColumnName("Engagement Business Area");
            entity.Property(e => e.EngagementBusinessAreaDesc).HasColumnName("Engagement Business Area Desc");
            entity.Property(e => e.EngagementLastTimeEntryDate).HasColumnName("Engagement Last Time Entry Date");
            entity.Property(e => e.EngagementName).HasColumnName("Engagement Name");
            entity.Property(e => e.EngagementTechnologySurcharge).HasColumnName("Engagement Technology Surcharge");
            entity.Property(e => e.ErpDiscount).HasColumnName("ERP Discount");
            entity.Property(e => e.EstimatedRecoverableFees).HasColumnName("Estimated Recoverable Fees");
            entity.Property(e => e.FiscalPeriod).HasColumnName("Fiscal Period");
            entity.Property(e => e.FiscalYear).HasColumnName("Fiscal Year");
            entity.Property(e => e.GrossEngagementRevenue).HasColumnName("Gross Engagement Revenue");
            entity.Property(e => e.GrossMargin).HasColumnName("Gross Margin");
            entity.Property(e => e.LaborCosts).HasColumnName("Labor Costs");
            entity.Property(e => e.LeadEngagement).HasColumnName("Lead Engagement");
            entity.Property(e => e.LeadEngagementName).HasColumnName("Lead Engagement Name");
            entity.Property(e => e.NetEngagementRevenue).HasColumnName("Net Engagement Revenue");
            entity.Property(e => e.NetLockup).HasColumnName("Net Lockup");
            entity.Property(e => e.OpeningWipBalance).HasColumnName("Opening WIP Balance");
            entity.Property(e => e.ReportingCurrency).HasColumnName("Reporting Currency");
            entity.Property(e => e.RevenueRealization).HasColumnName("Revenue @ Realization");
            entity.Property(e => e.RevenueStandard).HasColumnName("Revenue @ Standard");
            entity.Property(e => e.WipProvision).HasColumnName("WIP Provision");
            entity.Property(e => e.WriteOnOff).HasColumnName("Write On/(Off)");
        });

        modelBuilder.Entity<ReporteAuditGeneral2026>(entity =>
        {
            entity.HasKey(e => e.ReporteAuditGeneralId);

            entity.ToTable("ReporteAuditGeneral2026");

            entity.Property(e => e.ReporteAuditGeneralId).ValueGeneratedNever();
            entity.Property(e => e.BilledWip).HasColumnName("Billed WIP");
            entity.Property(e => e.CeacId).HasColumnName("CEAC ID");
            entity.Property(e => e.ClientGroup).HasColumnName("Client Group");
            entity.Property(e => e.ClientGroupDesc).HasColumnName("Client Group Desc");
            entity.Property(e => e.ClientName).HasColumnName("Client Name");
            entity.Property(e => e.ClosingReceivableBalance).HasColumnName("Closing Receivable Balance");
            entity.Property(e => e.ClosingWipBalance).HasColumnName("Closing WIP Balance");
            entity.Property(e => e.CurrentAdditionalEngagementRole).HasColumnName("Current Additional Engagement Role");
            entity.Property(e => e.CurrentAdditionalEngagementRoleName).HasColumnName("Current Additional Engagement Role Name");
            entity.Property(e => e.CurrentEngagementBusinessArea).HasColumnName("Current Engagement Business Area");
            entity.Property(e => e.CurrentEngagementBusinessAreaDesc).HasColumnName("Current Engagement Business Area Desc");
            entity.Property(e => e.CurrentEngagementErp).HasColumnName("Current Engagement ERP%");
            entity.Property(e => e.CurrentEngagementManager).HasColumnName("Current Engagement Manager");
            entity.Property(e => e.CurrentEngagementManagerName).HasColumnName("Current Engagement Manager Name");
            entity.Property(e => e.CurrentEngagementPartner).HasColumnName("Current Engagement Partner");
            entity.Property(e => e.CurrentEngagementPartnerName).HasColumnName("Current Engagement Partner Name");
            entity.Property(e => e.CurrentEngagementProfitCenter).HasColumnName("Current Engagement Profit Center");
            entity.Property(e => e.CurrentEngagementProfitCenterDesc).HasColumnName("Current Engagement Profit Center Desc");
            entity.Property(e => e.CurrentEngagementProfitCenterFunction).HasColumnName("Current Engagement Profit Center : Function");
            entity.Property(e => e.CurrentEngagementProfitCenterFunctionDesc).HasColumnName("Current Engagement Profit Center : Function Desc");
            entity.Property(e => e.CurrentEngagementStatus).HasColumnName("Current Engagement Status");
            entity.Property(e => e.CurrentEngagementStatusDesc).HasColumnName("Current Engagement Status Desc");
            entity.Property(e => e.EngagementAdminSurcharge).HasColumnName("Engagement Admin Surcharge");
            entity.Property(e => e.EngagementBusinessArea).HasColumnName("Engagement Business Area");
            entity.Property(e => e.EngagementBusinessAreaDesc).HasColumnName("Engagement Business Area Desc");
            entity.Property(e => e.EngagementLastTimeEntryDate).HasColumnName("Engagement Last Time Entry Date");
            entity.Property(e => e.EngagementName).HasColumnName("Engagement Name");
            entity.Property(e => e.EngagementTechnologySurcharge).HasColumnName("Engagement Technology Surcharge");
            entity.Property(e => e.ErpDiscount).HasColumnName("ERP Discount");
            entity.Property(e => e.EstimatedRecoverableFees).HasColumnName("Estimated Recoverable Fees");
            entity.Property(e => e.FiscalPeriod).HasColumnName("Fiscal Period");
            entity.Property(e => e.FiscalYear).HasColumnName("Fiscal Year");
            entity.Property(e => e.GrossEngagementRevenue).HasColumnName("Gross Engagement Revenue");
            entity.Property(e => e.GrossMargin).HasColumnName("Gross Margin");
            entity.Property(e => e.LaborCosts).HasColumnName("Labor Costs");
            entity.Property(e => e.LeadEngagement).HasColumnName("Lead Engagement");
            entity.Property(e => e.LeadEngagementName).HasColumnName("Lead Engagement Name");
            entity.Property(e => e.NetEngagementRevenue).HasColumnName("Net Engagement Revenue");
            entity.Property(e => e.NetLockup).HasColumnName("Net Lockup");
            entity.Property(e => e.OpeningWipBalance).HasColumnName("Opening WIP Balance");
            entity.Property(e => e.ReportingCurrency).HasColumnName("Reporting Currency");
            entity.Property(e => e.RevenueRealization).HasColumnName("Revenue @ Realization");
            entity.Property(e => e.RevenueStandard).HasColumnName("Revenue @ Standard");
            entity.Property(e => e.WipProvision).HasColumnName("WIP Provision");
            entity.Property(e => e.WriteOnOff).HasColumnName("Write On/(Off)");
        });

        modelBuilder.Entity<ReporteAuditProductividad>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("ReporteAuditProductividad");

            entity.Property(e => e.BaseHours).HasColumnName("Base Hours");
            entity.Property(e => e.ChargeableHours).HasColumnName("Chargeable Hours");
            entity.Property(e => e.CurrentEmployeeBusinessArea).HasColumnName("Current Employee Business Area");
            entity.Property(e => e.CurrentEmployeeBusinessAreaDesc).HasColumnName("Current Employee Business Area Desc");
            entity.Property(e => e.CurrentEmployeeStaffLevel).HasColumnName("Current Employee Staff Level");
            entity.Property(e => e.CurrentEmployeeStaffLevelDesc).HasColumnName("Current Employee Staff Level Desc");
            entity.Property(e => e.CurrentEmployeeStatus).HasColumnName("Current Employee Status");
            entity.Property(e => e.CurrentEmployeeStatusDesc).HasColumnName("Current Employee Status Desc");
            entity.Property(e => e.EmployeeCompanyCode).HasColumnName("Employee Company Code");
            entity.Property(e => e.EmployeeName).HasColumnName("Employee Name");
            entity.Property(e => e.EmployeeNumber).HasColumnName("Employee Number");
            entity.Property(e => e.EmployeeProfitCenter).HasColumnName("Employee Profit Center");
            entity.Property(e => e.EmployeeProfitCenterDesc).HasColumnName("Employee Profit Center Desc");
            entity.Property(e => e.EmployeeProfitCenterFunction).HasColumnName("Employee Profit Center : Function");
            entity.Property(e => e.EmployeeProfitCenterFunctionDesc).HasColumnName("Employee Profit Center : Function Desc");
            entity.Property(e => e.EngagementDevelopment).HasColumnName("Engagement Development");
            entity.Property(e => e.FiscalYearPeriodFromPostingDate).HasColumnName("Fiscal Year Period (From Posting Date)");
            entity.Property(e => e.InternalProject).HasColumnName("Internal Project");
            entity.Property(e => e.LeaveTotalHours).HasColumnName("Leave: Total Hours");
            entity.Property(e => e.NapHours).HasColumnName("NAP Hours");
            entity.Property(e => e.OtherHours).HasColumnName("Other Hours");
            entity.Property(e => e.TotalHours).HasColumnName("Total Hours");
            entity.Property(e => e.TrainingHours).HasColumnName("Training Hours");
        });

        modelBuilder.Entity<ReporteAuditProductividad2025>(entity =>
        {
            entity.HasKey(e => e.ReporteAuditProductividadId);

            entity.ToTable("ReporteAuditProductividad2025");

            entity.Property(e => e.ReporteAuditProductividadId).ValueGeneratedNever();
            entity.Property(e => e.BaseHours).HasColumnName("Base Hours");
            entity.Property(e => e.ChargeableHours).HasColumnName("Chargeable Hours");
            entity.Property(e => e.CurrentEmployeeBusinessArea).HasColumnName("Current Employee Business Area");
            entity.Property(e => e.CurrentEmployeeBusinessAreaDesc).HasColumnName("Current Employee Business Area Desc");
            entity.Property(e => e.CurrentEmployeeStaffLevel).HasColumnName("Current Employee Staff Level");
            entity.Property(e => e.CurrentEmployeeStaffLevelDesc).HasColumnName("Current Employee Staff Level Desc");
            entity.Property(e => e.CurrentEmployeeStatus).HasColumnName("Current Employee Status");
            entity.Property(e => e.CurrentEmployeeStatusDesc).HasColumnName("Current Employee Status Desc");
            entity.Property(e => e.EmployeeCompanyCode).HasColumnName("Employee Company Code");
            entity.Property(e => e.EmployeeName).HasColumnName("Employee Name");
            entity.Property(e => e.EmployeeNumber).HasColumnName("Employee Number");
            entity.Property(e => e.EmployeeProfitCenter).HasColumnName("Employee Profit Center");
            entity.Property(e => e.EmployeeProfitCenterDesc).HasColumnName("Employee Profit Center Desc");
            entity.Property(e => e.EmployeeProfitCenterFunction).HasColumnName("Employee Profit Center : Function");
            entity.Property(e => e.EmployeeProfitCenterFunctionDesc).HasColumnName("Employee Profit Center : Function Desc");
            entity.Property(e => e.EngagementDevelopment).HasColumnName("Engagement Development");
            entity.Property(e => e.FiscalYearPeriodFromPostingDate).HasColumnName("Fiscal Year Period (From Posting Date)");
            entity.Property(e => e.InternalProject).HasColumnName("Internal Project");
            entity.Property(e => e.LeaveTotalHours).HasColumnName("Leave: Total Hours");
            entity.Property(e => e.NapHours).HasColumnName("NAP Hours");
            entity.Property(e => e.OtherHours).HasColumnName("Other Hours");
            entity.Property(e => e.TotalHours).HasColumnName("Total Hours");
            entity.Property(e => e.TrainingHours).HasColumnName("Training Hours");
        });

        modelBuilder.Entity<ReporteAuditTiempo>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.BaseHours).HasColumnName("Base Hours");
            entity.Property(e => e.ChargeableHours).HasColumnName("Chargeable Hours");
            entity.Property(e => e.ClientName).HasColumnName("Client Name");
            entity.Property(e => e.CurrentEmployeeStaffLevel).HasColumnName("Current Employee Staff Level");
            entity.Property(e => e.CurrentEmployeeStaffLevelDesc).HasColumnName("Current Employee Staff Level Desc");
            entity.Property(e => e.CurrentEmployeeStatus).HasColumnName("Current Employee Status");
            entity.Property(e => e.CurrentEmployeeStatusDesc).HasColumnName("Current Employee Status Desc");
            entity.Property(e => e.CurrentEngagementPartner).HasColumnName("Current Engagement Partner");
            entity.Property(e => e.CurrentEngagementPartnerName).HasColumnName("Current Engagement Partner Name");
            entity.Property(e => e.CurrentEngagementProfitCenter).HasColumnName("Current Engagement Profit Center");
            entity.Property(e => e.CurrentEngagementProfitCenterDesc).HasColumnName("Current Engagement Profit Center Desc");
            entity.Property(e => e.CurrentEngagementProfitCenterFunction).HasColumnName("Current Engagement Profit Center : Function");
            entity.Property(e => e.CurrentEngagementProfitCenterFunctionDesc).HasColumnName("Current Engagement Profit Center : Function Desc");
            entity.Property(e => e.CurrentEngagementProfitCenterServiceLine).HasColumnName("Current Engagement Profit Center : Service Line");
            entity.Property(e => e.CurrentEngagementProfitCenterServiceLineDesc).HasColumnName("Current Engagement Profit Center : Service Line Desc");
            entity.Property(e => e.EmployeeCompanyCode).HasColumnName("Employee Company Code");
            entity.Property(e => e.EmployeeName).HasColumnName("Employee Name");
            entity.Property(e => e.EmployeeNumber).HasColumnName("Employee Number");
            entity.Property(e => e.EngagementDesc).HasColumnName("Engagement Desc");
            entity.Property(e => e.EngagementDevelopment).HasColumnName("Engagement Development");
            entity.Property(e => e.FiscalYearPeriodFromPostingDate).HasColumnName("Fiscal Year Period (From Posting Date)");
            entity.Property(e => e.InternalCode).HasColumnName("Internal Code");
            entity.Property(e => e.InternalCodeDesc).HasColumnName("Internal Code Desc");
            entity.Property(e => e.InternalProject).HasColumnName("Internal Project");
            entity.Property(e => e.LeaveTotalHours).HasColumnName("Leave: Total Hours");
            entity.Property(e => e.NapHours).HasColumnName("NAP Hours");
            entity.Property(e => e.OtherHours).HasColumnName("Other Hours");
            entity.Property(e => e.TotalHours).HasColumnName("Total Hours");
            entity.Property(e => e.TrainingHours).HasColumnName("Training Hours");
        });

        modelBuilder.Entity<ReporteAuditTiempos2025>(entity =>
        {
            entity.HasKey(e => e.ReporteAuditTiemposId);

            entity.ToTable("ReporteAuditTiempos2025");

            entity.Property(e => e.ReporteAuditTiemposId).ValueGeneratedNever();
            entity.Property(e => e.BaseHours).HasColumnName("Base Hours");
            entity.Property(e => e.ChargeableHours).HasColumnName("Chargeable Hours");
            entity.Property(e => e.ClientName).HasColumnName("Client Name");
            entity.Property(e => e.CurrentEmployeeStaffLevel).HasColumnName("Current Employee Staff Level");
            entity.Property(e => e.CurrentEmployeeStaffLevelDesc).HasColumnName("Current Employee Staff Level Desc");
            entity.Property(e => e.CurrentEmployeeStatus).HasColumnName("Current Employee Status");
            entity.Property(e => e.CurrentEmployeeStatusDesc).HasColumnName("Current Employee Status Desc");
            entity.Property(e => e.CurrentEngagementPartner).HasColumnName("Current Engagement Partner");
            entity.Property(e => e.CurrentEngagementPartnerName).HasColumnName("Current Engagement Partner Name");
            entity.Property(e => e.CurrentEngagementProfitCenter).HasColumnName("Current Engagement Profit Center");
            entity.Property(e => e.CurrentEngagementProfitCenterDesc).HasColumnName("Current Engagement Profit Center Desc");
            entity.Property(e => e.CurrentEngagementProfitCenterFunction).HasColumnName("Current Engagement Profit Center : Function");
            entity.Property(e => e.CurrentEngagementProfitCenterFunctionDesc).HasColumnName("Current Engagement Profit Center : Function Desc");
            entity.Property(e => e.CurrentEngagementProfitCenterServiceLine).HasColumnName("Current Engagement Profit Center : Service Line");
            entity.Property(e => e.CurrentEngagementProfitCenterServiceLineDesc).HasColumnName("Current Engagement Profit Center : Service Line Desc");
            entity.Property(e => e.EmployeeCompanyCode).HasColumnName("Employee Company Code");
            entity.Property(e => e.EmployeeName).HasColumnName("Employee Name");
            entity.Property(e => e.EmployeeNumber).HasColumnName("Employee Number");
            entity.Property(e => e.EngagementDesc).HasColumnName("Engagement Desc");
            entity.Property(e => e.EngagementDevelopment).HasColumnName("Engagement Development");
            entity.Property(e => e.FiscalYearPeriodFromPostingDate).HasColumnName("Fiscal Year Period (From Posting Date)");
            entity.Property(e => e.InternalCode).HasColumnName("Internal Code");
            entity.Property(e => e.InternalCodeDesc).HasColumnName("Internal Code Desc");
            entity.Property(e => e.InternalProject).HasColumnName("Internal Project");
            entity.Property(e => e.LeaveTotalHours).HasColumnName("Leave: Total Hours");
            entity.Property(e => e.NapHours).HasColumnName("NAP Hours");
            entity.Property(e => e.OtherHours).HasColumnName("Other Hours");
            entity.Property(e => e.TotalHours).HasColumnName("Total Hours");
            entity.Property(e => e.TrainingHours).HasColumnName("Training Hours");
        });

        modelBuilder.Entity<ReporteAuditTiempos2026>(entity =>
        {
            entity.HasKey(e => e.ReporteAuditTiemposId);

            entity.ToTable("ReporteAuditTiempos2026");

            entity.Property(e => e.ReporteAuditTiemposId).ValueGeneratedNever();
            entity.Property(e => e.BaseHours).HasColumnName("Base Hours");
            entity.Property(e => e.ChargeableHours).HasColumnName("Chargeable Hours");
            entity.Property(e => e.ClientName).HasColumnName("Client Name");
            entity.Property(e => e.CurrentEmployeeStaffLevel).HasColumnName("Current Employee Staff Level");
            entity.Property(e => e.CurrentEmployeeStaffLevelDesc).HasColumnName("Current Employee Staff Level Desc");
            entity.Property(e => e.CurrentEmployeeStatus).HasColumnName("Current Employee Status");
            entity.Property(e => e.CurrentEmployeeStatusDesc).HasColumnName("Current Employee Status Desc");
            entity.Property(e => e.CurrentEngagementPartner).HasColumnName("Current Engagement Partner");
            entity.Property(e => e.CurrentEngagementPartnerName).HasColumnName("Current Engagement Partner Name");
            entity.Property(e => e.CurrentEngagementProfitCenter).HasColumnName("Current Engagement Profit Center");
            entity.Property(e => e.CurrentEngagementProfitCenterDesc).HasColumnName("Current Engagement Profit Center Desc");
            entity.Property(e => e.CurrentEngagementProfitCenterFunction).HasColumnName("Current Engagement Profit Center : Function");
            entity.Property(e => e.CurrentEngagementProfitCenterFunctionDesc).HasColumnName("Current Engagement Profit Center : Function Desc");
            entity.Property(e => e.CurrentEngagementProfitCenterServiceLine).HasColumnName("Current Engagement Profit Center : Service Line");
            entity.Property(e => e.CurrentEngagementProfitCenterServiceLineDesc).HasColumnName("Current Engagement Profit Center : Service Line Desc");
            entity.Property(e => e.EmployeeCompanyCode).HasColumnName("Employee Company Code");
            entity.Property(e => e.EmployeeName).HasColumnName("Employee Name");
            entity.Property(e => e.EmployeeNumber).HasColumnName("Employee Number");
            entity.Property(e => e.EngagementDesc).HasColumnName("Engagement Desc");
            entity.Property(e => e.EngagementDevelopment).HasColumnName("Engagement Development");
            entity.Property(e => e.FiscalYearPeriodFromPostingDate).HasColumnName("Fiscal Year Period (From Posting Date)");
            entity.Property(e => e.InternalCode).HasColumnName("Internal Code");
            entity.Property(e => e.InternalCodeDesc).HasColumnName("Internal Code Desc");
            entity.Property(e => e.InternalProject).HasColumnName("Internal Project");
            entity.Property(e => e.LeaveTotalHours).HasColumnName("Leave: Total Hours");
            entity.Property(e => e.NapHours).HasColumnName("NAP Hours");
            entity.Property(e => e.OtherHours).HasColumnName("Other Hours");
            entity.Property(e => e.TotalHours).HasColumnName("Total Hours");
            entity.Property(e => e.TrainingHours).HasColumnName("Training Hours");
        });

        modelBuilder.Entity<ReporteIngreso>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.BusinessArea).IsUnicode(false);
            entity.Property(e => e.EmName)
                .IsUnicode(false)
                .HasColumnName("EM_Name");
            entity.Property(e => e.EngagementCreateDate)
                .HasColumnType("datetime")
                .HasColumnName("Engagement_Create_Date");
            entity.Property(e => e.EngagementDescr)
                .IsUnicode(false)
                .HasColumnName("Engagement_Descr");
            entity.Property(e => e.EngagementNumber)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Engagement_Number");
            entity.Property(e => e.EntityGroupId)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("EntityGroupID");
            entity.Property(e => e.EntityName)
                .IsUnicode(false)
                .HasColumnName("Entity_Name");
            entity.Property(e => e.EpName)
                .IsUnicode(false)
                .HasColumnName("EP_Name");
            entity.Property(e => e.Function).IsUnicode(false);
            entity.Property(e => e.MotivoRechazo).IsUnicode(false);
            entity.Property(e => e.NetEngagementRevenue).HasColumnName("Net_Engagement_Revenue");
            entity.Property(e => e.OpportunityNumber)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Opportunity_Number");
            entity.Property(e => e.PhaseStatus)
                .IsUnicode(false)
                .HasColumnName("Phase_Status");
            entity.Property(e => e.ProfitCenter).IsUnicode(false);
        });

        modelBuilder.Entity<RoleProfileDetail>(entity =>
        {
            entity.HasKey(e => e.RolePdId).HasName("RolePD_Id");

            entity.Property(e => e.RolePdId).HasColumnName("RolePD_Id");
            entity.Property(e => e.ColumnA)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("Column_A");
            entity.Property(e => e.ColumnB)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("Column_B");
            entity.Property(e => e.ColumnC).HasColumnName("Column_C");
            entity.Property(e => e.ColumnD).HasColumnName("Column_D");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.CreatedTime)
                .HasDefaultValueSql("(getdate())", "dfd_RoleProfileDetails_Created_time")
                .HasColumnType("datetime")
                .HasColumnName("Created_time");
            entity.Property(e => e.EvaluatedComent)
                .HasMaxLength(350)
                .IsUnicode(false);
            entity.Property(e => e.Fy).HasColumnName("FY");
            entity.Property(e => e.IdRoleProfile)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("ID_RoleProfile");
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.ModifiedTime)
                .HasColumnType("datetime")
                .HasColumnName("Modified_time");
            entity.Property(e => e.Pmcoment)
                .HasMaxLength(350)
                .IsUnicode(false)
                .HasColumnName("PMComent");
            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<RoleProfileResuman>(entity =>
        {
            entity.HasKey(e => e.RolePrId).HasName("RolePR_Id");

            entity.Property(e => e.RolePrId).HasColumnName("RolePR_Id");
            entity.Property(e => e.ColumnA)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_A");
            entity.Property(e => e.ColumnB)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_B");
            entity.Property(e => e.ColumnC).HasColumnName("Column_C");
            entity.Property(e => e.ColumnD).HasColumnName("Column_D");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.CreatedTime)
                .HasDefaultValueSql("(getdate())", "dfd_RoleProfileResumen_Created_time")
                .HasColumnType("datetime")
                .HasColumnName("Created_time");
            entity.Property(e => e.EvaluatedEmail)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatedId).HasColumnName("EvaluatedID");
            entity.Property(e => e.EvaluatedName)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Fy).HasColumnName("FY");
            entity.Property(e => e.IdRoleProfile)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("ID_RoleProfile");
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.ModifiedTime)
                .HasColumnType("datetime")
                .HasColumnName("Modified_time");
            entity.Property(e => e.Pmcomplete).HasColumnName("PMComplete");
            entity.Property(e => e.Pmemail)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("PMEmail");
            entity.Property(e => e.Pmid).HasColumnName("PMID");
            entity.Property(e => e.Pmname)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("PMName");
        });

        modelBuilder.Entity<ScorefyDimFiscalYearPeriod>(entity =>
        {
            entity.ToTable("scorefy_dim_FiscalYearPeriod");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ColumnA)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("column_A");
        });

        modelBuilder.Entity<ScorefyTblEvaluationsGenerate>(entity =>
        {
            entity.HasKey(e => e.PkEvalGene).HasName("ID_PK_EvalGene");

            entity.ToTable("scorefy_tbl_EvaluationsGenerate");

            entity.Property(e => e.PkEvalGene).HasColumnName("PK_EvalGene");
            entity.Property(e => e.Bu)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("BU");
            entity.Property(e => e.ChargeableHours)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Chargeable_Hours");
            entity.Property(e => e.ClientId).HasColumnName("Client_ID");
            entity.Property(e => e.ClientName)
                .HasMaxLength(400)
                .IsUnicode(false)
                .HasColumnName("Client_Name");
            entity.Property(e => e.Created)
                .HasDefaultValueSql("(getdate())", "dfd_scorefy_tbl_EvaluationsGenerate_Created")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Created_by");
            entity.Property(e => e.CutOff).HasColumnName("Cut_Off");
            entity.Property(e => e.EmailAddressBusiness)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Email_Address_Business");
            entity.Property(e => e.EmployeeId).HasColumnName("Employee_ID");
            entity.Property(e => e.EmployeeName)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("Employee_Name");
            entity.Property(e => e.GeneratedEvaluation).HasColumnName("Generated_Evaluation");
            entity.Property(e => e.GeneratedType).HasColumnName("Generated_Type");
            entity.Property(e => e.IsCurrent)
                .HasDefaultValue(true, "dfc_scorefy_tbl_EvaluationsGenerate_Is_Current")
                .HasColumnName("Is_Current");
            entity.Property(e => e.KeyReport)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("Key_Report");
            entity.Property(e => e.LocalJobLevelName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Local_Job_Level_Name");
            entity.Property(e => e.LocationName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Location_Name");
            entity.Property(e => e.TotalHours)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Total_Hours");
        });

        modelBuilder.Entity<ScorefyTblEvaluationsGenerateExtra>(entity =>
        {
            entity.HasKey(e => e.PkEvalGeneEx).HasName("ID_PK_EvalGeneEx");

            entity.ToTable("scorefy_tbl_EvaluationsGenerateExtra");

            entity.Property(e => e.PkEvalGeneEx).HasColumnName("PK_EvalGeneEx");
            entity.Property(e => e.Bu)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("BU");
            entity.Property(e => e.ChargeableHours)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Chargeable_Hours");
            entity.Property(e => e.ClientId).HasColumnName("Client_ID");
            entity.Property(e => e.ClientName)
                .HasMaxLength(400)
                .IsUnicode(false)
                .HasColumnName("Client_Name");
            entity.Property(e => e.Created)
                .HasDefaultValueSql("(getdate())", "dfd_scorefy_tbl_EvaluationsGenerateExtra_Created")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Created_by");
            entity.Property(e => e.CutOff).HasColumnName("Cut_Off");
            entity.Property(e => e.EmailAddressBusiness)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Email_Address_Business");
            entity.Property(e => e.EmployeeId).HasColumnName("Employee_ID");
            entity.Property(e => e.EmployeeName)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("Employee_Name");
            entity.Property(e => e.GeneratedDocumentation)
                .IsUnicode(false)
                .HasColumnName("Generated_Documentation");
            entity.Property(e => e.GeneratedEvaluation).HasColumnName("Generated_Evaluation");
            entity.Property(e => e.GeneratedType).HasColumnName("Generated_Type");
            entity.Property(e => e.IsCurrent)
                .HasDefaultValue(true, "dfc_scorefy_tbl_EvaluationsGenerateExtra_Is_Current")
                .HasColumnName("Is_Current");
            entity.Property(e => e.KeyReport)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasComputedColumnSql("(concat([Client_ID],[Employee_ID],[Generated_Type],[Cut_Off]))", true)
                .HasColumnName("Key_Report");
            entity.Property(e => e.LocalJobLevelName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Local_Job_Level_Name");
            entity.Property(e => e.LocationName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Location_Name");
            entity.Property(e => e.TotalHours)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Total_Hours");
        });

        modelBuilder.Entity<ScorefyTblException>(entity =>
        {
            entity.HasKey(e => e.PkScorExceptions).HasName("PK_scorExceptions");

            entity.ToTable("scorefy_tbl_Exceptions");

            entity.Property(e => e.PkScorExceptions).HasColumnName("PK_scorExceptions");
            entity.Property(e => e.ColumnA).HasColumnName("Column_A");
            entity.Property(e => e.ColumnB).HasColumnName("Column_B");
            entity.Property(e => e.ColumnC)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("Column_C");
            entity.Property(e => e.ColumnD)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("Column_D");
            entity.Property(e => e.Created)
                .HasDefaultValueSql("(getdate())", "dfd_scorefy_tbl_Exceptions_Created")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Created_By");
            entity.Property(e => e.EventNumber).HasColumnName("Event_Number");
            entity.Property(e => e.Fy).HasColumnName("FY");
            entity.Property(e => e.IsCurrent)
                .HasDefaultValue(true, "dfc_scorefy_tbl_Exceptions_Is_Current")
                .HasColumnName("Is_Current");
            entity.Property(e => e.IsException)
                .HasDefaultValue(true, "dfc_scorefy_tbl_Exceptions_Is_Exception")
                .HasColumnName("Is_Exception");
            entity.Property(e => e.KeyReport)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("Key_Report");
            entity.Property(e => e.Modified).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Modified_By");
            entity.Property(e => e.ReasonException)
                .IsUnicode(false)
                .HasColumnName("Reason_Exception");
        });

        modelBuilder.Entity<SecurityScorefy>(entity =>
        {
            entity.ToTable("SecurityScorefy");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Bu)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("BU");
            entity.Property(e => e.ColumnA)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_A");
            entity.Property(e => e.ColumnB).HasColumnName("Column_B");
            entity.Property(e => e.Email)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Office)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Role)
                .HasMaxLength(250)
                .IsUnicode(false);

            entity.Property(e => e.Segmento).HasColumnName("Segmento");
            entity.Property(e => e.Is_Committee).HasColumnName("Is_Committee");
            entity.Property(e => e.TypeCommittee).HasColumnName("TypeCommittee");
            entity.Property(e => e.ColumnC).HasColumnName("Column_C");
            entity.Property(e => e.ColumnD).HasColumnName("Column_D");
            entity.Property(e => e.ColumnE).HasColumnName("Column_E");
            entity.Property(e => e.ColumnF).HasColumnName("Column_F");
        });


        modelBuilder.Entity<VistaEvaluacRp>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vista_evaluacRP");

            entity.Property(e => e.CreatedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeIdE).HasColumnName("EmployeeId_E");
            entity.Property(e => e.EmployeeIdGdD).HasColumnName("EmployeeId_GdD");
            entity.Property(e => e.Fy).HasColumnName("FY");
            entity.Property(e => e.MailE)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Mail_E");
            entity.Property(e => e.MailGdD)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Mail_GdD");
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.NameE)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Name_E");
            entity.Property(e => e.NameGdD)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Name_GdD");
            entity.Property(e => e.NivelE)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Nivel_E");
            entity.Property(e => e.NivelGdD)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Nivel_GdD");
        });

        modelBuilder.Entity<VwDimEntity>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_dim_Entities");

            entity.Property(e => e.ColumnC)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.ColumnD)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.DimeId)
                .ValueGeneratedOnAdd()
                .HasColumnName("DIME_ID");
            entity.Property(e => e.EntityDescription).IsUnicode(false);
            entity.Property(e => e.EntityGroupDescription).IsUnicode(false);
            entity.Property(e => e.EntityGroupId)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("EntityGroupID");
            entity.Property(e => e.EntityId)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("EntityID");
            entity.Property(e => e.EntityLob)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("EntityLOB");
            entity.Property(e => e.EntitySector)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Gisid)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("GISID");
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.ParentGisid)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("ParentGISID");
        });

        

        modelBuilder.Entity<VwEntidadesCfy>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Entidades_CFY");

            entity.Property(e => e.AuditRules)
                .HasMaxLength(300)
                .IsUnicode(false);
            entity.Property(e => e.ColumnC)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_C");
            entity.Property(e => e.ColumnD)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_D");
            entity.Property(e => e.ComissarId).HasColumnName("ComissarID");
            entity.Property(e => e.ComissarName)
                .HasMaxLength(300)
                .IsUnicode(false);
            entity.Property(e => e.Created).HasColumnType("datetime");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.ESic)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("e_SIC");
            entity.Property(e => e.EntityClient)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("Entity_client");
            entity.Property(e => e.EntityGroupId)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Entity_group_ID");
            entity.Property(e => e.EntityId)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Entity_ID");
            entity.Property(e => e.Fdo)
                .HasColumnType("datetime")
                .HasColumnName("FDO");
            entity.Property(e => e.FinancialRules)
                .HasMaxLength(300)
                .IsUnicode(false);
            entity.Property(e => e.HonAudit)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Hon_audit");
            entity.Property(e => e.HonFisc)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Hon_fisc");
            entity.Property(e => e.HonReport)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Hon_report");
            entity.Property(e => e.IdP8)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ID_P8");
            entity.Property(e => e.IdPviiiEnt).HasColumnName("ID_PVIII_Ent");
            entity.Property(e => e.Modified).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Nature)
                .HasMaxLength(300)
                .IsUnicode(false);
            entity.Property(e => e.Srfee).HasColumnName("SRFee");
            entity.Property(e => e.Srid).HasColumnName("SRID");
            entity.Property(e => e.Srname)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("SRName");
            entity.Property(e => e.TipoInfId).HasColumnName("Tipo_infId");
            entity.Property(e => e.TipoRevId).HasColumnName("Tipo_revId");
            entity.Property(e => e.TotalHonEnt)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Total_hon_ent");
        });

        modelBuilder.Entity<VwEntidadesPfy>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Entidades_PFY");

            entity.Property(e => e.AuditRules)
                .HasMaxLength(300)
                .IsUnicode(false);
            entity.Property(e => e.ColumnC)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_C");
            entity.Property(e => e.ColumnD)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Column_D");
            entity.Property(e => e.ComissarId).HasColumnName("ComissarID");
            entity.Property(e => e.ComissarName)
                .HasMaxLength(300)
                .IsUnicode(false);
            entity.Property(e => e.Created).HasColumnType("datetime");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.ESic)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("e_SIC");
            entity.Property(e => e.EntityClient)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("Entity_client");
            entity.Property(e => e.EntityGroupId)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Entity_group_ID");
            entity.Property(e => e.EntityId)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Entity_ID");
            entity.Property(e => e.Fdo)
                .HasColumnType("datetime")
                .HasColumnName("FDO");
            entity.Property(e => e.FinancialRules)
                .HasMaxLength(300)
                .IsUnicode(false);
            entity.Property(e => e.HonAudit)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Hon_audit");
            entity.Property(e => e.HonFisc)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Hon_fisc");
            entity.Property(e => e.HonReport)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Hon_report");
            entity.Property(e => e.IdP8)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ID_P8");
            entity.Property(e => e.IdPviiiEnt).HasColumnName("ID_PVIII_Ent");
            entity.Property(e => e.Modified).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Nature)
                .HasMaxLength(300)
                .IsUnicode(false);
            entity.Property(e => e.Srfee).HasColumnName("SRFee");
            entity.Property(e => e.Srid).HasColumnName("SRID");
            entity.Property(e => e.Srname)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("SRName");
            entity.Property(e => e.TipoInfId).HasColumnName("Tipo_infId");
            entity.Property(e => e.TipoRevId).HasColumnName("Tipo_revId");
            entity.Property(e => e.TotalHonEnt)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Total_hon_ent");
        });

        modelBuilder.Entity<VwEntity>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_Entities");

            entity.Property(e => e.EntityDescription).IsUnicode(false);
            entity.Property(e => e.EntityGroupDescription).IsUnicode(false);
            entity.Property(e => e.EntityGroupId).HasColumnName("EntityGroupID");
            entity.Property(e => e.EntityId).HasColumnName("EntityID");
            entity.Property(e => e.EntityLob)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("EntityLOB");
            entity.Property(e => e.EntitySector)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VwEstatusEvalProy>(entity =>
        {
            //entity
            //    .HasNoKey()
            //    .ToView("vw_EstatusEvalProy");// codigo Mich
            entity
                .HasKey(e => e.PkScorExceptions);// codigo Isaac
            entity
                .ToView("vw_EstatusEvalProy");// codigo Isaac

            entity.Property(e => e.Bu)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("BU");
            entity.Property(e => e.ChargeableHours)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Chargeable_Hours");
            entity.Property(e => e.ClientId).HasColumnName("Client_ID");
            entity.Property(e => e.ClientName)
                .HasMaxLength(400)
                .IsUnicode(false)
                .HasColumnName("Client_Name");
            entity.Property(e => e.CutOff).HasColumnName("Cut_Off");
            entity.Property(e => e.EmailAddressBusiness)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Email_Address_Business");
            entity.Property(e => e.EmployeeId).HasColumnName("Employee_ID");
            entity.Property(e => e.EmployeeName)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("Employee_Name");
            entity.Property(e => e.EstatusEvaluado)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.EstatusEvaluador)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatorEmail)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatorId).HasColumnName("EvaluatorID");
            entity.Property(e => e.EvaluatorName)
                .HasMaxLength(62)
                .IsUnicode(false);
            entity.Property(e => e.EventNumber).HasColumnName("Event_Number");
            entity.Property(e => e.GeneratedType).HasColumnName("Generated_Type");
            entity.Property(e => e.IsException).HasColumnName("Is_Exception");
            entity.Property(e => e.KeyReport)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("Key_Report");
            entity.Property(e => e.LocalJobLevelName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Local_Job_Level_Name");
            entity.Property(e => e.LocationName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Location_Name");
            entity.Property(e => e.PkScorExceptions).HasColumnName("PK_scorExceptions");
            entity.Property(e => e.ReasonException)
                .IsUnicode(false)
                .HasColumnName("Reason_Exception");
            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TotalHours)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Total_Hours");
        });

        modelBuilder.Entity<VwEvaluaColabDetail>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_EvaluaColabDetail");

            entity.Property(e => e.CompetenciaDescrip)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.EcdId).HasColumnName("ECD_Id");
            entity.Property(e => e.EvaluatedComent)
                .HasMaxLength(350)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatorComent)
                .HasMaxLength(350)
                .IsUnicode(false);
            entity.Property(e => e.IdColabEmpProy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("ID_Colab_Emp_Proy");
            entity.Property(e => e.ReactiveNum)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.ReactivoDescrip)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.SubCompetence).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.SubCompetenciaDescrip)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VwEvaluaColabResume>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_EvaluaColabResume");

            entity.Property(e => e.Bu)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("BU");
            entity.Property(e => e.ClientName)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.CreatedTime)
                .HasColumnType("datetime")
                .HasColumnName("Created_time");
            entity.Property(e => e.CutOff).HasColumnName("Cut_Off");
            entity.Property(e => e.EcrId).HasColumnName("ECR_Id");
            entity.Property(e => e.EntityNumber)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatedEmail)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatedId).HasColumnName("EvaluatedID");
            entity.Property(e => e.EvaluatedName)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatorEmail)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatorId).HasColumnName("EvaluatorID");
            entity.Property(e => e.EvaluatorName)
                .HasMaxLength(62)
                .IsUnicode(false);
            entity.Property(e => e.GeneratedType).HasColumnName("Generated_Type");
            entity.Property(e => e.GradeEvaluated).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.GradeEvaluator).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.IdColabEmpProy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("ID_Colab_Emp_Proy");
            entity.Property(e => e.KeyReport)
                .HasMaxLength(56)
                .IsUnicode(false)
                .HasColumnName("Key_Report");
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.ModifiedTime)
                .HasColumnType("datetime")
                .HasColumnName("Modified_time");
            entity.Property(e => e.Office)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.PkEvalGene).HasColumnName("PK_EvalGene");
            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TotalHours).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ColumnC).HasColumnName("Column_C");
        });

        modelBuilder.Entity<VwEvaluaColabResumeRespaldo>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_EvaluaColabResumeRespaldo");

            entity.Property(e => e.Bu)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("BU");
            entity.Property(e => e.ClientName)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.DetailColA)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.DetailColB)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.EcrId).HasColumnName("ECR_Id");
            entity.Property(e => e.EntityNumber)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.EstatusAprob)
                .HasMaxLength(9)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatedEmail)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatedId).HasColumnName("EvaluatedID");
            entity.Property(e => e.EvaluatedName)
                .HasMaxLength(62)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatorEmail)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatorId).HasColumnName("EvaluatorID");
            entity.Property(e => e.EvaluatorName)
                .HasMaxLength(62)
                .IsUnicode(false);
            entity.Property(e => e.Fy).HasColumnName("FY");
            entity.Property(e => e.GradeEvaluated).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.GradeEvaluator).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.IdColabEmpProy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("ID_Colab_Emp_Proy");
            entity.Property(e => e.LocationName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("Location_Name");
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Office)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.ProyectoColab)
                .HasMaxLength(32)
                .IsUnicode(false)
                .HasColumnName("Proyecto_Colab");
            entity.Property(e => e.ResumeColA)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.ResumeColB)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TipoEvDescrip)
                .HasMaxLength(6)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VwEvaluaColabResumeTest>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_EvaluaColabResumeTest");

            entity.Property(e => e.Bu)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("BU");
            entity.Property(e => e.ClientName)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.CreatedTime)
                .HasColumnType("datetime")
                .HasColumnName("Created_time");
            entity.Property(e => e.CutOff).HasColumnName("Cut_Off");
            entity.Property(e => e.DetailColA)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.DetailColB)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.EcrId).HasColumnName("ECR_Id");
            entity.Property(e => e.EntityNumber)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatedEmail)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatedId).HasColumnName("EvaluatedID");
            entity.Property(e => e.EvaluatedName)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatorEmail)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatorId).HasColumnName("EvaluatorID");
            entity.Property(e => e.EvaluatorName)
                .HasMaxLength(62)
                .IsUnicode(false);
            entity.Property(e => e.GeneratedType).HasColumnName("Generated_Type");
            entity.Property(e => e.GradeEvaluated).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.GradeEvaluator).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.IdColabEmpProy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("ID_Colab_Emp_Proy");
            entity.Property(e => e.KeyReport)
                .HasMaxLength(56)
                .IsUnicode(false)
                .HasColumnName("Key_Report");
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.ModifiedTime)
                .HasColumnType("datetime")
                .HasColumnName("Modified_time");
            entity.Property(e => e.Office)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.PkEvalGene).HasColumnName("PK_EvalGene");
            entity.Property(e => e.ResumeColA)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.ResumeColB)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TotalHours).HasColumnType("decimal(18, 2)");
        });

        modelBuilder.Entity<VwEvaluacRp>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_EvaluacRP");

            entity.Property(e => e.CreatedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeIdE).HasColumnName("EmployeeId_E");
            entity.Property(e => e.EmployeeIdGdD).HasColumnName("EmployeeId_GdD");
            entity.Property(e => e.Fy).HasColumnName("FY");
            entity.Property(e => e.MailE)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Mail_E");
            entity.Property(e => e.MailGdD)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Mail_GdD");
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.NameE)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Name_E");
            entity.Property(e => e.NameGdD)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Name_GdD");
            entity.Property(e => e.NivelE)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Nivel_E");
            entity.Property(e => e.NivelGdD)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("Nivel_GdD");
        });

        modelBuilder.Entity<VwIncisosEdp>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_IncisosEDP");

            entity.Property(e => e.Nivel)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VwReactivosEdp>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_ReactivosEDP");

            entity.Property(e => e.Nivel)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VwReactivosEdpinciso>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_ReactivosEDPIncisos");

            entity.Property(e => e.CompetenciaDescrip)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.Nivel)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.NumReactivo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ReactivoDescrip)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.SubCompetencia).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.SubCompetenciaDescrip)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VwReactivosRoleProfile>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_ReactivosRoleProfile");

            entity.Property(e => e.IdRrp)
                .ValueGeneratedOnAdd()
                .HasColumnName("Id_RRP");
            entity.Property(e => e.Indicador)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Nivel)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VwReactivosRp>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_ReactivosRP");

            entity.Property(e => e.Nivel)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VwReporteAuditGeneral>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_ReporteAuditGeneral");

            entity.Property(e => e.ClientId).HasColumnName("ClientID");
            entity.Property(e => e.Fy).HasColumnName("FY");
            entity.Property(e => e.ManagerId).HasColumnName("ManagerID");
            entity.Property(e => e.PartnerId).HasColumnName("PartnerID");
        });

        modelBuilder.Entity<VwReporteAuditTiempo>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_ReporteAuditTiempos");

            entity.Property(e => e.Bu)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("BU");
            entity.Property(e => e.ClientName).HasColumnName("Client Name");
            entity.Property(e => e.CurrentEngagementPartner).HasColumnName("Current Engagement Partner");
            entity.Property(e => e.CurrentEngagementPartnerName).HasColumnName("Current Engagement Partner Name");
            entity.Property(e => e.CurrentEngagementProfitCenter).HasColumnName("Current Engagement Profit Center");
            entity.Property(e => e.CurrentEngagementProfitCenterFunction).HasColumnName("Current Engagement Profit Center : Function");
            entity.Property(e => e.CurrentEngagementProfitCenterServiceLine).HasColumnName("Current Engagement Profit Center : Service Line");
            entity.Property(e => e.EmployeeName).HasColumnName("Employee Name");
            entity.Property(e => e.EmployeeNumber).HasColumnName("Employee Number");
            entity.Property(e => e.EngagementDesc).HasColumnName("Engagement Desc");
        });

        modelBuilder.Entity<VwReporteAuditTiemposColab>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_ReporteAuditTiemposColab");

            entity.Property(e => e.Bu)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("BU");
            entity.Property(e => e.ClientId).HasColumnName("ClientID");
            entity.Property(e => e.EmployeeEmail)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");
            entity.Property(e => e.Nivel)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Office)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VwRoleProfileDetail>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_RoleProfileDetails");

            entity.Property(e => e.Bu)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("BU");
            entity.Property(e => e.DetaiColumnA)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.DetaiColumnB)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.EvalStatus)
                .HasMaxLength(39)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatedComent)
                .HasMaxLength(350)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatedEmail)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatedId).HasColumnName("EvaluatedID");
            entity.Property(e => e.EvaluatedLevel)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatedName)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.IdRoleProfile)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("ID_RoleProfile");
            entity.Property(e => e.Indicador)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Pmcoment)
                .HasMaxLength(350)
                .IsUnicode(false)
                .HasColumnName("PMComent");
            entity.Property(e => e.Pmcomplete).HasColumnName("PMComplete");
            entity.Property(e => e.Pmemail)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("PMEmail");
            entity.Property(e => e.Pmid).HasColumnName("PMID");
            entity.Property(e => e.Pmlevel)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("PMLevel");
            entity.Property(e => e.Pmname)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("PMName");
            entity.Property(e => e.ResumColumnA)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.ResumColumnB)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.RolePdId).HasColumnName("RolePD_Id");
            entity.Property(e => e.RolePrId).HasColumnName("RolePR_Id");
        });

        modelBuilder.Entity<VwRoleProfileResuman>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_RoleProfileResumen");

            entity.Property(e => e.Bu)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("BU");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.CreatedTime)
                .HasColumnType("datetime")
                .HasColumnName("Created_time");
            entity.Property(e => e.DetaiColumnA)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.DetaiColumnB)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.EvalStatus)
                .HasMaxLength(39)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatedEmail)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatedId).HasColumnName("EvaluatedID");
            entity.Property(e => e.EvaluatedLevel)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EvaluatedName)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.IdRoleProfile)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("ID_RoleProfile");
            entity.Property(e => e.LocationName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("Location_Name");
            entity.Property(e => e.ModifiedBy)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.ModifiedTime)
                .HasColumnType("datetime")
                .HasColumnName("Modified_time");
            entity.Property(e => e.Pmcomplete).HasColumnName("PMComplete");
            entity.Property(e => e.Pmemail)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("PMEmail");
            entity.Property(e => e.Pmid).HasColumnName("PMID");
            entity.Property(e => e.Pmlevel)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("PMLevel");
            entity.Property(e => e.Pmname)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("PMName");
            entity.Property(e => e.ResumColumnA)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.ResumColumnB)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.RolePrId).HasColumnName("RolePR_Id");
        });

        modelBuilder.Entity<VwScorefyEmployee>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_scorefy_Employees");

            entity.Property(e => e.Bu)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("BU");
            entity.Property(e => e.CostCenter)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Cost_Center");
            entity.Property(e => e.EmailAddressBusiness)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Email_Address_Business");
            entity.Property(e => e.EmployeeId).HasColumnName("Employee_Id");
            entity.Property(e => e.FullName)
                .HasMaxLength(62)
                .IsUnicode(false)
                .HasColumnName("Full_name");
            entity.Property(e => e.LocalJobLevelName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Local_Job_Level_Name");
            entity.Property(e => e.LocationName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("Location_Name");

            entity.Property(e => e.PerformanceManager).HasColumnName("PerformanceManager");
            entity.Property(e => e.PMEmail).HasColumnName("PMEmail");
            entity.Property(e => e.English_Level).HasColumnName("English_Level");
            entity.Property(e => e.Is_Graduated).HasColumnName("Is_Graduated");
            entity.Property(e => e.AllEvaluationsCompleted).HasColumnName("AllEvaluationsCompleted");
            entity.Property(e => e.CompletedEvaluations).HasColumnName("CompletedEvaluations");
            entity.Property(e => e.PendingEvaluations).HasColumnName("PendingEvaluations");
            entity.Property(e => e.TotalEvaluations).HasColumnName("TotalEvaluations");
            entity.Property(e => e.Segmento).HasColumnName("Segmento");
            entity.Property(e => e.ManagerPerformanceConclusionStatus).HasColumnName("ManagerPerformanceConclusionStatus");

        });

        modelBuilder.Entity<VwScorefyFirstCutOff>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_scorefy_FirstCutOff");

            entity.Property(e => e.Bu)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("BU");
            entity.Property(e => e.ClientId).HasColumnName("ClientID");
            entity.Property(e => e.CutOff)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeEmail)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");
            entity.Property(e => e.Nivel)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Office)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VwScorefySecondCutOff>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_scorefy_SecondCutOff");

            entity.Property(e => e.Bu)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("BU");
            entity.Property(e => e.ClientId).HasColumnName("ClientID");
            entity.Property(e => e.CutOff)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeEmail)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");
            entity.Property(e => e.Nivel)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Office)
                .HasMaxLength(30)
                .IsUnicode(false);
        });
        //para nuevo modelo de final evaluation 

        modelBuilder.Entity<Evaluation>(entity =>
        {
            entity.ToTable("Evaluation");
            entity.HasKey(e => e.EvaluationId);

            entity.Property(e => e.EmployeeId).HasMaxLength(50).IsRequired();
            entity.Property(e => e.CreatedAt).HasColumnType("datetime2");
        });

        modelBuilder.Entity<EvaluationStep>(entity =>
        {
            entity.ToTable("EvaluationStep");
            entity.HasKey(e => e.EvaluationStepId);

            entity.Property(e => e.StepType).HasMaxLength(20).IsRequired();

            entity.HasOne(e => e.Evaluation)
                          .WithMany(e => e.Steps)
                          .HasForeignKey(e => e.EvaluationId);
        });

        modelBuilder.Entity<LkpDecisionType>(entity =>
        {
            entity.ToTable("LkpDecisionType");
            entity.HasKey(e => e.DecisionTypeId);
        });

        modelBuilder.Entity<LkpPromotionCategory>(entity =>
        {
            entity.ToTable("LkpPromotionCategory");
            entity.HasKey(e => e.PromotionCategoryId);
        });

        modelBuilder.Entity<LkpStageStatus>(entity =>
        {
            entity.ToTable("LkpStageStatus");
            entity.HasKey(e => e.StageStatusId);
        });


        OnModelCreatingPartial(modelBuilder);
    }
    
partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
