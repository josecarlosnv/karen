import pandas as pd

# ============================================================
# POWER BI inyecta la tabla aplanada como 'dataset'
# ============================================================

df = dataset.copy()


# ============================================================
# 1. HELPERS Y CONSTANTES
# ============================================================

INVALIDOS = {"nan", "none", "", "nat", "<na>", "null"}


def is_valid(v) -> bool:
    if v is None:
        return False

    try:
        if pd.isna(v):
            return False
    except (TypeError, ValueError):
        pass

    return str(v).strip().lower() not in INVALIDOS


def s_clean(series: pd.Series) -> pd.Series:
    return series.astype("string").str.strip()


def mejor_valor(*vals):
    for v in vals:
        if not is_valid(v):
            continue
        return str(v).strip()

    return pd.NA


def mejor_de_serie(ser: pd.Series):
    for v in ser.tolist():
        mv = mejor_valor(v)
        if mv is not pd.NA:
            return mv

    return pd.NA


def parsear_equivalencias(valor) -> list:
    """
    Convierte valores como:
        'A / B / C'
    en:
        ['A', 'B', 'C']

    También funciona si viene como:
        'A/B/C'
        'A /B / C'
    """
    v = mejor_valor(valor)

    if v is pd.NA:
        return []

    partes = [p.strip() for p in str(v).split("/") if p.strip()]

    out = []
    seen = set()

    for p in partes:
        pp = mejor_valor(p)

        if pp is pd.NA:
            continue

        key = pp.lower()

        if key not in seen:
            seen.add(key)
            out.append(pp)

    return out


def mejor_lista(series_de_listas: pd.Series) -> list:
    for lst in series_de_listas.tolist():
        if isinstance(lst, list) and len(lst) > 0:
            return lst

    return []


# ============================================================
# 2. LIMPIEZA DE NOMBRES DE COLUMNAS
# ============================================================

df.columns = df.columns.astype(str).str.strip()


# ============================================================
# 3. NOMBRES DE COLUMNAS
# ============================================================

col_nombre = "Nombre"
col_job = "Local_Job_Level_Name"
col_cc = "Cost_Center"
col_empid = "Employee_Id"
col_user = "User_Name"
col_location = "Location_Name"
col_email = "Email_Address_Business"
col_bu = "BU"
col_oficina = "Oficina"

col_titulo = "Nombre del curso"
col_item = "Item ID o Program ID Clave Actual"
col_equiv = "Item ID o Program ID Equivalencia"
col_cat = "Categoría"
col_programa = "Programa de Capacitación"

col_comp = "Item ID o Program ID Complementos Equivalencia"

col_gmls_item = "GMLSFact.Item ID"
col_source = "GMLSFact.Source (in histor, learning plan or never assigned?)"

tiene_comp = col_comp in df.columns


# ============================================================
# 4. VALIDACIÓN DE COLUMNAS OBLIGATORIAS
# ============================================================

cols_requeridas = [
    col_nombre,
    col_job,
    col_cc,
    col_empid,
    col_user,
    col_location,
    col_email,
    col_bu,
    col_oficina,
    col_titulo,
    col_item,
    col_equiv,
    col_cat,
    col_programa,
    col_gmls_item,
    col_source,
]

faltantes = [c for c in cols_requeridas if c not in df.columns]

if faltantes:
    raise ValueError(f"Faltan columnas en el dataset de entrada: {faltantes}")


# ============================================================
# 5. LIMPIEZA DE CAMPOS
# ============================================================

for c in cols_requeridas:
    df[c] = s_clean(df[c])

if tiene_comp:
    df[col_comp] = s_clean(df[col_comp])


# ============================================================
# 6. REGLA "LISTA ESPECIFICA"
# ============================================================

_cat_lower = df[col_cat].str.strip().str.lower()
_es_lista_esp = _cat_lower == "lista especifica"

_items_otra_cat = df.loc[~_es_lista_esp, col_item].unique()

_mask_eliminar = _es_lista_esp & df[col_item].isin(_items_otra_cat)

df = df[~_mask_eliminar].copy().reset_index(drop=True)


# ============================================================
# 7. CLAVE INTERNA DE EMPLEADO
# ============================================================

