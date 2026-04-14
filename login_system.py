"""Simple login system for the Khanta Enterprises app.

Features:
- User registration
- Password hashing with per-user salt (PBKDF2-HMAC SHA-256)
- User authentication
- SQLite-backed persistence
"""

from __future__ import annotations

import hashlib
import hmac
import os
import sqlite3
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional


@dataclass
class AuthResult:
    success: bool
    message: str


class LoginSystem:
    def __init__(self, db_path: str | Path = "khanta_enterprises.db") -> None:
        self.db_path = str(db_path)
        self._initialize_database()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _initialize_database(self) -> None:
        with self._connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    salt TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
                """
            )
            conn.commit()

    @staticmethod
    def _hash_password(password: str, salt: bytes) -> str:
        digest = hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), salt, 200_000
        )
        return digest.hex()

    @staticmethod
    def _valid_password(password: str) -> bool:
        return len(password) >= 8

    def register_user(self, username: str, password: str) -> AuthResult:
        username = username.strip()
        if not username:
            return AuthResult(False, "Username is required.")

        if not self._valid_password(password):
            return AuthResult(False, "Password must be at least 8 characters.")

        salt = os.urandom(16)
        password_hash = self._hash_password(password, salt)

        try:
            with self._connect() as conn:
                conn.execute(
                    """
                    INSERT INTO users (username, password_hash, salt, created_at)
                    VALUES (?, ?, ?, ?)
                    """,
                    (
                        username,
                        password_hash,
                        salt.hex(),
                        datetime.now(timezone.utc).isoformat(),
                    ),
                )
                conn.commit()
        except sqlite3.IntegrityError:
            return AuthResult(False, "Username already exists.")

        return AuthResult(True, "User registered successfully.")

    def authenticate_user(self, username: str, password: str) -> AuthResult:
        username = username.strip()
        if not username or not password:
            return AuthResult(False, "Username and password are required.")

        with self._connect() as conn:
            user = conn.execute(
                "SELECT username, password_hash, salt FROM users WHERE username = ?",
                (username,),
            ).fetchone()

        if user is None:
            return AuthResult(False, "Invalid username or password.")

        salt = bytes.fromhex(user["salt"])
        expected_hash = user["password_hash"]
        password_hash = self._hash_password(password, salt)

        if not hmac.compare_digest(password_hash, expected_hash):
            return AuthResult(False, "Invalid username or password.")

        return AuthResult(True, "Login successful.")

    def user_exists(self, username: str) -> bool:
        with self._connect() as conn:
            user = conn.execute(
                "SELECT 1 FROM users WHERE username = ?", (username.strip(),)
            ).fetchone()
        return user is not None


def _prompt(prompt: str) -> str:
    return input(prompt).strip()


def cli() -> None:
    auth = LoginSystem()
    print("Khanta Enterprises Login System")
    print("1) Register")
    print("2) Login")

    choice = _prompt("Choose an option (1/2): ")

    if choice == "1":
        username = _prompt("Username: ")
        password = input("Password: ")
        result = auth.register_user(username, password)
        print(result.message)
    elif choice == "2":
        username = _prompt("Username: ")
        password = input("Password: ")
        result = auth.authenticate_user(username, password)
        print(result.message)
    else:
        print("Invalid option.")


if __name__ == "__main__":
    cli()
