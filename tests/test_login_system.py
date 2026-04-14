from login_system import LoginSystem


def test_register_and_login_success(tmp_path):
    system = LoginSystem(tmp_path / "test.db")

    register = system.register_user("alice", "supersecret")
    login = system.authenticate_user("alice", "supersecret")

    assert register.success is True
    assert login.success is True


def test_duplicate_username_fails(tmp_path):
    system = LoginSystem(tmp_path / "test.db")

    first = system.register_user("alice", "supersecret")
    second = system.register_user("alice", "supersecret")

    assert first.success is True
    assert second.success is False


def test_invalid_password_fails(tmp_path):
    system = LoginSystem(tmp_path / "test.db")

    system.register_user("alice", "supersecret")
    result = system.authenticate_user("alice", "wrongpass")

    assert result.success is False