df["_emp_key"] = df.apply(
    lambda r: mejor_valor(r[col_user], r[col_empid]),
    axis=1,
)


# ============================================================
# 8. SUBTABLA DE EMPLEADOS
# ============================================================

cols_empleado = [
    "_emp_key",
    col_nombre,
    col_job,
    col_cc,
    col_empid,
    col_user,
    col_location,
    col_email,
    col_bu,
    col_oficina,
]

empleados = (
    df[cols_empleado]
    .copy()
    .loc[df["_emp_key"].apply(is_valid)]
    .drop_duplicates(subset=["_emp_key"])
    .reset_index(drop=True)
)


# ============================================================
# 9. CATÁLOGO DE CURSOS
# ============================================================

cat_cols = [
    col_titulo,
    col_item,
    col_equiv,
    col_cat,
    col_programa,
]

if tiene_comp:
    cat_cols.append(col_comp)

catalogo_raw = df[cat_cols].copy()
catalogo_raw = catalogo_raw[catalogo_raw[col_item].apply(is_valid)].copy()

catalogo_raw["_equiv_lista"] = catalogo_raw[col_equiv].apply(parsear_equivalencias)
catalogo_raw["_tiene_equiv"] = catalogo_raw["_equiv_lista"].apply(lambda x: len(x) > 0)

catalogo_raw = catalogo_raw.sort_values(
    [col_item, col_programa, "_tiene_equiv"],
    ascending=[True, True, False],
)

agg_cat = {
    col_titulo: mejor_de_serie,
    col_equiv: mejor_de_serie,
    "_equiv_lista": mejor_lista,
}

catalogo = (
    catalogo_raw
    .groupby([col_item, col_cat, col_programa], as_index=False)
    .agg(agg_cat)
)


# ============================================================
# 9A. CATÁLOGO GLOBAL
# ============================================================

catalogo_global = (
    catalogo_raw[[col_item, col_titulo, col_equiv, "_equiv_lista"]]
    .groupby(col_item, as_index=False)
    .agg(
        {
            col_titulo: mejor_de_serie,
            col_equiv: mejor_de_serie,
            "_equiv_lista": mejor_lista,
        }
    )
)

global_titulo_map = catalogo_global.set_index(col_item)[col_titulo].to_dict()
global_equiv_str = catalogo_global.set_index(col_item)[col_equiv].to_dict()
global_equiv_list = catalogo_global.set_index(col_item)["_equiv_lista"].to_dict()


# ============================================================
# 9B. MAPA DE GRUPOS DE COMPLEMENTOS
# ============================================================

item_a_comp_info = {}
grupos_por_equiv = {}

if tiene_comp:
    comp_filas = (
        catalogo_raw[
            catalogo_raw[col_comp].apply(is_valid)
            & catalogo_raw[col_equiv].apply(is_valid)
        ][[col_item, col_comp, col_equiv]]
        .drop_duplicates()
    )

    for _, fila in comp_filas.iterrows():
        item_id = str(fila[col_item]).strip()
        comp_tok = str(fila[col_comp]).strip()
        equiv_id = str(fila[col_equiv]).strip()

        if "." not in comp_tok:
            continue

        prefijo = comp_tok.split(".")[0].strip()

        item_a_comp_info[item_id] = (equiv_id, prefijo)

        grupos_por_equiv.setdefault(equiv_id, {})
        grupos_por_equiv[equiv_id].setdefault(prefijo, [])

        if item_id not in grupos_por_equiv[equiv_id][prefijo]:
            grupos_por_equiv[equiv_id][prefijo].append(item_id)


# ============================================================
# 10. LOOKUP DE ESTATUS
# ============================================================

fact = (
    df[["_emp_key", col_gmls_item, col_source]]
    .copy()
    .loc[
        df["_emp_key"].apply(is_valid)
        & df[col_gmls_item].apply(is_valid)
    ]
)

ORDEN_SOURCE = {
    "LEARNING_HISTORY": 0,
    "LEARNING_PLAN": 1,
}

fact["_prio_src"] = fact[col_source].map(ORDEN_SOURCE).fillna(99)

fact_dedup = (
    fact
    .sort_values(["_emp_key", col_gmls_item, "_prio_src"])
    .drop_duplicates(subset=["_emp_key", col_gmls_item], keep="first")
    .set_index(["_emp_key", col_gmls_item])
)


