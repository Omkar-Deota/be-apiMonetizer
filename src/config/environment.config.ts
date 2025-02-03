import 'dotenv/config';

const env = {
	app: {
		port: Number(process.env.APP_PORT) || 8080,
		apiSecret: process.env.API_SECRET!,
		encryptionKey: process.env.ENCRYPTION_KEY!
	},
	db: {
		host: process.env.PG_HOST!,
		dbName: process.env.PG_DATABASE_NAME!,
		user: process.env.PG_USER!,
		password: process.env.PG_PASSWORD!
	},
	environment: process.env.NODE_ENV ?? 'local',
	auth0: {
		audience: process.env.AUTH0_AUDIENCE!,
		audienceSystem: process.env.AUTH0_AUDIENCE_SYSTEM!,
		apiClientId: process.env.AUTH0_API_CLIENT_ID!,
		apiClientSecret: process.env.AUTH0_API_CLIENT_SECRET!,
		grantType: process.env.AUTH0_GRANT_TYPE!,
		domain: process.env.AUTH0_DOMAIN!,
		tokenSigningAlgo: process.env.AUTH0_TOKEN_SIGNING_ALGO!
	}
};

export default env;
