import Stripe from 'stripe';
import config from '../config';

const stripe = new Stripe(config.stripe_api_secret!);
export default stripe;
