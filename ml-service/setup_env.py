import os
import subprocess
import sys

def setup():
    print("Setting up Python virtual environment...")
    venv_dir = "venv"
    
    if not os.path.exists(venv_dir):
        subprocess.run([sys.executable, "-m", "venv", venv_dir], check=True)
        print("Virtual environment created.")
    else:
        print("Virtual environment already exists.")

    print("Installing dependencies...")
    # Path to pip varies by OS
    if os.name == 'nt':
        pip_path = os.path.join(venv_dir, "Scripts", "pip")
    else:
        pip_path = os.path.join(venv_dir, "bin", "pip")
    
    subprocess.run([pip_path, "install", "-r", "requirements.txt"], check=True)
    print("ML Service environment setup complete!")

if __name__ == "__main__":
    setup()