# ============================================================
# 11. FUNCIÓN RESOLVER
# ============================================================

STATUS_COMP = "🟢Completado"
STATUS_ASIG = "🔵Asignado"
STATUS_NOASIG = "⚪No Asignado"


def get_src(emp_key: str, item: str):
    key = (emp_key, item)

    if key in fact_dedup.index:
        return fact_dedup.at[key, col_source]

    return None


def resolver(emp_key: str, id_clave: str, equiv_lista: list) -> tuple:
    if not is_valid(id_clave):
        return STATUS_NOASIG, pd.NA, pd.NA

    src_clave = get_src(emp_key, id_clave)

    # 1. Clave actual en LEARNING_HISTORY
    if src_clave == "LEARNING_HISTORY":
        return STATUS_COMP, id_clave, src_clave

    # Si tiene múltiples equivalencias, NO se evalúan equivalencias
    evaluar_equiv = isinstance(equiv_lista, list) and len(equiv_lista) == 1

    # 2. Equivalencia única en LEARNING_HISTORY
    if evaluar_equiv:
        for eq in equiv_lista:
            if get_src(emp_key, eq) == "LEARNING_HISTORY":
                return STATUS_COMP, eq, "LEARNING_HISTORY"

    # 3. Clave actual en LEARNING_PLAN
    if src_clave == "LEARNING_PLAN":
        return STATUS_ASIG, id_clave, src_clave

    # 4. Equivalencia única en LEARNING_PLAN
    if evaluar_equiv:
        for eq in equiv_lista:
            if get_src(emp_key, eq) == "LEARNING_PLAN":
                return STATUS_ASIG, eq, "LEARNING_PLAN"

    return STATUS_NOASIG, pd.NA, pd.NA


# ============================================================
# 12. PRODUCTO CARTESIANO EMPLEADOS X CATÁLOGO
# ============================================================

empleados["_k"] = 1
catalogo["_k"] = 1

combos = (
    empleados
    .merge(catalogo, on="_k", how="inner")
    .drop(columns=["_k"])
)


def lista_final(row) -> list:
    lst = row["_equiv_lista"]

    if isinstance(lst, list) and len(lst) > 0:
        return lst

    return global_equiv_list.get(row[col_item], [])


def equiv_str_final(row):
    v = mejor_valor(row[col_equiv])

    if v is not pd.NA:
        return v

    return mejor_valor(global_equiv_str.get(row[col_item]))


combos["_equiv_lista_final"] = combos.apply(lista_final, axis=1)
combos["Equivalencia_Final"] = combos.apply(equiv_str_final, axis=1)


# ============================================================
# 13. RESOLUCIÓN DEL ESTATUS
# ============================================================

resolucion = combos.apply(
    lambda r: resolver(
        r["_emp_key"],
        r[col_item],
        r["_equiv_lista_final"],
    ),
    axis=1,
    result_type="expand",
)

resolucion.columns = [
    "Estatus",
    col_gmls_item,
    col_source,
]

resultado = pd.concat(
    [
        combos[
            [
                "_emp_key",
                col_nombre,
                col_job,
                col_cc,
                col_empid,
                col_user,
                col_location,
                col_email,
                col_bu,
                col_oficina,
                col_titulo,
                col_item,
                col_cat,
                col_programa,
                "Equivalencia_Final",
                "_equiv_lista_final",
            ]
        ],
        resolucion,
    ],
    axis=1,
)

resultado["_es_espejo"] = False


# ============================================================
# 14. FILAS ESPEJO
# Solo para equivalencias únicas
# ============================================================

combos_unicos = resultado[
    resultado["_equiv_lista_final"].apply(
        lambda x: isinstance(x, list) and len(x) == 1
    )
].copy()

equiv_map = (
    combos_unicos[[col_item, "_equiv_lista_final"]]
    .explode("_equiv_lista_final")
    .rename(columns={"_equiv_lista_final": "_equiv_id"})
)

equiv_map["_equiv_id"] = equiv_map["_equiv_id"].astype("string").str.strip()

equiv_map = equiv_map[
    equiv_map["_equiv_id"].apply(is_valid)
    & (equiv_map["_equiv_id"] != equiv_map[col_item])
].drop_duplicates(subset=[col_item, "_equiv_id"])

