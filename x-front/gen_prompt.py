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
        ".terraform.lock.hcl",
        "terraform.tfstate",
        "terraform.tfstate.backup",
        "package-lock.json",  # Ignoring package lock file
        "yarn.lock",  # Ignoring yarn lock file
        ".env",  # Ignoring environment variable files
        ".env.local",
        ".env.development.local",
        ".env.test.local",
        ".env.production.local",
        "gen_prompt.py"
    ]
    ignore_dirs = [
        "node_modules",
        ".next",  # Next.js build output
        ".vercel",  # Vercel deployment cache
        "out",  # Next.js export output
        ".git",  # Git directory
        "public",  # Static assets might not need to be displayed
    ]

    for root, dirs, files in os.walk(start_path):
        # Ignore specified directories
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for file in files:
            if file not in ignore_files:
                file_path = os.path.join(root, file)
                print(f"{file_path}:")
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        print(f.read())
                except Exception as e:
                    print(f"Error reading file {file_path}: {e}")
                print("\n" + "-" * 20 + "\n")  # Separator between files

def main():
    # display_tree_structure()
    print("Displaying contents of each file:\n")
    cwd = os.getcwd()
    display_contents(cwd)

if __name__ == "__main__":
    main()
