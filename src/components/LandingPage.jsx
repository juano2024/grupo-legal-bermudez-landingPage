// src/components/LandingPage.jsx
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import './LandingPage.css';

const LandingPage = () => {
  // ========================================
  // ESTADO DEL COMPONENTE
  // ========================================
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    emailAddress: '',
    zipCode: '',
    caseType: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // ========================================
  // CONFIGURACIÓN - WHATSAPP Y EMAILJS
  // ========================================
  const CONFIG = {
    whatsappNumber: '573152992963',
    
    // Configuración de EmailJS (obtén estos valores en emailjs.com)
    emailJS: {
      serviceID: 'service_xoqjvoh',        // Ejemplo: 'service_abc123'
      clientTemplateID: 'template_ou1pg2i',  // Ejemplo: 'template_xyz789'
      adminTemplateID: 'template_oy88o8n',    // Ejemplo: 'template_admin456'
      publicKey: 'YPwpvvK55C0l4dQXV',        // Ejemplo: 'AbCd1234EfGh5678'
      adminEmail: 'juanospina0602@gmail.com'   // Tu email para recibir notificaciones
    }
  };

  // Opciones para el select de Case Type
  const caseTypes = [
    'Personal Injury',
    'Car Accident', 
    'Medical Malpractice',
    'Workers Compensation',
    'Wrongful Death',
    'Slip and Fall',
    'Product Liability',
    'Other'
  ];

  // ========================================
  // MANEJADORES DE EVENTOS
  // ========================================
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validarFormulario = () => {
    if (!formData.firstName.trim()) {
      setError('Please enter your first name');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Please enter your last name');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (!formData.emailAddress.trim()) {
      setError('Please enter your email address');
      return false;
    }
    if (!formData.zipCode.trim()) {
      setError('Please enter your zip code');
      return false;
    }
    if (!formData.caseType) {
      setError('Please select a case type');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Please describe what happened');
      return false;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailAddress)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Validar zip code (5 dígitos)
    const zipRegex = /^\d{5}$/;
    if (!zipRegex.test(formData.zipCode)) {
      setError('Please enter a valid 5-digit zip code');
      return false;
    }
    
    setError('');
    return true;
  };

  // ========================================
  // FUNCIÓN: ENVIAR EMAIL AL CLIENTE
  // ========================================
  const enviarEmailCliente = async () => {
    try {
      const submissionDate = new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const templateParams = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.emailAddress,
        phoneNumber: formData.phoneNumber,
        zipCode: formData.zipCode,
        caseType: formData.caseType,
        description: formData.description,
        submissionDate: submissionDate,
        reply_to: formData.emailAddress
      };

      await emailjs.send(
        CONFIG.emailJS.serviceID,
        CONFIG.emailJS.clientTemplateID,
        templateParams,
        CONFIG.emailJS.publicKey
      );

      console.log('✅ Email de confirmación enviado al cliente');
      return true;

    } catch (error) {
      console.error('❌ Error al enviar email al cliente:', error);
      return false;
    }
  };

  // ========================================
  // FUNCIÓN: ENVIAR EMAIL AL ADMINISTRADOR
  // ========================================
  const enviarEmailAdmin = async () => {
    try {
      const submissionDate = new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const templateParams = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.emailAddress,
        phoneNumber: formData.phoneNumber,
        zipCode: formData.zipCode,
        caseType: formData.caseType,
        description: formData.description,
        submissionDate: submissionDate,
        to_email: CONFIG.emailJS.adminEmail,
        reply_to: formData.emailAddress
      };

      await emailjs.send(
        CONFIG.emailJS.serviceID,
        CONFIG.emailJS.adminTemplateID,
        templateParams,
        CONFIG.emailJS.publicKey
      );

      console.log('✅ Email de notificación enviado al administrador');
      return true;

    } catch (error) {
      console.error('❌ Error al enviar email al administrador:', error);
      return false;
    }
  };

  // ========================================
  // FUNCIÓN: ENVIAR A NETLIFY FORMS
  // ========================================
  const enviarANetlify = async () => {
    try {
      const encode = (data) => {
        return Object.keys(data)
          .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
          .join("&");
      };

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "contact-form",
          "submission-date": new Date().toLocaleString('en-US'),
          ...formData
        })
      });

      if (!response.ok) {
        throw new Error('Error al enviar a Netlify');
      }

      console.log('✅ Datos enviados a Netlify Forms');
      return true;

    } catch (error) {
      console.error('❌ Error al enviar a Netlify:', error);
      return false;
    }
  };

  // ========================================
  // FUNCIÓN: ENVIAR A WHATSAPP
  // ========================================
  const enviarAWhatsApp = async () => {
  try {
    const response = await fetch("/.netlify/functions/send-whatsapp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error("Error calling Netlify Function");
    }

    console.log("✅ Mensaje enviado al backend (Netlify Function)");
    return true;

  } catch (error) {
    console.error("❌ Error enviando a Netlify Function:", error);
    return false;
  }
};

  // ========================================
  // FUNCIÓN PRINCIPAL: ENVIAR FORMULARIO
  // ========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Enviar a Netlify Forms
      await enviarANetlify();

      // 2. Enviar email de confirmación al cliente
      await enviarEmailCliente();

      // 3. Enviar email de notificación al administrador (tú)
      await enviarEmailAdmin();

      // 4. Abrir WhatsApp
      enviarAWhatsApp();

      // 5. Mostrar éxito
      setSuccess(true);
      limpiarFormulario();

      setTimeout(() => {
        setSuccess(false);
      }, 7000);

    } catch (error) {
      console.error('Error general:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // RENDERIZADO DEL COMPONENTE
  // ========================================
  return (
    <div className="landing-page">
      <header className="header">
        <div className="container">
          <h1>Grupo Legal Bermudez</h1>
        </div>
      </header>

      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            
            {/* Columna Izquierda: Contenido */}
            <div className="hero-content">
              <h2>Get the Justice You Deserve</h2>
              <p className="hero-description">
                Contact us today for a free consultation. Our experienced attorneys 
                are ready to fight for your rights and help you get the compensation 
                you deserve.
              </p>
              
              <div className="benefits-list">
                <div className="benefit-item">
                  <span className="check-icon">✓</span>
                  <span>Free Case Evaluation</span>
                </div>
                <div className="benefit-item">
                  <span className="check-icon">✓</span>
                  <span>No Fee Unless We Win</span>
                </div>
                <div className="benefit-item">
                  <span className="check-icon">✓</span>
                  <span>Available 24/7</span>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Formulario */}
            <div className="form-container">
              <h3>Request a Free Consultation</h3>
              <p className="form-subtitle">Fill out the form and we'll contact you immediately</p>

              {/* Mensaje de éxito */}
              {success && (
                <div className="alert alert-success">
                  <strong>✓ Form submitted successfully!</strong>
                  <p>
                    Check your email for confirmation. We'll contact you via WhatsApp very soon!
                  </p>
                </div>
              )}

              {/* Mensaje de error */}
              {error && (
                <div className="alert alert-error">
                  {error}
                </div>
              )}

              {/* FORMULARIO CON NETLIFY */}
              <form 
                name="contact-form" 
                method="POST" 
                data-netlify="true"
                onSubmit={handleSubmit}
                netlify-honeypot="bot-field"
              >
                {/* Campo oculto requerido por Netlify */}
                <input type="hidden" name="form-name" value="contact-form" />
                
                {/* Campo honeypot anti-spam (oculto) */}
                <p style={{ display: 'none' }}>
                  <label>
                    Don't fill this out if you're human: <input name="bot-field" />
                  </label>
                </p>

                <div className="form-fields">
                  
                  {/* Fila 1: First Name & Last Name */}
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Fila 2: Phone Number & Email Address */}
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="email"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleChange}
                        placeholder="Email Address"
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Fila 3: Zip Code & Case Type */}
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="Zip Code"
                        maxLength="5"
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <select
                        name="caseType"
                        value={formData.caseType}
                        onChange={handleChange}
                        required
                        className="form-input form-select"
                      >
                        <option value="">Case Type</option>
                        {caseTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Fila 4: Description */}
                  <div className="form-group-full">
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Please describe what happened"
                      rows="5"
                      required
                      className="form-input form-textarea"
                    />
                  </div>

                  {/* Privacy Policy Text */}
                  <div className="privacy-text">
                    By submitting your contact information, you are consenting to receive 
                    communications including but not limited to telephone calls, SMS text 
                    messages, and emails in accordance with our{' '}
                    <a href="#" className="privacy-link">Privacy Policy</a>.
                  </div>

                  {/* Botón de envío */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="submit-button"
                  >
                    {loading ? 'SUBMITTING...' : 'SUBMIT FORM'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <h3>Grupo Legal Bermudez</h3>
          <p>Fighting for Your Rights Since 2000</p>
          <div className="footer-links">
            <a href="#">Terms & Conditions</a>
            <span>|</span>
            <a href="#">Privacy Policy</a>
          </div>
          <p className="copyright">
            © {new Date().getFullYear()} Grupo Legal Bermudez. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;