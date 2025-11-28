"""Configuração de SMTP e função auxiliar para envio de e-mails."""

import smtplib
import ssl
from email.mime.text import MIMEText
from typing import Dict


SMTP_CONFIG: Dict[str, object] = {
    # Dados do servidor SMTP
    "HOST": "smtp.sendgrid.net",         # ex.: "smtp.gmail.com"
    "PORT": 587,                         # 587 para TLS, 465 para SSL
    "USER": "apikey",                      # ex.: "seu.email@dominio.com"
    "PASSWORD": "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",        # senha ou app password

    # Remetente padrão
    "FROM_EMAIL": "fabricio.sbiscaino@gmail.com",

    # Segurança
    "USE_TLS": True,                     # True para STARTTLS
    "USE_SSL": False,                    # True para SMTP SSL direto
}


def send_reset_email(email_to: str, reset_link: str) -> None:
    """Envia o e-mail de redefinição de senha para o usuário."""
    subject = "Redefinição de senha - Portal OCC"
    body = f"""Olá,

Você solicitou a redefinição de senha do Portal OCC.
Para criar uma nova senha, acesse o link abaixo:

{reset_link}

Se você não solicitou esta operação, ignore este e-mail.

Atenciosamente,
Equipe Portal OCC
"""

    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"] = str(SMTP_CONFIG["FROM_EMAIL"])
    msg["To"] = email_to

    host = str(SMTP_CONFIG["HOST"])
    port = int(SMTP_CONFIG["PORT"])
    user = str(SMTP_CONFIG.get("USER") or "")
    password = str(SMTP_CONFIG.get("PASSWORD") or "")
    use_tls = bool(SMTP_CONFIG.get("USE_TLS", False))
    use_ssl = bool(SMTP_CONFIG.get("USE_SSL", False))

    if use_ssl:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(host, port, context=context) as server:
            if user and password:
                server.login(user, password)
            server.send_message(msg)
    else:
        with smtplib.SMTP(host, port) as server:
            if use_tls:
                context = ssl.create_default_context()
                server.starttls(context=context)
            if user and password:
                server.login(user, password)
            server.send_message(msg)
