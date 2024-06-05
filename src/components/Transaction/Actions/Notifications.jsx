import emailjs from 'emailjs-com';


export function sendRejectionEmail(userEmail, reason) {
    const templateParams = {
      to_email: userEmail,
      message: `Your application has been rejected. Reason: ${reason}`,
      // You can add more parameters here if needed
    };
  
    emailjs.send('service_1o9imim', 'template_vz7sa7n', templateParams, 'MG8FqmDXz6tVE0npQ')
      .then((response) => {
         console.log('SUCCESS!', response.status, response.text);
      }, (error) => {
         console.log('FAILED...', error);
      });
  }


  export function sendAcceptanceEmail(userEmail) {
    const templateParams = {
      to_email: userEmail,
      message: `Your rent application has been accepted. Please proceed with the payment.`,
      // You can add more parameters here if needed
    };
  
    emailjs.send('service_1o9imim', 'template_ktivtci', templateParams, 'MG8FqmDXz6tVE0npQ')
      .then((response) => {
         console.log('SUCCESS!', response.status, response.text);
      }, (error) => {
         console.log('FAILED...', error);
      });
  }

  export function sendEmail(userEmail, subject, message) {
    const templateParams = {
      to_email: userEmail,
      subject: subject,
      message: message,
      // You can add more parameters here if needed
    };
  
    emailjs.send('service_1o9imim', 'template_vz7sa7n', templateParams, 'MG8FqmDXz6tVE0npQ')
      .then((response) => {
         console.log('SUCCESS!', response.status, response.text);
      }, (error) => {
         console.log('FAILED...', error);
      });
  }



  
  
  