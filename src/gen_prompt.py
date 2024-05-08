import os
import subprocess


def display_tree_structure():
    cwd = os.getcwd()
    result = subprocess.run(["tree", cwd], capture_output=True, text=True)
    if result.returncode == 0:
        print("This is my project structure:\n")
        print(result.stdout)
    else:
        print("Error executing 'tree' command:", result.stderr)


def display_contents(start_path):
    ignore_files = [
        "Untitled-1.ipynb",
    ]
    ignore_dirs = [
        "node_modules",
        ".git",
        "__pycache__",
    ]
    allowed_extensions = [".py"]

    for root, dirs, files in os.walk(start_path):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for file in files:
            if file not in ignore_files and any(
                file.endswith(ext) for ext in allowed_extensions
            ):
                file_path = os.path.join(root, file)
                print(f"{file_path}:")
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        print(f.read())
                except Exception as e:
                    print(f"Error reading file {file_path}: {e}")
                print("\n" + "-" * 20 + "\n")


def main():
    print("Displaying contents of each file:\n")
    cwd = os.getcwd()
    display_contents(cwd)


if __name__ == "__main__":
    main()
