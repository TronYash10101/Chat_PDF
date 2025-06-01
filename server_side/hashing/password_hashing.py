import bcrypt

def hashing(password : str):
    if password:

        byte_pass = password.encode("utf-8")

        salt = bcrypt.gensalt()

        hashed_password = bcrypt.hashpw(byte_pass,salt)

        return hashed_password
    return "password_error"

if __name__ == "__main__":
    hashing()