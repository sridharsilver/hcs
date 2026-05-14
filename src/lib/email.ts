export interface EmailPayload {
  to_name?: string;
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
  phone?: string;
  grade?: string;
  campus?: string;
  child_name?: string;
}

const EMAIL_API_ENDPOINT = import.meta.env.VITE_EMAIL_API_ENDPOINT;

export const sendEmail = async (payload: EmailPayload) => {
  if (!EMAIL_API_ENDPOINT) {
    console.group('📧 [DEV MOCK] Email Sent');
    console.log('To:', 'Admin (info@hcschools.in)');
    console.log('From:', `${payload.from_name} <${payload.from_email}>`);
    console.log('Subject:', payload.subject);
    console.log('Details:', {
      phone: payload.phone,
      child: payload.child_name,
      grade: payload.grade,
      campus: payload.campus,
      message: payload.message
    });
    console.groupEnd();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, message: 'Mock email logged to console.' };
  }

  try {
    const response = await fetch(EMAIL_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Email API Error:', error);
    throw error;
  }
};
