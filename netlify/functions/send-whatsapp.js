// netlify/functions/send-whatsapp.js

exports.handler = async (event, context) => {
  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Obtener datos del formulario
    const data = JSON.parse(event.body);

    // Configuración de Ultramsg (VARIABLES DE ENTORNO - SEGURAS)
    const ULTRAMSG_INSTANCE = process.env.ULTRAMSG_INSTANCE_ID;
    const ULTRAMSG_TOKEN = process.env.ULTRAMSG_TOKEN;
    const ADMIN_PHONE = process.env.ADMIN_WHATSAPP_NUMBER;

    // Validar que las variables de entorno existan
    if (!ULTRAMSG_INSTANCE || !ULTRAMSG_TOKEN || !ADMIN_PHONE) {
      console.error('Variables de entorno no configuradas');
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'WhatsApp service not configured' 
        })
      };
    }

    // Crear el mensaje
    const fechaActual = new Date().toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const mensaje = 
      `🔔 *NUEVO CONTACTO DESDE LANDING PAGE*\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `👤 *Nombre:*\n${data.firstName} ${data.lastName}\n\n` +
      `📱 *Teléfono:*\n${data.phoneNumber}\n\n` +
      `📧 *Email:*\n${data.emailAddress}\n\n` +
      `📍 *Código Postal:*\n${data.zipCode}\n\n` +
      `⚖️ *Tipo de Caso:*\n${data.caseType}\n\n` +
      `📝 *Descripción:*\n${data.description}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📅 *Fecha:* ${fechaActual}`;

    // Enviar mensaje a través de Ultramsg
    const response = await fetch(
      `https://api.ultramsg.com/${ULTRAMSG_INSTANCE}/messages/chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: ULTRAMSG_TOKEN,
          to: ADMIN_PHONE,
          body: mensaje
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Ultramsg error: ${JSON.stringify(result)}`);
    }

    console.log('✅ WhatsApp enviado:', result);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'WhatsApp sent successfully',
        result: result
      })
    };

  } catch (error) {
    console.error('❌ Error en función de WhatsApp:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send WhatsApp',
        details: error.message 
      })
    };
  }
};