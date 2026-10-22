export async function enviarEmailResend({ to, subject, text, html }) {
  const { RESEND_API_KEY, RESEND_FROM_EMAIL } = process.env;

  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    throw new Error(
      "Configure RESEND_API_KEY e RESEND_FROM_EMAIL para enviar e-mails.",
    );
  }

  const resposta = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to: [to],
      subject,
      text,
      html,
    }),
  });

  if (!resposta.ok) {
    const detalhes = await resposta.json().catch(() => ({}));
    const mensagem =
      detalhes.message || detalhes.name || `HTTP ${resposta.status}`;
    throw new Error(`Resend recusou o envio (${resposta.status}): ${mensagem}`);
  }

  return resposta.json();
}
