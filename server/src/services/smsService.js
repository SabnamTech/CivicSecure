import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class SMSService {
    constructor() {
        this.providers = {
            fast2sms: {
                url: 'https://www.fast2sms.com/dev/bulkV2',
                apiKey: process.env.FAST2SMS_API_KEY,
                active: !!process.env.FAST2SMS_API_KEY
            },
            textlocal: {
                url: 'https://api.textlocal.in/send/',
                apiKey: process.env.TEXTLOCAL_API_KEY,
                active: !!process.env.TEXTLOCAL_API_KEY
            }
        };
    }

    // Fast2SMS implementation (Free credits available)
    async sendViaBast2SMS(phoneNumber, otp) {
        try {
            const message = `Your CivicSecure verification OTP is ${otp}. Valid for 5 minutes. Do not share with anyone.`;

            const response = await axios.post(this.providers.fast2sms.url, {
                route: 'otp',
                variables_values: otp,
                numbers: phoneNumber,
                flash: 0
            }, {
                headers: {
                    'authorization': this.providers.fast2sms.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.return === true) {
                return {
                    success: true,
                    messageId: response.data.request_id,
                    provider: 'Fast2SMS'
                };
            } else {
                throw new Error('Fast2SMS API failed');
            }
        } catch (error) {
            console.error('Fast2SMS Error:', error.response?.data || error.message);
            return { success: false, error: error.message };
        }
    }

    // SMS India Hub implementation (Free API)
    async sendViaSMSIndiaHub(phoneNumber, otp) {
        try {
            const message = `Your CivicSecure OTP is ${otp}. Valid for 5 minutes.`;

            const params = new URLSearchParams({
                apikey: process.env.SMSINDIAHUB_API_KEY,
                user: process.env.SMSINDIAHUB_USER,
                password: process.env.SMSINDIAHUB_PASSWORD,
                msisdn: `91${phoneNumber}`,
                sid: 'CVCSEC', // Your sender ID
                msg: message,
                fl: '0'
            });

            const response = await axios.get(`https://apps.smsindiahub.in/vendorsms/pushsms.aspx?${params.toString()}`);

            if (response.data.includes('success')) {
                return {
                    success: true,
                    messageId: 'SIDHUB_' + Date.now(),
                    provider: 'SMSIndiaHub'
                };
            } else {
                throw new Error('SMSIndiaHub API failed');
            }
        } catch (error) {
            console.error('SMSIndiaHub Error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // Console fallback for development
    async sendViaConsole(phoneNumber, otp) {
        console.log('\n=================================');
        console.log('📱 SMS FALLBACK (Development Mode)');
        console.log('=================================');
        console.log(`📞 Phone: +91${phoneNumber}`);
        console.log(`🔐 OTP: ${otp}`);
        console.log(`⏰ Time: ${new Date().toLocaleString()}`);
        console.log('=================================\n');

        return {
            success: true,
            messageId: 'CONSOLE_' + Date.now(),
            provider: 'Console'
        };
    }

    // Main OTP sending method with fallback chain
    async sendOTP(phoneNumber, otp) {
        // Try Fast2SMS first
        if (this.providers.fast2sms.active) {
            const result = await this.sendViaBast2SMS(phoneNumber, otp);
            if (result.success) return result;
        }

        // Try SMS India Hub
        if (process.env.SMSINDIAHUB_API_KEY) {
            const result = await this.sendViaSMSIndiaHub(phoneNumber, otp);
            if (result.success) return result;
        }

        // Fallback to console (development)
        return await this.sendViaConsole(phoneNumber, otp);
    }
}

export default new SMSService();
