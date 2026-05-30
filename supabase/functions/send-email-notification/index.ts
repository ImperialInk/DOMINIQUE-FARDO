const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SMTP_HOST = "mail.dominiquefardo.com";
const SMTP_PORT = 465;
const SMTP_USER = "send@dominiquefardo.com";
const SMTP_PASS = "nP!dNYs9kNRJ";
const RECIPIENT_EMAIL = "info@dominiquefardo.com";

async function readLine(reader: ReadableStreamDefaultReader<Uint8Array>): Promise<string> {
  const decoder = new TextDecoder();
  let line = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    line += decoder.decode(value, { stream: true });
    if (line.includes("\r\n")) break;
  }
  return line.trim();
}

async function sendCommand(
  writer: WritableStreamDefaultWriter<Uint8Array>,
  reader: ReadableStreamDefaultReader<Uint8Array>,
  command: string
): Promise<string> {
  const encoder = new TextEncoder();
  await writer.write(encoder.encode(command + "\r\n"));
  const response = await readLine(reader);
  return response;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { name, lastname, email, phone, message } = await req.json();

    const subject = `New contact form submission from ${name} ${lastname}`.trim();
    const htmlBody = [
      `<b>Name:</b><br>${name}<br><br>`,
      `<b>Last Name:</b><br>${lastname}<br><br>`,
      `<b>Email:</b><br>${email}<br><br>`,
      `<b>Phone:</b><br>${phone}<br><br>`,
      `<b>Message:</b><br>${message}`,
    ].join("");

    const boundary = "----boundary" + Date.now();
    const emailContent = [
      `From: "Website Contact Form" <${SMTP_USER}>`,
      `To: ${RECIPIENT_EMAIL}`,
      `Reply-To: ${email}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      ``,
      `--${boundary}`,
      `Content-Type: text/plain; charset=UTF-8`,
      ``,
      `Name: ${name}\nLast Name: ${lastname}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
      ``,
      `--${boundary}`,
      `Content-Type: text/html; charset=UTF-8`,
      ``,
      htmlBody,
      ``,
      `--${boundary}--`,
    ].join("\r\n");

    const conn = await Deno.connectTls({
      hostname: SMTP_HOST,
      port: SMTP_PORT,
    });

    const writer = conn.writable.getWriter();
    const reader = conn.readable.getReader();
    const encoder = new TextEncoder();

    // Read server greeting
    await readLine(reader);

    // EHLO
    await sendCommand(writer, reader, `EHLO dominiquefardo.com`);

    // AUTH LOGIN
    await sendCommand(writer, reader, `AUTH LOGIN`);
    await sendCommand(writer, reader, btoa(SMTP_USER));
    await sendCommand(writer, reader, btoa(SMTP_PASS));

    // MAIL FROM
    await sendCommand(writer, reader, `MAIL FROM:<${SMTP_USER}>`);

    // RCPT TO
    await sendCommand(writer, reader, `RCPT TO:<${RECIPIENT_EMAIL}>`);

    // DATA
    await sendCommand(writer, reader, `DATA`);

    // Send email content
    await writer.write(encoder.encode(emailContent + "\r\n.\r\n"));
    await readLine(reader);

    // QUIT
    await sendCommand(writer, reader, `QUIT`);

    writer.releaseLock();
    reader.releaseLock();
    conn.close();

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMsg }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
