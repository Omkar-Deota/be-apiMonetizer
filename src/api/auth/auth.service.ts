import axios from 'axios';
import env from '../../config/environment.config';
import log from '../../utils/logger';

const AxiosService = axios.create({
	baseURL: `https://${env.auth0.domain}`,
	timeout: 5000
});

AxiosService.defaults.headers.common.Accept = 'application/json';
AxiosService.defaults.headers.common['Content-Type'] = 'application/json';

namespace Auth0Service {
	export const resendVerificationEmail = async (userId:string): Promise<void> => {
		try {
			const token = await getAuth0ApiToken();
			

			await AxiosService.post(
				`/api/v2/jobs/verification-email`,
				{
					user_id: userId
				},
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);

			log.info('Verification email resend request sent successfully');
		} catch (error) {
			log.error('Failed to resend verification email inside service', error);
			throw error;
		}
	};

	const getAuth0ApiToken = async (): Promise<string> => {
		log.info('Getting Auth0 token');

		const dataToSend = JSON.stringify({
			grant_type: env.auth0.grantType,
			client_id: env.auth0.apiClientId,
			client_secret: env.auth0.apiClientSecret,
			audience: env.auth0.audienceSystem
		});
		const { data } = await AxiosService.post(`/oauth/token`, dataToSend);
		if (!data || !data?.access_token) throw new Error('Unable to fetch auth0 token');

		return data.access_token;
	};
}

export default Auth0Service;
