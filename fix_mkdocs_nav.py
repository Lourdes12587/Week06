import os
import yaml

DOCS_DIR = "docs/mkdocs"
MKDOCS_FILE = "mkdocs.yml"
OUTPUT_FILE = "mkdocs_fixed.yml"

def get_md_files_dict(path):
    """Devuelve un diccionario con nombres de archivo en minúscula -> ruta relativa real"""
    md_dict = {}
    for root, dirs, files in os.walk(path):
        for file in files:
            if file.endswith(".md"):
                rel_path = os.path.relpath(os.path.join(root, file), path).replace("\\", "/")
                md_dict[file.lower()] = rel_path
    return md_dict

def fix_nav(nav_list, md_dict):
    """Recorre la estructura nav y corrige las rutas según los archivos reales"""
    fixed_nav = []
    for item in nav_list:
        if isinstance(item, dict):
            new_item = {}
            for k, v in item.items():
                if isinstance(v, list):
                    new_item[k] = fix_nav(v, md_dict)
                elif isinstance(v, str):
                    corrected_path = md_dict.get(v.lower())
                    if corrected_path:
                        new_item[k] = corrected_path
                    else:
                        print(f"⚠️  No se encontró el archivo para: {v}")
                        new_item[k] = v  # Dejamos el original si no existe
            fixed_nav.append(new_item)
        else:
            # item puede ser string (caso raro)
            corrected_path = md_dict.get(item.lower(), item)
            fixed_nav.append(corrected_path)
    return fixed_nav

def main():
    with open(MKDOCS_FILE, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)

    md_dict = get_md_files_dict(DOCS_DIR)
    if "nav" in config:
        config["nav"] = fix_nav(config["nav"], md_dict)

    # Guardamos el mkdocs corregido
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        yaml.dump(config, f, sort_keys=False, allow_unicode=True)

    print(f"✅ Archivo {OUTPUT_FILE} generado con rutas corregidas.")

if __name__ == "__main__":
    main()
