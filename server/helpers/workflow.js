const twilio = require('twilio');

// Initialize Twilio client
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMS = async (to, body) => {
  try {
    await client.messages.create({
      body, // Message body
      from: process.env.TWILIO_PHONE_NUMBER, // Twilio phone number
      to, // Recipient's phone number
    });
    console.log(`SMS sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send SMS: ${error.message}`);
    throw error;
  }
};
const evaluateConditions = (conditions, data) => {
    return conditions.every(condition => {
      const { field, operator, value } = condition;
      const fieldValue = field.split('.').reduce((obj, key) => obj?.[key], data);
  
      switch (operator) {
        case 'equals':
          return fieldValue === value;
        case 'contains':
          return fieldValue?.includes(value);
        case 'greater_than':
          return fieldValue > value;
        case 'less_than':
          return fieldValue < value;
        default:
          return false;
      }
    });
  };
  
  const executeActions = async (actions, data) => {
    for (const action of actions) {
      switch (action) {
        case 'send_sms':
          await handleSendSMS(data);
          break;
        case 'send_email':
          await handleSendEmail(data);
          break;
        case 'custom_logic':
          await handleCustomLogic(data);
          break;
        default:
          console.log(`Unknown action: ${action}`);
      }
    }
  };
  
  const handleSendSMS = async (data) => {
    const { phone, message } = data;
    try {
      await sendSMS(phone, `Hello, this is a message regarding ${data.name}`);
      console.log(`SMS sent to ${phone}`);
    } catch (error) {
      console.error(`Failed to send SMS: ${error.message}`);
    }
  };
  
  const handleSendEmail = async (data) => {
    const { email, subject, body } = data;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject || 'Default Subject',
        text: body || `Hello ${data.name}, this is an automated email.`,
      });
      console.log(`Email sent to ${email}`);
    } catch (error) {
      console.error(`Failed to send email: ${error.message}`);
    }
  };
  
  const handleCustomLogic = async (data) => {
    try {
      console.log(`Executing custom logic for data: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error(`Failed to execute custom logic: ${error.message}`);
    }
  };
  
  module.exports = {sendSMS, evaluateConditions, executeActions };
  