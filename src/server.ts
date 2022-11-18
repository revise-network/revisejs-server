import 'dotenv/config';
import '@/index';
import App from '@/app';
import IndexRoute from '@routes/index.route';
import CollectionsRoute from '@routes/collections.route';
import NFTsRoute from '@routes/nfts.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const routes = [
    new IndexRoute(),
    new CollectionsRoute(),
    new NFTsRoute()
];
export const app = new App(routes);