base_ok = resultado[resultado["Estatus"] == STATUS_COMP].copy()

base_ok = base_ok.merge(equiv_map, on=col_item, how="inner")
base_ok = base_ok[base_ok["_equiv_id"] != base_ok[col_item]].copy()

base_ok = base_ok[
    base_ok.apply(
        lambda r: get_src(r["_emp_key"], r["_equiv_id"]) != "LEARNING_HISTORY",
        axis=1,
    )
].copy()

filas_eq = base_ok.copy()

filas_eq[col_item] = filas_eq["_equiv_id"]
filas_eq["Equivalencia_Final"] = ""
filas_eq["_equiv_lista_final"] = [[] for _ in range(len(filas_eq))]
filas_eq["_es_espejo"] = True
filas_eq["Estatus"] = STATUS_COMP

filas_eq[col_titulo] = (
    filas_eq[col_item]
    .map(global_titulo_map)
    .fillna(filas_eq[col_titulo])
)

filas_eq = (
    filas_eq
    .drop_duplicates(
        subset=[
            "_emp_key",
            col_item,
            col_cat,
            col_programa,
        ]
    )
    .reset_index(drop=True)
)


# ============================================================
# 15. COMPLEMENTOS
# ============================================================

filas_comp_list = []

if tiene_comp and grupos_por_equiv:
    todos_emp = empleados["_emp_key"].tolist()
    emp_data = empleados.set_index("_emp_key").to_dict("index")

    # Precalculado una sola vez: antes cada emp x miembro repetía un escaneo
    # completo de catalogo_raw con .loc; con miles de empleados eso multiplica
    # el costo por el tamaño de catalogo_raw en cada iteración del loop.
    item_cat_prog_map = (
        catalogo_raw
        .drop_duplicates(subset=[col_item], keep="first")
        .set_index(col_item)[[col_cat, col_programa]]
        .to_dict("index")
    )

    for equiv_id, grupos in grupos_por_equiv.items():
        for prefijo, miembros in grupos.items():
            if not miembros:
                continue

            info_base = item_cat_prog_map.get(miembros[0])

            cat_miembro = info_base[col_cat] if info_base is not None else ""
            prog_miembro = info_base[col_programa] if info_base is not None else ""

            for emp in todos_emp:
                datos_emp = emp_data.get(emp, {})

                for miembro in miembros:
                    src_m = get_src(emp, miembro)

                    if src_m == "LEARNING_HISTORY":
                        estatus_m = STATUS_COMP
                    elif src_m == "LEARNING_PLAN":
                        estatus_m = STATUS_ASIG
                    else:
                        estatus_m = STATUS_NOASIG

                    info_m = item_cat_prog_map.get(miembro)

                    filas_comp_list.append(
                        {
                            "_emp_key": emp,
                            col_nombre: datos_emp.get(col_nombre, ""),
                            col_job: datos_emp.get(col_job, ""),
                            col_cc: datos_emp.get(col_cc, ""),
                            col_empid: datos_emp.get(col_empid, ""),
                            col_user: datos_emp.get(col_user, ""),
                            col_location: datos_emp.get(col_location, ""),
                            col_email: datos_emp.get(col_email, ""),
                            col_bu: datos_emp.get(col_bu, ""),
                            col_oficina: datos_emp.get(col_oficina, ""),
                            col_titulo: global_titulo_map.get(
                                miembro,
                                "[Título no encontrado]",
                            ),
                            col_item: miembro,
                            col_cat: info_m[col_cat] if info_m is not None else cat_miembro,
                            col_programa: info_m[col_programa] if info_m is not None else prog_miembro,
                            "Equivalencia_Final": "",
                            "_equiv_lista_final": [],
                            col_gmls_item: miembro if src_m is not None else pd.NA,
                            col_source: src_m if src_m is not None else pd.NA,
                            "Estatus": estatus_m,
                            "_es_espejo": False,
                        }
                    )

                grupo_completo = all(
                    get_src(emp, m) == "LEARNING_HISTORY"
                    for m in miembros
                )

                paraguas_ya_completo = get_src(emp, equiv_id) == "LEARNING_HISTORY"

                if grupo_completo and not paraguas_ya_completo and is_valid(equiv_id):
                    filas_comp_list.append(
                        {
                            "_emp_key": emp,
                            col_nombre: datos_emp.get(col_nombre, ""),
                            col_job: datos_emp.get(col_job, ""),
                            col_cc: datos_emp.get(col_cc, ""),
                            col_empid: datos_emp.get(col_empid, ""),
                            col_user: datos_emp.get(col_user, ""),
                            col_location: datos_emp.get(col_location, ""),
                            col_email: datos_emp.get(col_email, ""),
                            col_bu: datos_emp.get(col_bu, ""),
                            col_oficina: datos_emp.get(col_oficina, ""),
                            col_titulo: global_titulo_map.get(
                                equiv_id,
                                "[Título no encontrado]",
                            ),
                            col_item: equiv_id,
                            col_cat: cat_miembro,
                            col_programa: prog_miembro,
                            "Equivalencia_Final": "",
                            "_equiv_lista_final": [],
                            col_gmls_item: equiv_id,
                            col_source: "LEARNING_HISTORY",
                            "Estatus": STATUS_COMP,
                            "_es_espejo": True,
                        }
                    )

