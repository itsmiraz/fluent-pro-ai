import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  bcrypt_salt_round: process.env.BYCRYPT_SAT_ROUND,
  default_pass: process.env.DEFAULT_PASS,
  NODE_ENV: process.env.NODE_ENV,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  cloudniary_cloud_name: process.env.CLOUDNIARY_CLOUD_NAME,
  cloudniary_api_key: process.env.CLOUDNIARY_API_KEY,
  cloudniary_api_secret: process.env.CLOUDNIARY_API_SECRET,
  stripe_api_secret: process.env.STRIPE_SECRET_KEY,
  client_side_url: process.env.ClIENT_SIDE_URL,
};
