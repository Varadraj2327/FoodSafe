from datetime import datetime, timedelta, timezone
from typing import Optional, Any
from jose import jwt, JWTError
import bcrypt
from passlib.context import CryptContext
from app.core.config import settings

# Workaround for passlib 1.7.4 compatibility with bcrypt >= 4.0.0
# passlib's internal detect_wrap_bug passes 255-byte test passwords to bcrypt.hashpw,
# which causes bcrypt 4.0+ to raise ValueError("password cannot be longer than 72 bytes").
_orig_hashpw = bcrypt.hashpw
def _safe_hashpw(password: bytes, salt: bytes) -> bytes:
    if len(password) > 72:
        password = password[:72]
    return _orig_hashpw(password, salt)
bcrypt.hashpw = _safe_hashpw

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def _truncate_password(password: str) -> str:
    """
    Safely truncates password bytes to max 72 bytes for bcrypt compatibility.
    """
    if not password:
        return ""
    return password.encode("utf-8")[:72].decode("utf-8", errors="ignore")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain-text password against a stored bcrypt hash using passlib.
    """
    try:
        safe_pwd = _truncate_password(plain_password)
        return pwd_context.verify(safe_pwd, hashed_password)
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    """
    Generates a bcrypt hash for a plain-text password using passlib.
    """
    safe_pwd = _truncate_password(password)
    return pwd_context.hash(safe_pwd)


def create_access_token(subject: Any, expires_delta: Optional[timedelta] = None) -> str:
    """
    Encodes a JWT access token containing user identity and expiration.
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "sub": str(subject),
        "exp": expire,
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_access_token(token: str) -> Optional[dict]:
    """
    Decodes and validates a JWT token using jose.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