if filas_comp_list:
    filas_comp = pd.DataFrame(filas_comp_list)
else:
    filas_comp = pd.DataFrame(columns=resultado.columns)


# ============================================================
# 16. UNIÓN FINAL
# ============================================================

COLS_BASE = [
    "_emp_key",
    col_nombre,
    col_job,
    col_cc,
    col_empid,
    col_user,
    col_location,
    col_email,
    col_bu,
    col_oficina,
    col_titulo,
    col_item,
    col_cat,
    col_programa,
    "Equivalencia_Final",
    "_equiv_lista_final",
    col_gmls_item,
    col_source,
    "Estatus",
    "_es_espejo",
]


def alinear(df_in):
    df_in = df_in.copy()

    for c in COLS_BASE:
        if c not in df_in.columns:
            df_in[c] = pd.NA

    return df_in[COLS_BASE]


dfs_a_unir = [
    alinear(resultado),
    alinear(filas_eq),
]

if not filas_comp.empty:
    dfs_a_unir.append(alinear(filas_comp))

resultado_completo = pd.concat(
    dfs_a_unir,
    ignore_index=True,
)


# ============================================================
# 17. CLAVE COMPUESTA
# ============================================================

resultado_completo["Clave"] = (
    resultado_completo[col_user].fillna("").astype("string").str.strip()
    + "-"
    + resultado_completo[col_item].fillna("").astype("string").str.strip()
    + "-"
    + resultado_completo[col_programa].fillna("").astype("string").str.strip()
)


# ============================================================
# 18. PRIORIZACIÓN Y DEDUPLICACIÓN FINAL
# ============================================================

PRIO_STATUS = {
    STATUS_COMP: 0,
    STATUS_ASIG: 1,
    STATUS_NOASIG: 2,
}

resultado_completo["_prio_estatus"] = (
    resultado_completo["Estatus"]
    .map(PRIO_STATUS)
    .fillna(9)
)

resultado_completo["_prio_espejo"] = (
    resultado_completo["_es_espejo"]
    .fillna(False)
    .astype(bool)
    .astype(int)
)

resultado_completo = resultado_completo.sort_values(
    ["_prio_estatus", "_prio_espejo"],
    ascending=[True, True],
)

resultado_final = (
    resultado_completo
    .drop_duplicates(subset=["Clave"], keep="first")
    .reset_index(drop=True)
)


# ============================================================
# 19. COLUMNAS DE SALIDA
# ============================================================

cols_salida = [
    col_nombre,
    col_job,
    col_cc,
    col_empid,
    col_user,
    col_location,
    col_email,
    col_bu,
    col_oficina,
    col_titulo,
    col_item,
    col_cat,
    col_programa,
    "Clave",
    col_gmls_item,
    col_source,
    "Estatus",
]

cols_salida = [c for c in cols_salida if c in resultado_final.columns]

resultado_final = (
    resultado_final[cols_salida]
    .copy()
    .loc[resultado_final["Clave"].astype("string").str.strip().ne("")]
    .reset_index(drop=True)
)

# ============================================================
# 20. SALIDA PARA POWER BI
# ============================================================

resultado_final
