export async function handler(event) {
  // 1. Solo permitir POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  try {
    // 2. Obtener datos del frontend
    const data = JSON.parse(event.body);

    // 3. Construir mensaje
    const mensajeCliente = `
¡SE HA GENERADO UNA NUEVA SOLICITUD! 🙌🙌

Nombre: ${data.firstName} ${data.lastName}
Correo: ${data.emailAddress}
Teléfono: ${data.phoneNumber}
Código Postal: ${data.zipCode}

Tipo de caso: ${data.caseType}

Descripción:
${data.description}

Fecha: ${new Date().toLocaleString("es-CO")}
`;

    // 4. 🚨 AQUÍ va la integración real con WhatsApp Business API
    console.log("📩 Mensaje generado:", mensajeCliente);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error("❌ Error en send-whatsapp:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Internal Server Error" })
    };
  }
}
